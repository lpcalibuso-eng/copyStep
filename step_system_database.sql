-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 19, 2026 at 07:54 AM
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
  `approval_id` char(36) DEFAULT NULL,
  `prev_hash` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `data_snapshot` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chain`
--

INSERT INTO `chain` (`id`, `approval_id`, `prev_hash`, `hash`, `data_snapshot`, `created_at`) VALUES
('05a528b2-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash1', NULL, '2026-03-19 06:29:42'),
('05a52af2-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash2', NULL, '2026-03-19 06:29:42'),
('05a52b8f-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash3', NULL, '2026-03-19 06:29:42'),
('05a52bf1-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash4', NULL, '2026-03-19 06:29:42'),
('05a52c57-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash5', NULL, '2026-03-19 06:29:42'),
('05a52cb9-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash6', NULL, '2026-03-19 06:29:42'),
('05a52d0d-235d-11f1-9647-10683825ce81', '05a3e3a8-235d-11f1-9647-10683825ce81', NULL, 'hash7', NULL, '2026-03-19 06:29:42');

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
('059d226e-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSIT', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d2571-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSCS', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d2612-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSBA', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d267c-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSCE', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d26df-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSED', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d2744-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSN', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059d279f-235d-11f1-9647-10683825ce81', '059bab0d-235d-11f1-9647-10683825ce81', 'BSCrim', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0);

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
('059bab0d-235d-11f1-9647-10683825ce81', 'CAS', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059bb26f-235d-11f1-9647-10683825ce81', 'CCS', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059bb31d-235d-11f1-9647-10683825ce81', 'CBA', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059bb359-235d-11f1-9647-10683825ce81', 'COE', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059bb388-235d-11f1-9647-10683825ce81', 'CTE', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059bb3b0-235d-11f1-9647-10683825ce81', 'CON', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('059bb3d9-235d-11f1-9647-10683825ce81', 'CCJ', NULL, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ledger_entries`
--

