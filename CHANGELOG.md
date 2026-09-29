# PlantPulse - Changelog & Release History

## [1.2.0] - 2026-09-29
### Added & Fixed
- **Centralized Theme System (`js/theme.js`):** Unified `PlantPulseTheme` module establishing single source of truth for Light and Dark modes.
- **Zero-Flicker Early Theme Initialization:** Added synchronous early head script across all HTML files eliminating dark-mode flash during navigation and hard refreshes in Light Mode.
- **Theme Persistence:** Theme preference automatically stored and synchronized in `localStorage` under `plantpulse_theme`.
- **Sidebar Accessibility & Contrast Fix:** Refactored sidebar section labels (`CORE OPERATIONS`, `RESOURCES & INVENTORY`, `INTELLIGENCE`, `SYSTEM`) to high-contrast WCAG 2.1 AAA compliant design system tokens.
- **Dual-Theme Login Page (`login.html`):** Restructured login interface to respect selected theme, added live theme toggle, password eye visibility toggle, and loading state spinner.
- **Enhanced Industrial Hero Image:** Improved contrast overlays on login hero image to maintain high visibility in both Light and Dark modes.
- **PlantPulse Brand Identity:** Refined logo and wordmark visibility across all components and themes.
- **Typography & CSS Variables Audit:** Unified design system tokens (`--bg-primary`, `--text-section-heading`, etc.) eliminating hardcoded colors.
- **Smooth Page & Theme Transitions:** Added non-blocking CSS transitions for theme switching and subtle page enter animations.
- **Documentation & Test Suite:** Added comprehensive architecture docs and test cases `THEME-01` to `THEME-08` covering cross-page theme stability.

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
