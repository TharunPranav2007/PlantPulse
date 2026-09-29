/* ==========================================================================
   PLANTPULSE - Settings Controller (Stage 1)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("resetDataBtn")) {
        SettingsController.init();
    }
});

const SettingsController = {
    init() {
        const resetBtn = document.getElementById("resetDataBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                PlantPulseApp.confirmAction(
                    "Reset All Application Data?",
                    "This will restore all industrial assets, maintenance logs, work orders, technicians, and spare parts back to default mock data.",
                    "Reset Factory Data",
                    () => {
                        store.resetToDefault();
                        PlantPulseApp.showToast("✓ Factory Reset Complete", "All mock data restored to default system state.", "success");
                    }
                );
            });
        }
    }
};
