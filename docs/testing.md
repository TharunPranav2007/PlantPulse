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

---

## 3. Theme System & Cross-Page Navigation Test Cases

### Test Case THEME-01: Select Light Mode Persistence
- **Action:** Click Theme Toggle button in Top Bar or Login Screen to select **Light Mode**.
- **Expected Outcome:** Application shifts immediately to Light Mode. `plantpulse_theme` key in `localStorage` stores `"light"`.

### Test Case THEME-02: Navigation Without Dark Flash (Light Mode Active)
- **Action:** With Light Mode active, navigate sequentially from Dashboard → Assets → Maintenance → Work Orders → Technicians → Spare Parts → Analytics → Predictive Maintenance → Alert Center → Settings → Profile.
- **Expected Outcome:** Every page loads instantly in Light Mode with ZERO dark-mode flash, flicker, or unstyled state.

### Test Case THEME-03: Page Hard Refresh (Light Mode Active)
- **Action:** While on `pages/assets.html` in Light Mode, perform a browser hard refresh (`Ctrl + Shift + R` / `F5`).
- **Expected Outcome:** Page renders immediately in Light Mode on the first frame via synchronous early head script execution.

### Test Case THEME-04: Select Dark Mode Persistence
- **Action:** Click Theme Toggle button to select **Dark Mode**.
- **Expected Outcome:** Application shifts to Dark Mode. `plantpulse_theme` key in `localStorage` stores `"dark"`.

### Test Case THEME-05: Navigation Without Light Flash (Dark Mode Active)
- **Action:** Navigate between all platform pages while Dark Mode is active.
- **Expected Outcome:** Every page remains consistently Dark throughout with ZERO light-mode flash or flicker.

### Test Case THEME-06: Login Page in Light Mode
- **Action:** Set theme to Light Mode and log out or navigate to `login.html`.
- **Expected Outcome:** Login page renders cleanly in Light Mode with high-contrast background, clear hero image visibility, dark wordmark, and crisp form inputs.

### Test Case THEME-07: Login Page in Dark Mode
- **Action:** Set theme to Dark Mode and log out or navigate to `login.html`.
- **Expected Outcome:** Login page renders in Dark Mode with dark slate background, visible industrial hero image overlay, white wordmark, and readable form inputs.

### Test Case THEME-08: Live Theme Switching on Login Screen
- **Action:** Toggle theme button directly on `login.html`.
- **Expected Outcome:** Background, login card, inputs, wordmark, and hero image treatment update immediately without reloading the page.

