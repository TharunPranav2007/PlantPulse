/* ==========================================================================
   PLANTPULSE - Dashboard Page Controller
   Stage 1: Dynamic Dashboard UI, KPI render, Machine Health Cards,
   Chart.js Health Trend Chart, Alerts & Maintenance Summaries.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("dashboardKPIContainer")) {
        DashboardController.init();
    }
});

const DashboardController = {
    chartInstance: null,

    init() {
        this.renderKPIs();
        this.renderMachineHealthGrid();
        this.renderHealthChart("7d");
        this.renderRecentMaintenance();
        this.renderCriticalAlerts();

        // Subscribe to store updates
        store.subscribe(() => {
            this.renderKPIs();
            this.renderMachineHealthGrid();
            this.renderRecentMaintenance();
            this.renderCriticalAlerts();
        });

        // Period filter event for chart
        const periodSelect = document.getElementById("chartPeriodSelect");
        if (periodSelect) {
            periodSelect.addEventListener("change", (e) => {
                this.renderHealthChart(e.target.value);
            });
        }
    },

    /* --- Render 6 Main KPI Cards --- */
    renderKPIs() {
        const kpis = store.getKPIs();
        const container = document.getElementById("dashboardKPIContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Total Assets</span>
                    <div class="kpi-icon blue"><i class="fas fa-microchip"></i></div>
                </div>
                <div class="kpi-value">${kpis.totalAssets}</div>
                <div class="kpi-footer">
                    <span class="trend-up"><i class="fas fa-arrow-up"></i> +6.2%</span>
                    <span class="kpi-subtext">vs last month</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Operational</span>
                    <div class="kpi-icon green"><i class="fas fa-circle-check"></i></div>
                </div>
                <div class="kpi-value">${kpis.operationalAssets}</div>
                <div class="kpi-footer">
                    <span class="trend-up"><i class="fas fa-check"></i> 88.5% uptime</span>
                    <span class="kpi-subtext">current rate</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Active Alerts</span>
                    <div class="kpi-icon red"><i class="fas fa-bell"></i></div>
                </div>
                <div class="kpi-value">${kpis.activeAlerts}</div>
                <div class="kpi-footer">
                    <span class="trend-down"><i class="fas fa-exclamation-triangle"></i> Action req.</span>
                    <span class="kpi-subtext">requires review</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Open Work Orders</span>
                    <div class="kpi-icon amber"><i class="fas fa-clipboard-list"></i></div>
                </div>
                <div class="kpi-value">${kpis.openWorkOrders}</div>
                <div class="kpi-footer">
                    <span class="trend-neutral"><i class="fas fa-user-clock"></i> Assigned</span>
                    <span class="kpi-subtext">to technicians</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Maintenance Cost</span>
                    <div class="kpi-icon purple"><i class="fas fa-indian-rupee-sign"></i></div>
                </div>
                <div class="kpi-value">${kpis.totalMaintenanceCost}</div>
                <div class="kpi-footer">
                    <span class="trend-down"><i class="fas fa-arrow-down"></i> -4.1%</span>
                    <span class="kpi-subtext">under budget</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Avg Machine Health</span>
                    <div class="kpi-icon green"><i class="fas fa-heart-pulse"></i></div>
                </div>
                <div class="kpi-value">${kpis.averageHealth}</div>
                <div class="kpi-footer">
                    <span class="trend-up"><i class="fas fa-shield-halved"></i> Optimal</span>
                    <span class="kpi-subtext">fleet score</span>
                </div>
            </div>
        `;
    },

    /* --- Render Machine Health Section --- */
    renderMachineHealthGrid() {
        const container = document.getElementById("dashboardHealthGrid");
        if (!container) return;

        const assets = store.getAssets().slice(0, 4); // Display top 4 machines

        let html = "";
        assets.forEach(asset => {
            const health = asset.health;
            let statusClass = "healthy";
            let statusBadge = "badge-success";
            
            if (health < 70) {
                statusClass = "critical";
                statusBadge = "badge-danger";
            } else if (health < 90) {
                statusClass = "warning";
                statusBadge = "badge-warning";
            }

            html += `
                <div class="card" style="padding:1.25rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                        <div>
                            <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-primary); font-weight:700;">${asset.id}</div>
                            <h4 style="font-size:1rem; margin-top:2px;">${asset.name}</h4>
                        </div>
                        <span class="badge ${statusBadge}"><span class="badge-dot"></span>${asset.status}</span>
                    </div>

                    <div style="margin:1rem 0;">
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">
                            <span>Health Score</span>
                            <span style="font-weight:700; color:var(--text-primary);">${health}%</span>
                        </div>
                        <div class="health-bar-track">
                            <div class="health-bar-fill ${statusClass}" style="width: ${health}%;"></div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.8rem; border-top:1px solid var(--border-color); padding-top:0.75rem; margin-top:0.75rem;">
                        <div>
                            <span style="color:var(--text-muted);">Temperature:</span>
                            <div style="font-weight:600; color:var(--text-primary);"><i class="fas fa-temperature-high" style="color:var(--status-warning);"></i> ${asset.temperature}°C</div>
                        </div>
                        <div>
                            <span style="color:var(--text-muted);">Vibration:</span>
                            <div style="font-weight:600; color:var(--text-primary);"><i class="fas fa-wave-square" style="color:var(--status-info);"></i> ${asset.vibration} mm/s</div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /* --- Machine Health Trend Chart --- */
    renderHealthChart(period) {
        const canvas = document.getElementById("healthTrendCanvas");
        if (!canvas) return;

        let labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"];
        let dataPoints = [92, 90, 88, 89, 87, 85, 87];

        if (period === "30d") {
            labels = ["W1", "W2", "W3", "W4"];
            dataPoints = [94, 91, 88, 87];
        } else if (period === "90d") {
            labels = ["Month 1", "Month 2", "Month 3"];
            dataPoints = [95, 90, 87];
        }

        if (typeof Chart !== "undefined") {
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, "rgba(0, 242, 254, 0.35)");
            gradient.addColorStop(1, "rgba(0, 242, 254, 0.0)");

            this.chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Average Machine Health Index (%)",
                        data: dataPoints,
                        borderColor: "#00f2fe",
                        borderWidth: 3,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: "#00f2fe",
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            min: 60,
                            max: 100,
                            grid: { color: "rgba(255, 255, 255, 0.05)" },
                            ticks: { color: "#94a3b8" }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: "#94a3b8" }
                        }
                    }
                }
            });
        }
    },

    /* --- Render Upcoming Maintenance Table --- */
    renderRecentMaintenance() {
        const tbody = document.getElementById("dashboardMaintTbody");
        if (!tbody) return;

        const records = store.getMaintenance().slice(0, 5);

        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">No upcoming maintenance schedules recorded.</td></tr>`;
            return;
        }

        let html = "";
        records.forEach(r => {
            const asset = store.getAssetById(r.assetId);
            const machineName = asset ? asset.name : r.assetId;
            let statusBadge = "badge-secondary";
            if (r.status === "Completed") statusBadge = "badge-success";
            if (r.status === "In Progress") statusBadge = "badge-warning";
            if (r.status === "Overdue") statusBadge = "badge-danger";
            if (r.status === "Scheduled") statusBadge = "badge-info";

            html += `
                <tr>
                    <td>
                        <span class="table-cell-bold">${r.assetId}</span>
                        <div style="font-size:0.78rem; color:var(--text-muted);">${machineName}</div>
                    </td>
                    <td>${r.type}</td>
                    <td>${r.technician}</td>
                    <td>${r.scheduledDate}</td>
                    <td><span class="badge badge-secondary">${r.priority}</span></td>
                    <td><span class="badge ${statusBadge}"><span class="badge-dot"></span>${r.status}</span></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    /* --- Render Critical Alerts Panel --- */
    renderCriticalAlerts() {
        const container = document.getElementById("dashboardAlertsList");
        if (!container) return;

        const alerts = store.getAlerts().slice(0, 4);

        if (alerts.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">No active critical alerts. Operational status normal.</div>`;
            return;
        }

        let html = "";
        alerts.forEach(a => {
            let badgeClass = "badge-info";
            let iconClass = "fa-circle-info";
            if (a.severity === "CRITICAL") { badgeClass = "badge-danger"; iconClass = "fa-triangle-exclamation"; }
            if (a.severity === "WARNING") { badgeClass = "badge-warning"; iconClass = "fa-circle-exclamation"; }

            html += `
                <div style="padding:0.9rem; background:var(--bg-dark); border:1px solid var(--border-color); border-radius:var(--radius-md); margin-bottom:0.75rem; display:flex; gap:0.75rem; align-items:flex-start;">
                    <i class="fas ${iconClass}" style="margin-top:3px;" class="${badgeClass}"></i>
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="badge ${badgeClass}">${a.severity}</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${a.timestamp}</span>
                        </div>
                        <div style="font-weight:600; margin-top:4px; font-size:0.875rem;">${a.title}</div>
                        <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">Machine: <span class="table-cell-code">${a.assetId}</span> - ${a.description}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};
