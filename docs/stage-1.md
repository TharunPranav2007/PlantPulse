# PlantPulse - Stage 1 Technical Documentation
**Evaluation Stage:** LWP Review 01 (Static Website Enhanced with Client-Side Scripting)

---

## 1. Executive Summary
**PlantPulse** is a modern, enterprise-grade Industrial Asset & Predictive Maintenance Platform designed for manufacturing operations. Stage 1 focuses on building a highly responsive, visually stunning static web application powered by modular client-side JavaScript (ES6+), custom CSS3 design tokens, HTML5 semantic layout, and LocalStorage state persistence.

---

## 2. Technology Stack (Stage 1 Constraints Enforced)
- **HTML5:** Semantic document structure, accessible input forms, modal dialog templates.
- **CSS3 (Vanilla):** CSS Variables, Flexbox & CSS Grid, custom scrollbars, high-contrast dark graphite command-center theme with dark/light mode toggle support.
- **JavaScript (ES6+):** Modular event bus, client-side CRUD methods, localStorage persistence, health score calculations, search/filter/sort algorithms.
- **Chart.js (CDN):** Data visualization for machine health trend graphs, downtime breakdown, cost distribution, and equipment category polar charts.
- **FontAwesome 6 (CDN):** Industrial visual iconography.

---

## 3. Core Operational Modules
1. **Industrial Dashboard:** Real-time KPI summaries, top 4 equipment telemetry status cards, Chart.js machine health trend lines, critical alerts drawer, upcoming maintenance table.
2. **Asset Management:** Full CRUD interface for plant equipment (Add, Edit, Delete, View telemetry details modal, search, filter by unit/type/status, sort).
3. **Maintenance Management:** Schedule Preventive, Corrective, Predictive, and Emergency maintenance events.
4. **Work Orders Lifecycle:** Interactive Kanban Board View (OPEN -> ASSIGNED -> IN PROGRESS -> RESOLVED -> CLOSED) + Table View.
5. **Technician Directory:** Skilled personnel roster, active job allocations, availability statuses, quick technician registration.
6. **Spare Parts Inventory:** Auto-computed stock indicators (`NORMAL`, `LOW STOCK`, `OUT OF STOCK`) with instant quantity increment/decrement controls.
7. **Interactive Analytics:** Multi-chart dashboard with interactive period, production unit, and machine category filtering.
8. **Predictive Maintenance Engine:** Multi-factor algorithm calculating machine risk levels based on vibration telemetry, thermal load, operating hours, and maintenance age.
9. **Alert Center:** Critical warning threshold alerts with instant work order dispatch and mark-as-read toggles.
10. **Settings & Preferences:** Theme switcher, factory data reset to default mock state.

---

## 4. Key Client-Side Scripting Features
- **Zero Page Reloads:** All CRUD operations (Create, Read, Update, Delete) mutate client state in `js/store.js` and immediately re-render DOM views.
- **LocalStorage Persistence:** State is serialized to JSON in browser storage (`plantpulse_state_v1`), preserving user edits across sessions.
- **Dynamic Search Modal (Ctrl+K):** Instant global search across Assets, Work Orders, Technicians, and Spare Parts.
- **Toast Notification Engine:** Animated toast notifications for operation success, warnings, and errors.
