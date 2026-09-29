# PlantPulse | Smart Industrial Asset & Predictive Maintenance Platform

> **Tagline:** Monitor. Maintain. Predict.  
> **Domain:** Industrial Operations & Smart Manufacturing  
> **Academic Evaluation:** Web Technologies Laboratory Project (Stage 1 - LWP Review 01)

---

## 1. Project Overview
**PlantPulse** is a modern, enterprise-grade web application developed for manufacturing organizations to manage industrial machinery, maintenance schedules, work order lifecycles, skilled technicians, spare parts inventory, critical telemetry alerts, and predictive health analytics.

Designed to emulate a command-center interface, PlantPulse provides real-time visibility into shop floor operational health while adhering strictly to academic laboratory requirements.

---

## 2. Academic Project Stage Breakdown

### STAGE 1 (CURRENT IMPLEMENTATION - LWP Review 01)
- **Technologies Used:** HTML5 + CSS3 (Vanilla CSS) + JavaScript (ES6+ Vanilla JS)
- **Data Persistence:** LocalStorage API & Dynamic In-Memory Store
- **Key Deliverables:** 
  - Complete Responsive Web Application (10 Interactive Pages)
  - Full Client-Side CRUD for Assets, Maintenance, Work Orders, Parts
  - Interactive Chart.js Telemetry Trend & Analytics Charts
  - Simulated Multi-Factor Predictive Maintenance Risk Engine
  - Toast Notification System & Dynamic Modal Dialogs
  - Theme Switcher (Dark Industrial Command Center & Light Mode)

### STAGE 2 (FUTURE MIGRATION - LWP Review 02)
- **Target Backend:** PHP 8.x
- **Target Database:** MySQL Relational Database (PDO Prepared Statements)
- **Architecture:** Restful API Endpoints (`/php/assets.php`, `/php/workorders.php`) + Session Authentication

---

## 3. Technology Stack & Academic Constraints Enforced

| Component | Technology | Usage in Stage 1 |
|---|---|---|
| **Structure** | HTML5 | Semantic structure, accessible forms, modal templates |
| **Styling** | Vanilla CSS3 | CSS Variables, Flexbox, CSS Grid, Dark/Light themes |
| **Scripting** | Vanilla JavaScript (ES6+) | Event bus, DOM manipulation, client-side CRUD, predictive algorithm |
| **Charts** | Chart.js (CDN) | Telemetry health trends, downtime, cost breakdowns |
| **Iconography**| FontAwesome 6 (CDN) | Industrial command center iconography |
| **Storage** | LocalStorage API | Persistence of client state across browser reloads |

*Note: As required by academic constraints, React, Angular, Vue, Node.js, Express, MongoDB, Firebase, and PostgreSQL are NOT used in this implementation.*

---

## 4. Key Application Modules

1. **Industrial Dashboard (`index.html`):** 6 KPI summary cards, live machine health overview, Chart.js telemetry trend graph (7D/30D/90D filters), upcoming maintenance table, critical alerts drawer.
2. **Asset Management (`pages/assets.html`):** Client-side CRUD interface for 35+ realistic assets (`CNC-001`, `ROB-014`, `PRESS-009`). Search, filter by type/unit/status, sort, and detail modal.
3. **Maintenance Management (`pages/maintenance.html`):** Schedule Preventive, Corrective, Predictive, and Emergency events with technician assignment and cost logging.
4. **Work Orders Lifecycle (`pages/workorders.html`):** Interactive 5-stage Kanban Board (`OPEN` -> `ASSIGNED` -> `IN PROGRESS` -> `RESOLVED` -> `CLOSED`) + Table View.
5. **Technician Directory (`pages/technicians.html`):** Roster of skilled personnel, active job allocations, availability statuses, technician registration.
6. **Spare Parts Inventory (`pages/spareparts.html`):** Automated stock status calculator (`NORMAL`, `LOW STOCK`, `OUT OF STOCK`), quick stock adjustment buttons.
7. **Interactive Analytics (`pages/analytics.html`):** Multi-chart analytics dashboard with live period, unit, and machine category filters.
8. **Predictive Maintenance (`pages/predictive.html`):** Multi-variable algorithm evaluating vibration (mm/s), thermal load (°C), operating hours, and maintenance age into a risk matrix.
9. **Alert Center (`pages/alerts.html`):** Critical alarm notifications with quick work order dispatch and read/dismiss toggles.
10. **System Settings (`pages/settings.html`):** Theme toggle preferences and factory data reset to default mock state.

