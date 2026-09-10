<?php

// Turn PHPUnit's JUnit report into workflow annotations. Job logs need
// authentication to download, but annotations on a public repository do not.
// GitHub shows at most 10 error annotations per step, so emit one summary of
// every affected test, then one annotation per distinct cause.
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
    $results = [];
    $report = simplexml_load_file($junit);
    foreach ($report ? $report->xpath('//testcase') : [] as $case) {
        $test = ($case['class'] ?? $case['classname']).'::'.$case['name'];
        foreach (['failure' => 'error', 'error' => 'error', 'skipped' => 'warning'] as $outcome => $level) {
            foreach ($case->{$outcome} as $detail) {
                $text = trim((string) $detail) ?: (string) ($detail['message'] ?? $outcome);
                $results[] = compact('outcome', 'level', 'test', 'text');
            }
        }
    }
    if ($results === []) {
        exit(0);
    }

    $counts = array_count_values(array_column($results, 'outcome'));
    $failed = isset($counts['failure']) || isset($counts['error']);
    annotate($failed ? 'error' : 'warning',
        'PHPUnit '.basename($junit).': '.implode(', ', array_map(fn ($outcome, $n) => "$n $outcome", array_keys($counts), $counts)),
        implode("\n", array_map(fn ($result) => "{$result['outcome']}: {$result['test']}", $results)));

    // Group by the report without the test's own name and trace lines, which
    // differ per test even when the cause is the same.
    $groups = [];
    foreach ($results as $result) {
        $lines = array_filter(explode("\n", $result['text']), fn ($line) => trim($line) !== $result['test'] && ! preg_match('#^\s*/\S+:\d+$#', $line));
        $key = $result['level']."\n".implode("\n", array_slice(array_values($lines), 0, 8));
        $groups[$key] ??= ['level' => $result['level'], 'text' => $result['text'], 'tests' => []];
        $groups[$key]['tests'][] = $result['test'];
    }
    foreach ($groups as $group) {
        $names = array_map(fn ($test) => substr($test, strrpos($test, '\\') + 1), $group['tests']);
        annotate($group['level'], count($names).' test(s): '.$names[0],
            'Affected: '.implode(', ', $names)."\n\n".$group['text']);
    }
} elseif (is_string($log) && is_file($log)) {
    // No report means PHPUnit stopped before running tests; show how it ended.
    $tail = array_slice(file($log, FILE_IGNORE_NEW_LINES) ?: [], -40);
    annotate('error', 'PHPUnit did not finish ('.basename($log).')', implode("\n", $tail));
}
