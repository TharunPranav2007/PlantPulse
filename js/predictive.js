/* ==========================================================================
   PLANTPULSE - Simulated Predictive Maintenance Engine (Stage 1)
   Applies multi-factor degradation algorithm combining vibration telemetry,
   thermal load, operating hours, and maintenance recency.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("predictiveGridContainer")) {
        PredictiveController.init();
    }
});

const PredictiveController = {
    init() {
        this.render();
        store.subscribe(() => this.render());
    },

    render() {
        const container = document.getElementById("predictiveGridContainer");
        if (!container) return;

        const assets = store.getAssets();

        let html = "";
        assets.forEach(asset => {
            const risk = store.calculatePredictiveRisk(asset);
            
            let riskBadge = "badge-success";
            let borderColor = "var(--border-color)";
            if (risk.riskLevel === "HIGH") { riskBadge = "badge-danger"; borderColor = "var(--status-danger)"; }
            if (risk.riskLevel === "MEDIUM") { riskBadge = "badge-warning"; borderColor = "var(--status-warning)"; }

            html += `
                <div class="card" style="border-top:3px solid ${risk.riskLevel === 'HIGH' ? 'var(--status-danger)' : risk.riskLevel === 'MEDIUM' ? 'var(--status-warning)' : 'var(--status-success)'};">
                    <div class="card-header">
                        <div>
                            <span class="table-cell-code">${asset.id}</span>
                            <div class="card-title">${asset.name}</div>
                        </div>
                        <span class="badge ${riskBadge}"><span class="badge-dot"></span>RISK: ${risk.riskLevel}</span>
                    </div>

                    <div class="card-body">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                            <div>
                                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">HEALTH INDEX SCORE</span>
                                <div style="font-family:var(--font-heading); font-size:2rem; font-weight:800; color:var(--text-primary);">${risk.healthScore}%</div>
                            </div>
                            <div class="health-bar-track" style="width:120px; height:12px;">
                                <div class="health-bar-fill ${risk.healthScore < 70 ? 'critical' : risk.healthScore < 88 ? 'warning' : 'healthy'}" style="width:${risk.healthScore}%;"></div>
                            </div>
                        </div>

                        <div style="background:var(--bg-dark); border:1px solid var(--border-color); padding:0.85rem; border-radius:var(--radius-md); font-size:0.85rem; margin-bottom:1rem;">
                            <div style="font-weight:600; color:var(--accent-primary); margin-bottom:2px;"><i class="fas fa-microchip"></i> Prediction Diagnostic:</div>
                            <div style="color:var(--text-secondary); line-height:1.4;">${risk.prediction}</div>
                            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem;"><strong>Root Cause:</strong> ${risk.reason}</div>
                        </div>

                        <div style="font-size:0.8rem; color:var(--text-muted); padding-top:0.5rem; border-top:1px dashed var(--border-color);">
                            <strong>Recommended Action:</strong> ${risk.recommendedAction}
                        </div>
                    </div>

                    <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center;">
                        <button class="btn btn-sm btn-secondary" onclick="PredictiveController.openFormulaExplanationModal('${asset.id}')"><i class="fas fa-calculator"></i> View Algorithm</button>
                        <button class="btn btn-sm btn-primary" onclick="PredictiveController.createWorkOrderFromPredictive('${asset.id}')"><i class="fas fa-wrench"></i> Schedule Maintenance</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    openFormulaExplanationModal(assetId) {
        const asset = store.getAssetById(assetId);
        if (!asset) return;

        const risk = store.calculatePredictiveRisk(asset);

        const contentHtml = `
            <div>
                <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); margin-bottom:1rem;">
                    <div style="font-weight:700; color:var(--accent-primary); margin-bottom:0.4rem;"><i class="fas fa-brain"></i> Algorithmic Scoring Equation (Stage 1 Prototype)</div>
                    <code style="display:block; background:var(--bg-dark); padding:0.6rem; border-radius:4px; font-family:var(--font-mono); font-size:0.8rem; color:var(--text-primary);">
                        Health Score = 100 - (VibrationPenalty + TempPenalty + HoursPenalty + StatusPenalty)
                    </code>
                </div>

                <table class="data-table" style="margin-bottom:1rem;">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Current Sensor Value</th>
                            <th>Threshold</th>
                            <th>Penalty Deducted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Vibration Telemetry</td>
                            <td class="table-cell-code">${asset.vibration} mm/s</td>
                            <td>&le; 5.0 mm/s</td>
                            <td style="color:var(--status-danger); font-weight:600;">-${asset.vibration > 5 ? Math.round((asset.vibration - 5) * 4.5) : 0} pts</td>
                        </tr>
                        <tr>
                            <td>Thermal Load</td>
                            <td class="table-cell-code">${asset.temperature} °C</td>
                            <td>&le; 70 °C</td>
                            <td style="color:var(--status-danger); font-weight:600;">-${asset.temperature > 70 ? Math.round((asset.temperature - 70) * 1.2) : 0} pts</td>
                        </tr>
                        <tr>
                            <td>Operating Hours</td>
                            <td class="table-cell-code">${asset.hours} hrs</td>
                            <td>&le; 5000 hrs</td>
                            <td style="color:var(--status-danger); font-weight:600;">-${asset.hours > 5000 ? Math.round((asset.hours - 5000)/1000 * 1.5) : 0} pts</td>
                        </tr>
                    </tbody>
                </table>

                <div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">
                    Note: This multi-variable scoring model provides deterministic real-time predictive failure assessment during Stage 1 evaluation. In Stage 2, server-side PHP processing can execute machine learning models.
                </div>
            </div>
        `;

        PlantPulseApp.openModal(`<i class="fas fa-square-root-variable"></i> Predictive Diagnostic Breakdown for ${assetId}`, contentHtml);
    },

    createWorkOrderFromPredictive(assetId) {
        const asset = store.getAssetById(assetId);
        if (!asset) return;

        store.addWorkOrder({
            assetId: asset.id,
            issue: `Predictive Intervention: Sensor anomaly on ${asset.name}`,
            technician: "Arun Kumar",
            priority: asset.health < 70 ? "Critical" : "High",
            status: "OPEN",
            description: `Generated from Predictive Maintenance algorithm. Health score at ${asset.health}%. Vibration: ${asset.vibration}mm/s.`
        });

        PlantPulseApp.showToast("✓ Work Order Dispatched", `Maintenance order created for ${assetId} based on predictive risk.`, "success");
    }
};
