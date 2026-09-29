/* ==========================================================================
   PLANTPULSE - Global Application UI Controller
   Handles Session enforcement, Role-Aware Sidebar Navigation, Topbar Profile,
   Theme synchronization, Toast notifications, Modals, and Global Search.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Enforce Authentication Check
    if (typeof PlantPulseAuth !== "undefined") {
        if (!PlantPulseAuth.requireAuth()) return;
    }
    PlantPulseApp.init();
});

const PlantPulseApp = {
    init() {
        this.initTheme();
        this.renderUserHeader();
        this.renderRoleSidebar();
        this.initSidebarToggle();
        this.initGlobalSearch();
        this.initAlertBadge();
        this.highlightActiveNav();

        // Subscribe to store updates to update alert counts dynamically
        if (typeof store !== "undefined") {
            store.subscribe(() => {
                this.initAlertBadge();
            });
        }
    },

    /* --- Theme Initialization Delegate --- */
    initTheme() {
        if (typeof PlantPulseTheme !== "undefined") {
            PlantPulseTheme.init();
        }
    },

    /* --- Render Logged-in User Profile in Topbar --- */
    renderUserHeader() {
        const user = PlantPulseAuth.getCurrentUser();
        if (!user) return;

        const profileContainer = document.querySelector(".user-profile");
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div class="avatar">${user.avatar || 'AD'}</div>
                <div class="user-info">
                    <span class="user-name">${user.name}</span>
                    <span class="user-role">${user.role}</span>
                </div>
                <i class="fas fa-chevron-down" style="font-size:0.75rem; color:var(--text-muted); margin-left:0.25rem;"></i>

                <!-- Profile Dropdown Menu -->
                <div class="user-dropdown-menu" id="userDropdownMenu">
                    <div class="user-dropdown-header">
                        <div style="font-weight:600; color:var(--text-primary);">${user.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${user.employeeId} • ${user.department}</div>
                    </div>
                    <a href="${window.location.pathname.includes('/pages/') ? 'profile.html' : 'pages/profile.html'}" class="user-dropdown-item">
                        <i class="fas fa-id-card"></i> My Profile
                    </a>
                    <a href="${window.location.pathname.includes('/pages/') ? 'settings.html' : 'pages/settings.html'}" class="user-dropdown-item">
                        <i class="fas fa-sliders"></i> Preferences
                    </a>
                    <button class="user-dropdown-item logout-item" onclick="PlantPulseAuth.logout()">
                        <i class="fas fa-right-from-bracket"></i> Sign Out Session
                    </button>
                </div>
            `;

            profileContainer.onclick = (e) => {
                e.stopPropagation();
                const menu = document.getElementById("userDropdownMenu");
                if (menu) menu.classList.toggle("show");
            };

            document.addEventListener("click", () => {
                const menu = document.getElementById("userDropdownMenu");
                if (menu) menu.classList.remove("show");
            });
        }
    },

    /* --- Dynamic Role-Aware Sidebar Builder --- */
    renderRoleSidebar() {
        const user = PlantPulseAuth.getCurrentUser();
        if (!user) return;

        const navContainer = document.querySelector(".sidebar-nav");
        if (!navContainer) return;

        const isPagesSubdir = window.location.pathname.includes("/pages/");
        const rootPath = isPagesSubdir ? "../" : "";
        const pagesPath = isPagesSubdir ? "" : "pages/";

        let navHtml = "";

        if (user.roleKey === "admin") {
            navHtml = `
                <div class="nav-section-title">Core Operations</div>
                <a href="${rootPath}index.html" class="nav-item"><i class="fas fa-chart-line"></i><span class="nav-text">Dashboard</span></a>
                <a href="${pagesPath}assets.html" class="nav-item"><i class="fas fa-cubes"></i><span class="nav-text">Assets Management</span></a>
                <a href="${pagesPath}maintenance.html" class="nav-item"><i class="fas fa-screwdriver-wrench"></i><span class="nav-text">Maintenance</span></a>
                <a href="${pagesPath}workorders.html" class="nav-item"><i class="fas fa-clipboard-check"></i><span class="nav-text">Work Orders</span></a>

                <div class="nav-section-title">Resources & Inventory</div>
                <a href="${pagesPath}technicians.html" class="nav-item"><i class="fas fa-user-gear"></i><span class="nav-text">Technicians</span></a>
                <a href="${pagesPath}spareparts.html" class="nav-item"><i class="fas fa-boxes-packing"></i><span class="nav-text">Spare Parts</span></a>

                <div class="nav-section-title">Intelligence</div>
                <a href="${pagesPath}analytics.html" class="nav-item"><i class="fas fa-chart-pie"></i><span class="nav-text">Analytics</span></a>
                <a href="${pagesPath}predictive.html" class="nav-item"><i class="fas fa-brain"></i><span class="nav-text">Predictive Health</span></a>
                <a href="${pagesPath}alerts.html" class="nav-item"><i class="fas fa-bell"></i><span class="nav-text">Alert Center</span><span class="badge-count alert-badge-count">0</span></a>

                <div class="nav-section-title">System</div>
                <a href="${pagesPath}profile.html" class="nav-item"><i class="fas fa-id-card"></i><span class="nav-text">My Profile</span></a>
                <a href="${pagesPath}settings.html" class="nav-item"><i class="fas fa-gear"></i><span class="nav-text">Settings</span></a>
            `;
        } else if (user.roleKey === "technician") {
            navHtml = `
                <div class="nav-section-title">Technician Workspace</div>
                <a href="${rootPath}index.html" class="nav-item"><i class="fas fa-gauge-high"></i><span class="nav-text">My Workspace</span></a>
                <a href="${pagesPath}workorders.html" class="nav-item"><i class="fas fa-clipboard-list"></i><span class="nav-text">My Work Orders</span></a>
                <a href="${pagesPath}maintenance.html" class="nav-item"><i class="fas fa-screwdriver-wrench"></i><span class="nav-text">My Maintenance</span></a>
                <a href="${pagesPath}assets.html" class="nav-item"><i class="fas fa-cubes"></i><span class="nav-text">Assigned Assets</span></a>

                <div class="nav-section-title">System & Alerts</div>
                <a href="${pagesPath}alerts.html" class="nav-item"><i class="fas fa-bell"></i><span class="nav-text">Alert Center</span><span class="badge-count alert-badge-count">0</span></a>
                <a href="${pagesPath}profile.html" class="nav-item"><i class="fas fa-id-card"></i><span class="nav-text">My Profile</span></a>
            `;
        } else if (user.roleKey === "supervisor") {
            navHtml = `
                <div class="nav-section-title">Supervisor Management</div>
                <a href="${rootPath}index.html" class="nav-item"><i class="fas fa-chart-line"></i><span class="nav-text">Operations Center</span></a>
                <a href="${pagesPath}assets.html" class="nav-item"><i class="fas fa-cubes"></i><span class="nav-text">Plant Assets</span></a>
                <a href="${pagesPath}maintenance.html" class="nav-item"><i class="fas fa-screwdriver-wrench"></i><span class="nav-text">Maintenance</span></a>
                <a href="${pagesPath}workorders.html" class="nav-item"><i class="fas fa-clipboard-check"></i><span class="nav-text">Work Orders Queue</span></a>
                <a href="${pagesPath}technicians.html" class="nav-item"><i class="fas fa-user-gear"></i><span class="nav-text">Technicians Roster</span></a>

                <div class="nav-section-title">Intelligence</div>
                <a href="${pagesPath}analytics.html" class="nav-item"><i class="fas fa-chart-pie"></i><span class="nav-text">Analytics</span></a>
                <a href="${pagesPath}predictive.html" class="nav-item"><i class="fas fa-brain"></i><span class="nav-text">Predictive Diagnostics</span></a>
                <a href="${pagesPath}alerts.html" class="nav-item"><i class="fas fa-bell"></i><span class="nav-text">Alert Center</span><span class="badge-count alert-badge-count">0</span></a>
                <a href="${pagesPath}profile.html" class="nav-item"><i class="fas fa-id-card"></i><span class="nav-text">My Profile</span></a>
            `;
        } else if (user.roleKey === "inventory") {
            navHtml = `
                <div class="nav-section-title">Stores & Inventory</div>
                <a href="${rootPath}index.html" class="nav-item"><i class="fas fa-boxes-stacked"></i><span class="nav-text">Stores Workspace</span></a>
                <a href="${pagesPath}spareparts.html" class="nav-item"><i class="fas fa-boxes-packing"></i><span class="nav-text">Spare Parts Catalog</span></a>
                <a href="${pagesPath}assets.html" class="nav-item"><i class="fas fa-cubes"></i><span class="nav-text">View Plant Assets</span></a>

                <div class="nav-section-title">System & Alerts</div>
                <a href="${pagesPath}alerts.html" class="nav-item"><i class="fas fa-bell"></i><span class="nav-text">Stock Alerts</span><span class="badge-count alert-badge-count">0</span></a>
                <a href="${pagesPath}profile.html" class="nav-item"><i class="fas fa-id-card"></i><span class="nav-text">My Profile</span></a>
            `;
        }

        navContainer.innerHTML = navHtml;
    },

    /* --- Sidebar Collapse & Mobile Navigation --- */
    initSidebarToggle() {
        const sidebar = document.querySelector(".sidebar");
        const toggleBtn = document.querySelector(".sidebar-toggle-btn");
        const mobileBtn = document.querySelector(".mobile-menu-btn");

        if (toggleBtn && sidebar) {
            toggleBtn.onclick = () => {
                sidebar.classList.toggle("collapsed");
                const isCollapsed = sidebar.classList.contains("collapsed");
                localStorage.setItem("plantpulse_sidebar_collapsed", isCollapsed ? "true" : "false");
            };

            if (localStorage.getItem("plantpulse_sidebar_collapsed") === "true") {
                sidebar.classList.add("collapsed");
            }
        }

        if (mobileBtn && sidebar) {
            mobileBtn.onclick = () => {
                sidebar.classList.toggle("mobile-open");
            };
        }
    },

    /* --- Active Navigation Item --- */
    highlightActiveNav() {
        const path = window.location.pathname;
        const page = path.split("/").pop() || "index.html";
        
        document.querySelectorAll(".nav-item").forEach(item => {
            const href = item.getAttribute("href");
            if (href && (href.endsWith(page) || (page === "" && href.endsWith("index.html")))) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    },

    /* --- Alert Badge Count --- */
    initAlertBadge() {
        const alerts = store.getAlerts();
        const unreadCount = alerts.filter(a => !a.read).length;
        
        document.querySelectorAll(".alert-badge-count").forEach(el => {
            el.textContent = unreadCount;
            el.style.display = unreadCount > 0 ? "inline-block" : "none";
        });
    },

    /* --- Toast Notification System --- */
    showToast(title, message, type = "success") {
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const iconMap = {
            success: "fa-circle-check",
            danger: "fa-triangle-exclamation",
            warning: "fa-circle-exclamation",
            info: "fa-circle-info"
        };

        toast.innerHTML = `
            <i class="fas ${iconMap[type] || 'fa-circle-info'} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()" style="color:var(--text-muted); padding:4px;"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    },

    /* --- Global Search System (Ctrl + K) --- */
    initGlobalSearch() {
        const triggerBtns = document.querySelectorAll(".global-search-trigger");
        triggerBtns.forEach(btn => {
            btn.onclick = () => this.openSearchModal();
        });

        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                this.openSearchModal();
            }
        });
    },

    openSearchModal() {
        let modal = document.getElementById("globalSearchModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "globalSearchModal";
            modal.className = "modal-overlay";
            modal.innerHTML = `
                <div class="modal-dialog" style="max-width:680px;">
                    <div class="modal-header">
                        <div class="modal-title"><i class="fas fa-search"></i> Global Search Platform</div>
                        <button class="modal-close-btn" onclick="PlantPulseApp.closeSearchModal()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body" style="padding:1.25rem;">
                        <div class="search-box" style="max-width:100%; margin-bottom:1.25rem;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="globalSearchInput" class="search-input" placeholder="Search assets, work orders, technicians, spare parts..." autofocus>
                        </div>
                        <div id="globalSearchResults" style="max-height:380px; overflow-y:auto; display:flex; flex-direction:column; gap:1rem;">
                            <div style="text-align:center; color:var(--text-muted); padding:2rem;">Start typing to search across central operational store...</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.classList.add("active");
        const input = document.getElementById("globalSearchInput");
        if (input) {
            input.value = "";
            input.focus();
            input.oninput = (e) => this.performGlobalSearch(e.target.value);
        }
    },

    closeSearchModal() {
        const modal = document.getElementById("globalSearchModal");
        if (modal) modal.classList.remove("active");
    },

    performGlobalSearch(query) {
        const resultsContainer = document.getElementById("globalSearchResults");
        if (!resultsContainer) return;

        const q = query.trim().toLowerCase();
        if (!q) {
            resultsContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">Start typing to search across central operational store...</div>`;
            return;
        }

        const assets = store.getAssets().filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
        const workOrders = store.getWorkOrders().filter(w => w.id.toLowerCase().includes(q) || w.issue.toLowerCase().includes(q) || w.technician.toLowerCase().includes(q));
        const technicians = store.getTechnicians().filter(t => t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q));
        const spareParts = store.getSpareParts().filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));

        let html = "";
        const isPagesSubdir = window.location.pathname.includes("/pages/");
        const pagesPrefix = isPagesSubdir ? "" : "pages/";

        if (assets.length > 0) {
            html += `<div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; color:var(--accent-primary); letter-spacing:1px; margin-bottom:0.5rem;">Assets (${assets.length})</div>`;
            assets.forEach(a => {
                html += `
                    <div style="padding:0.75rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:600; color:var(--text-primary);"><span class="table-cell-code">${a.id}</span> - ${a.name}</div>
                            <div style="font-size:0.78rem; color:var(--text-muted);">${a.unit} • ${a.type}</div>
                        </div>
                        <a href="${pagesPrefix}assets.html" class="btn btn-sm btn-secondary">View Asset</a>
                    </div>
                `;
            });
        }

        if (workOrders.length > 0) {
            html += `<div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; color:var(--accent-primary); letter-spacing:1px; margin-top:1rem; margin-bottom:0.5rem;">Work Orders (${workOrders.length})</div>`;
            workOrders.forEach(w => {
                html += `
                    <div style="padding:0.75rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:600; color:var(--text-primary);"><span class="table-cell-code">${w.id}</span> - ${w.issue}</div>
                            <div style="font-size:0.78rem; color:var(--text-muted);">Assigned to: ${w.technician} • Status: ${w.status}</div>
                        </div>
                        <a href="${pagesPrefix}workorders.html" class="btn btn-sm btn-secondary">View Work Order</a>
                    </div>
                `;
            });
        }

        if (!html) {
            html = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">No matching records found for "${query}".</div>`;
        }

        resultsContainer.innerHTML = html;
    },

    /* --- Custom Modal Dialog Helpers --- */
    openModal(title, contentHtml, footerButtonsHtml) {
        let modal = document.getElementById("ppGlobalModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "ppGlobalModal";
            modal.className = "modal-overlay";
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-header">
                        <div class="modal-title" id="ppModalTitle"></div>
                        <button class="modal-close-btn" onclick="PlantPulseApp.closeModal()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body" id="ppModalBody"></div>
                    <div class="modal-footer" id="ppModalFooter"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById("ppModalTitle").innerHTML = title;
        document.getElementById("ppModalBody").innerHTML = contentHtml;
        document.getElementById("ppModalFooter").innerHTML = footerButtonsHtml || `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Close</button>
        `;

        modal.classList.add("active");
    },

    closeModal() {
        const modal = document.getElementById("ppGlobalModal");
        if (modal) modal.classList.remove("active");
    },

    confirmAction(title, message, confirmBtnText, onConfirm) {
        const content = `<p style="color:var(--text-secondary); line-height:1.6;">${message}</p>`;
        const buttons = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-danger" id="confirmActionBtn">${confirmBtnText}</button>
        `;
        this.openModal(title, content, buttons);
        document.getElementById("confirmActionBtn").onclick = () => {
            onConfirm();
            this.closeModal();
        };
    }
};
