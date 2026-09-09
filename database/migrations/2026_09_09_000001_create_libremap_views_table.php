<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('libremap_views', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            // Avoid coupling to the host's historically varying user key types.
            $table->unsignedBigInteger('user_id')->index();
            $table->string('name', 100);
            $table->unsignedInteger('revision')->default(1);
            $table->json('state');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('libremap_views');
    }
};
