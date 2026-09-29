# PlantPulse - Comprehensive Test Case Documentation

---

## 1. Authentication & Access Control Test Cases

### Test Case AUTH-01: Admin Login
- **Input:** Username `admin`, Password `admin123`.
- **Expected Outcome:** Successfully authenticates as Plant Manager. Redirects to Command Center Dashboard with full sidebar navigation links.

### Test Case AUTH-02: Technician Login
- **Input:** Username `technician`, Password `tech123`.
- **Expected Outcome:** Authenticates as Arun Kumar. Redirects to "My Maintenance Workspace". Sidebar displays only Technician-authorized links (`My Work Orders`, `My Maintenance`, `Assigned Assets`, `Alert Center`, `My Profile`).

### Test Case AUTH-03: Unauthorized Direct URL Access (403 Protection)
- **Input:** Log in as `technician`, then manually enter URL `pages/settings.html` or `pages/analytics.html`.
- **Expected Outcome:** System blocks access and renders 403 Access Restricted screen with a button to return to Dashboard or switch accounts.

### Test Case AUTH-04: Session Logout & Back Button Guard
- **Input:** Click **Sign Out Session**. After redirect to `login.html`, click browser **Back** button.
- **Expected Outcome:** Session is cleared. `PlantPulseAuth.requireAuth()` intercepts navigation and redirects back to `login.html`.

---

## 2. Multi-Role Workflow & Real-Time Synchronization Test Cases

### Test Case SYNC-01: Asset Creation & Global Propagation
- **Action:** Log in as `admin`. Create asset `CNC-015`.
- **Expected Outcome:** Asset count KPI increments. Asset table updates instantly. `CNC-015` becomes searchable in Global Search (`Ctrl+K`). Activity feed logs: `"Rajesh Kumar registered new industrial asset: CNC-015"`.

### Test Case SYNC-02: Supervisor Assignment to Technician
- **Action:** Log in as `supervisor`. Assign Work Order `WO-2026-0192` to `Arun Kumar`.
- **Expected Outcome:** Notification dispatched to technician. Log in as `technician` (`technician` / `tech123`) -> Work order appears under "My Work Orders Queue".

### Test Case SYNC-03: Technician Work Order Resolution
- **Action:** Log in as `technician`. Click **Start Work** on assigned order, then click **Complete Work** and enter completion notes.
- **Expected Outcome:** Status advances to `RESOLVED`. My Completed Orders KPI increments. Activity feed logs resolution. Log in as `admin` -> Admin dashboard reflects work order completion.

### Test Case SYNC-04: Inventory Stock Adjustment & Auto-Alert Trigger
- **Action:** Log in as `inventory`. Decrement `Synthetic Way Lube ISO VG 220` quantity below minimum required (to 4 units).
- **Expected Outcome:** Stock status automatically updates to `LOW STOCK`. Low stock notification and alert generated automatically. Stock movement log records `OUT` transaction by `Vikram Singh`.
