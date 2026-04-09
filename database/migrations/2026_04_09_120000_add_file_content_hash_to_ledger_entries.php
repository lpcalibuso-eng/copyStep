<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ledger_entries', function (Blueprint $table) {
            // Add file_content_hash column if it doesn't exist
            if (!Schema::hasColumn('ledger_entries', 'file_content_hash')) {
                $table->string('file_content_hash', 64)->nullable()->after('ledger_proof')->comment('SHA-256 hash of uploaded file for integrity verification');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ledger_entries', function (Blueprint $table) {
            if (Schema::hasColumn('ledger_entries', 'file_content_hash')) {
                $table->dropColumn('file_content_hash');
            }
        });
    }
};
