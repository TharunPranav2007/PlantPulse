# PlantPulse | Smart Industrial Asset & Predictive Maintenance Platform

> **Tagline:** Monitor. Maintain. Predict.  
> **Domain:** Industrial Operations & Smart Manufacturing  
> **Academic Evaluation:** Web Technologies Laboratory Project (Stage 1 - LWP Review 01)

---

## 🟢 Academic Project Status

- 🟢 **Stage 1 (Current):** Static Web Application enhanced with Client-Side Scripting (HTML5 + CSS3 + ES6 JavaScript + LocalStorage)
- 🟡 **Stage 2 (Planned):** Dynamic Web Application with PHP 8.x + MySQL Relational Database (PDO Prepared Statements)
- ⚪ **Final Stage:** Project Documentation Report & Viva Examination

---

## 1. Project Overview
**PlantPulse** is a modern, enterprise-grade multi-role web application developed for manufacturing organizations to manage industrial machinery, maintenance schedules, work order lifecycles, skilled technicians, spare parts inventory, critical telemetry alerts, and predictive health analytics.

The platform enforces strict **Role-Based Access Control (RBAC)**, allowing different industrial personnel (Plant Manager, Maintenance Technician, Maintenance Supervisor, Stores Inventory Manager) to log in and interact with role-specific dashboards and authorized operational tools.

---

## 2. Pre-Configured Demo Credentials

| Role Title | Name | Username | Password | Employee ID | Department |
|---|---|---|---|---|---|
| **Plant Manager** | Rajesh Kumar | `admin` | `admin123` | PM-001 | Plant Operations |
| **Maintenance Technician** | Arun Kumar | `technician` | `tech123` | TECH-001 | Maintenance |
| **Maintenance Supervisor** | Priya Sharma | `supervisor` | `super123` | SUP-001 | Maintenance Operations |
| **Inventory Manager** | Vikram Singh | `inventory` | `inventory123` | INV-001 | Stores & Inventory |

*Note: These demonstration credentials can be clicked directly on the `login.html` screen to quick-fill input fields.*

---

## 3. Role-Based Access Control (RBAC) Matrix

| Module / Action | Plant Manager (Admin) | Supervisor | Technician | Inventory Manager |
|---|:---:|:---:|:---:|:---:|
| **Dashboard** | Command Center | Operations | My Workspace | Stores Overview |
| **Assets Management** | Full CRUD | View | Assigned Only | View Only |
| **Maintenance Schedules** | Full CRUD | Create / Update | Assigned Only | Relevant Parts |
| **Work Orders** | Full CRUD | Assign / Create | Update Assigned | No |
| **Technicians Roster** | Full CRUD | View Workload | Profile Only | No |
| **Spare Parts Inventory** | Full CRUD | View Only | View Only | Full CRUD / Movements |
| **Analytics Dashboard** | Full Access | Full Access | No | Inventory Analytics |
| **Predictive Engine** | Full Access | Full Access | No | No |
| **Alert Center** | All Alarms | All Alarms | Assigned Alarms | Stock Alarms |
| **System Settings** | Full Access | No | No | No |

---

## 4. Role-Specific Navigation Guide

### 🛡️ Plant Manager (Admin)
`Dashboard` • `Assets Management` • `Maintenance` • `Work Orders` • `Technicians` • `Spare Parts` • `Analytics` • `Predictive Health` • `Alert Center` • `My Profile` • `Settings`

### 🔧 Maintenance Technician
`My Workspace` • `My Work Orders` • `My Maintenance` • `Assigned Assets` • `Alert Center` • `My Profile`

### 📋 Maintenance Supervisor
`Operations Center` • `Plant Assets` • `Maintenance` • `Work Orders Queue` • `Technicians Roster` • `Analytics` • `Predictive Diagnostics` • `Alert Center` • `My Profile`

### 📦 Inventory Manager
`Stores Workspace` • `Spare Parts Catalog` • `View Plant Assets` • `Stock Alerts` • `My Profile`

---

## 5. Technology Stack & Academic Constraints Enforced

| Component | Technology | Usage in Stage 1 |
|---|---|---|
| **Structure** | HTML5 | Semantic structure, accessible forms, modal templates |
| **Styling** | Vanilla CSS3 | CSS Variables, Flexbox, CSS Grid, Dark/Light themes |
| **Scripting** | Vanilla JavaScript (ES6+) | Central state store, RBAC auth guard, DOM manipulation |
| **Data Storage** | LocalStorage / SessionStorage | Client-side state persistence across reloads |
| **Charts** | Chart.js (CDN) | Telemetry health trends, downtime, cost breakdowns |
| **Iconography**| FontAwesome 6 (CDN) | Industrial command center iconography |

