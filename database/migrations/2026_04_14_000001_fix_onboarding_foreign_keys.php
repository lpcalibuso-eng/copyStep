<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Fix incorrect foreign key constraints on onboarding-related tables:
 * 
 * 1. student_csg_officers.course_id was referencing teacher_adviser(id) — should reference course(id)
 * 2. teacher_adviser.institute_id was referencing permission(id) — should reference institute(id)
 * 
 * Uses raw SQL for idempotent FK drops (handles partial migration state).
 */
return new class extends Migration
{
    public function up(): void
    {
        // ===== Fix student_csg_officers.course_id FK =====

        // Drop the wrong FK if it still exists (may have been dropped by a previous failed run)
        $this->dropForeignKeyIfExists('student_csg_officers', 'student_csg_officers_ibfk_2');

        // Clean up orphan data — set course_id to NULL where it points to
        // teacher_adviser IDs instead of actual course IDs
        DB::statement("
            UPDATE `student_csg_officers`
            SET `course_id` = NULL
            WHERE `course_id` IS NOT NULL
              AND `course_id` NOT IN (SELECT `id` FROM `course`)
        ");

        // Add the correct FK: course_id → course(id)
        DB::statement("
            ALTER TABLE `student_csg_officers`
            ADD CONSTRAINT `student_csg_officers_ibfk_2`
            FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE SET NULL
        ");

        // ===== Fix teacher_adviser.institute_id FK =====

        // Drop the wrong FK if it still exists
        $this->dropForeignKeyIfExists('teacher_adviser', 'teacher_adviser_ibfk_2');

        // Clean up orphan data — set institute_id to NULL where it points to
        // permission IDs instead of actual institute IDs
        DB::statement("
            UPDATE `teacher_adviser`
            SET `institute_id` = NULL
            WHERE `institute_id` IS NOT NULL
              AND `institute_id` NOT IN (SELECT `id` FROM `institute`)
        ");

        // Add the correct FK: institute_id → institute(id)
        DB::statement("
            ALTER TABLE `teacher_adviser`
            ADD CONSTRAINT `teacher_adviser_ibfk_2`
            FOREIGN KEY (`institute_id`) REFERENCES `institute` (`id`) ON DELETE SET NULL
        ");
    }

    public function down(): void
    {
        // Revert student_csg_officers FK
        $this->dropForeignKeyIfExists('student_csg_officers', 'student_csg_officers_ibfk_2');
        DB::statement("
            ALTER TABLE `student_csg_officers`
            ADD CONSTRAINT `student_csg_officers_ibfk_2`
            FOREIGN KEY (`course_id`) REFERENCES `teacher_adviser` (`id`) ON DELETE SET NULL
        ");

        // Revert teacher_adviser FK
        $this->dropForeignKeyIfExists('teacher_adviser', 'teacher_adviser_ibfk_2');
        DB::statement("
            ALTER TABLE `teacher_adviser`
            ADD CONSTRAINT `teacher_adviser_ibfk_2`
            FOREIGN KEY (`institute_id`) REFERENCES `permission` (`id`) ON DELETE SET NULL
        ");
    }

    /**
     * Safely drop a foreign key constraint only if it exists.
     */
    private function dropForeignKeyIfExists(string $table, string $constraintName): void
    {
        $exists = DB::select("
            SELECT CONSTRAINT_NAME
            FROM information_schema.TABLE_CONSTRAINTS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = ?
              AND CONSTRAINT_NAME = ?
              AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        ", [$table, $constraintName]);

        if (!empty($exists)) {
            DB::statement("ALTER TABLE `{$table}` DROP FOREIGN KEY `{$constraintName}`");
        }
    }
};
