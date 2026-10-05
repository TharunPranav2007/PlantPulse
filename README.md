# ⚡ PlantPulse | Smart Industrial Asset & Predictive Maintenance Platform

<div align="center">

![PlantPulse Platform](https://img.shields.io/badge/PlantPulse-v2.0.0-00f2fe?style=for-the-badge&logo=react&logoColor=black)
![Stage 2 Status](https://img.shields.io/badge/Stage_2-PHP_%2B_MySQL_Complete-10b981?style=for-the-badge&logo=mysql&logoColor=white)
![Evaluation](https://img.shields.io/badge/Academic_Evaluation-LWP_Review_02-3b82f6?style=for-the-badge&logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

**Monitor. Maintain. Predict.**

*An Enterprise-Grade Smart Manufacturing Operations, Predictive Diagnostic Scoring, and Work Order Execution Platform.*

[Features](#-key-platform-capabilities) • [System Architecture](#-system-architecture--data-flow) • [Role Matrix](#-role-based-access-control-rbac) • [MySQL Setup](#-stage-2-mysql-database-setup-guide) • [API Docs](#-php-rest-api-documentation) • [Viva Guide](#-faculty-review--viva-checklist)

---

</div>

> [!NOTE]
> **Academic Evaluation Status:**
> - 🟢 **Stage 1 (Completed):** Enterprise UI/UX Static Web Application (HTML5, Vanilla CSS3 Tokens, ES6 JS Engine, Dual Theme System, LocalStorage Persistence)
> - 🟢 **Stage 2 (Completed):** Dynamic Industrial Platform integrated with **MySQL Server 8.0** & **PHP 8.x PDO REST API Backend**
> - ⚪ **Final Evaluation:** Project Documentation Report & End-Semester Viva Examination

---

## 🌟 Executive Summary

**PlantPulse** is a full-featured industrial asset performance and predictive maintenance platform engineered for modern manufacturing plants. It solves equipment downtime, unmonitored telemetry spikes, and fragmented technician assignments by centralizing asset health indexes, automated work order lifecycles, spare parts inventory thresholds, and predictive failure scoring.

Built cleanly without heavy external frameworks (strictly complying with academic constraints using native **HTML5, CSS3, ES6 JavaScript, PHP 8.x PDO, and MySQL 8.0**), PlantPulse features a single centralized zero-flicker dual-theme engine (`Dark Slate` and `Clean Industrial Light`) and dynamic real-time synchronization between the browser presentation layer and MySQL database.

---

## 🛠️ Technology Stack & Architectural Constraints

| Component Layer | Technology | Engineering Implementation Details |
|---|---|---|
| **Frontend Structure** | **HTML5** | Accessible semantic elements, modal templates, dynamic tables, ARIA support |
| **Styling & Design System** | **Vanilla CSS3** | Dual-theme CSS Variables (`:root` / `[data-theme="light"]`), Flexbox, CSS Grid, Glassmorphism |
| **Client Scripting** | **JavaScript (ES6+)** | Central State Store (`js/store.js`), RBAC Auth Engine (`js/auth.js`), Live Ticker |
| **Theme Engine** | **`js/theme.js`** | Zero-flicker early head initialization, `localStorage` preference, live Chart.js theme adapter |
| **Backend REST API** | **PHP 8.x (PDO)** | Object-Oriented PDO database connection layer with prepared statements |
| **Relational Database** | **MySQL Server 8.0** | `plantpulse_db` schema with 9 normalized tables, FK constraints, and cascades |
| **Visualizations** | **Chart.js 4.x (CDN)** | Theme-adaptive line graphs, downtime bar charts, cost doughnut charts, polar distributions |
| **Iconography** | **FontAwesome 6 (CDN)**| Precision industrial iconography system |

> [!IMPORTANT]
> **Academic Integrity Constraint Compliance:**  
> In strict accordance with Web Technologies Laboratory evaluation rules, **React, Angular, Vue, Node.js, Express, MongoDB, Firebase, and PostgreSQL are NOT used**. All dynamic features are achieved using native web standards.

---

## 🔑 Pre-Configured Demo Accounts (Multi-Role Gateway)

The login portal ([`login.html`](file:///c:/Users/work/Downloads/WT%20Lab%20Project/login.html)) provides quick-fill role selection pills for seamless faculty evaluation:

| Role Title | Personnel Name | Username | Password | Employee ID | Department Workspace |
|---|---|---|---|---|---|
| 🛡️ **Plant Manager (Admin)** | Rajesh Kumar | `admin` | `admin123` | `PM-001` | Plant Operations Command Center |
| 🔧 **Maintenance Technician** | Arun Kumar | `technician` | `tech123` | `TECH-001` | Technician Operations Queue |
| 📋 **Maintenance Supervisor** | Priya Sharma | `supervisor` | `super123` | `SUP-001` | Maintenance & Workload Roster |
| 📦 **Stores Inventory Manager**| Vikram Singh | `inventory` | `inventory123` | `INV-001` | Spare Parts & Stock Movements |

---

## ⚡ Key Platform Capabilities

### 1. 🛡️ Role-Based Access Control (RBAC) & Dynamic Navigation
- **Granular Security Matrix:** RESTRICTS unauthorized direct URL access (e.g., technician attempting to access system settings triggers a **403 Access Restricted** guard screen).
- **Tailored Workspaces:** Dynamically filters sidebar navigation options based on the authenticated user's permission level.

### 2. ☀️ Zero-Flicker Dual-Theme Architecture
- **Central Source of Truth:** Managed by [`js/theme.js`](file:///c:/Users/work/Downloads/WT%20Lab%20Project/js/theme.js).
- **Early Synchronous Head Script:** Prevents Flash of Unstyled Content (FOUC) or dark mode flash during cross-page navigation or hard refreshes in Light Mode.
- **WCAG 2.1 AAA Contrast:** High-contrast slate design tokens (`--text-section-heading`) for sidebar category headers (`CORE OPERATIONS`, `RESOURCES & INVENTORY`, `INTELLIGENCE`, `SYSTEM`).
- **Collapsed Sidebar Tooltip Flyouts:** Hovering over icons in collapsed sidebar mode displays crisp floating flyout labels.

### 3. 📈 Interactive & Theme-Adaptive Visualizations
- All Chart.js charts dynamically update grid lines, text labels, tooltips, and background gradients when switching between Light Mode and Dark Mode.
- Real-Time 10-second ticker updates relative activity feed timestamps (`Just now`, `15 sec ago`, `2 mins ago`).

### 4. 🔄 Dynamic MySQL CRUD & Auto Fallback Bridge
- Executing actions (registering an asset, dispatching a work order, updating stock) sends real-time `POST`/`PUT`/`DELETE` HTTP requests to PHP REST endpoints, executing SQL queries in MySQL database `plantpulse_db`.
- **Resilient Fallback:** If offline or running without a server, the application automatically uses LocalStorage backup without breaking.

---

## 📐 System Architecture & Data Flow

```
                      +------------------------------------------+
                      |       BROWSER PRESENTATION LAYER         |
                      |   HTML5 | CSS Design Tokens | ES6 Engine |
                      +------------------------------------------+
                                           │
                       ┌───────────────────┴───────────────────┐
                       │                                       │
                       ▼                                       ▼
            +--------------------+                   +--------------------+
            | CENTRAL STATE STORE|                   | EARLY THEME ENGINE |
            |    (js/store.js)   |                   |   (js/theme.js)    |
            +--------------------+                   +--------------------+
                       │                                       │
            fetch() REST API Calls                     data-theme="light/dark"
                       │                                       │
                       ▼                                       ▼
            +--------------------+                   +--------------------+
            | PHP 8.x PDO LAYER  |                   | DYNAMIC CSS VARS   |
            |     (api/*.php)    |                   |   (& CHART.JS)     |
            +--------------------+                   +--------------------+
                       │
            PDO Prepared Statements
                       │
                       ▼
            +--------------------+
            | MYSQL DATABASE 8.0 |
            |  (plantpulse_db)   |
            +--------------------+
```

---

## 🗄️ Relational MySQL Database Schema (`plantpulse_db`)

The relational database contains **9 normalized tables** linked with Primary & Foreign Key constraints:

```
+------------------+         +--------------------+         +-----------------------+
|      users       |         |       assets       |         |      maintenance      |
+------------------+         +--------------------+         +-----------------------+
| id (PK)          |         | id (PK)            |<--------| id (PK)               |
| username (UQ)    |         | name               |         | asset_id (FK)         |
| password_hash    |         | type               |         | type                  |
| role             |         | status             |         | technician            |
| role_key         |         | health             |         | priority              |
| employee_id (UQ) |         | vibration          |         | cost                  |
| department       |         | temperature        |         | status                |
+------------------+         +--------------------+         +-----------------------+
                                       │
                                       ├────────────────────┐
                                       ▼                    ▼
                             +--------------------+ +-----------------------+
                             |    work_orders     | |        alerts         |
                             +--------------------+ +-----------------------+
                             | id (PK)            | | id (PK)               |
                             | asset_id (FK)      | | asset_id (FK NULL)    |
                             | issue              | | severity              |
                             | priority           | | title                 |
                             | technician         | | description           |
                             | status             | | is_read               |
                             +--------------------+ +-----------------------+
                                                               
+------------------+         +--------------------+         +-----------------------+
|   technicians    |         |    spare_parts     |         |    stock_movements    |
+------------------+         +--------------------+         +-----------------------+
| id (PK)          |         | id (PK)            |<--------| id (PK)               |
| name             |         | name               |         | part_id (FK)          |
| specialization   |         | category           |         | type (IN/OUT)         |
| availability     |         | quantity           |         | quantity              |
| active_orders    |         | min_stock          |         | user                  |
| completed_orders |         | unit_cost          |         | date                  |
+------------------+         +--------------------+         +-----------------------+
```

---

## 🚀 Stage 2 MySQL Database Setup Guide

> [!TIP]
> **Prerequisites:** MySQL Server 8.0 & MySQL Workbench installed on your system.

### Step 1: Execute SQL Schema Script
1. Open **MySQL Workbench 8.0**.
2. Connect to your MySQL Server instance (`localhost:3306` with user `root`).
3. Open [`database/plantpulse_schema.sql`](file:///c:/Users/work/Downloads/WT%20Lab%20Project/database/plantpulse_schema.sql).
4. Click the **Lightning Bolt (Execute)** button.  
   *(This creates `plantpulse_db` and populates all 9 tables with initial seed data).*

#### Command Line Option (PowerShell):
```powershell
Get-Content "c:\Users\work\Downloads\WT Lab Project\database\plantpulse_schema.sql" | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### Step 2: Configure Database Credentials in `api/db.php`
Open [`api/db.php`](file:///c:/Users/work/Downloads/WT%20Lab%20Project/api/db.php) and verify your MySQL password on line 20:
```php
$db_host = "127.0.0.1";
$db_name = "plantpulse_db";
$db_user = "root";
$db_pass = "YOUR_MYSQL_PASSWORD"; // Set your password
```

### Step 3: Run via XAMPP or Built-in PHP Server

#### Option A: Using XAMPP
1. Copy the project folder to `C:\xampp\htdocs\WT Lab Project`.
2. Start **Apache** in XAMPP Control Panel.
3. Open browser: `http://localhost/WT%20Lab%20Project/`

#### Option B: Built-in PHP CLI Server
```powershell
php -S localhost:8000
```
Then open: `http://localhost:8000/`

---

## 📡 PHP REST API Documentation

| Endpoint | Method | Input Parameters | Output Response | Functionality |
|---|:---:|---|---|---|
| `/api/login.php` | `POST` | `username`, `password` | User JSON Profile | Authenticates user against `users` table |
| `/api/assets.php` | `GET` | `?id=CNC-001` (Optional) | Asset Object / Array | Reads assets from `assets` table |
| `/api/assets.php` | `POST` | Asset JSON Object | `{status: "success"}` | Inserts new machinery asset into MySQL |
| `/api/assets.php` | `PUT` | Updated Asset JSON | `{status: "success"}` | Updates asset telemetry & status |
| `/api/assets.php` | `DELETE`| `?id=CNC-001` | `{status: "success"}` | Deletes machine asset from MySQL |
| `/api/workorders.php` | `GET` | None | Work Orders Array | Reads work order queue |
| `/api/workorders.php` | `POST` | Work Order JSON | `{status: "success"}` | Dispatches new work order |
| `/api/workorders.php` | `PUT` | `{id, status, notes}` | `{status: "success"}` | Advances work order lifecycle state |
| `/api/spareparts.php` | `GET` | None | Parts & Movements | Fetches inventory stock & logs |
| `/api/spareparts.php` | `POST` | `{action, partId, qty}` | `{status: "success"}` | Adjusts stock & triggers low-stock alert |
| `/api/analytics.php` | `GET` | None | KPI Aggregations | Runs SQL `SUM`, `COUNT`, `AVG` queries |

---

## 📂 Project Directory Structure

```
WT Lab Project/
├── index.html                  # Main Role-Aware Command Dashboard Gateway
├── login.html                  # Multi-Role Portal with Quick-Fill Credentials
├── README.md                   # Complete Platform Documentation
├── CHANGELOG.md                # Version & Release History
│
├── api/                        # PHP 8.x REST API Backend (Stage 2)
│   ├── db.php                  # PDO Connection & Error Handler
│   ├── login.php               # Authentication API Endpoint
│   ├── assets.php              # Asset CRUD API Endpoint
│   ├── workorders.php         # Work Orders Management API Endpoint
│   ├── spareparts.php          # Inventory Stock API Endpoint
│   ├── analytics.php           # SQL Analytical Aggregations API Endpoint
│   ├── alerts.php              # Telemetry Alerts API Endpoint
│   ├── technicians.php         # Technicians Directory API Endpoint
│   ├── maintenance.php         # Maintenance Schedules API Endpoint
│   └── activity.php            # Real-time Activity Feed API Endpoint
│
├── database/                   # MySQL Schema & Seed Script
│   └── plantpulse_schema.sql   # Relational Database DDL/DML Script (9 Tables)
│
├── pages/                      # Application Module Views
│   ├── assets.html             # Asset Directory & Validation Modals
│   ├── maintenance.html        # Maintenance Schedules & Calendar
│   ├── workorders.html         # Kanban Board & Table View
│   ├── technicians.html        # Technicians Roster & Workload
│   ├── spareparts.html         # Spare Parts Catalog & Calculator
│   ├── analytics.html          # Interactive Analytical Dashboard
│   ├── predictive.html         # Predictive Health Scoring Engine
│   ├── alerts.html             # Critical Telemetry Alert Center
│   ├── profile.html            # User Personnel Profile
│   └── settings.html           # System Settings & Data Reset
│
├── css/
│   └── style.css               # Design System, CSS Variables, Component Tokens
│
├── js/
│   ├── theme.js                # Centralized Theme Engine & Chart Adapter
│   ├── store.js                # Data Store, MySQL API Bridge, Fallback Engine
│   ├── auth.js                 # Session Guard & RBAC Permission Matrix
│   ├── app.js                  # Sidebar Controller, Toasts, Modals, Time Ticker
│   ├── dashboard.js            # Dashboard Controller & Live Line Chart
│   ├── assets.js               # Assets Controller & Validation Logic
│   ├── maintenance.js          # Maintenance Schedules Controller
│   ├── workorders.js           # Kanban & Table View Controller
│   ├── technicians.js          # Technicians Roster Controller
│   ├── spareparts.js           # Stock Status & Restock Logic
│   ├── analytics.js            # Analytical Charts & Filter Engines
│   ├── predictive.js           # Diagnostic Formula Modal & Scoring
│   ├── alerts.js               # Alert Center Controller
│   └── settings.js             # Preferences Controller
│
└── docs/                       # Academic Evaluation Support Documentation
    ├── stage-1.md              # Stage 1 Technical Report
    ├── stage-2-guide.md        # Stage 2 Setup & Execution Guide
    ├── stage-2-plan.md         # Stage 2 Migration Architecture Blueprint
    ├── architecture.md         # Design System Tokens & Architecture
    ├── user-roles.md           # Multi-Role RBAC Specification
    ├── testing.md              # Comprehensive Test Suite (AUTH, SYNC, THEME)
    ├── presentation-outline.md # 16-Slide PowerPoint Outline
    └── viva-questions.md       # Laboratory Viva Examination Guide
```

---

## 🎓 Faculty Review & Viva Checklist

### LWP Review 01 Verification (Stage 1)
- [x] Static HTML5/CSS3/JavaScript web platform implementation.
- [x] Zero-flicker dual-theme switcher (`Light` and `Dark` modes).
- [x] Client-side form validation and modal dialogs.
- [x] Role-Based Access Control (`admin`, `technician`, `supervisor`, `inventory`).
- [x] Responsive layout across Desktop (1920px), Laptop (1366px), Tablet (768px), and Mobile (375px).

### LWP Review 02 Verification (Stage 2)
- [x] MySQL Server 8.0 relational database integration (`plantpulse_db`).
- [x] PHP 8.x PDO REST API backend handling `GET`, `POST`, `PUT`, `DELETE` operations.
- [x] Real-time CRUD synchronization (creating asset in browser updates MySQL table).
- [x] SQL aggregation queries (`SUM`, `COUNT`, `AVG`, `GROUP BY`) calculating analytics.
- [x] PDO prepared statements securing all endpoints against SQL Injection.

---

<div align="center">

**PlantPulse Smart Industrial Platform** • Developed for Web Technologies Laboratory Evaluation  
*Designed with Precision. Built for Performance.*

</div>
