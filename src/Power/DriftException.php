<?php

namespace LibreMap\Power;

/**
 * A DRIFT failure with a message that is safe to log and to show: it never
 * carries the request, its headers or the token.
 */
class DriftException extends \RuntimeException
{
    public function __construct(string $message, public readonly int $status)
    {
        parent::__construct($message);
    }
}
