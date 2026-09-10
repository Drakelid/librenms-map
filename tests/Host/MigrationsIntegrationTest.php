<?php

namespace LibreMap\Tests\Host;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use LibreNMS\Tests\TestCase;

/** CI runs migration/rollback/reapply before this schema and persistence check. */
class MigrationsIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    public function testMigratedSchemaPersistsViewsAndOwnerLocks(): void
    {
        $this->assertTrue(Schema::hasColumns('libremap_views', ['id', 'user_id', 'name', 'revision', 'state', 'created_at', 'updated_at']));
        $this->assertTrue(Schema::hasColumns('libremap_view_owners', ['user_id']));
        $owner = 9000000001;
        $this->assertSame(1, DB::table('libremap_view_owners')->insertOrIgnore(['user_id' => $owner]));
        $this->assertSame(0, DB::table('libremap_view_owners')->insertOrIgnore(['user_id' => $owner]));
        $id = (string) Str::uuid();
        DB::table('libremap_views')->insert([
            'id' => $id, 'user_id' => $owner, 'name' => str_repeat('x', 100),
            'state' => json_encode(['positions' => (object) [], 'pinned' => []]),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $view = DB::table('libremap_views')->where('id', $id)->first();
        $this->assertSame(1, (int) $view->revision);
        $this->assertSame($owner, (int) $view->user_id);
        $this->assertIsObject(json_decode($view->state)->positions);
    }
}
