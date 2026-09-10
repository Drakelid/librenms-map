#!/usr/bin/env bash
# Install or upgrade LibreMap from Packagist into a LibreNMS installation.
#
# Run on the LibreNMS host as the LibreNMS application user:
#   sudo -H -u librenms bash install.sh
#
# Rerunning upgrades to the newest stable release. See README.md for details.
set -euo pipefail

PACKAGE="libremap/librenms-plugin"
PLUGIN="libremap"
METADATA_URL="https://repo.packagist.org/p2/${PACKAGE}.json"

LIBRENMS_DIR="${LIBRENMS_DIR:-/opt/librenms}"
VERSION=""

# Reads Packagist p2 metadata on stdin and prints the newest stable version.
# Stable means a purely numeric normalized version (no -beta, -RC or dev-).
LATEST_STABLE_PHP='
$data = json_decode(stream_get_contents(STDIN), true);
$best = null;
foreach ($data["packages"][$argv[1]] ?? [] as $release) {
    $normalized = $release["version_normalized"] ?? "";
    if (! preg_match("/^\d+(\.\d+)*$/", $normalized)) {
        continue;
    }
    if ($best === null || version_compare($normalized, $best["version_normalized"], ">")) {
        $best = $release;
    }
}
if ($best === null) {
    exit(1);
}
echo ltrim($best["version"], "v");
'

# Prints the installed version of the package named by the first argument, or nothing.
INSTALLED_VERSION_PHP='
require "vendor/autoload.php";
echo \Composer\InstalledVersions::isInstalled($argv[1])
    ? \Composer\InstalledVersions::getPrettyVersion($argv[1])
    : "";
'

usage() {
    cat <<EOF
Usage: $(basename "$0") [options]

Install the latest stable ${PACKAGE} release from Packagist into LibreNMS,
publish its assets and config, run its migrations, enable it and clear caches.

Options:
  -d, --dir DIR      LibreNMS directory (default: \$LIBRENMS_DIR or /opt/librenms)
      --version VER  Install this version or constraint instead of the latest stable
  -h, --help         Show this help
EOF
}

die() {
    echo "error: $*" >&2
    exit 1
}

step() {
    printf '\n==> %s\n' "$*"
}

fetch() {
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$1"
    elif command -v wget >/dev/null 2>&1; then
        wget -qO- "$1"
    else
        die "curl or wget is required"
    fi
}

while [ $# -gt 0 ]; do
    case "$1" in
        -d | --dir)
            [ $# -ge 2 ] || die "$1 needs a value"
            LIBRENMS_DIR="$2"
            shift 2
            ;;
        --version)
            [ $# -ge 2 ] || die "$1 needs a value"
            VERSION="$2"
            shift 2
            ;;
        -h | --help)
            usage
            exit 0
            ;;
        *)
            usage >&2
            die "unknown option: $1"
            ;;
    esac
done

[ -f "$LIBRENMS_DIR/lnms" ] && [ -f "$LIBRENMS_DIR/artisan" ] \
    || die "$LIBRENMS_DIR is not a LibreNMS installation (use --dir)"
command -v php >/dev/null 2>&1 || die "php was not found in PATH"

# Composer and artisan must write files as the user that owns the install.
owner="$(stat -c %U "$LIBRENMS_DIR")"
[ "$(id -u)" -ne 0 ] || die "do not run as root; run: sudo -H -u $owner bash $0"
[ "$(id -un)" = "$owner" ] || die "run as the owner of $LIBRENMS_DIR: sudo -H -u $owner bash $0"

cd "$LIBRENMS_DIR"

# Captured first: grep -q in a pipeline can SIGPIPE lnms and trip pipefail.
plugin_commands="$(./lnms list --raw plugin 2>/dev/null || true)"
grep -q '^plugin:add' <<<"$plugin_commands" \
    || die "this LibreNMS has no 'lnms plugin:add'; update LibreNMS first"

if [ -z "$VERSION" ]; then
    step "Resolving the latest stable release from Packagist"
    VERSION="$(fetch "$METADATA_URL" | php -r "$LATEST_STABLE_PHP" "$PACKAGE")" \
        || die "could not determine the latest stable release from $METADATA_URL"
fi
echo "Target: $PACKAGE $VERSION"

# A path repository from a source install takes priority over Packagist and
# would keep Composer resolving the package from the local checkout.
if php scripts/composer_wrapper.php config repositories.libremap >/dev/null 2>&1; then
    step "Removing the 'libremap' path repository left by a source install"
    php scripts/composer_wrapper.php config --unset repositories.libremap
fi

step "Installing $PACKAGE $VERSION"
./lnms plugin:add "$PACKAGE" "$VERSION"

step "Publishing assets and default config"
# Replace rather than overlay: each build's worker has a new hashed file name,
# and vendor:publish never deletes the previous one.
rm -rf -- "$PWD/public/vendor/libremap"
php artisan vendor:publish --tag=libremap-assets --force
# Without --force: an existing config/libremap.php is kept as-is.
php artisan vendor:publish --tag=libremap-config

step "Running LibreMap migrations"
php artisan migrate --force --realpath --path="$PWD/vendor/$PACKAGE/database/migrations"

step "Enabling the $PLUGIN plugin"
./lnms plugin:enable "$PLUGIN"

# Routes are only registered while the plugin is enabled, and a warm route
# cache skips that registration, so /libremap would 404 until cleared.
step "Clearing application caches"
php artisan optimize:clear

installed="$(php -r "$INSTALLED_VERSION_PHP" "$PACKAGE")"
[ -n "$installed" ] || die "$PACKAGE is not installed after composer ran"

printf '\nLibreMap %s is installed. Open Plugins -> LibreMap, or /libremap under the LibreNMS base URL.\n' "$installed"
