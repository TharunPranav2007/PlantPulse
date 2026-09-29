# PlantPulse - Changelog & Release History

## [1.1.0] - 2026-09-29
### Added
- **Multi-Role Authentication Gateway (`login.html`):** Split-screen desktop layout with industrial backdrop and demo accounts quick-fill buttons.
- **Granular Role-Based Access Control (RBAC):** Central permission lookup matrix (`js/auth.js`) for 4 distinct industrial roles:
  1. Plant Manager / Administrator (`admin`)
  2. Maintenance Technician (`technician`)
  3. Maintenance Supervisor (`supervisor`)
  4. Inventory Manager (`inventory`)
- **Role-Aware Dynamic Navigation:** Sidebar menu links render dynamically based on user permissions.
- **Role-Specific Workspace Dashboards:** Custom tailored dashboards for Admin Command Center, Technician Workspace, Supervisor Operations, and Inventory Store.
- **Real-time Activity Feed Engine:** Central log tracking real user actions across all modules.
- **Inventory Stock Movement History:** Tracking `IN`, `OUT`, and `ADJUSTMENT` transactions.
- **User Profile Page (`pages/profile.html`):** Personnel metadata, employee ID, department, and role statistics.
- **403 Access Restricted View:** Route protection preventing unauthorized URL access.

### Improved
- **Single Central Source of Truth (`js/store.js`):** Unified event bus re-calculating KPIs, evaluating alerts, and updating UI components in real time without page reloads.
- **Global Search Platform (`Ctrl + K`):** Performs instant searches across current reactive state.
- **Notifications & Alert Center:** Dynamic generation from sensor telemetry and stock thresholds.

---

## [1.0.0] - 2026-09-28
- Initial Stage 1 Static Web Application release with client-side scripting, Chart.js analytics, predictive maintenance scoring engine, and LocalStorage persistence.