*Note: As required by academic constraints, React, Angular, Vue, Node.js, Express, MongoDB, Firebase, and PostgreSQL are NOT used in this implementation.*

---

## 6. Single Source of Truth & Real-Time Data Flow

```
User Action (e.g. Technician Completes Work Order / Inventory Manager Adjusts Stock)
                           ↓
              PlantPulse Store (js/store.js)
                           ↓
                 Persist to LocalStorage
                           ↓
        Recalculate Role KPIs & Evaluate Alerts
                           ↓
           Append to Central Activity Feed
                           ↓
     Dispatch Event & Re-render Affected UI Views (No Page Reload)
```

---

## 7. Project Directory Structure

```
WT Lab Project/
│
├── index.html                  # Main Role-Aware Dashboard Gateway
├── login.html                  # Multi-Role Authentication Gateway
├── README.md                   # Main Project Documentation
├── CHANGELOG.md                # Version Release History
│
├── pages/                      # Application Module Pages
│   ├── assets.html             # Asset Management & Client-Side CRUD
│   ├── maintenance.html        # Maintenance Schedules & Tracking
│   ├── workorders.html         # Work Orders Kanban Board & Table View
│   ├── technicians.html        # Technician Directory & Workload
│   ├── spareparts.html         # Spare Parts & Auto Stock Calculator
│   ├── analytics.html          # Interactive Analytics & Chart.js
│   ├── predictive.html         # Simulated Predictive Diagnostic Engine
│   ├── alerts.html             # Critical Alert Center
│   ├── profile.html            # User Personnel Profile
│   └── settings.html           # System Settings & Data Reset
│
├── css/
│   └── style.css               # Design System, Tokens, Components, Themes
│
├── js/
│   ├── mock-data.js            # Initial Dataset (35+ assets, logs, orders)
│   ├── store.js                # Central State Store, LocalStorage API, Predictive Engine
│   ├── auth.js                 # Session Management, RBAC Matrix & Route Guards
│   ├── app.js                  # Role-Aware Sidebar, Topbar Profile, Toasts, Modals
│   ├── dashboard.js            # Role-Specific Dashboard Controller
│   ├── assets.js               # Assets Controller & Validation Form Modals
│   ├── maintenance.js          # Maintenance Schedules Controller
│   ├── workorders.js           # Work Orders Kanban/Table View Controller
│   ├── technicians.js          # Technicians Roster Controller
│   ├── spareparts.js           # Inventory & Auto Stock Status Logic
│   ├── analytics.js            # Analytical Charts & Live Filters
│   ├── predictive.js           # Predictive Diagnostic Scoring & Formula Modal
│   ├── alerts.js               # Alert Center Controller
│   └── settings.js             # Preferences & Data Reset Logic
│
└── docs/                       # Academic Evaluation Support Documentation
    ├── user-roles.md           # Multi-Role Specifications & Permission Matrix
    ├── testing.md              # Comprehensive Test Case Documentation
    ├── stage-1.md              # Stage 1 Technical Documentation
    ├── stage-2-plan.md         # Stage 2 PHP + MySQL Migration Blueprint
    ├── architecture.md         # System Architecture & Design Tokens
    ├── presentation-outline.md # 16-Slide PowerPoint Presentation Outline
    └── viva-questions.md       # Laboratory Viva Q&A Guide
```

---

## 8. Faculty Review Quick Guide (LWP Review 01)

1. **Authentication:** Open `login.html`. Click **Rajesh Kumar (Plant Manager)** demo credentials chip, then click **Sign In**.
2. **Admin Command Center:** Review global KPIs, telemetry overview, machine health trend chart, and real-time activity feed log.
3. **Role Switching:** Click topbar avatar &rarr; **Sign Out Session**. Log in as **Arun Kumar (Technician)** (`technician` / `tech123`).
4. **Technician Workspace:** Observe tailored sidebar links. View assigned work order `WO-2026-0192`, click **Start Work**, then **Complete Work** to enter completion notes.
5. **Supervisor Work Order Assignment:** Log in as **Priya Sharma (Supervisor)** (`supervisor` / `super123`). Reassign an open work order to another technician.
6. **Inventory Store Manager:** Log in as **Vikram Singh (Inventory Manager)** (`inventory` / `inventory123`). Adjust stock of `Synthetic Way Lube` down to trigger automated `LOW STOCK` alert and view stock movement history.
7. **Access Control Verification:** Log in as technician and attempt to navigate to `pages/settings.html`. Verify the **403 Access Restricted** guard screen.
