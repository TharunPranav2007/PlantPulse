-- ============================================================================
-- PLANTPULSE - Smart Industrial Asset & Predictive Maintenance Platform
-- Stage 2: Relational MySQL Database Schema & Initial Data Seed
-- Target Engine: MySQL Server 8.0+
-- Database Name: plantpulse_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `plantpulse_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `plantpulse_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. USERS & ACCESS CONTROL TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `role_key` VARCHAR(30) NOT NULL,
    `employee_id` VARCHAR(30) UNIQUE NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(10) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Initial Role Accounts
INSERT INTO `users` (`username`, `password_hash`, `name`, `role`, `role_key`, `employee_id`, `department`, `avatar`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rajesh Kumar', 'Plant Manager', 'admin', 'PM-001', 'Plant Operations', 'RK'),
('technician', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Arun Kumar', 'Maintenance Technician', 'technician', 'TECH-001', 'Maintenance', 'AK'),
('supervisor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya Sharma', 'Maintenance Supervisor', 'supervisor', 'SUP-001', 'Maintenance Operations', 'PS'),
('inventory', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vikram Singh', 'Inventory Manager', 'inventory', 'INV-001', 'Stores & Inventory', 'VS');


-- ----------------------------------------------------------------------------
-- 2. INDUSTRIAL ASSETS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
    `id` VARCHAR(30) PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `unit` VARCHAR(100) NOT NULL,
    `manufacturer` VARCHAR(100) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `status` ENUM('Operational', 'Maintenance Required', 'Critical Failure', 'Offline') DEFAULT 'Operational',
    `health` INT DEFAULT 100,
    `vibration` DECIMAL(4,2) DEFAULT 3.00,
    `temperature` INT DEFAULT 65,
    `hours` INT DEFAULT 0,
    `installation_date` DATE NOT NULL,
    `last_maintenance` DATE NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Industrial Machinery Assets
INSERT INTO `assets` (`id`, `name`, `type`, `unit`, `manufacturer`, `model`, `status`, `health`, `vibration`, `temperature`, `hours`, `installation_date`, `last_maintenance`, `description`) VALUES
('CNC-001', 'CNC 5-Axis Milling Machine', 'Milling Machine', 'Machining Unit Alpha', 'Haas Automation', 'VF-4SS', 'Operational', 94, 2.10, 68, 4200, '2023-01-15', '2026-09-10', 'High-speed vertical machining center for precision turbine blade component milling.'),
('ROB-014', '6-Axis Heavy Payload Robotic Arm', 'Robotic Assembly', 'Assembly Line 2', 'FANUC Robotics', 'R-2000iC', 'Operational', 88, 3.40, 72, 6150, '2022-06-20', '2026-08-28', 'Articulated robotic arm assigned to automated heavy chassis welding and positioning.'),
('PRESS-009', '150-Ton Hydraulic Stamping Press', 'Stamping Press', 'Press Shop Line B', 'Schuler Group', 'HP-150T', 'Maintenance Required', 62, 5.80, 84, 8900, '2021-11-05', '2026-07-15', 'Heavy-duty hydraulic press experiencing elevated hydraulic pump temperature and fluid pressure drops.'),
('COMP-004', 'Rotary Screw Air Compressor', 'Pneumatics', 'Utility Plant Unit 1', 'Atlas Copco', 'GA 75 VSD+', 'Operational', 91, 1.80, 62, 3400, '2023-04-10', '2026-09-01', 'Variable speed drive rotary screw compressor supplying main pneumatic pressure grid.'),
('LATHE-007', 'CNC Precision Turning Center', 'Lathe Machine', 'Machining Unit Beta', 'DMG MORI', 'NLX 2500', 'Critical Failure', 45, 7.20, 92, 11200, '2020-08-12', '2026-06-18', 'Spindle bearing degradation causing severe chatter and thermal expansion beyond tolerances.');


-- ----------------------------------------------------------------------------
-- 3. MAINTENANCE SCHEDULES TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `maintenance`;
CREATE TABLE `maintenance` (
    `id` VARCHAR(30) PRIMARY KEY,
    `asset_id` VARCHAR(30) NOT NULL,
    `asset_name` VARCHAR(150) NOT NULL,
    `type` ENUM('Preventive PM', 'Corrective Overhaul', 'Predictive Parts Replacement', 'Emergency Repair') NOT NULL,
    `technician` VARCHAR(100) NOT NULL,
    `scheduled_date` DATE NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    `cost` DECIMAL(10,2) DEFAULT 0.00,
    `status` ENUM('Scheduled', 'In Progress', 'Completed', 'Overdue') DEFAULT 'Scheduled',
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `maintenance` (`id`, `asset_id`, `asset_name`, `type`, `technician`, `scheduled_date`, `priority`, `cost`, `status`, `notes`) VALUES
('PM-2026-041', 'PRESS-009', '150-Ton Hydraulic Stamping Press', 'Corrective Overhaul', 'Arun Kumar', '2026-10-02', 'High', 14500.00, 'In Progress', 'Flush hydraulic lines, replace high-pressure viton seal kits, inspect pump valves.'),
('PM-2026-042', 'CNC-001', 'CNC 5-Axis Milling Machine', 'Preventive PM', 'Kavita Reddy', '2026-10-10', 'Medium', 3200.00, 'Scheduled', 'Quarterly spindle alignment check, guide rail lubrication, coolant filter element replacement.'),
('PM-2026-043', 'LATHE-007', 'CNC Precision Turning Center', 'Emergency Repair', 'Arun Kumar', '2026-09-28', 'Critical', 28500.00, 'Overdue', 'Urgent spindle unit disassembly and bearing replacement required.'),
('PM-2026-044', 'ROB-014', '6-Axis Heavy Payload Robotic Arm', 'Preventive PM', 'Suresh Nair', '2026-09-25', 'Low', 1800.00, 'Completed', 'Joint 3 gear oil change, cable harness tensioning, zero-point calibration.');


-- ----------------------------------------------------------------------------
-- 4. WORK ORDERS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `work_orders`;
CREATE TABLE `work_orders` (
    `id` VARCHAR(30) PRIMARY KEY,
    `asset_id` VARCHAR(30) NOT NULL,
    `asset_name` VARCHAR(150) NOT NULL,
    `issue` VARCHAR(255) NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    `technician` VARCHAR(100) NOT NULL,
    `assigned_by` VARCHAR(100) NOT NULL,
    `status` ENUM('OPEN', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    `created_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `resolution_notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `work_orders` (`id`, `asset_id`, `asset_name`, `issue`, `priority`, `technician`, `assigned_by`, `status`, `created_date`, `due_date`, `resolution_notes`) VALUES
('WO-2026-0192', 'PRESS-009', '150-Ton Hydraulic Stamping Press', 'Elevated hydraulic temperature (84°C) and pressure ripple in main manifold.', 'Critical', 'Arun Kumar', 'Priya Sharma', 'IN PROGRESS', '2026-09-28', '2026-10-02', ''),
('WO-2026-0193', 'LATHE-007', 'CNC Precision Turning Center', 'Severe spindle vibration amplitude spike exceeding 7.2 mm/s threshold.', 'Critical', 'Arun Kumar', 'Rajesh Kumar', 'OPEN', '2026-09-29', '2026-09-30', ''),
('WO-2026-0190', 'COMP-004', 'Rotary Screw Air Compressor', 'Air intake filter clogged differential pressure alarm.', 'Low', 'Suresh Nair', 'Priya Sharma', 'RESOLVED', '2026-09-20', '2026-09-22', 'Replaced intake filter element with synthetic pleat filter. Pressure differential restored to normal.');


-- ----------------------------------------------------------------------------
-- 5. TECHNICIANS ROSTER TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `technicians`;
CREATE TABLE `technicians` (
    `id` VARCHAR(30) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `specialization` VARCHAR(100) NOT NULL,
    `availability` ENUM('Available', 'Busy', 'On Leave') DEFAULT 'Available',
    `active_orders` INT DEFAULT 0,
    `completed_orders` INT DEFAULT 0,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `technicians` (`id`, `name`, `specialization`, `availability`, `active_orders`, `completed_orders`, `phone`, `email`) VALUES
('TECH-001', 'Arun Kumar', 'Hydraulics & Mechanical Overhaul', 'Busy', 2, 28, '+91 98765 43210', 'arun.kumar@plantpulse.ind'),
('TECH-002', 'Kavita Reddy', 'CNC Precision & Precision Robotics', 'Available', 1, 34, '+91 98765 43211', 'kavita.reddy@plantpulse.ind'),
('TECH-003', 'Suresh Nair', 'Pneumatics & Electrical Automation', 'Available', 0, 42, '+91 98765 43212', 'suresh.nair@plantpulse.ind'),
('TECH-004', 'Deepak Verma', 'Thermodynamics & Industrial Boilers', 'On Leave', 0, 19, '+91 98765 43213', 'deepak.verma@plantpulse.ind');


-- ----------------------------------------------------------------------------
-- 6. SPARE PARTS INVENTORY TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `spare_parts`;
CREATE TABLE `spare_parts` (
    `id` VARCHAR(30) PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 0,
    `min_stock` INT NOT NULL DEFAULT 10,
    `unit_cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `supplier` VARCHAR(150) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `spare_parts` (`id`, `name`, `category`, `quantity`, `min_stock`, `unit_cost`, `supplier`) VALUES
('PART-901', 'High Pressure Viton Seal Kit', 'Hydraulics', 28, 10, 1450.00, 'PARKER HANNIFIN INDIA'),
('PART-902', 'Synthetic Way Lube ISO VG 220 (20L)', 'Lubricants', 4, 10, 3800.00, 'MOBIL INDUSTRIAL LUBRICANTS'),
('PART-903', 'CNC Ceramic Spindle Bearing Set', 'Bearings & Drives', 8, 5, 12500.00, 'SKF BEARINGS INDIA'),
('PART-904', 'Air Intake Synthetic Filter Element', 'Filters', 18, 12, 850.00, 'ATLAS COPCO INDIA'),
('PART-905', 'PLC Digital Output Expansion Module', 'Electronics', 3, 5, 8900.00, 'SIEMENS AUTOMATION');


-- ----------------------------------------------------------------------------
-- 7. ALERTS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `alerts`;
CREATE TABLE `alerts` (
    `id` VARCHAR(30) PRIMARY KEY,
    `asset_id` VARCHAR(30),
    `severity` ENUM('CRITICAL', 'WARNING', 'INFO') NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `alerts` (`id`, `asset_id`, `severity`, `title`, `description`, `is_read`) VALUES
('ALT-301', 'LATHE-007', 'CRITICAL', 'Vibration Threshold Exceeded (7.2 mm/s)', 'Spindle shaft chatter detected on CNC Precision Turning Center LATHE-007.', FALSE),
('ALT-302', 'PRESS-009', 'WARNING', 'Hydraulic Oil Temperature High (84°C)', 'Stamping press hydraulic oil reservoir temperature elevated above safe limit.', FALSE),
('ALT-303', NULL, 'WARNING', 'Low Stock Warning: Synthetic Way Lube', 'Inventory level (4 units) dropped below minimum safety threshold (10 units).', FALSE);


-- ----------------------------------------------------------------------------
-- 8. ACTIVITY LOG TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NOT NULL,
    `action` TEXT NOT NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `activity_log` (`user`, `role`, `action`) VALUES
('Rajesh Kumar', 'Plant Manager', 'Initialized PlantPulse MySQL database engine.'),
('Priya Sharma', 'Maintenance Supervisor', 'Assigned Work Order WO-2026-0192 to Arun Kumar.'),
('Vikram Singh', 'Inventory Manager', 'Restocked High Pressure Viton Seal Kits (+25 qty).');


-- ----------------------------------------------------------------------------
-- 9. STOCK MOVEMENTS LOG TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `stock_movements`;
CREATE TABLE `stock_movements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `part_id` VARCHAR(30) NOT NULL,
    `part_name` VARCHAR(150) NOT NULL,
    `type` ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    `quantity` INT NOT NULL,
    `user` VARCHAR(100) NOT NULL,
    `date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`part_id`) REFERENCES `spare_parts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `stock_movements` (`part_id`, `part_name`, `type`, `quantity`, `user`, `date`) VALUES
('PART-901', 'High Pressure Viton Seal Kit', 'IN', 25, 'Vikram Singh', '2026-09-28'),
('PART-902', 'Synthetic Way Lube ISO VG 220', 'OUT', 2, 'Arun Kumar', '2026-09-27');

SET FOREIGN_KEY_CHECKS = 1;
