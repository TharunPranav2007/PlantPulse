# PlantPulse System Architecture Documentation

## 1. High-Level Architectural Vision
PlantPulse is structured following clean architectural principles, decoupling presentation UI from state management and persistence.

```
+-------------------------------------------------------------------+
|                        PRESENTATION LAYER                         |
|   index.html | pages/*.html | CSS Design System (css/style.css)   |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                   CENTRALIZED THEME ENGINE                        |
|  js/theme.js (PlantPulseTheme) + Early Synchronous <head> script  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        APPLICATION CONTROLLER                     |
|  app.js (Global UI, Toasts, Modals, Global Search Engine, RBAC)  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        MODULE CONTROLLERS                         |
|  dashboard.js | assets.js | maintenance.js | workorders.js | ...  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                         DATA STORE LAYER                          |
|  js/store.js (CRUD Methods, Event Bus, Predictive Calculations)   |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                         PERSISTENCE LAYER                         |
|           LocalStorage API (Key: plantpulse_state_v1 &           |
|                       plantpulse_theme)                           |
+-------------------------------------------------------------------+
```

## 2. Centralized Theme System Architecture

To prevent Flash of Unstyled Content (FOUC) or Flash of Wrong Theme during cross-page navigation and hard refreshes, PlantPulse implements a multi-stage early initialization theme workflow:

```
User Action / Page Load
          │
          ▼
Synchronous Head Script (Reads 'plantpulse_theme' from localStorage)
          │
          ▼
Applies data-theme attribute on <html> element BEFORE DOM render
          │
          ▼
CSS Variable Tokens active immediately on first paint frame
          │
          ▼
PlantPulseTheme JS Module loads & synchronizes UI controls & ARIA labels
```

### Theme Execution Flow
`User Theme Selection` ➔ `PlantPulseTheme.setTheme()` ➔ `localStorage.setItem('plantpulse_theme')` ➔ `html[data-theme]` ➔ `CSS Custom Properties` ➔ `All Pages & Components`

## 3. Design System Tokens & CSS Variables
- **Theme Switcher:** Dual-mode support (`dark` / `light`) driven by CSS variables in `css/style.css`.
- **Sidebar Headings (`.nav-section-title`):** Muted slate token (`--text-section-heading`) guaranteeing WCAG 2.1 AAA contrast compliance in both modes.
- **Surface Elevation:** Dynamic CSS variables (`--bg-primary`, `--bg-secondary`, `--surface`, `--surface-elevated`).
- **Accent Primary:** Industrial PlantPulse Cyan (`#00f2fe` to `#00b4db` gradient).
- **Status Badges:**
  - Success / Healthy: `#10b981` (Green)
  - Warning / Attention: `#f59e0b` (Amber)
  - Danger / Critical: `#ef4444` (Red)
  - Info / Scheduled: `#3b82f6` (Blue)

