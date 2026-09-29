/* ==========================================================================
   PLANTPULSE - Maintenance Management Controller (Stage 1)
   Manages Maintenance schedules, CRUD operations, filters, priority tagging.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("maintTableBody")) {
        MaintenanceController.init();
    }
});

const MaintenanceController = {
    init() {
        this.renderTable();
        this.bindEvents();

        store.subscribe(() => {
            this.renderTable();
        });
    },

    bindEvents() {
        const searchInput = document.getElementById("maintSearchInput");
        const typeFilter = document.getElementById("maintTypeFilter");
        const statusFilter = document.getElementById("maintStatusFilter");
        const addBtn = document.getElementById("addMaintBtn");

        if (searchInput) searchInput.addEventListener("input", () => this.renderTable());
        if (typeFilter) typeFilter.addEventListener("change", () => this.renderTable());
        if (statusFilter) statusFilter.addEventListener("change", () => this.renderTable());

        if (addBtn) {
            addBtn.addEventListener("click", () => this.openAddModal());
        }
    },

    getFilteredRecords() {
        let records = store.getMaintenance();
        const search = (document.getElementById("maintSearchInput")?.value || "").toLowerCase().trim();
        const type = document.getElementById("maintTypeFilter")?.value || "ALL";
        const status = document.getElementById("maintStatusFilter")?.value || "ALL";

        return records.filter(r => {
            const matchesSearch = !search || r.id.toLowerCase().includes(search) || r.assetId.toLowerCase().includes(search) || r.technician.toLowerCase().includes(search);
            const matchesType = type === "ALL" || r.type === type;
            const matchesStatus = status === "ALL" || r.status === status;
            return matchesSearch && matchesType && matchesStatus;
        });
    },

    renderTable() {
        const tbody = document.getElementById("maintTableBody");
        if (!tbody) return;

        const records = this.getFilteredRecords();

        if (records.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; color:var(--text-muted); padding:3rem;">
                        <i class="fas fa-screwdriver-wrench" style="font-size:2rem; margin-bottom:0.75rem; color:var(--border-color-light);"></i>
                        <div>No maintenance records found. Try adjusting your filter parameters.</div>
                    </td>
                </tr>
            `;
            return;
        }

        let html = "";
        records.forEach(r => {
            let statusBadge = "badge-secondary";
            if (r.status === "Completed") statusBadge = "badge-success";
            if (r.status === "In Progress") statusBadge = "badge-warning";
            if (r.status === "Overdue") statusBadge = "badge-danger";
            if (r.status === "Scheduled") statusBadge = "badge-info";

            html += `
                <tr>
                    <td class="table-cell-code">${r.id}</td>
                    <td class="table-cell-bold">${r.assetId}</td>
                    <td>${r.type}</td>
                    <td>${r.technician}</td>
                    <td>${r.scheduledDate}</td>
                    <td><span class="badge badge-secondary">${r.priority}</span></td>
                    <td style="font-family:var(--font-mono);">₹${r.cost ? r.cost.toLocaleString() : 0}</td>
                    <td><span class="badge ${statusBadge}"><span class="badge-dot"></span>${r.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-secondary btn-icon" title="Edit Schedule" onclick="MaintenanceController.openEditModal('${r.id}')"><i class="fas fa-pen"></i></button>
                            <button class="btn btn-sm btn-danger btn-icon" title="Delete Schedule" onclick="MaintenanceController.confirmDelete('${r.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    openAddModal() {
        const assets = store.getAssets();
        const assetOptions = assets.map(a => `<option value="${a.id}">${a.id} - ${a.name}</option>`).join("");
        const technicians = store.getTechnicians();
        const techOptions = technicians.map(t => `<option value="${t.name}">${t.name} (${t.specialization})</option>`).join("");

        const formHtml = `
            <form id="addMaintForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Select Equipment/Asset <span class="required">*</span></label>
                        <select id="maintAssetInput" class="select-control" style="width:100%;">
                            ${assetOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Maintenance Type <span class="required">*</span></label>
                        <select id="maintTypeInput" class="select-control" style="width:100%;">
                            <option value="Preventive">Preventive</option>
                            <option value="Corrective">Corrective</option>
                            <option value="Predictive">Predictive</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Assigned Technician</label>
                        <select id="maintTechInput" class="select-control" style="width:100%;">
                            ${techOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Scheduled Date</label>
                        <input type="date" id="maintDateInput" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Priority</label>
                        <select id="maintPriorityInput" class="select-control" style="width:100%;">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Estimated Cost (₹)</label>
                        <input type="number" id="maintCostInput" class="form-control" value="15000">
                    </div>

                    <div class="form-group full-width">
                        <label class="form-label">Maintenance Notes & Instructions</label>
                        <textarea id="maintNotesInput" class="form-control" placeholder="Specify tasks, components to lubricate/replace..."></textarea>
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="MaintenanceController.submitAddForm()"><i class="fas fa-calendar-check"></i> Schedule Maintenance</button>
        `;

        PlantPulseApp.openModal('<i class="fas fa-calendar-plus"></i> Schedule Maintenance Event', formHtml, footerHtml);
    },

    submitAddForm() {
        const assetId = document.getElementById("maintAssetInput").value;
        const type = document.getElementById("maintTypeInput").value;
        const tech = document.getElementById("maintTechInput").value;
        const date = document.getElementById("maintDateInput").value;
        const priority = document.getElementById("maintPriorityInput").value;
        const cost = parseInt(document.getElementById("maintCostInput").value) || 0;
        const notes = document.getElementById("maintNotesInput").value;

        const newMaint = {
            assetId,
            type,
            technician: tech,
            scheduledDate: date,
            priority,
            status: "Scheduled",
            cost,
            notes
        };

        store.addMaintenance(newMaint);
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Maintenance Scheduled", `New ${type} maintenance event scheduled for ${assetId}.`, "success");
    },

    openEditModal(id) {
        const rec = store.getMaintenance().find(m => m.id === id);
        if (!rec) return;

        const formHtml = `
            <form id="editMaintForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Maintenance ID</label>
                        <input type="text" value="${rec.id}" class="form-control" disabled>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="editMaintStatusInput" class="select-control" style="width:100%;">
                            <option value="Scheduled" ${rec.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                            <option value="In Progress" ${rec.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${rec.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Overdue" ${rec.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Cost (₹)</label>
                        <input type="number" id="editMaintCostInput" class="form-control" value="${rec.cost}">
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="MaintenanceController.submitEditForm('${rec.id}')">Update Status</button>
        `;

        PlantPulseApp.openModal(`<i class="fas fa-edit"></i> Update Maintenance Record`, formHtml, footerHtml);
    },

    submitEditForm(id) {
        const status = document.getElementById("editMaintStatusInput").value;
        const cost = parseInt(document.getElementById("editMaintCostInput").value) || 0;

        store.updateMaintenance(id, { status, cost });
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Record Updated", `Maintenance ${id} updated to ${status}.`, "success");
    },

    confirmDelete(id) {
        PlantPulseApp.confirmAction(
            "Delete Maintenance Record?",
            `Are you sure you want to remove maintenance schedule <strong>${id}</strong>?`,
            "Delete",
            () => {
                store.deleteMaintenance(id);
                PlantPulseApp.showToast("✓ Schedule Removed", `Maintenance ${id} has been deleted.`, "warning");
            }
        );
    }
};