CREATE TABLE `ledger_entries` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `type` enum('Income','Expense') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `budget_breakdown` int(11) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `ledger_proof` varchar(500) DEFAULT NULL COMMENT 'Path to uploaded proof file',
  `approval_status` enum('Draft','Pending Approval','Approved','Rejected') DEFAULT 'Draft',
  `note` text DEFAULT NULL COMMENT 'Approval/rejection notes',
  `approved_by` char(36) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ledger_entries`
--

INSERT INTO `ledger_entries` (`id`, `project_id`, `type`, `amount`, `budget_breakdown`, `description`, `category`, `ledger_proof`, `approval_status`, `note`, `approved_by`, `created_by`, `updated_by`, `approved_at`, `rejected_at`, `created_at`, `updated_at`) VALUES
('06b10001-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 'Income', 5000.00, 1, 'Initial project allocation', 'Allocation', 'proofs/ledger/06b10001-allocation.pdf', 'Approved', 'Initial approved allocation', '05a031f5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '2026-03-19 06:40:00', NULL, '2026-03-19 06:35:00', '2026-03-19 06:40:00'),
('06b10002-235d-11f1-9647-10683825ce81', '05a30928-235d-11f1-9647-10683825ce81', 'Expense', 1200.00, 2, 'Venue down payment', 'Venue', 'proofs/ledger/06b10002-venue.jpg', 'Pending Approval', 'Waiting adviser review', NULL, '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', NULL, NULL, '2026-03-19 06:50:00', '2026-03-19 06:50:00'),
('06b10003-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', 'Income', 4500.00, 1, 'Sports committee sponsor fund', 'Sponsorship', 'proofs/ledger/06b10003-sports-sponsor.pdf', 'Approved', 'Sponsor fund confirmed', '05a031f5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '2026-03-20 09:15:00', NULL, '2026-03-20 08:50:00', '2026-03-20 09:15:00'),
('06b10004-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', 'Expense', 1800.00, 2, 'Uniform partial payment', 'Uniform', 'proofs/ledger/06b10004-uniform.jpg', 'Approved', 'Approved by adviser', '05a031f5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '2026-03-20 10:05:00', NULL, '2026-03-20 09:50:00', '2026-03-20 10:05:00'),
('06b10005-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', 'Expense', 220.00, 1, 'Gloves and cleaning tools', 'Supplies', 'proofs/ledger/06b10005-cleanup-tools.png', 'Approved', 'Community drive expense', '05a031f5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '2026-03-08 14:00:00', NULL, '2026-03-07 17:10:00', '2026-03-08 14:00:00'),
('06b10006-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', 'Expense', 750.00, 1, 'Speaker token and certificates', 'Program', 'proofs/ledger/06b10006-seminar-proof.pdf', 'Pending Approval', 'Awaiting proof verification', NULL, '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', NULL, NULL, '2026-03-20 11:30:00', '2026-03-20 11:30:00'),
('06b10007-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', 'Income', 6000.00, 1, 'Concert partner sponsorship', 'Sponsorship', 'proofs/ledger/06b10007-concert-sponsor.pdf', 'Approved', 'Main sponsor signed agreement', '05a031f5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '2026-03-20 12:55:00', NULL, '2026-03-20 12:20:00', '2026-03-20 12:55:00'),
('06b10008-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', 'Expense', 520.00, 2, 'Workshop snacks and refreshments', 'Food', 'proofs/ledger/06b10008-workshop-snacks.jpg', 'Approved', 'Receipts complete', '05a032b9-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', '2026-03-10 15:30:00', NULL, '2026-03-10 14:40:00', '2026-03-10 15:30:00'),
('06b10009-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', 'Expense', 1600.00, 2, 'Booth utilities and permit fees', 'Operations', 'proofs/ledger/06b10009-fair-utilities.pdf', 'Pending Approval', 'Pending final permit attachment', NULL, '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', NULL, NULL, '2026-03-20 13:25:00', '2026-03-20 13:25:00');

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
('06d20001-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Project Approved', 'Your project "Tech Expo" was approved by the adviser.', 'project', 0, NULL, '2026-03-20 08:10:00', '2026-03-20 08:10:00', 0),
('06d20002-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Ledger Entry Pending', 'A ledger entry for "Tech Expo" is waiting for approval.', 'ledger', 0, NULL, '2026-03-20 09:25:00', '2026-03-20 09:25:00', 0),
('06d20003-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'New Proof Uploaded', 'A new proof document was uploaded for transaction 06b10002.', 'proof', 1, '2026-03-20 10:12:00', '2026-03-20 10:00:00', '2026-03-20 10:12:00', 0),
('06d20004-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Meeting Reminder', 'Budget planning meeting starts at 2:00 PM today.', 'meeting', 0, NULL, '2026-03-20 11:00:00', '2026-03-20 11:00:00', 0),
('06d20005-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Badge Earned', 'You unlocked "Documentation Pro" badge.', 'badge', 0, NULL, '2026-03-20 12:15:00', '2026-03-20 12:15:00', 0),
('06d20006-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Points Added', 'You received 15 points from helpful project feedback.', 'points', 1, '2026-03-20 13:00:00', '2026-03-20 12:40:00', '2026-03-20 13:00:00', 0),
('06d20007-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 'Rating Posted', 'Your rating on "Sports Fest" has been published.', 'rating', 0, NULL, '2026-03-20 13:25:00', '2026-03-20 13:25:00', 0),
('06d20008-235d-11f1-9647-10683825ce81', NULL, 'System Notice', 'The STEP platform will undergo maintenance on Sunday at 9:00 PM.', 'system', 0, NULL, '2026-03-20 13:30:00', '2026-03-20 13:30:00', 0);

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
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` char(36) NOT NULL,
  `student_id` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `budget_breakdown` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `proposed_by` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `approve_by` varchar(255) DEFAULT NULL,
  `approval_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `student_id`, `title`, `description`, `category`, `budget`, `budget_breakdown`, `status`, `proposed_by`, `note`, `start_date`, `end_date`, `approve_by`, `approval_status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `archive`) VALUES
