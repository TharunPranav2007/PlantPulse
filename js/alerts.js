/* ==========================================================================
   PLANTPULSE - Alert Center Controller (Stage 1)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("alertCenterList")) {
        AlertsController.init();
    }
});

const AlertsController = {
    init() {
        this.render();
        this.bindEvents();
        store.subscribe(() => this.render());
    },

    bindEvents() {
        const severityFilter = document.getElementById("alertSeverityFilter");
        if (severityFilter) severityFilter.addEventListener("change", () => this.render());
    },

    render() {
        const container = document.getElementById("alertCenterList");
        if (!container) return;

        const severity = document.getElementById("alertSeverityFilter")?.value || "ALL";
        let alerts = store.getAlerts();

        if (severity !== "ALL") {
            alerts = alerts.filter(a => a.severity === severity);
        }

        if (alerts.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:3rem;">No notifications or alerts matched criteria.</div>`;
            return;
        }

        let html = "";
        alerts.forEach(a => {
            let badgeClass = "badge-info";
            let iconClass = "fa-circle-info";
            if (a.severity === "CRITICAL") { badgeClass = "badge-danger"; iconClass = "fa-triangle-exclamation"; }
            if (a.severity === "WARNING") { badgeClass = "badge-warning"; iconClass = "fa-circle-exclamation"; }

            html += `
                <div class="card" style="padding:1.25rem; margin-bottom:1rem; opacity:${a.read ? '0.75' : '1'};">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                        <div style="display:flex; align-items:center; gap:0.6rem;">
                            <span class="badge ${badgeClass}"><span class="badge-dot"></span>${a.severity}</span>
                            <span class="table-cell-code">${a.assetId}</span>
                        </div>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${a.timestamp}</span>
                    </div>

                    <h4 style="font-size:1.05rem; margin-bottom:0.4rem;">${a.title}</h4>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">${a.description}</p>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem;">
                        <div>
                            ${!a.read ? `<button class="btn btn-sm btn-secondary" onclick="AlertsController.markRead('${a.id}')"><i class="fas fa-check"></i> Mark Read</button>` : `<span style="font-size:0.75rem; color:var(--status-success);"><i class="fas fa-check-double"></i> Read</span>`}
                        </div>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn btn-sm btn-primary" onclick="AlertsController.createWorkOrder('${a.assetId}', '${a.title}')"><i class="fas fa-wrench"></i> Create Work Order</button>
                            <button class="btn btn-sm btn-danger btn-icon" onclick="AlertsController.dismiss('${a.id}')" title="Dismiss Alert"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    markRead(id) {
        store.markAlertRead(id);
        PlantPulseApp.showToast("Alert Read", "Alert marked as reviewed.", "info");
    },

    dismiss(id) {
        store.dismissAlert(id);
        PlantPulseApp.showToast("Alert Dismissed", "Alert notification removed.", "warning");
    },

    createWorkOrder(assetId, title) {
        store.addWorkOrder({
            assetId: assetId,
            issue: title,
            technician: "Arun Kumar",
            priority: "High",
            status: "OPEN",
            description: "Work order created directly from critical telemetry alert notification."
        });

        PlantPulseApp.showToast("✓ Work Order Created", `Work Order generated for asset ${assetId}.`, "success");
    }
};
