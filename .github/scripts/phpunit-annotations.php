<?php

// Turn PHPUnit's JUnit report into workflow annotations. Job logs need
// authentication to download, but annotations on a public repository do not.
// Usage: php phpunit-annotations.php <junit.xml> <phpunit-output.log>

function annotate(string $level, string $title, string $message): void
{
    $escape = fn (string $value, array $extra = []) => strtr($value, ['%' => '%25', "\r" => '%0D', "\n" => '%0A'] + $extra);
    // Keep the start of each report: the assertion and the top of its trace.
    $body = implode("\n", array_slice(explode("\n", trim($message)), 0, 40));
    echo "::{$level} title=".$escape($title, [':' => '%3A', ',' => '%2C']).'::'.$escape($body).PHP_EOL;
}

[, $junit, $log] = $argv + [null, null, null];

if (is_string($junit) && is_file($junit)) {
    $report = simplexml_load_file($junit);
    foreach ($report ? $report->xpath('//testcase') : [] as $case) {
        $test = ($case['class'] ?? $case['classname']).'::'.$case['name'];
        foreach (['failure' => 'error', 'error' => 'error', 'skipped' => 'warning'] as $outcome => $level) {
            foreach ($case->{$outcome} as $detail) {
                annotate($level, ucfirst($outcome).' '.$test, trim((string) $detail) ?: (string) ($detail['message'] ?? $outcome));
            }
        }
    }
} elseif (is_string($log) && is_file($log)) {
    // No report means PHPUnit stopped before running tests; show how it ended.
    $tail = array_slice(file($log, FILE_IGNORE_NEW_LINES) ?: [], -40);
    annotate('error', 'PHPUnit did not finish ('.basename($log).')', implode("\n", $tail));
}