---

## 5. Project Directory Structure

```
WT Lab Project/
│
├── index.html                  # Main Industrial Operations Dashboard
├── README.md                   # Main GitHub & Project Documentation
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
│   └── settings.html           # System Settings & Data Reset
│
├── css/
│   └── style.css               # Design System, Tokens, Components, Themes
│
├── js/
│   ├── mock-data.js            # Initial Dataset (35+ assets, logs, orders)
│   ├── store.js                # State Store, LocalStorage API, Predictive Engine
│   ├── app.js                  # Global UI, Toasts, Modals, Theme, Global Search
│   ├── dashboard.js            # Dashboard Controller & Telemetry Charts
│   ├── assets.js               # Assets Controller & Validation Form Modals
│   ├── maintenance.js          # Maintenance Controller & Schedules
│   ├── workorders.js           # Work Orders Kanban/Table View Controller
│   ├── technicians.js          # Technicians Roster Controller
│   ├── spareparts.js           # Inventory & Auto Stock Status Logic
│   ├── analytics.js            # Analytical Charts & Filter Event Listeners
│   ├── predictive.js           # Predictive Diagnostic Scoring & Formula Modal
│   ├── alerts.js               # Alert Center Controller
│   └── settings.js             # Preferences & Data Reset Logic
│
└── docs/                       # Comprehensive Academic Documentation
    ├── stage-1.md              # Stage 1 Technical Documentation
    ├── stage-2-plan.md         # Stage 2 PHP + MySQL Migration Blueprint
    ├── architecture.md         # System Architecture & Design Tokens
    ├── presentation-outline.md # 16-Slide PowerPoint Presentation Outline
    └── viva-questions.md       # Laboratory Viva Q&A Guide
```

---

## 6. How to Run Stage 1

1. Clone or download the repository into your local system.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. Alternatively, launch using any local web server (e.g. VS Code Live Server, Python `http.server`).
4. Interact with the application:
   - Use `Ctrl + K` to open the Global Search platform.
   - Click the theme toggle icon in the topbar to switch between Dark and Light mode.
   - Perform CRUD operations on assets, maintenance, work orders, and spare parts.

---

## 7. Demo Flow for Laboratory Examiner / Viva

1. **Dashboard Overview:** Open `index.html`, review KPI cards, operational uptime, and Chart.js health trend.
2. **Asset CRUD Demonstration:** Navigate to `pages/assets.html`. Perform a search for `CNC-001`. Click **Add New Asset**, fill in form details, and submit without page reload. Demonstrate Edit and Delete confirmation modals.
3. **Work Order Kanban Advancement:** Navigate to `pages/workorders.html`. Advance a work order card from `OPEN` to `IN PROGRESS` to `CLOSED`. Toggle between Kanban and Table views.
4. **Spare Parts Auto-Stock Calculator:** Navigate to `pages/spareparts.html`. Decrement quantity of a part until it automatically transitions from `NORMAL` -> `LOW STOCK` -> `OUT OF STOCK`.
5. **Predictive Diagnostic Calculation:** Navigate to `pages/predictive.html`. Click **View Algorithm** on asset `PRESS-009` to review the multi-variable scoring equation modal.
6. **Alert Dispatch:** Navigate to `pages/alerts.html` and click **Create Work Order** from a critical alert.
