/* ==========================================================================
   PLANTPULSE - Spare Parts & Inventory Controller (Stage 1)
   Includes dynamic auto-calculation of stock status:
   (Qty > minStock = NORMAL, Qty <= minStock = LOW STOCK, Qty == 0 = OUT OF STOCK)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("sparePartsTbody")) {
        SparePartsController.init();
    }
});

const SparePartsController = {
    init() {
        this.renderTable();
        this.bindEvents();

        store.subscribe(() => {
            this.renderTable();
        });
    },

    bindEvents() {
        const searchInput = document.getElementById("partSearchInput");
        const statusFilter = document.getElementById("partStatusFilter");
        const addBtn = document.getElementById("addSparePartBtn");

        if (searchInput) searchInput.addEventListener("input", () => this.renderTable());
        if (statusFilter) statusFilter.addEventListener("change", () => this.renderTable());
        if (addBtn) addBtn.addEventListener("click", () => this.openAddModal());
    },

    getFilteredParts() {
        let parts = store.getSpareParts();
        const search = (document.getElementById("partSearchInput")?.value || "").toLowerCase().trim();
        const filter = document.getElementById("partStatusFilter")?.value || "ALL";

        return parts.filter(p => {
            const status = store.calculateStockStatus(p.quantity, p.minStock);
            const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
            const matchesStatus = filter === "ALL" || status === filter;
            return matchesSearch && matchesStatus;
        });
    },

    renderTable() {
        const tbody = document.getElementById("sparePartsTbody");
        if (!tbody) return;

        const parts = this.getFilteredParts();

        if (parts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:3rem;">No spare parts inventory matched your search.</td></tr>`;
            return;
        }

        let html = "";
        parts.forEach(p => {
            const stockStatus = store.calculateStockStatus(p.quantity, p.minStock);
            let badgeClass = "badge-success";
            if (stockStatus === "LOW STOCK") badgeClass = "badge-warning";
            if (stockStatus === "OUT OF STOCK") badgeClass = "badge-danger";

            html += `
                <tr>
                    <td class="table-cell-code">${p.id}</td>
                    <td class="table-cell-bold">${p.name}</td>
                    <td>${p.category}</td>
                    <td style="font-weight:700; font-size:1rem;">
                        ${p.quantity} 
                        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(Min: ${p.minStock})</span>
                    </td>
                    <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${stockStatus}</span></td>
                    <td style="font-family:var(--font-mono);">₹${p.unitCost ? p.unitCost.toLocaleString() : 0}</td>
                    <td>${p.supplier}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-secondary btn-icon" title="Add Stock (+5)" onclick="SparePartsController.adjustQty('${p.id}', 5)"><i class="fas fa-plus"></i></button>
                            <button class="btn btn-sm btn-secondary btn-icon" title="Consume Stock (-1)" onclick="SparePartsController.adjustQty('${p.id}', -1)"><i class="fas fa-minus"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    adjustQty(id, delta) {
        const updated = store.updateSparePartQty(id, delta);
        if (updated) {
            const status = store.calculateStockStatus(updated.quantity, updated.minStock);
            PlantPulseApp.showToast("✓ Inventory Adjusted", `${updated.name} quantity updated to ${updated.quantity} (${status}).`, status === "OUT OF STOCK" ? "danger" : "info");
        }
    },

    openAddModal() {
        const formHtml = `
            <form id="addPartForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Part ID <span class="required">*</span></label>
                        <input type="text" id="partIdInput" class="form-control" placeholder="e.g. PART-907" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Part Name <span class="required">*</span></label>
                        <input type="text" id="partNameInput" class="form-control" placeholder="e.g. O-Ring Gasket Kit 30mm" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select id="partCategoryInput" class="select-control" style="width:100%;">
                            <option value="Hydraulics">Hydraulics</option>
                            <option value="Lubricants">Lubricants</option>
                            <option value="Tooling">Tooling</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Pneumatics">Pneumatics</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Initial Quantity <span class="required">*</span></label>
                        <input type="number" id="partQtyInput" class="form-control" value="25" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Minimum Stock Level</label>
                        <input type="number" id="partMinInput" class="form-control" value="10">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Unit Cost (₹)</label>
                        <input type="number" id="partCostInput" class="form-control" value="1200">
                    </div>

                    <div class="form-group full-width">
                        <label class="form-label">Supplier Details</label>
                        <input type="text" id="partSupplierInput" class="form-control" placeholder="Supplier Company Name">
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SparePartsController.submitAddForm()"><i class="fas fa-box"></i> Add Spare Part</button>
        `;

        PlantPulseApp.openModal('<i class="fas fa-boxes-packing"></i> Register New Spare Part', formHtml, footerHtml);
    },

    submitAddForm() {
        const id = document.getElementById("partIdInput").value.trim();
        const name = document.getElementById("partNameInput").value.trim();
        const category = document.getElementById("partCategoryInput").value;
        const qty = parseInt(document.getElementById("partQtyInput").value) || 0;
        const minStock = parseInt(document.getElementById("partMinInput").value) || 5;
        const unitCost = parseInt(document.getElementById("partCostInput").value) || 0;
        const supplier = document.getElementById("partSupplierInput").value.trim() || "Industrial Distributor";

        if (!id || !name) {
            PlantPulseApp.showToast("Validation Error", "Part ID and Name are required.", "danger");
            return;
        }

        const newPart = {
            id,
            name,
            category,
            quantity: qty,
            minStock,
            unitCost,
            supplier
        };

        store.addSparePart(newPart);
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Part Added", `${name} added to inventory.`, "success");
    }
};
