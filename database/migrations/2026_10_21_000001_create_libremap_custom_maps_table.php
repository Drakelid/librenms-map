<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('libremap_custom_maps', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            // Avoid coupling to the host's historically varying user key types.
            $table->unsignedBigInteger('user_id')->index();
            $table->string('name', 100);
            // Shared maps are readable by every signed-in user, editable only by the owner.
            $table->boolean('shared')->default(false)->index();
            $table->unsignedInteger('revision')->default(1);
            $table->json('document');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('libremap_custom_maps');
    }
};
