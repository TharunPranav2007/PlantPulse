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
|                        APPLICATION CONTROLLER                     |
|  app.js (Global UI, Toasts, Modals, Theme, Global Search Engine)  |
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
|           LocalStorage API (Key: plantpulse_state_v1)             |
+-------------------------------------------------------------------+
```

## 2. Design System Tokens
- **Theme Primary Dark:** `#0a0e17`
- **Surface Elevation:** `#121824`
- **Card Background:** `#161e2e`
- **Accent Primary Gradient:** `linear-gradient(135deg, #00f2fe 0%, #00b4db 100%)`
- **Status Badges:**
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)
  - Danger: `#ef4444` (Red)
  - Info: `#3b82f6` (Blue)
