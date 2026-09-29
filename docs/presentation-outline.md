# PlantPulse - Stage 1 PowerPoint Presentation Outline
**Evaluation Review:** LWP Review 01 (Static Web Application with Client-Side Scripting)

---

### Slide 1: Title Slide
- **Title:** PlantPulse: Smart Industrial Asset & Predictive Maintenance Platform
- **Subtitle:** Individual Web Technologies Laboratory Project (LWP Review 01)
- **Tagline:** Monitor. Maintain. Predict.
- **Presenter Name:** [Student Name / Roll Number]

---

### Slide 2: Problem Statement
- Unplanned industrial machine downtime causes massive financial loss in modern manufacturing.
- Traditional paper-based or manual maintenance tracking leads to delayed work orders and missed asset failures.
- Need for a real-time command center interface to track telemetry (vibration, thermal load, hours) and automate maintenance workflows.

---

### Slide 3: Industrial Use Case & Target Audience
- **Industrial Sector:** Manufacturing Plants, CNC Machining Centers, Automotive Robotic Assembly Bays.
- **Users:** Plant Operations Manager, Maintenance Engineers, Field Technicians, Inventory Supervisors.

---

### Slide 4: Project Objectives
- Build a responsive, enterprise-grade web application following strict academic constraints.
- Implement comprehensive client-side CRUD operations without external JS frameworks.
- Design an intuitive dark industrial command-center UI with real-time KPI metrics and telemetry analytics.

---

### Slide 5: Proposed Solution - PlantPulse
- Unified platform combining Asset Monitoring, Maintenance Scheduling, Work Order Lifecycles (Kanban & Table), Spare Parts Inventory, and Predictive Risk Scoring.

---

### Slide 6: Technology Stack (Stage 1)
- **Frontend Structure:** HTML5 Semantic Markup
- **Styling:** Vanilla CSS3 with CSS Variables, Dark/Light Mode Theme Switch, Responsive Flexbox & Grid
- **Logic & State:** Vanilla ES6+ JavaScript, Event-driven architecture, LocalStorage API
- **Data Visualization:** Chart.js Library
- **Icons:** FontAwesome 6

---

### Slide 7: System Architecture
- Separation of concerns: Presentation (HTML/CSS) -> Application Controllers -> Centralized Data Store (`js/store.js`) -> Persistence (`localStorage`).

---

### Slide 8: Core Modules Overview
- Dashboard
- Asset Management (CRUD)
- Maintenance Schedules
- Work Orders Lifecycle (OPEN to CLOSED)
- Technician Roster
- Spare Parts (Auto Stock Status Calculator)
- Analytics & Charts
- Simulated Predictive Diagnostic Engine
- Alert Center
- System Settings

---

### Slide 9: Industrial Command Dashboard
- 6 Real-time KPI Cards (Total Assets, Operational Uptime, Active Alerts, Open Work Orders, Cost, Avg Health).
- Live Telemetry Health Bar Cards (Vibration, Temperature, Operating Hours).
- Chart.js Health Trend Chart with 7D / 30D / 90D filter selectors.

---

### Slide 10: Asset Management & Client-Side CRUD
- Interactive Data Table displaying 35+ realistic industrial machines (`CNC-001`, `ROB-014`, `PRESS-009`).
- Search, Filter by Unit/Type/Status, and Sort.
- Working Add, Edit, Delete (with custom confirmation modal), and Detailed Telemetry Modal.

---

### Slide 11: Work Order Lifecycle (Kanban & Table Views)
- Visual Kanban Board tracking orders across 5 stages: `OPEN` -> `ASSIGNED` -> `IN PROGRESS` -> `RESOLVED` -> `CLOSED`.
- One-click status advancement buttons.
- Toggle between Kanban Board and Data Table views.

---

### Slide 12: Spare Parts Auto Stock Calculator
- Automated Inventory Classification:
  - `Quantity > minStock` => **NORMAL** (Green)
  - `Quantity <= minStock` => **LOW STOCK** (Amber)
  - `Quantity == 0` => **OUT OF STOCK** (Red)
- Quick Stock consumption/restock buttons.

---

### Slide 13: Predictive Maintenance Concept
- Multi-factor algorithm: `Health Score = 100 - (VibrationPenalty + TempPenalty + HoursPenalty + StatusPenalty)`.
- Calculates Risk Matrix (`LOW`, `MEDIUM`, `HIGH/CRITICAL`).
- Transparently labeled as "Simulated Predictive Analysis" for Stage 1 evaluation.

---

### Slide 14: Client-Side JavaScript Highlights
- No page reload during CRUD operations.
- LocalStorage persistence (`plantpulse_state_v1`).
- Global Search Modal (`Ctrl + K`).
- Toast Notification Engine for visual feedback.

---

### Slide 15: Demonstration Walkthrough Plan
1. Open Dashboard & Explain KPI Metrics.
2. Search & Add Asset `CNC-002` in Asset Management.
3. Advance Work Order status in Kanban View.
4. Demonstrate Low Stock trigger in Spare Parts.
5. Filter Analytics chart by 90-day period.
6. Review Predictive Risk breakdown modal.

---

### Slide 16: Future Enhancements (Stage 2 Transition)
- Migration to dynamic **PHP 8.x** backend.
- Migration to **MySQL** relational database with PDO prepared statements.
- Server-side session authentication & role-based access control (RBAC).
