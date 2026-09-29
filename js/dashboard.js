/* ==========================================================================
   PLANTPULSE - Role-Specific Dashboard Controller
   Stage 1: Multi-Role Dashboard Rendering (Admin Command Center,
   Technician Workspace, Supervisor Operations, Inventory Store Manager).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("dashboardRoot")) {
        DashboardController.init();
    }
});

const DashboardController = {
    chartInstance: null,

    init() {
        this.renderRoleDashboard();

        // Subscribe to store updates to keep dashboard synchronized in real-time
        if (typeof store !== "undefined") {
            store.subscribe(() => {
                this.renderRoleDashboard();
            });
        }
    },

    renderRoleDashboard() {
        const root = document.getElementById("dashboardRoot");
        if (!root) return;

        const currentUser = PlantPulseAuth.getCurrentUser() || { roleKey: "admin", name: "User" };

        if (currentUser.roleKey === "admin") {
            this.renderAdminDashboard(root, currentUser);
        } else if (currentUser.roleKey === "technician") {
            this.renderTechnicianDashboard(root, currentUser);
        } else if (currentUser.roleKey === "supervisor") {
            this.renderSupervisorDashboard(root, currentUser);
        } else if (currentUser.roleKey === "inventory") {
            this.renderInventoryDashboard(root, currentUser);
        }
    },

    /* --- 1. ADMIN / PLANT MANAGER DASHBOARD --- */
    renderAdminDashboard(root, user) {
        const kpis = store.getKPIs();

        root.innerHTML = `
            <div class="page-header">
                <div class="page-title-group">
                    <h1>Industrial Operations Command Center</h1>
                    <p class="page-subtitle">Welcome back, <strong>${user.name}</strong>. Global real-time overview of manufacturing assets, financial uptime, and plant performance.</p>
                </div>
                <div class="page-actions">
                    <a href="pages/assets.html" class="btn btn-secondary"><i class="fas fa-cubes"></i> Assets Directory</a>
                    <a href="pages/workorders.html" class="btn btn-primary"><i class="fas fa-plus"></i> New Work Order</a>
                </div>
            </div>

            <!-- KPI Cards Grid -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Total Assets</span><div class="kpi-icon blue"><i class="fas fa-microchip"></i></div></div>
                    <div class="kpi-value">${kpis.totalAssets}</div>
                    <div class="kpi-footer"><span class="trend-up"><i class="fas fa-arrow-up"></i> +6.2%</span><span class="kpi-subtext">vs last month</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Operational</span><div class="kpi-icon green"><i class="fas fa-circle-check"></i></div></div>
                    <div class="kpi-value">${kpis.operationalAssets}</div>
                    <div class="kpi-footer"><span class="trend-up"><i class="fas fa-check"></i> 88.5% uptime</span><span class="kpi-subtext">fleet rate</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Active Alerts</span><div class="kpi-icon red"><i class="fas fa-bell"></i></div></div>
                    <div class="kpi-value">${kpis.activeAlerts}</div>
                    <div class="kpi-footer"><span class="trend-down"><i class="fas fa-exclamation-triangle"></i> Action req.</span><span class="kpi-subtext">unresolved</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Open Work Orders</span><div class="kpi-icon amber"><i class="fas fa-clipboard-list"></i></div></div>
                    <div class="kpi-value">${kpis.openWorkOrders}</div>
                    <div class="kpi-footer"><span class="trend-neutral"><i class="fas fa-user-clock"></i> Active</span><span class="kpi-subtext">in queue</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Maintenance Cost</span><div class="kpi-icon purple"><i class="fas fa-indian-rupee-sign"></i></div></div>
                    <div class="kpi-value">${kpis.totalMaintenanceCost}</div>
                    <div class="kpi-footer"><span class="trend-down"><i class="fas fa-arrow-down"></i> -4.1%</span><span class="kpi-subtext">under budget</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Avg Health Score</span><div class="kpi-icon green"><i class="fas fa-heart-pulse"></i></div></div>
                    <div class="kpi-value">${kpis.averageHealth}</div>
                    <div class="kpi-footer"><span class="trend-up"><i class="fas fa-shield-halved"></i> Optimal</span><span class="kpi-subtext">plant index</span></div>
                </div>
            </div>

            <!-- Machine Health & Health Trend Chart -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:1.5rem; margin-top:1.5rem;">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-heart-pulse"></i> Machine Telemetry Overview</div>
                        <a href="pages/assets.html" class="btn btn-sm btn-secondary">All Assets &rarr;</a>
                    </div>
                    <div class="card-body" id="adminHealthGrid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;"></div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-chart-line"></i> Machine Health Trend</div>
                        <select id="chartPeriodSelect" class="select-control">
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                    </div>
                    <div class="card-body" style="height:260px; position:relative;">
                        <canvas id="healthTrendCanvas"></canvas>
                    </div>
                </div>
            </div>

            <!-- Maintenance Table + Activity Feed Timeline -->
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:1.5rem; margin-top:1.5rem;" class="responsive-grid">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-screwdriver-wrench"></i> Upcoming Maintenance Schedules</div>
                        <a href="pages/maintenance.html" class="btn btn-sm btn-secondary">View Schedules</a>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Type</th>
                                    <th>Technician</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="adminMaintTbody"></tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-stream"></i> Real-time Activity Feed</div>
                    </div>
                    <div class="card-body" style="max-height:360px; overflow-y:auto;" id="adminActivityList"></div>
                </div>
            </div>
        `;

        this.renderAdminSubcomponents();
    },

    renderAdminSubcomponents() {
        // Render Health Cards
        const healthGrid = document.getElementById("adminHealthGrid");
        if (healthGrid) {
            const assets = store.getAssets().slice(0, 4);
            healthGrid.innerHTML = assets.map(a => `
                <div class="card" style="padding:1rem;">
                    <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-primary); font-weight:700;">${a.id}</div>
                    <div style="font-weight:600; font-size:0.9rem; margin:2px 0;">${a.name}</div>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-secondary); margin-top:0.5rem;">
                        <span>Health:</span><strong>${a.health}%</strong>
                    </div>
                    <div class="health-bar-track" style="margin-top:4px;">
                        <div class="health-bar-fill ${a.health < 70 ? 'critical' : a.health < 90 ? 'warning' : 'healthy'}" style="width:${a.health}%;"></div>
                    </div>
                </div>
            `).join("");
        }

        // Render Maintenance Table
        const maintTbody = document.getElementById("adminMaintTbody");
        if (maintTbody) {
            const records = store.getMaintenance().slice(0, 5);
            maintTbody.innerHTML = records.map(r => `
                <tr>
                    <td class="table-cell-code">${r.assetId}</td>
                    <td>${r.type}</td>
                    <td>${r.technician}</td>
                    <td>${r.scheduledDate}</td>
                    <td><span class="badge ${r.status === 'Completed' ? 'badge-success' : r.status === 'In Progress' ? 'badge-warning' : 'badge-info'}">${r.status}</span></td>
                </tr>
            `).join("");
        }

        // Render Activity Feed
        const actList = document.getElementById("adminActivityList");
        if (actList) {
            const activities = store.getActivityFeed().slice(0, 6);
            actList.innerHTML = `<div class="activity-feed">` + activities.map(act => `
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-bolt"></i></div>
                    <div class="activity-content">
                        <div><span class="activity-user">${act.user}</span> <span style="font-size:0.75rem; color:var(--text-muted);">(${act.role})</span></div>
                        <div style="font-size:0.8rem; margin-top:2px;">${act.action}</div>
                        <div class="activity-time" data-timestamp="${act.timestamp || ''}">${store.getRelativeTime(act.timestamp, act.time)}</div>
                    </div>
                </div>
            `).join("") + `</div>`;
        }

        // Render Chart.js
        this.renderLineChart();
    },

    /* --- 2. TECHNICIAN WORKSPACE DASHBOARD --- */
    renderTechnicianDashboard(root, user) {
        const kpis = store.getKPIs();
        const myWorkOrders = store.getWorkOrders().filter(w => w.technician === user.name);
        const pendingOrders = myWorkOrders.filter(w => w.status !== "CLOSED" && w.status !== "RESOLVED");

        root.innerHTML = `
            <div class="page-header">
                <div class="page-title-group">
                    <h1>My Maintenance Workspace</h1>
                    <p class="page-subtitle">Welcome back, <strong>${user.name}</strong> (${user.specialization}). Manage your assigned work orders and log completion notes.</p>
                </div>
                <div class="page-actions">
                    <a href="pages/workorders.html" class="btn btn-primary"><i class="fas fa-clipboard-list"></i> View All My Orders</a>
                </div>
            </div>

            <!-- Technician KPIs -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">My Assigned Orders</span><div class="kpi-icon amber"><i class="fas fa-wrench"></i></div></div>
                    <div class="kpi-value">${myWorkOrders.length}</div>
                    <div class="kpi-footer"><span class="trend-neutral">Assigned tasks</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Active / Pending</span><div class="kpi-icon red"><i class="fas fa-clock"></i></div></div>
                    <div class="kpi-value">${pendingOrders.length}</div>
                    <div class="kpi-footer"><span class="trend-down">Requires action</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Completed Orders</span><div class="kpi-icon green"><i class="fas fa-circle-check"></i></div></div>
                    <div class="kpi-value">${kpis.myCompletedOrders}</div>
                    <div class="kpi-footer"><span class="trend-up">Resolved by me</span></div>
                </div>
            </div>

            <!-- My Work Orders Workspace Table -->
            <div class="card" style="margin-top:1.5rem;">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-list-check"></i> My Assigned Work Orders Queue</div>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Asset</th>
                                <th>Issue Summary</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myWorkOrders.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No work orders assigned to you currently.</td></tr>` : 
                              myWorkOrders.map(w => `
                                <tr>
                                    <td class="table-cell-code">${w.id}</td>
                                    <td class="table-cell-bold">${w.assetId}</td>
                                    <td>${w.issue}</td>
                                    <td><span class="badge ${w.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}">${w.priority}</span></td>
                                    <td><span class="badge ${w.status === 'RESOLVED' ? 'badge-success' : w.status === 'IN PROGRESS' ? 'badge-warning' : 'badge-info'}">${w.status}</span></td>
                                    <td>
                                        ${w.status === 'OPEN' || w.status === 'ASSIGNED' ? `<button class="btn btn-sm btn-primary" onclick="DashboardController.techStartWork('${w.id}')"><i class="fas fa-play"></i> Start Work</button>` :
                                          w.status === 'IN PROGRESS' ? `<button class="btn btn-sm btn-success" style="background:var(--status-success); color:#000;" onclick="DashboardController.openTechCompleteModal('${w.id}')"><i class="fas fa-check"></i> Complete Work</button>` :
                                          `<span style="font-size:0.8rem; color:var(--status-success);"><i class="fas fa-check-double"></i> Finished</span>`}
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    techStartWork(woId) {
        store.updateWorkOrderStatus(woId, "IN PROGRESS");
        PlantPulseApp.showToast("✓ Work Started", `Work order ${woId} is now marked IN PROGRESS.`, "success");
    },

    openTechCompleteModal(woId) {
        const formHtml = `
            <form id="techCompleteForm">
                <div class="form-group" style="margin-bottom:1rem;">
                    <label class="form-label">Completion Notes / Work Action Taken <span class="required">*</span></label>
                    <textarea id="techNotesInput" class="form-control" placeholder="Describe repair performed, sensor recalibration, or seal kit replaced..." required></textarea>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Time Spent (Hours)</label>
                        <input type="number" step="0.5" id="techTimeInput" class="form-control" value="2.5">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Parts / Consumables Used</label>
                        <input type="text" id="techPartsInput" class="form-control" placeholder="e.g. Viton Seal 45mm x1">
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="DashboardController.submitTechComplete('${woId}')"><i class="fas fa-check-circle"></i> Submit Resolution</button>
        `;

        PlantPulseApp.openModal(`<i class="fas fa-clipboard-check"></i> Complete Work Order ${woId}`, formHtml, footerHtml);
    },

    submitTechComplete(woId) {
        const notes = document.getElementById("techNotesInput").value.trim();
        const time = document.getElementById("techTimeInput").value;
        const parts = document.getElementById("techPartsInput").value.trim();

        if (!notes) {
            PlantPulseApp.showToast("Validation Error", "Completion notes are required.", "danger");
            return;
        }

        store.updateWorkOrderStatus(woId, "RESOLVED", notes, time, parts);
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Work Order Resolved", `Work Order ${woId} marked RESOLVED. Supervisor notified.`, "success");
    },

    /* --- 3. SUPERVISOR OPERATIONS DASHBOARD --- */
    renderSupervisorDashboard(root, user) {
        const kpis = store.getKPIs();
        const workOrders = store.getWorkOrders();
        const openQueue = workOrders.filter(w => w.status === "OPEN" || w.status === "ASSIGNED");

        root.innerHTML = `
            <div class="page-header">
                <div class="page-title-group">
                    <h1>Maintenance Operations Center</h1>
                    <p class="page-subtitle">Welcome back, <strong>${user.name}</strong> (${user.role}). Assign work orders, monitor technician workload, and review overdue maintenance.</p>
                </div>
                <div class="page-actions">
                    <a href="pages/workorders.html" class="btn btn-primary"><i class="fas fa-tasks"></i> Work Orders Queue</a>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Pending Orders Queue</span><div class="kpi-icon amber"><i class="fas fa-list"></i></div></div>
                    <div class="kpi-value">${openQueue.length}</div>
                    <div class="kpi-footer"><span class="trend-neutral">Requires assignment</span></div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Active Alerts</span><div class="kpi-icon red"><i class="fas fa-bell"></i></div></div>
                    <div class="kpi-value">${kpis.activeAlerts}</div>
                    <div class="kpi-footer"><span class="trend-down">Critical machines</span></div>
                </div>
            </div>

            <div class="card" style="margin-top:1.5rem;">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-clipboard-check"></i> Unassigned / Open Work Orders</div>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Asset Machine</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Current Tech</th>
                                <th>Assign Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${openQueue.map(w => `
                                <tr>
                                    <td class="table-cell-code">${w.id}</td>
                                    <td class="table-cell-bold">${w.assetId}</td>
                                    <td>${w.issue}</td>
                                    <td><span class="badge ${w.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}">${w.priority}</span></td>
                                    <td>${w.technician || 'Unassigned'}</td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary" onclick="DashboardController.openAssignModal('${w.id}')"><i class="fas fa-user-plus"></i> Reassign</button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    openAssignModal(woId) {
        const technicians = store.getTechnicians();
        const options = technicians.map(t => `<option value="${t.name}">${t.name} (${t.specialization})</option>`).join("");

        const formHtml = `
            <div class="form-group">
                <label class="form-label">Assign Technician to ${woId}</label>
                <select id="assignTechSelect" class="select-control" style="width:100%;">
                    ${options}
                </select>
            </div>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="DashboardController.submitAssign('${woId}')">Assign Work Order</button>
        `;

        PlantPulseApp.openModal('<i class="fas fa-user-check"></i> Dispatch Work Order Assignment', formHtml, footerHtml);
    },

    submitAssign(woId) {
        const techName = document.getElementById("assignTechSelect").value;
        const wo = store.getWorkOrders().find(w => w.id === woId);
        if (wo) {
            wo.technician = techName;
            wo.status = "ASSIGNED";
            store.addActivity(`Supervisor reassigned Work Order ${woId} to ${techName}`);
            store.addNotification("technician", "Work Order Assigned", `${woId} assigned to you by Maintenance Supervisor`);
            PlantPulseApp.closeModal();
            PlantPulseApp.showToast("✓ Technician Assigned", `${woId} assigned to ${techName}.`, "success");
        }
    },

    /* --- 4. INVENTORY STORE MANAGER DASHBOARD --- */
    renderInventoryDashboard(root, user) {
        const kpis = store.getKPIs();
        const parts = store.getSpareParts();
        const lowStockList = parts.filter(p => store.calculateStockStatus(p.quantity, p.minStock) !== "NORMAL");
        const movements = store.getStockMovements().slice(0, 6);

        root.innerHTML = `
            <div class="page-header">
                <div class="page-title-group">
                    <h1>Stores & Spare Parts Operations</h1>
                    <p class="page-subtitle">Welcome back, <strong>${user.name}</strong> (${user.role}). Track consumable levels, restock alerts, and stock movements.</p>
                </div>
                <div class="page-actions">
                    <a href="pages/spareparts.html" class="btn btn-primary"><i class="fas fa-boxes-packing"></i> Spare Parts Catalog</a>
                </div>
            </div>

            <!-- Stores KPIs -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Total Catalog Parts</span><div class="kpi-icon blue"><i class="fas fa-boxes-stacked"></i></div></div>
                    <div class="kpi-value">${kpis.totalParts}</div>
                    <div class="kpi-footer"><span class="trend-neutral">Items tracked</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Low Stock Alert</span><div class="kpi-icon amber"><i class="fas fa-exclamation-triangle"></i></div></div>
                    <div class="kpi-value">${kpis.lowStockParts}</div>
                    <div class="kpi-footer"><span class="trend-down">Below min threshold</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Out of Stock</span><div class="kpi-icon red"><i class="fas fa-circle-xmark"></i></div></div>
                    <div class="kpi-value">${kpis.outOfStockParts}</div>
                    <div class="kpi-footer"><span class="trend-down">Depleted items</span></div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header"><span class="kpi-title">Total Valuation</span><div class="kpi-icon green"><i class="fas fa-indian-rupee-sign"></i></div></div>
                    <div class="kpi-value">${kpis.inventoryValue}</div>
                    <div class="kpi-footer"><span class="trend-up">Inventory asset</span></div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-top:1.5rem;" class="responsive-grid">
                <!-- Low Stock Alert Grid -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-triangle-exclamation" style="color:var(--status-warning);"></i> Low & Depleted Stock Items</div>
                    </div>
                    <div class="card-body">
                        ${lowStockList.length === 0 ? `<div style="text-align:center; color:var(--text-muted); padding:2rem;">All inventory items are above minimum safety thresholds.</div>` :
                          lowStockList.map(p => {
                              const status = store.calculateStockStatus(p.quantity, p.minStock);
                              return `
                                <div style="padding:0.75rem; background:var(--bg-dark); border:1px solid var(--border-color); border-radius:var(--radius-md); margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="font-weight:600;"><span class="table-cell-code">${p.id}</span> - ${p.name}</div>
                                        <div style="font-size:0.75rem; color:var(--text-muted);">Current: ${p.quantity} | Min Required: ${p.minStock}</div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:0.5rem;">
                                        <span class="badge ${status === 'OUT OF STOCK' ? 'badge-danger' : 'badge-warning'}">${status}</span>
                                        <button class="btn btn-sm btn-primary" onclick="DashboardController.quickRestock('${p.id}')">+ Restock</button>
                                    </div>
                                </div>
                              `;
                          }).join("")}
                    </div>
                </div>

                <!-- Recent Stock Movement History -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-right-left"></i> Recent Stock Movement History</div>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Part</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${movements.map(m => `
                                    <tr>
                                        <td>${m.partName}</td>
                                        <td><span class="badge ${m.type === 'IN' ? 'badge-success' : 'badge-warning'}">${m.type}</span></td>
                                        <td style="font-weight:700;">${m.qty}</td>
                                        <td style="font-size:0.8rem;">${m.user}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    quickRestock(partId) {
        store.updateSparePartQty(partId, 20, "IN");
        PlantPulseApp.showToast("✓ Inventory Restocked", `Restocked +20 units for part ${partId}.`, "success");
    },

    /* --- Helper Chart.js Renderer --- */
    renderLineChart() {
        const canvas = document.getElementById("healthTrendCanvas");
        if (!canvas || typeof Chart === "undefined") return;

        if (this.chartInstance) this.chartInstance.destroy();
        const ctx = canvas.getContext("2d");

        const c = typeof PlantPulseTheme !== "undefined" ? PlantPulseTheme.getChartColors() : {
            gridColor: "rgba(255, 255, 255, 0.08)",
            textColor: "#94a3b8",
            accentPrimary: "#00f2fe",
            tooltipBg: "#161e2e",
            tooltipText: "#ffffff"
        };

        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, c.isDark ? "rgba(0, 242, 254, 0.35)" : "rgba(2, 132, 199, 0.3)");
        gradient.addColorStop(1, c.isDark ? "rgba(0, 242, 254, 0.0)" : "rgba(2, 132, 199, 0.0)");

        this.chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"],
                datasets: [{
                    label: "Plant Health Score Index (%)",
                    data: [92, 90, 88, 89, 87, 85, 87],
                    borderColor: c.accentPrimary,
                    borderWidth: 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: c.accentPrimary,
                    pointHoverRadius: 6,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: c.tooltipBg,
                        titleColor: c.headingColor,
                        bodyColor: c.tooltipText,
                        borderColor: c.tooltipBorder,
                        borderWidth: 1
                    }
                },
                scales: {
                    y: { min: 60, max: 100, grid: { color: c.gridColor }, ticks: { color: c.textColor } },
                    x: { grid: { display: false }, ticks: { color: c.textColor } }
                }
            }
        });

        // Listen for live theme changes to update chart instantly
        if (!this._themeBound) {
            this._themeBound = true;
            window.addEventListener("plantpulse_theme_change", () => {
                if (document.getElementById("healthTrendCanvas")) {
                    this.renderLineChart();
                }
            });
        }
    }
};
