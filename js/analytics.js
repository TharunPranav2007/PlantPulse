/* ==========================================================================
   PLANTPULSE - Analytics Controller (Stage 1)
   Manages Chart.js analytical charts: Downtime, Maintenance Cost Distribution,
   Failure Frequency, Technician Workload, with live filter updates.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("downtimeChartCanvas")) {
        AnalyticsController.init();
    }
});

const AnalyticsController = {
    downtimeChart: null,
    costChart: null,
    typeDistributionChart: null,

    init() {
        this.renderCharts();
        this.bindEvents();
    },

    bindEvents() {
        const periodFilter = document.getElementById("analyticsPeriodFilter");
        const unitFilter = document.getElementById("analyticsUnitFilter");
        const typeFilter = document.getElementById("analyticsTypeFilter");

        if (periodFilter) periodFilter.addEventListener("change", () => this.renderCharts());
        if (unitFilter) unitFilter.addEventListener("change", () => this.renderCharts());
        if (typeFilter) typeFilter.addEventListener("change", () => this.renderCharts());

        window.addEventListener("plantpulse_theme_change", () => {
            if (document.getElementById("downtimeChartCanvas")) {
                this.renderCharts();
            }
        });
    },

    renderCharts() {
        this.renderDowntimeChart();
        this.renderCostChart();
        this.renderTypeDistributionChart();
    },

    renderDowntimeChart() {
        const canvas = document.getElementById("downtimeChartCanvas");
        if (!canvas || typeof Chart === "undefined") return;

        if (this.downtimeChart) this.downtimeChart.destroy();

        const c = typeof PlantPulseTheme !== "undefined" ? PlantPulseTheme.getChartColors() : { gridColor: "rgba(255,255,255,0.08)", textColor: "#94a3b8" };

        const ctx = canvas.getContext("2d");
        this.downtimeChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["PRESS-009", "LATHE-007", "BOILER-002", "ROB-014", "PUMP-012"],
                datasets: [{
                    label: "Unplanned Downtime (Hours)",
                    data: [18.4, 12.2, 9.5, 5.1, 2.3],
                    backgroundColor: ["#ef4444", "#f59e0b", "#f59e0b", "#3b82f6", "#10b981"],
                    borderRadius: 6
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
                    y: { grid: { color: c.gridColor }, ticks: { color: c.textColor } },
                    x: { grid: { display: false }, ticks: { color: c.textColor } }
                }
            }
        });
    },

    renderCostChart() {
        const canvas = document.getElementById("costChartCanvas");
        if (!canvas || typeof Chart === "undefined") return;

        if (this.costChart) this.costChart.destroy();

        const c = typeof PlantPulseTheme !== "undefined" ? PlantPulseTheme.getChartColors() : { headingColor: "#f8fafc", cardBg: "#161e2e" };

        const ctx = canvas.getContext("2d");
        this.costChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Emergency Repairs", "Preventive PM", "Predictive Parts", "Corrective Overhaul"],
                datasets: [{
                    data: [48000, 32000, 22000, 18500],
                    backgroundColor: ["#ef4444", "#10b981", c.accentPrimary || "#00f2fe", "#f59e0b"],
                    borderWidth: 2,
                    borderColor: c.cardBg || "#161e2e"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: { color: c.headingColor, font: { family: "Inter", size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: c.tooltipBg,
                        titleColor: c.headingColor,
                        bodyColor: c.tooltipText,
                        borderColor: c.tooltipBorder,
                        borderWidth: 1
                    }
                }
            }
        });
    },

    renderTypeDistributionChart() {
        const canvas = document.getElementById("typeDistChartCanvas");
        if (!canvas || typeof Chart === "undefined") return;

        if (this.typeDistributionChart) this.typeDistributionChart.destroy();

        const c = typeof PlantPulseTheme !== "undefined" ? PlantPulseTheme.getChartColors() : { headingColor: "#f8fafc" };

        const ctx = canvas.getContext("2d");
        this.typeDistributionChart = new Chart(ctx, {
            type: "polarArea",
            data: {
                labels: ["Milling", "Turning", "Robotics", "Stamping", "Compressors", "Thermodynamics"],
                datasets: [{
                    data: [4, 3, 2, 2, 2, 1],
                    backgroundColor: [
                        "rgba(0, 242, 254, 0.65)",
                        "rgba(59, 130, 246, 0.65)",
                        "rgba(139, 92, 246, 0.65)",
                        "rgba(239, 68, 68, 0.65)",
                        "rgba(16, 185, 129, 0.65)",
                        "rgba(245, 158, 11, 0.65)"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "right", labels: { color: c.headingColor } },
                    tooltip: {
                        backgroundColor: c.tooltipBg,
                        titleColor: c.headingColor,
                        bodyColor: c.tooltipText,
                        borderColor: c.tooltipBorder,
                        borderWidth: 1
                    }
                }
            }
        });
    }
};
