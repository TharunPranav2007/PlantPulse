/* ==========================================================================
   PLANTPULSE - Asset Management Controller (Stage 1)
   Provides full client-side CRUD (Add, Edit, Delete, View Detail)
   along with search, filter by unit/type/status, and sort capabilities.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("assetsTableBody")) {
        AssetsController.init();
    }
});

const AssetsController = {
    init() {
        this.renderTable();
        this.bindEvents();

        // Subscribe to store changes
        store.subscribe(() => {
            this.renderTable();
        });
    },

    bindEvents() {
        const searchInput = document.getElementById("assetSearchInput");
        const typeFilter = document.getElementById("assetTypeFilter");
        const statusFilter = document.getElementById("assetStatusFilter");
        const sortSelect = document.getElementById("assetSortSelect");
        const addBtn = document.getElementById("addAssetBtn");

        if (searchInput) searchInput.addEventListener("input", () => this.renderTable());
        if (typeFilter) typeFilter.addEventListener("change", () => this.renderTable());
        if (statusFilter) statusFilter.addEventListener("change", () => this.renderTable());
        if (sortSelect) sortSelect.addEventListener("change", () => this.renderTable());

        if (addBtn) {
            addBtn.addEventListener("click", () => this.openAddModal());
        }
    },

    getFilteredAssets() {
        let assets = store.getAssets();

        const search = (document.getElementById("assetSearchInput")?.value || "").toLowerCase().trim();
        const type = document.getElementById("assetTypeFilter")?.value || "ALL";
        const status = document.getElementById("assetStatusFilter")?.value || "ALL";
        const sort = document.getElementById("assetSortSelect")?.value || "id_asc";

        // Filter
        assets = assets.filter(a => {
            const matchesSearch = !search || a.name.toLowerCase().includes(search) || a.id.toLowerCase().includes(search) || a.manufacturer.toLowerCase().includes(search);
            const matchesType = type === "ALL" || a.type === type;
            const matchesStatus = status === "ALL" || a.status === status;
            return matchesSearch && matchesType && matchesStatus;
        });

        // Sort
        assets.sort((a, b) => {
            if (sort === "name_asc") return a.name.localeCompare(b.name);
            if (sort === "health_desc") return b.health - a.health;
            if (sort === "health_asc") return a.health - b.health;
            if (sort === "hours_desc") return b.hours - a.hours;
            return a.id.localeCompare(b.id);
        });

        return assets;
    },

    renderTable() {
        const tbody = document.getElementById("assetsTableBody");
        if (!tbody) return;

        const assets = this.getFilteredAssets();

        if (assets.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; color:var(--text-muted); padding:3rem;">
                        <i class="fas fa-boxes-stacked" style="font-size:2rem; margin-bottom:0.75rem; color:var(--border-color-light);"></i>
                        <div>No industrial assets match your criteria.</div>
                    </td>
                </tr>
            `;
            return;
        }

        let html = "";
        assets.forEach(a => {
            let statusBadge = "badge-success";
            let healthClass = "healthy";

            if (a.status === "Critical") { statusBadge = "badge-danger"; healthClass = "critical"; }
            else if (a.status === "Maintenance") { statusBadge = "badge-warning"; healthClass = "warning"; }

            if (a.health < 70) healthClass = "critical";
            else if (a.health < 90) healthClass = "warning";

            html += `
                <tr>
                    <td class="table-cell-code">${a.id}</td>
                    <td>
                        <span class="table-cell-bold">${a.name}</span>
                        <div style="font-size:0.78rem; color:var(--text-muted);">${a.manufacturer} ${a.model}</div>
                    </td>
                    <td>${a.type}</td>
                    <td>${a.unit}</td>
                    <td><span class="badge ${statusBadge}"><span class="badge-dot"></span>${a.status}</span></td>
                    <td style="min-width:140px;">
                        <div class="health-bar-wrapper">
                            <div class="health-bar-track">
                                <div class="health-bar-fill ${healthClass}" style="width:${a.health}%;"></div>
                            </div>
                            <span class="health-score-val">${a.health}%</span>
                        </div>
                    </td>
                    <td>${a.lastMaintenance}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-secondary btn-icon" title="View Asset Details" onclick="AssetsController.viewDetails('${a.id}')"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-sm btn-secondary btn-icon" title="Edit Asset" onclick="AssetsController.openEditModal('${a.id}')"><i class="fas fa-pen"></i></button>
                            <button class="btn btn-sm btn-danger btn-icon" title="Delete Asset" onclick="AssetsController.confirmDelete('${a.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    /* --- Add Asset Modal & Validation --- */
    openAddModal() {
        const formHtml = `
            <form id="addAssetForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Asset ID <span class="required">*</span></label>
                        <input type="text" id="assetIdInput" class="form-control" placeholder="e.g. CNC-002" required>
                        <span class="error-message" id="err-id">Asset ID is required & must be unique.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Asset Name <span class="required">*</span></label>
                        <input type="text" id="assetNameInput" class="form-control" placeholder="e.g. CNC Lathe Machine" required>
                        <span class="error-message" id="err-name">Asset name is required.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Machine Type <span class="required">*</span></label>
                        <select id="assetTypeInput" class="select-control" style="width:100%;">
                            <option value="Milling">Milling</option>
                            <option value="Turning">Turning</option>
                            <option value="Robotics">Robotics</option>
                            <option value="Stamping">Stamping</option>
                            <option value="Compressors">Compressors</option>
                            <option value="Pumps">Pumps</option>
                            <option value="Thermodynamics">Thermodynamics</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Manufacturer</label>
                        <input type="text" id="assetMfrInput" class="form-control" placeholder="e.g. Haas / KUKA">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Model Number</label>
                        <input type="text" id="assetModelInput" class="form-control" placeholder="e.g. VF-4SS">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Production Unit <span class="required">*</span></label>
                        <input type="text" id="assetUnitInput" class="form-control" placeholder="e.g. Machining Bay A" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Vibration Level (mm/s)</label>
                        <input type="number" step="0.1" id="assetVibInput" class="form-control" value="3.5">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Operating Temperature (°C)</label>
                        <input type="number" id="assetTempInput" class="form-control" value="65">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Operating Hours</label>
                        <input type="number" id="assetHoursInput" class="form-control" value="1200">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="assetStatusInput" class="select-control" style="width:100%;">
                            <option value="Operational">Operational</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label class="form-label">Asset Description</label>
                        <textarea id="assetDescInput" class="form-control" placeholder="Detailed technical specification..."></textarea>
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AssetsController.submitAddForm()"><i class="fas fa-plus"></i> Save Asset</button>
        `;

        PlantPulseApp.openModal('<i class="fas fa-plus-circle"></i> Add New Industrial Asset', formHtml, footerHtml);
    },

    submitAddForm() {
        const id = document.getElementById("assetIdInput").value.trim();
        const name = document.getElementById("assetNameInput").value.trim();
        const type = document.getElementById("assetTypeInput").value;
        const mfr = document.getElementById("assetMfrInput").value.trim();
        const model = document.getElementById("assetModelInput").value.trim();
        const unit = document.getElementById("assetUnitInput").value.trim();
        const vib = parseFloat(document.getElementById("assetVibInput").value) || 3.0;
        const temp = parseInt(document.getElementById("assetTempInput").value) || 60;
        const hours = parseInt(document.getElementById("assetHoursInput").value) || 1000;
        const status = document.getElementById("assetStatusInput").value;
        const desc = document.getElementById("assetDescInput").value.trim();

        if (!id || !name || !unit) {
            PlantPulseApp.showToast("Validation Error", "Please fill in all required fields (*)", "danger");
            return;
        }

        // Check ID uniqueness
        if (store.getAssetById(id)) {
            PlantPulseApp.showToast("Duplicate Asset ID", `Asset ID ${id} already exists in the system.`, "danger");
            return;
        }

        const newAsset = {
            id,
            name,
            type,
            manufacturer: mfr || "Generic Industrial",
            model: model || "Standard",
            unit,
            status,
            vibration: vib,
            temperature: temp,
            hours,
            installationDate: new Date().toISOString().split('T')[0],
            lastMaintenance: new Date().toISOString().split('T')[0],
            criticality: "High",
            description: desc || "Industrial equipment record."
        };

        store.addAsset(newAsset);
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Asset Added Successfully", `${id} - ${name} is registered.`, "success");
    },

    /* --- Edit Asset Modal --- */
    openEditModal(id) {
        const asset = store.getAssetById(id);
        if (!asset) return;

        const formHtml = `
            <form id="editAssetForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Asset ID (Read-only)</label>
                        <input type="text" value="${asset.id}" class="form-control" disabled>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Asset Name</label>
                        <input type="text" id="editNameInput" class="form-control" value="${asset.name}" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Production Unit</label>
                        <input type="text" id="editUnitInput" class="form-control" value="${asset.unit}" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="editStatusInput" class="select-control" style="width:100%;">
                            <option value="Operational" ${asset.status === 'Operational' ? 'selected' : ''}>Operational</option>
                            <option value="Maintenance" ${asset.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                            <option value="Critical" ${asset.status === 'Critical' ? 'selected' : ''}>Critical</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Vibration Level (mm/s)</label>
                        <input type="number" step="0.1" id="editVibInput" class="form-control" value="${asset.vibration}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Temperature (°C)</label>
                        <input type="number" id="editTempInput" class="form-control" value="${asset.temperature}">
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AssetsController.submitEditForm('${asset.id}')">Update Asset</button>
        `;

        PlantPulseApp.openModal(`<i class="fas fa-edit"></i> Edit Asset: ${asset.id}`, formHtml, footerHtml);
    },

    submitEditForm(id) {
        const name = document.getElementById("editNameInput").value.trim();
        const unit = document.getElementById("editUnitInput").value.trim();
        const status = document.getElementById("editStatusInput").value;
        const vib = parseFloat(document.getElementById("editVibInput").value);
        const temp = parseInt(document.getElementById("editTempInput").value);

        if (!name || !unit) {
            PlantPulseApp.showToast("Validation Error", "Asset name and production unit are required.", "danger");
            return;
        }

        store.updateAsset(id, { name, unit, status, vibration: vib, temperature: temp });
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Asset Updated Successfully", `${id} record updated.`, "success");
    },

    /* --- Delete Asset --- */
    confirmDelete(id) {
        PlantPulseApp.confirmAction(
            "Delete Industrial Asset?",
            `Are you sure you want to delete <strong>${id}</strong>? This action cannot be undone.`,
            "Delete Asset",
            () => {
                store.deleteAsset(id);
                PlantPulseApp.showToast("✓ Asset Deleted", `Asset ${id} removed from system database.`, "warning");
            }
        );
    },

    /* --- Asset Detail Modal --- */
    viewDetails(id) {
        const asset = store.getAssetById(id);
        if (!asset) return;

        const health = asset.health;
        const risk = store.calculatePredictiveRisk(asset);

        const contentHtml = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
                    <div>
                        <span class="table-cell-code" style="font-size:1rem;">${asset.id}</span>
                        <h3 style="margin-top:2px;">${asset.name}</h3>
                        <div style="font-size:0.85rem; color:var(--text-muted);">${asset.manufacturer} - ${asset.model} • Installed: ${asset.installationDate}</div>
                    </div>
                    <span class="badge ${asset.status === 'Operational' ? 'badge-success' : 'badge-danger'}">${asset.status}</span>
                </div>

                <div class="form-grid" style="margin-bottom:1.5rem;">
                    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">HEALTH INDEX</div>
                        <div style="font-size:1.5rem; font-weight:700; color:var(--accent-primary); font-family:var(--font-heading);">${health}%</div>
                    </div>

                    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">VIBRATION TELEMETRY</div>
                        <div style="font-size:1.5rem; font-weight:700; color:var(--text-primary); font-family:var(--font-heading);">${asset.vibration} <span style="font-size:0.85rem; color:var(--text-muted);">mm/s</span></div>
                    </div>

                    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">TEMPERATURE</div>
                        <div style="font-size:1.5rem; font-weight:700; color:var(--text-primary); font-family:var(--font-heading);">${asset.temperature}°C</div>
                    </div>

                    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">OPERATING HOURS</div>
                        <div style="font-size:1.5rem; font-weight:700; color:var(--text-primary); font-family:var(--font-heading);">${asset.hours} <span style="font-size:0.85rem; color:var(--text-muted);">hrs</span></div>
                    </div>
                </div>

                <div style="background:var(--bg-dark); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); margin-bottom:1rem;">
                    <div style="font-weight:600; color:var(--accent-primary); margin-bottom:0.4rem;"><i class="fas fa-brain"></i> Simulated Predictive Diagnostic</div>
                    <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${risk.prediction}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.4rem;"><strong>Recommended Action:</strong> ${risk.recommendedAction}</div>
                </div>

                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${asset.description}</p>
            </div>
        `;

        PlantPulseApp.openModal(`<i class="fas fa-circle-info"></i> Asset Telemetry & Diagnostics`, contentHtml);
    }
};
