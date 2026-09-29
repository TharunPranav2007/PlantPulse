/* ==========================================================================
   PLANTPULSE - Authentication & Centralized Role Permissions Module
   Manages session storage, demo credentials, authentication enforcement,
   and granular Role-Based Access Control (RBAC).
   ========================================================================== */

const AUTH_SESSION_KEY = "plantpulse_session";

// Preconfigured Industrial Multi-Role Accounts
const DEMO_USERS = [
    {
        username: "admin",
        password: "admin123",
        name: "Rajesh Kumar",
        role: "Plant Manager",
        roleKey: "admin",
        employeeId: "PM-001",
        department: "Plant Operations",
        email: "rajesh.kumar@plantpulse.io",
        avatar: "RK"
    },
    {
        username: "technician",
        password: "tech123",
        name: "Arun Kumar",
        role: "Maintenance Technician",
        roleKey: "technician",
        employeeId: "TECH-001",
        department: "Maintenance",
        specialization: "Mechanical Systems",
        email: "arun.kumar@plantpulse.io",
        avatar: "AK"
    },
    {
        username: "supervisor",
        password: "super123",
        name: "Priya Sharma",
        role: "Maintenance Supervisor",
        roleKey: "supervisor",
        employeeId: "SUP-001",
        department: "Maintenance Operations",
        email: "priya.sharma@plantpulse.io",
        avatar: "PS"
    },
    {
        username: "inventory",
        password: "inventory123",
        name: "Vikram Singh",
        role: "Inventory Manager",
        roleKey: "inventory",
        employeeId: "INV-001",
        department: "Stores & Inventory",
        email: "vikram.singh@plantpulse.io",
        avatar: "VS"
    }
];

// Central Role-Based Permission Matrix
const ROLE_PERMISSIONS = {
    admin: [
        "dashboard.read", "dashboard.financials",
        "asset.create", "asset.read", "asset.update", "asset.delete",
        "maintenance.create", "maintenance.read", "maintenance.update", "maintenance.delete",
        "workorder.create", "workorder.read", "workorder.update", "workorder.delete", "workorder.assign",
        "technician.create", "technician.read", "technician.update", "technician.delete",
        "sparepart.create", "sparepart.read", "sparepart.update", "sparepart.delete", "inventory.movement",
        "analytics.read", "predictive.read", "alerts.read", "settings.manage", "activity.read", "users.manage"
    ],

    supervisor: [
        "dashboard.read",
        "asset.read",
        "maintenance.create", "maintenance.read", "maintenance.update",
        "workorder.create", "workorder.read", "workorder.update", "workorder.assign",
        "technician.read", "technician.workload",
        "sparepart.read",
        "analytics.read", "predictive.read", "alerts.read", "activity.read"
    ],

    technician: [
        "dashboard.read.assigned",
        "asset.read.assigned",
        "maintenance.read.assigned", "maintenance.update.assigned",
        "workorder.read.assigned", "workorder.update.assigned",
        "sparepart.read",
        "alerts.read", "profile.read"
    ],

    inventory: [
        "dashboard.read.inventory",
        "asset.read",
        "sparepart.create", "sparepart.read", "sparepart.update", "inventory.movement",
        "maintenance.read.parts",
        "analytics.inventory", "alerts.read", "profile.read"
    ]
};

const PlantPulseAuth = {
    // Return currently logged in user or null
    getCurrentUser() {
        try {
            const saved = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Auth session parsing error:", e);
        }
        return null;
    },

    // Authenticate credentials
    login(username, password, rememberMe = false) {
        const user = DEMO_USERS.find(u => u.username === username && u.password === password);
        if (user) {
            const sessionData = { ...user };
            delete sessionData.password; // Do not store plaintext password in session

            if (rememberMe) {
                localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
            }
            
            // Record login activity in central store if store exists
            if (typeof store !== "undefined" && store.addActivity) {
                store.addActivity(`${user.name} (${user.role}) logged into platform session.`);
            }
            return { success: true, user: sessionData };
        }
        return { success: false, message: "Invalid username or password credentials." };
    },

    // Logout session
    logout() {
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        localStorage.removeItem(AUTH_SESSION_KEY);
        window.location.href = window.location.pathname.includes("/pages/") ? "../login.html" : "login.html";
    },

    // Check permission for current session
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        const permissions = ROLE_PERMISSIONS[user.roleKey] || [];
        return permissions.includes(permission) || user.roleKey === "admin";
    },

    // Protected Route Enforcement Guard
    requireAuth(requiredPermission = null) {
        const user = this.getCurrentUser();
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.endsWith("login.html");

        if (!user && !isLoginPage) {
            window.location.href = currentPath.includes("/pages/") ? "../login.html" : "login.html";
            return false;
        }

        if (user && isLoginPage) {
            window.location.href = "index.html";
            return false;
        }

        if (user && requiredPermission && !this.hasPermission(requiredPermission)) {
            this.renderAccessDeniedView();
            return false;
        }

        return true;
    },

    // Render 403 Access Denied Screen if user manually navigates to unauthorized page
    renderAccessDeniedView() {
        const mainWrapper = document.querySelector(".main-wrapper") || document.body;
        const user = this.getCurrentUser();
        
        mainWrapper.innerHTML = `
            <div class="access-denied-container">
                <div class="access-denied-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2 style="font-size:1.8rem; margin-bottom:0.5rem;">403 - Access Restricted</h2>
                <p style="color:var(--text-secondary); max-width:500px; margin-bottom:1.5rem; line-height:1.6;">
                    Hello <strong>${user ? user.name : 'User'}</strong> (${user ? user.role : 'Guest'}). You do not have permissions to access this module.
                </p>
                <div style="display:flex; gap:0.75rem;">
                    <a href="${window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html'}" class="btn btn-primary">
                        <i class="fas fa-house"></i> Return to Dashboard
                    </a>
                    <button onclick="PlantPulseAuth.logout()" class="btn btn-secondary">
                        <i class="fas fa-right-from-bracket"></i> Switch Account
                    </button>
                </div>
            </div>
        `;
    }
};