('05a30928-235d-11f1-9647-10683825ce81', 'STU001', 'Tech Expo', 'Campus-wide technology exhibition for student innovations.', 'Technology', 5000.00, '{"booth_materials":1500,"awards":1000,"marketing":1200,"logistics":1300}', 'In Progress', 'CSG Innovation Committee', 'On track, waiting for final sponsor confirmation.', '2026-03-25', '2026-04-05', '05a031f5-235d-11f1-9647-10683825ce81', 'Approved', '2026-03-19 06:29:42', '2026-03-20 09:10:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30ad6-235d-11f1-9647-10683825ce81', 'STU001', 'Sports Fest', 'Inter-course sports competition and team building activities.', 'Sports', 10000.00, '{"uniforms":2500,"equipment":3000,"prizes":2000,"medical":2500}', 'Planning', 'CSG Sports Committee', 'Venue reserved and fixtures being finalized.', '2026-04-10', '2026-04-20', '05a031f5-235d-11f1-9647-10683825ce81', 'Pending Approval', '2026-03-19 06:29:42', '2026-03-20 10:15:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30b96-235d-11f1-9647-10683825ce81', 'STU002', 'Clean Up', 'Environmental clean-up and waste segregation drive.', 'Environmental', 500.00, '{"trash_bags":150,"gloves":120,"refreshments":230}', 'Completed', 'CSG Environment Unit', 'Completed successfully with 120 volunteers.', '2026-03-05', '2026-03-07', '05a031f5-235d-11f1-9647-10683825ce81', 'Approved', '2026-03-19 06:29:42', '2026-03-19 17:30:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30c03-235d-11f1-9647-10683825ce81', 'STU003', 'Seminar', 'Career and leadership seminar for graduating students.', 'Education', 2000.00, '{"speaker_honorarium":900,"kits":500,"snacks":600}', 'In Progress', 'CSG Academic Affairs', 'Second speaker confirmed, registration open.', '2026-04-01', '2026-04-01', '05a032b9-235d-11f1-9647-10683825ce81', 'Approved', '2026-03-19 06:29:42', '2026-03-20 11:20:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30c5d-235d-11f1-9647-10683825ce81', 'STU004', 'Concert', 'Fundraising cultural night featuring student bands.', 'Cultural', 15000.00, '{"sound_system":6000,"stage":4000,"permits":2000,"security":3000}', 'Planning', 'CSG Events Team', 'Permit request submitted to admin office.', '2026-05-02', '2026-05-02', '05a031f5-235d-11f1-9647-10683825ce81', 'Pending Approval', '2026-03-19 06:29:42', '2026-03-20 12:40:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30cb5-235d-11f1-9647-10683825ce81', 'STU005', 'Workshop', 'Skills workshop on public speaking and project pitching.', 'Education', 3000.00, '{"materials":900,"facilitator":1200,"certificates":400,"snacks":500}', 'Completed', 'CSG Training Desk', 'Post-event report submitted and archived.', '2026-03-10', '2026-03-10', '05a032b9-235d-11f1-9647-10683825ce81', 'Approved', '2026-03-19 06:29:42', '2026-03-19 18:10:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0),
('05a30d0a-235d-11f1-9647-10683825ce81', 'STU006', 'Fair', 'Community fair with student org booths and services.', 'Social', 8000.00, '{"booths":2500,"permits":1200,"utilities":1800,"promotions":2500}', 'In Progress', 'CSG Community Relations', 'Booth assignments are currently being finalized.', '2026-04-15', '2026-04-16', '05a031f5-235d-11f1-9647-10683825ce81', 'Approved', '2026-03-19 06:29:42', '2026-03-20 13:05:00', '05a0334d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 0);

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
('06c10201-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Great environmental impact.', 4, '2026-03-19 08:20:00', 0),
('06c10202-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Smooth operations and cleanup.', 2, '2026-03-19 08:25:00', 0),
('06c10203-235d-11f1-9647-10683825ce81', '05a30b96-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 5, 'Very meaningful activity.', 2, '2026-03-19 08:30:00', 0),
('06c10301-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 4, 'Topics are relevant for students.', 1, '2026-03-19 08:35:00', 0),
('06c10302-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 5, 'Best seminar lineup so far.', 3, '2026-03-19 08:40:00', 0),
('06c10303-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Useful and practical session.', 1, '2026-03-19 08:45:00', 0),
('06c10401-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Can be a flagship cultural event.', 2, '2026-03-19 08:50:00', 0),
('06c10402-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Budget is high but reasonable.', 1, '2026-03-19 08:55:00', 0),
('06c10403-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Hope approvals are completed soon.', 1, '2026-03-19 09:00:00', 0),
('06c10501-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 5, 'Very helpful workshop.', 2, '2026-03-19 09:05:00', 0),
('06c10502-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 4, 'Facilitators were engaging.', 1, '2026-03-19 09:10:00', 0),
('06c10503-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 5, 'Would recommend to others.', 2, '2026-03-19 09:15:00', 0),
('06c10601-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a033dc-235d-11f1-9647-10683825ce81', 4, 'Community fair is improving.', 1, '2026-03-19 09:20:00', 0),
('06c10602-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a0346d-235d-11f1-9647-10683825ce81', 5, 'Great variety of booths.', 2, '2026-03-19 09:25:00', 0),
('06c10603-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a034e4-235d-11f1-9647-10683825ce81', 4, 'Looking forward to final day.', 1, '2026-03-19 09:30:00', 0),
('06c10604-235d-11f1-9647-10683825ce81', '05a30d0a-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 5, 'Booth lineup is exciting and organized.', 4, '2026-03-20 09:40:00', 0),
('06c10304-235d-11f1-9647-10683825ce81', '05a30c03-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 5, 'Speakers were engaging from start to finish.', 3, '2026-03-20 09:50:00', 0),
('06c10404-235d-11f1-9647-10683825ce81', '05a30c5d-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 4, 'Excited for the cultural performances.', 2, '2026-03-20 10:00:00', 0),
('06c10104-235d-11f1-9647-10683825ce81', '05a30ad6-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 5, 'The tournament structure is fair and clear.', 5, '2026-03-20 10:10:00', 0),
('06c10504-235d-11f1-9647-10683825ce81', '05a30cb5-235d-11f1-9647-10683825ce81', '05a0334d-235d-11f1-9647-10683825ce81', 4, 'Great confidence-building activities.', 2, '2026-03-20 10:20:00', 0);

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
('a5BhMbI9T98SNp3pxkGwPEFNKGtbShnqy6a1L1IB', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidjBydWtkWkxOSEZsblpZeXN5bGNlVlZuNXFFd1lLTmF2Zk1wTVJYVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYWRtaW4vdXNlcnMiO3M6NToicm91dGUiO3M6MTI6InNhZG1pbi51c2VycyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773903001, 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_csg_officers`
--

CREATE TABLE `student_csg_officers` (
  `id` varchar(100) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `adviser_id` varchar(100) DEFAULT NULL,
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

INSERT INTO `student_csg_officers` (`id`, `user_id`, `adviser_id`, `is_csg`, `csg_position`, `csg_term_start`, `csg_term_end`, `csg_is_active`, `created_at`, `updated_at`, `archive`) VALUES
('STU001', '05a033dc-235d-11f1-9647-10683825ce81', 'EMP001', 0, 'President', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('STU002', '05a0346d-235d-11f1-9647-10683825ce81', 'EMP001', 0, 'VP', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('STU003', '05a034e4-235d-11f1-9647-10683825ce81', 'EMP002', 0, 'Secretary', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('STU004', '05a0334d-235d-11f1-9647-10683825ce81', 'EMP002', 0, 'Treasurer', NULL, NULL, 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
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
  `permission_id` char(36) DEFAULT NULL,
  `office_location` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `is_adviser` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_adviser`
--

INSERT INTO `teacher_adviser` (`id`, `user_id`, `permission_id`, `office_location`, `specialization`, `is_adviser`, `created_at`, `updated_at`, `archive`) VALUES
('EMP001', '05a031f5-235d-11f1-9647-10683825ce81', NULL, NULL, 'IT', 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP002', '05a032b9-235d-11f1-9647-10683825ce81', NULL, NULL, 'Math', 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP003', '05a032b9-235d-11f1-9647-10683825ce81', NULL, NULL, 'History', 0, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP004', '05a031f5-235d-11f1-9647-10683825ce81', NULL, NULL, 'Science', 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP005', '05a032b9-235d-11f1-9647-10683825ce81', NULL, NULL, 'PE', 0, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP006', '05a031f5-235d-11f1-9647-10683825ce81', NULL, NULL, 'Arts', 1, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0),
('EMP007', '05a032b9-235d-11f1-9647-10683825ce81', NULL, NULL, 'English', 0, '2026-03-19 06:29:42', '2026-03-19 06:29:42', 0);

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

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `email_verified_at`, `phone`, `password`, `status`, `last_login_at`, `remember_token`, `created_at`, `updated_at`, `archive`) VALUES
('05a02fe2-235d-11f1-9647-10683825ce81', '059ef3f9-235d-11f1-9647-10683825ce81', 'Super Admin', 'superadmin@kld.edu.ph', '2026-03-19 06:53:13', '09466552088', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a031f5-235d-11f1-9647-10683825ce81', '059ef712-235d-11f1-9647-10683825ce81', 'Dr. Maria Santos', 'maria.santos@kld.edu.ph', '2026-03-19 06:53:13', '09799179280', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a032b9-235d-11f1-9647-10683825ce81', '059f4213-235d-11f1-9647-10683825ce81', 'Prof. Juan Reyes', 'juan.reyes@kld.edu.ph', '2026-03-19 06:53:13', '09696240168', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a0334d-235d-11f1-9647-10683825ce81', '059efde1-235d-11f1-9647-10683825ce81', 'David', 'david@kld.edu.ph', '2026-03-19 06:53:13', '09983663026', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a033dc-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Eve', 'eve@kld.edu.ph', '2026-03-19 06:53:13', '09929594658', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a0346d-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Frank', 'frank@kld.edu.ph', '2026-03-19 06:53:13', '09696984240', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('05a034e4-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Grace', 'grace@kld.edu.ph', '2026-03-19 06:53:13', '09596137256', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-19 06:44:49', NULL, '2026-03-19 06:29:42', '2026-03-19 06:53:13', 0),
('06e30001-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Henry Cruz', 'henry.cruz@kld.edu.ph', '2026-03-20 07:10:00', '09981110001', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-20 07:10:00', NULL, '2026-03-20 07:10:00', '2026-03-20 07:10:00', 0),
('06e30002-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Ivy Santos', 'ivy.santos@kld.edu.ph', '2026-03-20 07:15:00', '09981110002', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-20 07:15:00', NULL, '2026-03-20 07:15:00', '2026-03-20 07:15:00', 0),
('06e30003-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Justin Lim', 'justin.lim@kld.edu.ph', '2026-03-20 07:20:00', '09981110003', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-20 07:20:00', NULL, '2026-03-20 07:20:00', '2026-03-20 07:20:00', 0),
('06e30004-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Karla Mendoza', 'karla.mendoza@kld.edu.ph', '2026-03-20 07:25:00', '09981110004', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-20 07:25:00', NULL, '2026-03-20 07:25:00', '2026-03-20 07:25:00', 0),
('06e30005-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Leo Navarro', 'leo.navarro@kld.edu.ph', '2026-03-20 07:30:00', '09981110005', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-20 07:30:00', NULL, '2026-03-20 07:30:00', '2026-03-20 07:30:00', 0),
('06e30006-235d-11f1-9647-10683825ce81', '059f4170-235d-11f1-9647-10683825ce81', 'Mia Perez', 'mia.perez@kld.edu.ph', '2026-03-20 07:35:00', '09981110006', '$2y$12$M3Q5rdVHYK06ZRzBwajIieZ3LecJICvPnilXwVfJ/toq1//nI/rNm', 'active', '2026-03-20 07:35:00', NULL, '2026-03-20 07:35:00', '2026-03-20 07:35:00', 0);

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
  ADD KEY `approval_id` (`approval_id`);

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
  ADD KEY `adviser_id` (`adviser_id`);

--
-- Indexes for table `teacher_adviser`
--
ALTER TABLE `teacher_adviser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

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
  ADD CONSTRAINT `chain_ibfk_1` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `student_csg_officers_ibfk_2` FOREIGN KEY (`adviser_id`) REFERENCES `teacher_adviser` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `teacher_adviser`
--
ALTER TABLE `teacher_adviser`
  ADD CONSTRAINT `teacher_adviser_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_adviser_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;