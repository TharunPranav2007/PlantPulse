/* ==========================================================================
   PLANTPULSE - Technicians Controller (Stage 1)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("techGridContainer")) {
        TechniciansController.init();
    }
});

const TechniciansController = {
    init() {
        this.render();
        this.bindEvents();

        store.subscribe(() => {
            this.render();
        });
    },

    bindEvents() {
        const searchInput = document.getElementById("techSearchInput");
        const addBtn = document.getElementById("addTechBtn");

        if (searchInput) searchInput.addEventListener("input", () => this.render());
        if (addBtn) addBtn.addEventListener("click", () => this.openAddModal());
    },

    render() {
        const container = document.getElementById("techGridContainer");
        if (!container) return;

        const search = (document.getElementById("techSearchInput")?.value || "").toLowerCase().trim();
        let technicians = store.getTechnicians();

        if (search) {
            technicians = technicians.filter(t => t.name.toLowerCase().includes(search) || t.specialization.toLowerCase().includes(search));
        }

        if (technicians.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:3rem;">No technicians found matching criteria.</div>`;
            return;
        }

        let html = "";
        technicians.forEach(t => {
            let statusBadge = t.availability === "Available" ? "badge-success" : "badge-warning";

            html += `
                <div class="card" style="padding:1.25rem;">
                    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
                        <div class="avatar" style="width:48px; height:48px; font-size:1.1rem; border-radius:50%;">${t.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                            <h4 style="font-size:1.05rem;">${t.name}</h4>
                            <div style="font-size:0.8rem; color:var(--accent-primary); font-weight:600;">${t.specialization}</div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; background:var(--bg-dark); padding:0.75rem; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:1rem;">
                        <div>
                            <span style="color:var(--text-muted);">Active Jobs:</span>
                            <div style="font-weight:700; color:var(--text-primary); font-size:1rem;">${t.activeJobs}</div>
                        </div>
                        <div>
                            <span style="color:var(--text-muted);">Completed:</span>
                            <div style="font-weight:700; color:var(--status-success); font-size:1rem;">${t.completedJobs}</div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem;">
                        <span class="badge ${statusBadge}"><span class="badge-dot"></span>${t.availability}</span>
                        <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-envelope"></i> ${t.email || 'N/A'}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    openAddModal() {
        const formHtml = `
            <form id="addTechForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Full Name <span class="required">*</span></label>
                        <input type="text" id="techNameInput" class="form-control" placeholder="e.g. Ramesh Kumar" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Specialization <span class="required">*</span></label>
                        <input type="text" id="techSpecInput" class="form-control" placeholder="e.g. Electrical & PLC Controls" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Phone Contact</label>
                        <input type="text" id="techPhoneInput" class="form-control" placeholder="+91 98765 00000">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" id="techEmailInput" class="form-control" placeholder="tech@plantpulse.io">
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button class="btn btn-secondary" onclick="PlantPulseApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="TechniciansController.submitAddForm()"><i class="fas fa-user-plus"></i> Register Technician</button>
        `;

        PlantPulseApp.openModal('<i class="fas fa-user-gear"></i> Add Technician to Roster', formHtml, footerHtml);
    },

    submitAddForm() {
        const name = document.getElementById("techNameInput").value.trim();
        const spec = document.getElementById("techSpecInput").value.trim();
        const phone = document.getElementById("techPhoneInput").value.trim();
        const email = document.getElementById("techEmailInput").value.trim();

        if (!name || !spec) {
            PlantPulseApp.showToast("Validation Error", "Name and specialization are required.", "danger");
            return;
        }

        const newTech = {
            name,
            specialization: spec,
            activeJobs: 0,
            completedJobs: 0,
            availability: "Available",
            phone: phone || "+91 98765 00000",
            email: email || `${name.toLowerCase().replace(' ', '.')}@plantpulse.io`
        };

        store.addTechnician(newTech);
        PlantPulseApp.closeModal();
        PlantPulseApp.showToast("✓ Technician Registered", `${name} added to maintenance team roster.`, "success");
    }
};
