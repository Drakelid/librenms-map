<?php

namespace LibreMap\Tests\Host;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use LibreMap\Http\ViewController;
use LibreMap\Views\ViewState;
use LibreNMS\Tests\TestCase;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

/** Real committed transactions on separate connections; never use DatabaseTransactions here. */
class SavedViewsConcurrencyIntegrationTest extends TestCase
{
    public function testConcurrentCreatesRespectTheCapAtBothSupportedIsolationLevels(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql' || ! function_exists('pcntl_fork')) {
            $this->markTestSkipped('Requires MySQL and pcntl (required by the host CI job).');
        }
        foreach (['REPEATABLE READ', 'READ COMMITTED'] as $isolation) {
            foreach ([[0, false], [49, false], [0, true], [49, true]] as [$existing, $holdOwner]) {
                $owner = User::factory()->create();
                try {
                    $state = ['rootId' => null, 'site' => '', 'search' => '', 'backbone' => false,
                        'positions' => [], 'pinned' => [], 'zoom' => 1, 'pan' => ['x' => 0, 'y' => 0]];
                    for ($i = 0; $i < $existing; $i++) {
                        DB::table('libremap_views')->insert([
                            'id' => (string) Str::uuid(), 'user_id' => $owner->getKey(), 'name' => 'Existing',
                            'revision' => 1, 'state' => json_encode($state), 'created_at' => now(), 'updated_at' => now(),
                        ]);
                    }
                    // Cover first use after migration and contention on a retained owner row.
                    $statuses = $this->race($owner, $state, $isolation, $holdOwner);
                    sort($statuses);
                    $this->assertSame($existing === 0 ? [201, 201] : [201, 422], $statuses, $isolation);
                    $this->assertSame($existing === 0 ? 2 : 50,
                        DB::table('libremap_views')->where('user_id', $owner->getKey())->count());
                    $this->assertSame(1, DB::table('libremap_view_owners')->where('user_id', $owner->getKey())->count());
                } finally {
                    DB::table('libremap_views')->where('user_id', $owner->getKey())->delete();
                    DB::table('libremap_view_owners')->where('user_id', $owner->getKey())->delete();
                    $owner->delete();
                }
            }
        }
    }

    private function race(User $owner, array $state, string $isolation, bool $holdOwner): array
    {
        // Close every inherited PDO before forking; each worker reconnects itself.
        foreach (DB::getConnections() as $connection) {
            $connection->disconnect();
        }
        $workers = [];
        $holding = false;
        try {
            for ($i = 0; $i < 2; $i++) {
                $pair = stream_socket_pair(STREAM_PF_UNIX, STREAM_SOCK_STREAM, STREAM_IPPROTO_IP);
                $this->assertNotFalse($pair);
                $pid = pcntl_fork();
                $this->assertNotSame(-1, $pid);
                if ($pid === 0) {
                    fclose($pair[0]);
                    foreach ($workers as $worker) {
                        fclose($worker['socket']);
                    }
                    stream_set_timeout($pair[1], 20);
                    try {
                        DB::statement('SET SESSION TRANSACTION ISOLATION LEVEL '.$isolation);
                        fwrite($pair[1], "ready\n");
                        if (trim((string) fgets($pair[1])) !== 'go') {
                            throw new \RuntimeException('Race start barrier timed out.');
                        }
                        $announced = false;
                        DB::connection()->beforeExecuting(function ($query) use (&$announced, $pair): void {
                            if (! $announced && preg_match('/(?:from|into) [`"]?libremap_view(?:s|_owners)[`"]?/i', $query)) {
                                $announced = true;
                                fwrite($pair[1], "attempting\n");
                            }
                        });
                        $request = Request::create('/libremap/views', 'POST', ['name' => 'Concurrent', 'state' => $state]);
                        $request->setUserResolver(fn () => $owner);
                        try {
                            $status = app(ViewController::class)->store($request, app(ViewState::class))->getStatusCode();
                        } catch (HttpExceptionInterface $exception) {
                            $status = $exception->getStatusCode();
                        }
                        fwrite($pair[1], json_encode(['status' => $status])."\n");
                        fclose($pair[1]);
                        exit(0);
                    } catch (\Throwable $exception) {
                        fwrite($pair[1], json_encode(['error' => get_class($exception).': '.$exception->getMessage()])."\n");
                        exit(1);
                    }
                }
                fclose($pair[1]);
                stream_set_timeout($pair[0], 30);
                $workers[] = ['pid' => $pid, 'socket' => $pair[0]];
            }
            foreach ($workers as $worker) {
                $this->assertSame("ready\n", fgets($worker['socket']));
            }
            if ($holdOwner) {
                DB::table('libremap_view_owners')->insert(['user_id' => $owner->getKey()]);
                DB::beginTransaction();
                $holding = true;
                DB::table('libremap_view_owners')->where('user_id', $owner->getKey())->lockForUpdate()->first();
            }
            foreach ($workers as $worker) {
                fwrite($worker['socket'], "go\n");
            }
            foreach ($workers as $worker) {
                $this->assertSame("attempting\n", fgets($worker['socket']));
            }
            if ($holdOwner) {
                // Both workers reached a persistence query. Neither may finish
                // while another connection holds this owner's serialization lock.
                $read = array_column($workers, 'socket');
                $write = $except = [];
                $this->assertSame(0, stream_select($read, $write, $except, 1), 'A create bypassed the owner lock.');
                DB::commit();
                $holding = false;
            }
            $statuses = [];
            foreach ($workers as $worker) {
                $result = json_decode((string) fgets($worker['socket']), true);
                $this->assertIsArray($result, 'Concurrent request timed out.');
                $this->assertArrayHasKey('status', $result, json_encode($result));
                $statuses[] = $result['status'];
            }

            return $statuses;
        } finally {
            if ($holding) {
                DB::rollBack();
            }
            foreach ($workers as $worker) {
                fclose($worker['socket']);
                // Bounded cleanup also handles a worker stuck waiting for its barrier.
                $deadline = microtime(true) + 2;
                do {
                    $finished = pcntl_waitpid($worker['pid'], $status, WNOHANG);
                    if ($finished !== 0) {
                        break;
                    }
                    usleep(10000);
                } while (microtime(true) < $deadline);
                if ($finished === 0) {
                    posix_kill($worker['pid'], SIGKILL);
                    pcntl_waitpid($worker['pid'], $status);
                }
            }
        }
    }
}
