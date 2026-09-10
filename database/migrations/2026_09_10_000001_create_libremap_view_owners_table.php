<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('libremap_view_owners', function (Blueprint $table): void {
            // Stable lock identity, independent of the host users schema.
            $table->unsignedBigInteger('user_id')->primary();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('libremap_view_owners');
    }
};
