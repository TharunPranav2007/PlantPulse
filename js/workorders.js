/* ==========================================================================
   PLANTPULSE - Work Order Controller (Stage 1)
   Manages Work Order Lifecycle (OPEN -> ASSIGNED -> IN PROGRESS -> RESOLVED -> CLOSED)
   with switchable Table View and Interactive Kanban Board View.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("workordersContainer")) {
        WorkOrdersController.init();
    }
});

const WorkOrdersController = {
    currentView: "kanban", // "table" or "kanban"

    init() {
        this.render();
        this.bindEvents();

        store.subscribe(() => {
            this.render();
        });
    },

    bindEvents() {
        const viewTableBtn = document.getElementById("viewTableBtn");
        const viewKanbanBtn = document.getElementById("viewKanbanBtn");
        const searchInput = document.getElementById("woSearchInput");
        const statusFilter = document.getElementById("woStatusFilter");
        const addBtn = document.getElementById("addWorkOrderBtn");

        if (viewTableBtn) {
            viewTableBtn.addEventListener("click", () => {
                this.currentView = "table";
                viewTableBtn.classList.add("active");
                if (viewKanbanBtn) viewKanbanBtn.classList.remove("active");
                this.render();
            });
        }

        if (viewKanbanBtn) {
            viewKanbanBtn.addEventListener("click", () => {
                this.currentView = "kanban";
                viewKanbanBtn.classList.add("active");
                if (viewTableBtn) viewTableBtn.classList.remove("active");
                this.render();
            });
        }

        if (searchInput) searchInput.addEventListener("input", () => this.render());
        if (statusFilter) statusFilter.addEventListener("change", () => this.render());

        if (addBtn) {
            addBtn.addEventListener("click", () => this.openAddModal());
        }
    },

    getFilteredWorkOrders() {
        let list = store.getWorkOrders();
        const search = (document.getElementById("woSearchInput")?.value || "").toLowerCase().trim();
        const status = document.getElementById("woStatusFilter")?.value || "ALL";

        return list.filter(w => {
            const matchesSearch = !search || w.id.toLowerCase().includes(search) || w.issue.toLowerCase().includes(search) || w.technician.toLowerCase().includes(search) || w.assetId.toLowerCase().includes(search);
            const matchesStatus = status === "ALL" || w.status === status;
            return matchesSearch && matchesStatus;
        });
    },

    render() {
        const container = document.getElementById("workordersContainer");
        if (!container) return;

        if (this.currentView === "kanban") {
            this.renderKanban(container);
        } else {
            this.renderTable(container);
        }
    },

    /* --- Kanban Board Rendering --- */
    renderKanban(container) {
        const workOrders = this.getFilteredWorkOrders();
        const statuses = ["OPEN", "ASSIGNED", "IN PROGRESS", "RESOLVED", "CLOSED"];
        
        let html = `<div class="kanban-board">`;

        statuses.forEach(status => {
            const cardsInStatus = workOrders.filter(w => w.status === status);
            let statusColor = "var(--text-muted)";
            if (status === "OPEN") statusColor = "var(--status-danger)";
            if (status === "ASSIGNED") statusColor = "var(--status-warning)";
            if (status === "IN PROGRESS") statusColor = "var(--status-info)";
            if (status === "RESOLVED") statusColor = "var(--status-purple)";
            if (status === "CLOSED") statusColor = "var(--status-success)";

            html += `
                <div class="kanban-column">
                    <div class="kanban-header">
                        <div class="kanban-title" style="color:${statusColor};">
                            <i class="fas fa-circle" style="font-size:0.6rem;"></i> ${status}
                        </div>
                        <span class="kanban-count">${cardsInStatus.length}</span>
                    </div>
                    <div class="kanban-cards">
            `;

            if (cardsInStatus.length === 0) {
                html += `<div style="text-align:center; color:var(--text-muted); padding:1.5rem; font-size:0.8rem; border:1px dashed var(--border-color); border-radius:var(--radius-md);">No orders in ${status}</div>`;
            } else {
                cardsInStatus.forEach(w => {
                    let priorityBadge = "badge-secondary";
                    if (w.priority === "Critical") priorityBadge = "badge-danger";
                    if (w.priority === "High") priorityBadge = "badge-warning";

                    html += `
                        <div class="kanban-card">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                                <span class="table-cell-code">${w.id}</span>
                                <span class="badge ${priorityBadge}">${w.priority}</span>
                            </div>
                            <div class="kanban-card-title">${w.issue}</div>
                            <div style="font-size:0.78rem; color:var(--text-muted);"><i class="fas fa-microchip"></i> Asset: <strong style="color:var(--text-primary);">${w.assetId}</strong></div>
                            <div class="kanban-card-meta">
                                <span><i class="fas fa-user"></i> ${w.technician}</span>
                                <div>
                                    ${this.getNextStatusButtons(w)}
                                </div>
                            </div>
                        </div>
                    `;
                });
            }

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    },

    getNextStatusButtons(wo) {
        const flow = ["OPEN", "ASSIGNED", "IN PROGRESS", "RESOLVED", "CLOSED"];
        const currentIndex = flow.indexOf(wo.status);
        let btns = "";

        if (currentIndex < flow.length - 1) {
            const nextStatus = flow[currentIndex + 1];
            btns += `<button class="btn btn-sm btn-secondary" style="font-size:0.7rem; padding:2px 6px;" title="Advance to ${nextStatus}" onclick="WorkOrdersController.changeStatus('${wo.id}', '${nextStatus}')">Move →</button>`;
        }
        return btns;
    },

    /* --- Table View Rendering --- */
    renderTable(container) {
        const workOrders = this.getFilteredWorkOrders();

        let html = `
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Work Order ID</th>
                                <th>Machine / Asset</th>
                                <th>Issue / Description</th>
                                <th>Priority</th>
                                <th>Assigned Tech</th>
                                <th>Date Created</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        if (workOrders.length === 0) {
            html += `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:3rem;">No work orders found.</td></tr>`;
        } else {
            workOrders.forEach(w => {
                let statusBadge = "badge-secondary";
                if (w.status === "CLOSED") statusBadge = "badge-success";
                if (w.status === "IN PROGRESS") statusBadge = "badge-warning";
                if (w.status === "OPEN") statusBadge = "badge-danger";

                html += `
                    <tr>
                        <td class="table-cell-code">${w.id}</td>
                        <td class="table-cell-bold">${w.assetId}</td>
                        <td>${w.issue}</td>
                        <td><span class="badge badge-secondary">${w.priority}</span></td>
                        <td>${w.technician}</td>
                        <td>${w.createdDate}</td>
                        <td><span class="badge ${statusBadge}">${w.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="WorkOrdersController.openStatusChangeModal('${w.id}')">Update Status</button>
                        </td>
                    </tr>
                `;
            });
        }

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    changeStatus(id, newStatus) {
        store.updateWorkOrderStatus(id, newStatus);
        PlantPulseApp.showToast("✓ Status Updated", `Work Order ${id} advanced to ${newStatus}.`, "success");
    },

    openStatusChangeModal(id) {
        const wo = store.getWorkOrders().find(w => w.id === id);
        if (!wo) return;

        const formHtml = `
            <div style="font-size:0.9rem; margin-bottom:1rem;">Change Status for <strong>${wo.id}</strong>:</div>
            <select id="selectWoStatus" class="select-control" style="width:100%;">
                <option value="OPEN" ${wo.status === 'OPEN' ? 'selected' : ''}>OPEN</option>
                <option value="ASSIGNED" ${wo.status === 'ASSIGNED' ? 'selected' : ''}>ASSIGNED</option>
                <option value="IN PROGRESS" ${wo.status === 'IN PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
                <option value="RESOLVED" ${wo.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
                <option value="CLOSED" ${wo.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
            </select>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="WorkOrdersController.saveStatusModal('${wo.id}')">Save Status</button>
        `;

        PlantPulseApp.openModal(`<i class="fas fa-tasks"></i> Work Order Lifecycle Transition`, formHtml, footerHtml);
    },

    saveStatusModal(id) {
        const val = document.getElementById("selectWoStatus").value;
        this.changeStatus(id, val);
        PlantPulseApp.closeModal();
    },

    openAddModal() {
        const assets = store.getAssets();
        const assetOptions = assets.map(a => `<option value="${a.id}">${a.id} - ${a.name}</option>`).join("");
        const technicians = store.getTechnicians();
        const techOptions = technicians.map(t => `<option value="${t.name}">${t.name}</option>`).join("");

        const formHtml = `
            <form id="addWoForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Asset Machine <span class="required">*</span></label>
                        <select id="woAssetInput" class="select-control" style="width:100%;">
                            ${assetOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Issue Summary <span class="required">*</span></label>
                        <input type="text" id="woIssueInput" class="form-control" placeholder="e.g. Hydraulic leakage in main cylinder" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Assign Technician</label>
                        <select id="woTechInput" class="select-control" style="width:100%;">
                            ${techOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Priority</label>
                        <select id="woPriorityInput" class="select-control" style="width:100%;">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label class="form-label">Detailed Description</label>
                        <textarea id="woDescInput" class="form-control" placeholder="Telemetry readings, observed fault symptoms..."></textarea>
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="WorkOrdersController.submitAddForm()"><i class="fas fa-plus"></i> Create Work Order</button>
        `;

        PlantPulseApp.openModal('<i class="fas fa-file-signature"></i> Dispatch New Work Order', formHtml, footerHtml);
    },

    submitAddForm() {
        const assetId = document.getElementById("woAssetInput").value;
        const issue = document.getElementById("woIssueInput").value.trim();
        const tech = document.getElementById("woTechInput").value;
        const priority = document.getElementById("woPriorityInput").value;
        const desc = document.getElementById("woDescInput").value.trim();

        if (!issue) {
            PlantPulseApp.showToast("Validation Error", "Issue summary is required.", "danger");
            return;
        }

        const wo = {
            assetId,
            issue,
            technician: tech,
            priority,
            status: "OPEN",
            description: desc || "Work order generated from shop floor alert."
        };

        store.addWorkOrder(wo);
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Work Order Created", `Work Order for ${assetId} dispatched.`, "success");
    }
};
