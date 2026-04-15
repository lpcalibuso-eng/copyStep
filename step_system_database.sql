-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 14, 2026 at 09:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `step2`
--

-- --------------------------------------------------------

--
-- Table structure for table `approval`
--

CREATE TABLE `approval` (
  `id` char(36) NOT NULL,
  `employee_id` varchar(100) DEFAULT NULL,
  `project_id` char(36) DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `approvable_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `officers_approved` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `approval`
--

INSERT INTO `approval` (`id`, `employee_id`, `project_id`, `reference_type`, `approvable_type`, `status`, `rejection_reason`, `reviewed_at`, `officers_approved`, `created_at`, `updated_at`) VALUES
('05a3e3a8-235d-11f1-9647-10683825ce81', 'EMP001', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Approved', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42'),
('05a3e5a6-235d-11f1-9647-10683825ce81', 'EMP001', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Pending', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42'),
('05a3e65c-235d-11f1-9647-10683825ce81', 'EMP002', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Rejected', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42'),
('05a3e6de-235d-11f1-9647-10683825ce81', 'EMP004', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Approved', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42'),
('05a3e762-235d-11f1-9647-10683825ce81', 'EMP004', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Pending', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42'),
('05a3e7eb-235d-11f1-9647-10683825ce81', 'EMP006', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Approved', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42'),
('05a3e860-235d-11f1-9647-10683825ce81', 'EMP006', '05a30928-235d-11f1-9647-10683825ce81', NULL, NULL, 'Approved', NULL, NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `actionable_id` varchar(100) DEFAULT NULL,
  `actionable_type` varchar(100) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `module` varchar(100) DEFAULT NULL,
  `action_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `browser_info` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `actionable_id`, `actionable_type`, `action`, `module`, `action_type`, `status`, `details`, `ip_address`, `browser_info`, `created_at`, `archive`) VALUES
