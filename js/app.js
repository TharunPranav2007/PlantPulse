/* ==========================================================================
   PLANTPULSE - Global Application UI Controller
   Handles Sidebar collapse, Mobile menu, Theme switching, Toasts, 
   Modal dialogs, Global Search, and Active Page highlights.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    PlantPulseApp.init();
});

const PlantPulseApp = {
    init() {
        this.initTheme();
        this.initSidebar();
        this.initGlobalSearch();
        this.initAlertBadge();
        this.highlightActiveNav();
        
        // Listen to store updates to update alert counts dynamically
        store.subscribe((event) => {
            this.initAlertBadge();
        });
    },

    /* --- Theme Management --- */
    initTheme() {
        const savedTheme = localStorage.getItem("plantpulse_theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        this.updateThemeToggleIcon(savedTheme);

        const themeBtn = document.getElementById("themeToggleBtn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
                const newTheme = currentTheme === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("plantpulse_theme", newTheme);
                this.updateThemeToggleIcon(newTheme);
                this.showToast("Theme Updated", `Switched to ${newTheme.toUpperCase()} mode`, "info");
            });
        }
    },

    updateThemeToggleIcon(theme) {
        const themeBtn = document.getElementById("themeToggleBtn");
        if (themeBtn) {
            const icon = themeBtn.querySelector("i");
            if (icon) {
                icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
            }
        }
    },

    /* --- Sidebar & Mobile Navigation --- */
    initSidebar() {
        const sidebar = document.querySelector(".sidebar");
        const toggleBtn = document.querySelector(".sidebar-toggle-btn");
        const mobileBtn = document.querySelector(".mobile-menu-btn");

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("collapsed");
                const isCollapsed = sidebar.classList.contains("collapsed");
                localStorage.setItem("plantpulse_sidebar_collapsed", isCollapsed ? "true" : "false");
            });

            // Restore collapsed state
            if (localStorage.getItem("plantpulse_sidebar_collapsed") === "true") {
                sidebar.classList.add("collapsed");
            }
        }

        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener("click", () => {
                sidebar.classList.toggle("mobile-open");
            });
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

    /* --- Dynamic Alert Badge in Sidebar & Topbar --- */
    initAlertBadge() {
        const alerts = store.getAlerts();
        const unreadCount = alerts.filter(a => !a.read).length;
        
        document.querySelectorAll(".alert-badge-count").forEach(el => {
            el.textContent = unreadCount;
            el.style.display = unreadCount > 0 ? "inline-block" : "none";
        });
    },

    /* --- Toast Notification Controller --- */
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

    /* --- Global Search Modal System --- */
    initGlobalSearch() {
        const triggerBtns = document.querySelectorAll(".global-search-trigger");
        
        triggerBtns.forEach(btn => {
            btn.addEventListener("click", () => this.openSearchModal());
        });

        // Keyboard Shortcut Ctrl+K or Cmd+K
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
                            <div style="text-align:center; color:var(--text-muted); padding:2rem;">Start typing to search across all operational modules...</div>
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
            resultsContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">Start typing to search across all operational modules...</div>`;
            return;
        }

        const assets = store.getAssets().filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
        const workOrders = store.getWorkOrders().filter(w => w.id.toLowerCase().includes(q) || w.issue.toLowerCase().includes(q) || w.technician.toLowerCase().includes(q));
        const technicians = store.getTechnicians().filter(t => t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q));
        const spareParts = store.getSpareParts().filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));

        let html = "";

        if (assets.length > 0) {
            html += `<div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; color:var(--accent-primary); letter-spacing:1px; margin-bottom:0.5rem;">Assets (${assets.length})</div>`;
            assets.forEach(a => {
                html += `
                    <div style="padding:0.75rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:600; color:var(--text-primary);"><span class="table-cell-code">${a.id}</span> - ${a.name}</div>
                            <div style="font-size:0.78rem; color:var(--text-muted);">${a.unit} • ${a.type}</div>
                        </div>
                        <a href="pages/assets.html" class="btn btn-sm btn-secondary">View Asset</a>
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
                        <a href="pages/workorders.html" class="btn btn-sm btn-secondary">View Work Order</a>
                    </div>
                `;
            });
        }

        if (technicians.length > 0) {
            html += `<div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; color:var(--accent-primary); letter-spacing:1px; margin-top:1rem; margin-bottom:0.5rem;">Technicians (${technicians.length})</div>`;
            technicians.forEach(t => {
                html += `
                    <div style="padding:0.75rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:600; color:var(--text-primary);">${t.name}</div>
                            <div style="font-size:0.78rem; color:var(--text-muted);">${t.specialization} • ${t.availability}</div>
                        </div>
                        <a href="pages/technicians.html" class="btn btn-sm btn-secondary">View Profile</a>
                    </div>
                `;
            });
        }

        if (!html) {
            html = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">No matching industrial records found for "${query}".</div>`;
        }

        resultsContainer.innerHTML = html;
    },

    /* --- Custom Modal Dialog Generator --- */
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

    /* --- Custom Confirmation Modal --- */
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