('05a8a69d-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', NULL, NULL, 'Login', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a8a865-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', NULL, NULL, 'Created Project', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a8a90a-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', NULL, NULL, 'Approved Project', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a8a96a-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', NULL, NULL, 'Logout', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a8a9c8-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', NULL, NULL, 'Updated User', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a8aa25-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', NULL, NULL, 'Deleted Entry', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a8aa86-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', NULL, NULL, 'Exported Data', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `badge`
--

CREATE TABLE `badge` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `badge`
--

INSERT INTO `badge` (`id`, `name`, `description`, `icon`, `category`, `created_at`, `updated_at`, `archive`) VALUES
('05aa4b9c-235d-11f1-9647-10683825ce81', 'Event Organizer', 'Successfully organized an event', 'star', 'achievement', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05aa4d10-235d-11f1-9647-10683825ce81', 'Active Member', 'Participated in 5+ events', 'flame', 'engagement', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05aa5cdb-235d-11f1-9647-10683825ce81', 'Budget Master', 'Managed project budget efficiently', 'coins', 'financial', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05aa5ddb-235d-11f1-9647-10683825ce81', 'Team Leader', 'Led a successful project', 'crown', 'leadership', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05aa5e25-235d-11f1-9647-10683825ce81', 'Quick Approver', 'Approved projects within 24 hours', 'flash', 'performance', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05aa5e68-235d-11f1-9647-10683825ce81', 'Documentation Pro', 'Submitted complete project documentation', 'document', 'quality', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05aa5eac-235d-11f1-9647-10683825ce81', 'Community Hero', 'Contributed to community service', 'heart', 'community', '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `badge_collected`
--

CREATE TABLE `badge_collected` (
  `id` char(36) NOT NULL,
  `badge_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `earned_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `badge_collected`
--

INSERT INTO `badge_collected` (`id`, `badge_id`, `user_id`, `earned_date`, `created_at`, `archive`) VALUES
('05ab9ce3-235d-11f1-9647-10683825ce81', '05aa4b9c-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43', '2026-03-19 06:29:43', 0),
('05aba156-235d-11f1-9647-10683825ce81', '05aa5eac-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '2026-03-12 06:29:43', '2026-03-19 06:29:43', 0),
('05aba2ac-235d-11f1-9647-10683825ce81', '05aa4d10-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '2026-03-05 06:29:43', '2026-03-19 06:29:43', 0),
('05aba374-235d-11f1-9647-10683825ce81', '05aa4b9c-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43', '2026-03-19 06:29:43', 0),
('05aba41d-235d-11f1-9647-10683825ce81', '05aa5eac-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '2026-03-16 06:29:43', '2026-03-19 06:29:43', 0),
('05aba4e6-235d-11f1-9647-10683825ce81', '05aa4d10-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '2026-02-26 06:29:43', '2026-03-19 06:29:43', 0),
('05aba5ab-235d-11f1-9647-10683825ce81', '05aa4b9c-235d-11f1-9647-10683825ce81', '05a032b9-235d-11f1-9647-10683825ce81', '2026-03-18 06:29:43', '2026-03-19 06:29:43', 0);

-- --------------------------------------------------------

--
-- Table structure for table `chain`
--

CREATE TABLE `chain` (
  `id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `block_index` int(11) NOT NULL DEFAULT 0,
  `prev_hash` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `data_snapshot` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chain`
--

INSERT INTO `chain` (`id`, `project_id`, `block_index`, `prev_hash`, `hash`, `data_snapshot`, `created_at`) VALUES
('05a528b2-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 0, NULL, 'hash1', NULL, '2026-03-19 06:29:42'),
('05a52af2-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 1, 'hash1', 'hash2', NULL, '2026-03-19 06:29:42'),
('05a52b8f-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 2, 'hash2', 'hash3', NULL, '2026-03-19 06:29:42'),
('05a52bf1-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 3, 'hash3', 'hash4', NULL, '2026-03-19 06:29:42'),
('05a52c57-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 4, 'hash4', 'hash5', NULL, '2026-03-19 06:29:42'),
('05a52cb9-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 5, 'hash5', 'hash6', NULL, '2026-03-19 06:29:42'),
('05a52d0d-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 6, 'hash6', 'hash7', NULL, '2026-03-19 06:29:42');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` char(36) NOT NULL,
  `institute_id` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `institute_id`, `name`, `description`, `created_at`, `updated_at`, `archive`) VALUES
('059d226e-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSIS', NULL, '2026-03-19 06:29:42', '2026-04-14 05:49:49', 0),
('059d2571-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSCS', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d2612-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSPSY', NULL, '2026-03-19 06:29:42', '2026-04-14 05:49:58', 0),
('059d267c-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSCE', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d26df-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSM', NULL, '2026-03-19 06:29:42', '2026-04-14 05:50:34', 0),
('059d2744-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSN', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d279f-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSocSc', NULL, '2026-03-19 06:29:42', '2026-04-14 05:52:23', 0);

-- --------------------------------------------------------

--
-- Table structure for table `institute`
--

CREATE TABLE `institute` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institute`
--

INSERT INTO `institute` (`id`, `name`, `description`, `created_at`, `updated_at`, `archive`) VALUES
('059bab0d-235d-11f1-9647-10683825ce81', 'ICDI', NULL, '2026-03-19 06:29:42', '2026-04-14 07:48:48', 0),
('059bb26f-235d-11f1-9647-10683825ce81', 'IBS', NULL, '2026-03-19 06:29:42', '2026-04-14 07:49:24', 0),
('059bb31d-235d-11f1-9647-10683825ce81', 'IE', NULL, '2026-03-19 06:29:42', '2026-04-14 07:49:38', 0),
('059bb359-235d-11f1-9647-10683825ce81', 'IFS', NULL, '2026-03-19 06:29:42', '2026-04-14 07:49:45', 0),
('059bb388-235d-11f1-9647-10683825ce81', 'IGDS', NULL, '2026-03-19 06:29:42', '2026-04-14 07:49:51', 0),
('059bb3b0-235d-11f1-9647-10683825ce81', 'IM', NULL, '2026-03-19 06:29:42', '2026-04-14 07:49:59', 0),
('059bb3d9-235d-11f1-9647-10683825ce81', 'CCJ', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('c062692a-37d6-11f1-81d0-0ee6e07d3d3d', 'ISM', NULL, '2026-04-14 07:51:27', '2026-04-14 07:51:27', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ledger_entries`
--

CREATE TABLE `ledger_entries` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `type` enum('Income','Expense') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `budget_breakdown` text DEFAULT NULL,
  `description` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `ledger_proof` varchar(500) DEFAULT NULL COMMENT 'Path to uploaded proof file',
  `file_content_hash` varchar(64) DEFAULT NULL COMMENT 'SHA-256 hash of uploaded file for integrity verification',
  `approval_status` enum('Draft','Pending Adviser Approval','Approved','Rejected') DEFAULT 'Draft',
  `is_initial_entry` tinyint(1) NOT NULL DEFAULT 0,
  `note` text DEFAULT NULL COMMENT 'Approval/rejection notes',
  `approved_by` char(36) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `archive` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ledger_entries`
--

INSERT INTO `ledger_entries` (`id`, `project_id`, `type`, `amount`, `budget_breakdown`, `description`, `category`, `ledger_proof`, `file_content_hash`, `approval_status`, `is_initial_entry`, `note`, `approved_by`, `created_by`, `updated_by`, `approved_at`, `rejected_at`, `archive`, `created_at`, `updated_at`) VALUES
('14a0d48b-1795-4386-a0fc-9d4ddbc08a93', '05a30928-235d-11f1-9647-10683825ce81', 'Income', 800.00, '\"[{\\\"id\\\":1,\\\"item\\\":\\\"800\\\",\\\"qty\\\":1,\\\"unitPrice\\\":\\\"800\\\",\\\"amount\\\":800}]\"', '800', NULL, 'storage/ledger_proofs/00e45febb88dfdd34b5ea95d40c85a97742cc4a921a038868ccc0330084ebf46.pdf', '00e45febb88dfdd34b5ea95d40c85a97742cc4a921a038868ccc0330084ebf46', 'Draft', 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-09 03:31:29', '2026-04-09 03:31:29'),
('47a4a84f-8cc5-4f1f-a502-0a2965e71515', '05a30928-235d-11f1-9647-10683825ce81', 'Expense', 300.00, '\"[{\\\"id\\\":1,\\\"item\\\":\\\"300\\\",\\\"qty\\\":1,\\\"unitPrice\\\":\\\"300\\\",\\\"amount\\\":300}]\"', '300', NULL, 'storage/ledger_proofs/a3bd77d7ea8a486310a00772304b1555ea2719974f41ebd637506274e7e9d6b2.jpg', 'a3bd77d7ea8a486310a00772304b1555ea2719974f41ebd637506274e7e9d6b2', 'Draft', 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-09 02:02:47', '2026-04-09 02:02:47');

-- --------------------------------------------------------

--
-- Table structure for table `meeting`
--

CREATE TABLE `meeting` (
  `id` char(36) NOT NULL,
  `student_id` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_done` tinyint(1) DEFAULT 0,
  `minutes_content` text DEFAULT NULL,
  `action_items` text DEFAULT NULL,
  `expected_attendees` text DEFAULT NULL,
  `attendees` text DEFAULT NULL,
  `meeting_proof` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meeting`
--

INSERT INTO `meeting` (`id`, `student_id`, `title`, `description`, `scheduled_date`, `created_at`, `is_done`, `minutes_content`, `action_items`, `expected_attendees`, `attendees`, `meeting_proof`, `updated_at`, `archive`) VALUES
('05a6aa59-235d-11f1-9647-10683825ce81', 'STU001', 'Intro Meet', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a6ac07-235d-11f1-9647-10683825ce81', 'STU001', 'Budget Plan', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a6ac90-235d-11f1-9647-10683825ce81', 'STU002', 'Event Sync', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a6ace6-235d-11f1-9647-10683825ce81', 'STU003', 'Officer Meet', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a6ad3a-235d-11f1-9647-10683825ce81', 'STU004', 'Emergency', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a6ad87-235d-11f1-9647-10683825ce81', 'STU005', 'Wrap up', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0),
('05a6add1-235d-11f1-9647-10683825ce81', 'STU006', 'Review', NULL, NULL, '2026-03-19 06:29:42', 0, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:29:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_04_09_050446_create_personal_access_tokens_table', 1),
(2, '2026_04_09_120000_add_file_content_hash_to_ledger_entries', 2),
(3, '2026_04_12_000001_add_profile_fields_to_users_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `read_at`, `created_at`, `updated_at`, `archive`) VALUES
('05a79f2e-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', 'Welcome', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05a7a144-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', 'Project Approved', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05a7a1e9-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', 'Meeting Reminder', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05a7a24b-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', 'Budget Alert', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05a7a2a9-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', 'New Role', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05a7a306-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', 'Task Update', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('05a7a363-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', 'System Maintenance', NULL, NULL, 0, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('06d20001-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Project Approved', 'Your project \"Tech Expo\" was approved by the adviser.', 'project', 0, NULL, '2026-03-20 08:10:00', '2026-03-20 08:10:00', 0),
('06d20002-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Ledger Entry Pending', 'A ledger entry for \"Tech Expo\" is waiting for approval.', 'ledger', 0, NULL, '2026-03-20 09:25:00', '2026-03-20 09:25:00', 0),
('06d20003-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'New Proof Uploaded', 'A new proof document was uploaded for transaction 06b10002.', 'proof', 1, '2026-03-20 10:12:00', '2026-03-20 10:00:00', '2026-03-20 10:12:00', 0),
('06d20004-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Meeting Reminder', 'Budget planning meeting starts at 2:00 PM today.', 'meeting', 0, NULL, '2026-03-20 11:00:00', '2026-03-20 11:00:00', 0),
('06d20005-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Badge Earned', 'You unlocked \"Documentation Pro\" badge.', 'badge', 0, NULL, '2026-03-20 12:15:00', '2026-03-20 12:15:00', 0),
('06d20006-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Points Added', 'You received 15 points from helpful project feedback.', 'points', 1, '2026-03-20 13:00:00', '2026-03-20 12:40:00', '2026-03-20 13:00:00', 0),
('06d20007-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Rating Posted', 'Your rating on \"Sports Fest\" has been published.', 'rating', 0, NULL, '2026-03-20 13:25:00', '2026-03-20 13:25:00', 0),
('06d20008-235d-11f1-9647-10683825ce81', NULL, 'Welcome', 'Thank you for regitering with STEP Platform.', 'system', 0, NULL, '2026-03-20 13:30:00', '2026-04-14 03:55:02', 0);

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` char(36) NOT NULL,
  `module` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `permission` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `module`, `action`, `permission`, `description`, `created_at`, `updated_at`, `archive`) VALUES
('059e4bca-235d-11f1-9647-10683825ce81', 'Projects', 'Approve', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059e56c0-235d-11f1-9647-10683825ce81', 'Users', 'Create', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059e5761-235d-11f1-9647-10683825ce81', 'Meetings', 'Schedule', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059e5794-235d-11f1-9647-10683825ce81', 'Reports', 'View', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059e57be-235d-11f1-9647-10683825ce81', 'Settings', 'Update', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059e57e6-235d-11f1-9647-10683825ce81', 'Audit', 'Export', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059e580c-235d-11f1-9647-10683825ce81', 'Roles', 'Assign', NULL, NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` char(36) NOT NULL,
  `student_id` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `objective` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `budget_breakdown` text DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `proposed_by` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `project_proof` blob DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `approve_by` varchar(255) DEFAULT NULL,
  `approval_status` varchar(50) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `student_id`, `title`, `description`, `objective`, `category`, `budget`, `budget_breakdown`, `venue`, `status`, `proposed_by`, `note`, `project_proof`, `start_date`, `end_date`, `approve_by`, `approval_status`, `approved_at`, `created_at`, `updated_at`, `created_by`, `updated_by`, `archive`) VALUES
('05a30928-235d-11f1-9647-10683825ce81', 'STU001', 'Tech Expo', 'Campus-wide technology exhibition for student innovations.', NULL, 'Technology', 5000.00, '{\"booth_materials\":1500,\"awards\":1000,\"marketing\":1200,\"logistics\":1300}', NULL, 'In Progress', 'CSG Innovation Committee', 'On track, waiting for final sponsor confirmation.', NULL, '2026-03-25', '2026-04-05', '05a031f5-235d-11f1-9647-10683825ce81', 'Approved', NULL, '2026-03-19 06:29:42', '2026-03-20 09:10:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30ad6-235d-11f1-9647-10683825ce81', 'STU001', 'Sports Fest', 'Inter-course sports competition and team building activities.', NULL, 'Sports', 10000.00, '{\"uniforms\":2500,\"equipment\":3000,\"prizes\":2000,\"medical\":2500}', NULL, 'Planning', 'CSG Sports Committee', 'Venue reserved and fixtures being finalized.', NULL, '2026-04-10', '2026-04-20', '05a031f5-235d-11f1-9647-10683825ce81', 'Pending Approval', NULL, '2026-03-19 06:29:42', '2026-03-20 10:15:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30b96-235d-11f1-9647-10683825ce81', 'STU002', 'Clean Up', 'Environmental clean-up and waste segregation drive.', NULL, 'Environmental', 500.00, '{\"trash_bags\":150,\"gloves\":120,\"refreshments\":230}', NULL, 'Completed', 'CSG Environment Unit', 'Completed successfully with 120 volunteers.', NULL, '2026-03-05', '2026-03-07', '05a031f5-235d-11f1-9647-10683825ce81', 'Approved', NULL, '2026-03-19 06:29:42', '2026-03-19 17:30:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30c03-235d-11f1-9647-10683825ce81', 'STU003', 'Seminar', 'Career and leadership seminar for graduating students.', NULL, 'Education', 2000.00, '{\"speaker_honorarium\":900,\"kits\":500,\"snacks\":600}', NULL, 'In Progress', 'CSG Academic Affairs', 'Second speaker confirmed, registration open.', NULL, '2026-04-01', '2026-04-01', '05a032b9-235d-11f1-9647-10683825ce81', 'Approved', NULL, '2026-03-19 06:29:42', '2026-03-20 11:20:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30c5d-235d-11f1-9647-10683825ce81', 'STU004', 'Concert', 'Fundraising cultural night featuring student bands.', NULL, 'Cultural', 15000.00, '{\"sound_system\":6000,\"stage\":4000,\"permits\":2000,\"security\":3000}', NULL, 'Planning', 'CSG Events Team', 'Permit request submitted to admin office.', NULL, '2026-05-02', '2026-05-02', '05a031f5-235d-11f1-9647-10683825ce81', 'Pending Approval', NULL, '2026-03-19 06:29:42', '2026-03-20 12:40:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30cb5-235d-11f1-9647-10683825ce81', 'STU005', 'Workshop', 'Skills workshop on public speaking and project pitching.', NULL, 'Education', 3000.00, '{\"materials\":900,\"facilitator\":1200,\"certificates\":400,\"snacks\":500}', NULL, 'Completed', 'CSG Training Desk', 'Post-event report submitted and archived.', NULL, '2026-03-10', '2026-03-10', '05a032b9-235d-11f1-9647-10683825ce81', 'Approved', NULL, '2026-03-19 06:29:42', '2026-03-19 18:10:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30d0a-235d-11f1-9647-10683825ce81', 'STU006', 'Fair', 'Community fair with student org booths and services.', NULL, 'Social', 8000.00, '{\"booths\":2500,\"permits\":1200,\"utilities\":1800,\"promotions\":2500}', NULL, 'In Progress', 'CSG Community Relations', 'Booth assignments are currently being finalized.', NULL, '2026-04-15', '2026-04-16', '05a031f5-235d-11f1-9647-10683825ce81', 'Approved', NULL, '2026-03-19 06:29:42', '2026-03-20 13:05:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('393a800f-3146-4e58-867c-ff47e404273c', NULL, 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Sports', 17902.00, '[{\"id\":1,\"item\":\"sfddsaf\",\"quantity\":1,\"unitPrice\":\"12321\",\"amount\":12321},{\"id\":2,\"item\":\"safsa\",\"quantity\":1,\"unitPrice\":\"23\",\"amount\":23},{\"id\":3,\"item\":\"fsaf\",\"quantity\":1,\"unitPrice\":\"5435\",\"amount\":5435},{\"id\":4,\"item\":\"fsafas\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123}]', 'Lorem ipsum dolor', 'Draft', 'Lorem ipsum dolor', NULL, NULL, '2026-03-22', '2026-04-09', NULL, 'Approved', NULL, '2026-03-23 17:40:32', '2026-03-23 07:41:01', NULL, NULL, 0),
('56fc666e-3b7d-4b03-8e16-87b580bbbdb3', NULL, 'Introduction to IT Outsourcing and Offshoring', 'Offshoring: Relocating business operations to another country.\r\n\r\nOnshore Outsourcing: Provider is in the same country.\r\n\r\nNearshore Outsourcing: Provider is in a neighboring country.\r\n\r\nOffshore Outsourcing: Provider is in a foreign country.\r\n\r\nCaptive Offshoring: Company-owned subsidiary in another country.', 'Outsourcing: Delegating IT functions to an external service provider.asdasasd', 'Technology', 1254675.00, '[{\"id\":1774404475521,\"item\":\"asdfs12312312\",\"qty\":\"1\",\"unitPrice\":\"23131\",\"amount\":23131},{\"id\":1774404762609,\"item\":\"wrqwrqw123123\",\"qty\":\"1\",\"unitPrice\":\"1231231\",\"amount\":1231231},{\"id\":1774405091425,\"item\":\"sdfsdsfsa\",\"qty\":\"1\",\"unitPrice\":\"313\",\"amount\":313}]', 'Outsourcing', 'Draft', 'sfdgfdsg', NULL, NULL, '2026-03-23', '2026-04-09', NULL, 'Pending Adviser Approval', NULL, '2026-03-24 09:31:33', '2026-03-25 13:08:30', NULL, NULL, 0),
('80610d3e-4350-4583-a3b0-1793ea8a109a', NULL, 'shabulab', 'This project aims to build a centralized Customer Data Platform (CDP) that unifies data from our CRM, e-commerce site, and customer support channels. By breaking down data silos, we will create a single, 360-degree view of each customer. The primary goal is to empower the marketing and sales teams with real-time insights to personalize campaigns, improve customer retention rates by 15%, and increase cross-selling opportunities. The project will be delivered in Q4, utilizing cloud-based infrastructure to ensure scalability and security.', NULL, 'Technology', 123247.00, '[{\"id\":1,\"item\":\"sdfa\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123},{\"id\":2,\"item\":\"asfsd\",\"quantity\":1,\"unitPrice\":\"123124\",\"amount\":123124}]', NULL, 'Pending Adviser Approval', 'sdafasdf', 'gusto ko yan boi', 0x30, '2026-04-01', '2026-04-09', 'jani', 'Draft', '2026-03-19 05:30:26', '2026-03-21 07:54:38', '2026-03-25 14:41:20', NULL, NULL, 1),
('892e8314-974c-4196-9865-7d36ab13e30f', NULL, 'sdfsadfsafsadfsad', 'safsadf', 'sdfsadf', 'Cultural', 15369195.00, '[{\"id\":1,\"item\":\"safsfsa\",\"quantity\":1,\"unitPrice\":\"12312\",\"amount\":15156072,\"qty\":\"1231\"},{\"id\":1774404381561,\"item\":\"sdfsdaf\",\"qty\":\"1\",\"unitPrice\":\"213123\",\"amount\":213123}]', 'sdfsda', 'Draft', 'safsdaf', NULL, NULL, '2026-03-24', '2026-04-07', NULL, 'Draft', NULL, '2026-03-25 12:06:12', '2026-03-25 12:54:40', NULL, NULL, 1),
('92c55bbf-deda-49b8-9f1c-28c487b261a2', NULL, 'safdsad', 'sadfsdasafsafs', 'fasdfasd', 'Technology', 23655.00, '[{\"id\":1,\"item\":\"fsaf\",\"quantity\":1,\"unitPrice\":\"21312\",\"amount\":21312},{\"id\":1774317057314,\"item\":\"safsad\",\"qty\":\"1\",\"unitPrice\":\"2343\",\"amount\":2343}]', 'safdsda', 'Draft', 'sdfsda', NULL, NULL, '2026-03-23', '2026-04-08', NULL, 'Draft', NULL, '2026-03-24 11:50:47', '2026-03-24 11:51:08', NULL, NULL, 1),
('a04da610-2106-4eeb-b0d3-cde6982ab56e', NULL, 'SabungaQo', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaasdfsdafasd. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Environmental', 1381634.00, '[{\"id\":1,\"item\":\"sfdsaf\",\"quantity\":1,\"unitPrice\":\"23423\",\"amount\":23423},{\"id\":2,\"item\":\"wqrqw\",\"quantity\":1,\"unitPrice\":\"1\",\"amount\":1},{\"id\":3,\"item\":\"fsdfsad\",\"quantity\":1,\"unitPrice\":\"1231\",\"amount\":1231},{\"id\":4,\"item\":\"fsasdaf\",\"quantity\":1,\"unitPrice\":\"432\",\"amount\":432},{\"id\":5,\"item\":\"sfsaf\",\"quantity\":1,\"unitPrice\":\"123123\",\"amount\":123123},{\"id\":6,\"item\":\"dfsd\",\"quantity\":1,\"unitPrice\":\"1233424\",\"amount\":1233424}]', 'Lorem ipsum dolor', 'Draft', 'janisadfs', NULL, NULL, '2026-03-22', '2026-04-08', NULL, 'Draft', NULL, '2026-03-23 17:09:37', '2026-03-24 10:55:12', NULL, NULL, 1),
('a5c95c33-1641-458f-a02e-75e7473e4f17', NULL, 'dsad', 'asfsadf', 'safsadf', 'Social', 325435.00, '[{\"id\":1,\"item\":\"sfsaf\",\"quantity\":1,\"unitPrice\":\"13123\",\"amount\":0,\"qty\":\"1\"},{\"id\":1774434470987,\"item\":\"asfsadf\",\"qty\":\"1\",\"unitPrice\":\"312312\",\"amount\":312312}]', 'safsadf', 'Draft', 'sfsa', NULL, NULL, '2026-03-25', '2026-04-08', NULL, 'Draft', NULL, '2026-03-25 20:27:44', '2026-03-25 20:28:01', NULL, NULL, 1),
('da5cc748-0baa-4064-aeab-0b36ac6fef9e', NULL, 'sdfsdf', 'safdsdaf', 'asfsdaf', 'Cultural', 1638203.00, '[{\"id\":1,\"item\":\"safsafs\",\"quantity\":1,\"unitPrice\":\"1312\",\"amount\":1615072,\"qty\":\"1231\"},{\"id\":1774402198690,\"item\":\"asfsdaf\",\"qty\":\"1\",\"unitPrice\":\"23131\",\"amount\":23131}]', 'sadfasdf', 'Draft', 'sfdsafs', NULL, NULL, '2026-03-24', '2026-04-09', NULL, 'Draft', NULL, '2026-03-25 11:29:32', '2026-03-25 12:48:09', NULL, NULL, 1),
('e2eca5d1-d532-4985-a21e-ea4ba3121c69', NULL, 'a', 'aa', 'fsd', 'Social', 2222.00, '[{\"id\":1,\"item\":\"a\",\"quantity\":1,\"unitPrice\":\"2222\",\"amount\":2222}]', 'a', 'Draft', 'aad', NULL, NULL, '2026-04-14', '2026-04-21', NULL, 'Draft', NULL, '2026-04-04 09:20:07', '2026-04-04 09:20:07', NULL, NULL, 0),
('f1d40b96-a6fc-4d09-9936-3e3782d71b7c', NULL, 'Customer 360 Data Integration', 'This project aims to build a centralized Customer Data Platform (CDP) that unifies data from our CRM, e-commerce site, and customer support channels. By breaking down data silos, we will create a single, 360-degree view of each customer. The primary goal is to empower the marketing and sales teams with real-time insights to personalize campaigns, improve customer retention rates by 15%, and increase cross-selling opportunities. The project will be delivered in Q4, utilizing cloud-based infrastructure to ensure scalability and security.', 'To design and implement a cloud-based Customer Data Platform (CDP) that unifies customer data from multiple sources to enhance marketing and sales strategies.sfsdf', 'Social', 7.00, '[{\"id\":1,\"item\":\"sdfsda\",\"quantity\":1,\"unitPrice\":\"1\",\"amount\":0,\"qty\":\"1\"},{\"id\":2,\"item\":\"sdfasd\",\"quantity\":1,\"unitPrice\":\"2\",\"amount\":0,\"qty\":\"1\"},{\"id\":3,\"item\":\"fsadfads\",\"quantity\":1,\"unitPrice\":\"4\",\"amount\":0,\"qty\":\"1\"}]', 'KLD Bldg 1', 'Draft', 'safsdafsadf sdfsadf sfasfasdf', NULL, NULL, '2026-03-20', '2026-04-09', NULL, 'Rejected', '0000-00-00 00:00:00', '2026-03-21 10:51:03', '2026-03-25 12:54:23', NULL, NULL, 0),
('ff05f8cc-f545-4be4-bb4c-417883aebe9c', NULL, 'tanimBala', 'According to Module 3:\r\n\r\n\"The most common and widely recognized BI tools include: a. Microsoft Power BI ... b. Tableau (now part of Salesforce) ... c. Qlik Sense ...\"', 'According to Module 3:', 'Social', 627.00, '[{\"id\":1,\"item\":\"sadsada\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123},{\"id\":2,\"item\":\"safdas\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123},{\"id\":3,\"item\":\"sdafsd\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123},{\"id\":4,\"item\":\"sdfsda\",\"quantity\":1,\"unitPrice\":\"12\",\"amount\":12},{\"id\":5,\"item\":\"sdfsa\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123},{\"id\":6,\"item\":\"safdsad\",\"quantity\":1,\"unitPrice\":\"123\",\"amount\":123}]', 'asdasdasda', 'Draft', 'sfsdaf', NULL, NULL, '2026-03-22', '2026-04-08', NULL, 'Draft', NULL, '2026-03-23 07:44:23', '2026-03-24 10:47:14', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `rating_score` int(11) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `helpful_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `project_id`, `user_id`, `rating_score`, `comments`, `helpful_count`, `created_at`, `archive`) VALUES
('05a60316-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Great project', 2, '2026-03-19 06:29:42', 0),
('05a6059d-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Well organized', 1, '2026-03-19 07:10:00', 0),
('05a6064f-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 5, 'Excellent outcome', 3, '2026-03-19 07:20:00', 0),
('06c10101-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 4, 'Looks promising for athletes.', 1, '2026-03-19 08:00:00', 0),
('06c10102-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 5, 'Good planning and timeline.', 2, '2026-03-19 08:10:00', 0),
('06c10103-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Excited to join this event.', 1, '2026-03-19 08:15:00', 0),
('06c10104-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 5, 'The tournament structure is fair and clear.', 5, '2026-03-20 10:10:00', 0),
('06c10201-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Great environmental impact.', 4, '2026-03-19 08:20:00', 0),
('06c10202-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Smooth operations and cleanup.', 2, '2026-03-19 08:25:00', 0),
('06c10203-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 5, 'Very meaningful activity.', 2, '2026-03-19 08:30:00', 0),
('06c10301-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 4, 'Topics are relevant for students.', 1, '2026-03-19 08:35:00', 0),
('06c10302-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 5, 'Best seminar lineup so far.', 3, '2026-03-19 08:40:00', 0),
('06c10303-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Useful and practical session.', 1, '2026-03-19 08:45:00', 0),
('06c10304-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 5, 'Speakers were engaging from start to finish.', 3, '2026-03-20 09:50:00', 0),
('06c10401-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Can be a flagship cultural event.', 2, '2026-03-19 08:50:00', 0),
('06c10402-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Budget is high but reasonable.', 1, '2026-03-19 08:55:00', 0),
('06c10403-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Hope approvals are completed soon.', 1, '2026-03-19 09:00:00', 0),
('06c10404-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 4, 'Excited for the cultural performances.', 2, '2026-03-20 10:00:00', 0),
('06c10501-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Very helpful workshop.', 2, '2026-03-19 09:05:00', 0),
('06c10502-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Facilitators were engaging.', 1, '2026-03-19 09:10:00', 0),
('06c10503-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 5, 'Would recommend to others.', 2, '2026-03-19 09:15:00', 0),
('06c10504-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 4, 'Great confidence-building activities.', 2, '2026-03-20 10:20:00', 0),
('06c10601-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 4, 'Community fair is improving.', 1, '2026-03-19 09:20:00', 0),
('06c10602-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 5, 'Great variety of booths.', 2, '2026-03-19 09:25:00', 0),
('06c10603-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Looking forward to final day.', 1, '2026-03-19 09:30:00', 0),
('06c10604-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 5, 'Booth lineup is exciting and organized.', 4, '2026-03-20 09:40:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `reset_password_token`
--

CREATE TABLE `reset_password_token` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` char(36) NOT NULL,
  `permission_id` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `permission_id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `archive`) VALUES
('059ef3f9-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', 'Super Admin', 'superadmin', 'Full system access with all permissions', '2026-03-19 06:29:42', '2026-03-19 06:32:19', 0),
('059ef712-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', 'Admin/Adviser', 'admin', 'Oversight and approvals of projects and transactions', '2026-03-19 06:29:42', '2026-03-19 06:32:48', 0),
('059efde1-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', 'CSG Officer', 'csg', 'Organization operations and submissions', '2026-03-19 06:29:42', '2026-03-19 06:33:09', 0),
('059f4170-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', 'Student', 'student', 'View, rate, and engage in projects', '2026-03-19 06:29:42', '2026-03-19 06:33:29', 0),
('059f4213-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', 'Ordinary Teacher', 'teacher', 'Teaching staff without advisory responsibilities', '2026-03-19 06:29:42', '2026-03-19 06:33:46', 0);

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `role_id` char(36) DEFAULT NULL,
  `permission_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permission`
--

INSERT INTO `role_permission` (`id`, `user_id`, `role_id`, `permission_id`, `created_at`) VALUES
('05acae39-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43'),
('05acb16e-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e56c0-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43'),
('05acb277-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43'),
('05acb39e-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e56c0-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43'),
('05acb459-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43'),
('05acb50b-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e56c0-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43'),
('05ad21e2-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', '059e4bca-235d-11f1-9647-10683825ce81', '2026-03-19 06:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext DEFAULT NULL,
  `last_activity` int(11) DEFAULT NULL,
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`, `archive`) VALUES
('05a9731a-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '127.0.0.1', NULL, NULL, NULL, 0),
('05a9750e-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '127.0.0.1', NULL, NULL, NULL, 0),
('05a975d1-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '192.168.1.1', NULL, NULL, NULL, 0),
('05a979d5-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '192.168.1.2', NULL, NULL, NULL, 0),
('05a97a57-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '10.0.0.1', NULL, NULL, NULL, 0),
('05a97ab9-235d-11f1-9647-10683825ce81', '05a031f5-235d-11f1-9647-10683825ce81', '10.0.0.2', NULL, NULL, NULL, 0),
('05a97b1a-235d-11f1-9647-10683825ce81', '05a02fe2-235d-11f1-9647-10683825ce81', '172.16.0.1', NULL, NULL, NULL, 0),
('6WvAnRBH4cYE3dQiOQ1OvwUECVQlC0SgCudH9qfT', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 CrKey/1.54.250320', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOHdlQmpzT2pBU1pnZEx3dklPUkd5MGx2MlhQWkgyUmo3NjJqWkJFYyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776152173, 0),
('gZR9zJ3XMTKB4RpzvyEMPSebbIyH0n3srEwD4iO8', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 CrKey/1.54.250320', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZGZRYXI4VDQ5bXNBRVdNWG1CYkRkVWhFODVyV2thSFNZMkpRQkhlSiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776148467, 0),
('I6V0mUi4nACt9E1fs71HgHoLMwsqkmO6R0wKMMC5', '4d4d3d82-d682-44f6-a08b-3540814bc026', '127.0.0.1', 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 CrKey/1.54.250320', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoidzAzYkdFZm1XU0tiR3U3NHJsZ05FdmRWYlBFWGE0Z09KNExMWlZnNiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6OToiZGFzaGJvYXJkIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO3M6MzY6IjRkNGQzZDgyLWQ2ODItNDRmNi1hMDhiLTM1NDA4MTRiYzAyNiI7fQ==', 1776153269, 0),
('JH5uOXepxEp99C90ptGUeh5MPZhQ2sTeXrO6HyoS', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 CrKey/1.54.250320', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVUs3dHRkWFVrNHlVdGJXclg3OEx0QU5hc2ZFUVBRYTdhMnNkbjFadyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776148914, 0),
('QnLCPaiaIRD25vYsJzKFOX99XeTFgpdSjap1hH0j', '4d4d3d82-d682-44f6-a08b-3540814bc026', '127.0.0.1', 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 CrKey/1.54.250320', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMWRKMlc2c2NDbEpKQ0NFcWNOY29keFh3MmRpRFh0ZG9EdVE4cFFtQyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO3M6MzY6IjRkNGQzZDgyLWQ2ODItNDRmNi1hMDhiLTM1NDA4MTRiYzAyNiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6OToiZGFzaGJvYXJkIjt9fQ==', 1776153269, 0),
('WhQrBocQ8ivu7n7tNXvVIwZ8rJ4h06hM01JxrYbf', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 CrKey/1.54.250320', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoid0VKZDlaUGp4NXdxRTI4NHJNZGxzTUtjekNqb3RMd1RTOGZyd1hkMyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776148962, 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_csg_officers`
--

CREATE TABLE `student_csg_officers` (
  `id` varchar(100) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `course_id` varchar(100) DEFAULT NULL,
  `is_csg` tinyint(1) DEFAULT 0,
  `csg_position` varchar(100) DEFAULT NULL,
  `csg_term_start` date DEFAULT NULL,
  `csg_term_end` date DEFAULT NULL,
  `csg_is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_csg_officers`
--

INSERT INTO `student_csg_officers` (`id`, `user_id`, `course_id`, `is_csg`, `csg_position`, `csg_term_start`, `csg_term_end`, `csg_is_active`, `created_at`, `updated_at`, `archive`) VALUES
('STU001', '05a033dc-235d-11f1-9647-10683825ce81', '059d2612-235d-11f1-9647-10683825ce81', 0, 'President', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-04-14 05:48:07', 0),
('STU002', '05a0346d-235d-11f1-9647-10683825ce81', '059d2612-235d-11f1-9647-10683825ce81', 0, 'VP', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-04-14 05:48:13', 0),
('STU003', '05a034e4-235d-11f1-9647-10683825ce81', '059d2612-235d-11f1-9647-10683825ce81', 0, 'Secretary', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-04-14 05:48:17', 0),
('STU004', '05a0334d-235d-11f1-9647-10683825ce81', '059d2612-235d-11f1-9647-10683825ce81', 0, 'Treasurer', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-04-14 05:48:21', 0),
('STU005', '05a033dc-235d-11f1-9647-10683825ce81', 'EMP004', 0, 'Auditor', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('STU006', '05a0346d-235d-11f1-9647-10683825ce81', 'EMP004', 0, 'PRO', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('STU007', '05a034e4-235d-11f1-9647-10683825ce81', 'EMP006', 0, 'Rep', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('STU008', '06e30001-235d-11f1-9647-10683825ce81', 'EMP001', 0, 'Member', NULL, NULL, 1, '2026-03-20 07:40:00', '2026-03-20 07:40:00', 0),
('STU009', '06e30002-235d-11f1-9647-10683825ce81', 'EMP001', 0, 'Member', NULL, NULL, 1, '2026-03-20 07:42:00', '2026-03-20 07:42:00', 0),
('STU010', '06e30003-235d-11f1-9647-10683825ce81', 'EMP002', 0, 'Member', NULL, NULL, 1, '2026-03-20 07:44:00', '2026-03-20 07:44:00', 0),
('STU011', '06e30004-235d-11f1-9647-10683825ce81', 'EMP004', 0, 'Member', NULL, NULL, 1, '2026-03-20 07:46:00', '2026-03-20 07:46:00', 0),
('STU012', '06e30005-235d-11f1-9647-10683825ce81', 'EMP006', 0, 'Member', NULL, NULL, 1, '2026-03-20 07:48:00', '2026-03-20 07:48:00', 0),
('STU013', '06e30006-235d-11f1-9647-10683825ce81', 'EMP002', 0, 'Member', NULL, NULL, 1, '2026-03-20 07:50:00', '2026-03-20 07:50:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_adviser`
--

CREATE TABLE `teacher_adviser` (
  `id` varchar(100) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `institute_id` char(36) DEFAULT NULL,
  `is_adviser` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_adviser`
--

INSERT INTO `teacher_adviser` (`id`, `user_id`, `institute_id`, `is_adviser`, `created_at`, `updated_at`, `archive`) VALUES
('EMP001', '05a031f5-235d-11f1-9647-10683825ce81', NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP002', '05a032b9-235d-11f1-9647-10683825ce81', NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP003', '05a032b9-235d-11f1-9647-10683825ce81', NULL, 0, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP004', '05a031f5-235d-11f1-9647-10683825ce81', NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP005', '05a032b9-235d-11f1-9647-10683825ce81', NULL, 0, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP006', '05a031f5-235d-11f1-9647-10683825ce81', NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP007', '05a032b9-235d-11f1-9647-10683825ce81', NULL, 0, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `role_id` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `profile_completed` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','suspended','archived') DEFAULT 'active',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `email_verified_at`, `phone`, `password`, `avatar_url`, `profile_completed`, `status`, `last_login_at`, `remember_token`, `created_at`, `updated_at`, `archive`) VALUES
('05a02fe2-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', 'Super Admin', 'superadmin@kld.edu.ph', '2026-03-19 06:53:13', '09466552088', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a031f5-235d-11f1-9647-10683825ce81', '059ef712-235d-11f1-9647-10683825ce81', 'Dr. Maria Santos', 'maria.santos@kld.edu.ph', '2026-03-19 06:53:13', '09799179280', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a032b9-235d-11f1-9647-10683825ce81', '059f4213-235d-11f1-9647-10683825ce81', 'Prof. Juan Reyes', 'juan.reyes@kld.edu.ph', '2026-03-19 06:53:13', '09696240168', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a0334d-235d-11f1-9647-10683825ce81', '059efde1-235d-11f1-9647-10683825ce81', 'David', 'david@kld.edu.ph', '2026-03-19 06:53:13', '09983663026', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a033dc-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Eve', 'eve@kld.edu.ph', '2026-03-19 06:53:13', '09929594658', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a0346d-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Frank', 'frank@kld.edu.ph', '2026-03-19 06:53:13', '09696984240', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a034e4-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Grace', 'grace@kld.edu.ph', '2026-03-19 06:53:13', '09596137256', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('06e30001-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Henry Cruz', 'henry.cruz@kld.edu.ph', '2026-03-20 07:10:00', '09981110001', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-20 07:10:00', NULL, '2026-03-20 07:10:00', '2026-03-20 07:10:00', 0),
('06e30002-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Ivy Santos', 'ivy.santos@kld.edu.ph', '2026-03-20 07:15:00', '09981110002', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-20 07:15:00', NULL, '2026-03-20 07:15:00', '2026-03-20 07:15:00', 0),
('06e30003-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Justin Lim', 'justin.lim@kld.edu.ph', '2026-03-20 07:20:00', '09981110003', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-20 07:20:00', NULL, '2026-03-20 07:20:00', '2026-03-20 07:20:00', 0),
('06e30004-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Karla Mendoza', 'karla.mendoza@kld.edu.ph', '2026-03-20 07:25:00', '09981110004', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-20 07:25:00', NULL, '2026-03-20 07:25:00', '2026-03-20 07:25:00', 0),
('06e30005-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Leo Navarro', 'leo.navarro@kld.edu.ph', '2026-03-20 07:30:00', '09981110005', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-20 07:30:00', NULL, '2026-03-20 07:30:00', '2026-03-20 07:30:00', 0),
('06e30006-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Mia Perez', 'mia.perez@kld.edu.ph', '2026-03-20 07:35:00', '09981110006', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', NULL, 0, 'active', '2026-03-20 07:35:00', NULL, '2026-03-20 07:35:00', '2026-03-20 07:35:00', 0),
('4d4d3d82-d682-44f6-a08b-3540814bc026', '059f4170-235d-11f1-9647-10683825ce81', 'JAMES TORILLAS TAMAYO', 'jttamayo@kld.edu.ph', '2026-04-13 23:54:26', NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJSq8gDznGQvQNLtVugx21hZN-Z40sehpu-m1mE9a1HhJkOGQ=s96-c', 0, 'active', '2026-04-13 23:54:27', NULL, '2026-04-13 23:54:26', '2026-04-13 23:54:27', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approval`
--
ALTER TABLE `approval`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `badge`
--
ALTER TABLE `badge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `badge_collected`
--
ALTER TABLE `badge_collected`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_badge` (`badge_id`,`user_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_badge_id` (`badge_id`),
  ADD KEY `idx_earned_date` (`earned_date`);

--
-- Indexes for table `chain`
--
ALTER TABLE `chain`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `institute_id` (`institute_id`);

--
-- Indexes for table `institute`
--
ALTER TABLE `institute`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_project_user_rating` (`project_id`,`user_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reset_password_token`
--
ALTER TABLE `reset_password_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `student_csg_officers`
--
ALTER TABLE `student_csg_officers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `teacher_adviser`
--
ALTER TABLE `teacher_adviser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `institute_id` (`institute_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `approval`
--
ALTER TABLE `approval`
  ADD CONSTRAINT `approval_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `teacher_adviser` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `approval_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `badge_collected`
--
ALTER TABLE `badge_collected`
  ADD CONSTRAINT `badge_collected_ibfk_1` FOREIGN KEY (`badge_id`) REFERENCES `badge` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `badge_collected_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chain`
--
ALTER TABLE `chain`
  ADD CONSTRAINT `chain_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`institute_id`) REFERENCES `institute` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD CONSTRAINT `ledger_entries_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ledger_entries_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ledger_entries_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ledger_entries_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `meeting_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_csg_officers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_csg_officers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reset_password_token`
--
ALTER TABLE `reset_password_token`
  ADD CONSTRAINT `reset_password_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_ibfk_3` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_csg_officers`
--
ALTER TABLE `student_csg_officers`
  ADD CONSTRAINT `student_csg_officers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  -- ADD CONSTRAINT `student_csg_officers_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `teacher_adviser` (`id`) ON DELETE SET NULL;
  -- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop the incorrect constraint
ALTER TABLE `student_csg_officers` DROP FOREIGN KEY `student_csg_officers_ibfk_2`;

-- Add the correct constraint (references 'course' table, not 'teacher_adviser')
ALTER TABLE `student_csg_officers`
  ADD CONSTRAINT `student_csg_officers_ibfk_2` 
  FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE SET NULL;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

--
-- Constraints for table `teacher_adviser`
--
ALTER TABLE `teacher_adviser`
  ADD CONSTRAINT `teacher_adviser_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_adviser_ibfk_2` FOREIGN KEY (`institute_id`) REFERENCES `permission` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;