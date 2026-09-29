/* ==========================================================================
   PLANTPULSE - Client-Side Store & State Manager (Stage 1)
   Manages localStorage persistence, CRUD methods, predictive health logic,
   and dynamic event subscriptions for UI components.
   ========================================================================== */

const STORAGE_KEY = "plantpulse_state_v1";

class PlantPulseStore {
    constructor() {
        this.listeners = [];
        this.data = this.loadState();
    }

    // Initialize or load from LocalStorage
    loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to load state from localStorage:", e);
        }
        // Fallback to initial mock data
        this.saveState(INITIAL_MOCK_DATA);
        return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    }

    saveState(dataToSave) {
        const state = dataToSave || this.data;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save state to localStorage:", e);
        }
    }

    resetToDefault() {
        this.data = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
        this.saveState();
        this.notifyListeners("reset");
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners(eventType, payload) {
        this.saveState();
        this.listeners.forEach(cb => cb(eventType, payload));
    }

    /* --- ASSET CRUD OPERATIONS --- */
    getAssets() {
        return this.data.assets || [];
    }

    getAssetById(id) {
        return this.data.assets.find(a => a.id === id);
    }

    addAsset(assetData) {
        // Calculate health score dynamically based on sensors
        assetData.health = this.calculateHealthScore(assetData);
        this.data.assets.unshift(assetData);
        this.notifyListeners("asset_added", assetData);
        return assetData;
    }

    updateAsset(id, updatedFields) {
        const index = this.data.assets.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.assets[index] = { ...this.data.assets[index], ...updatedFields };
            // Recalculate health
            this.data.assets[index].health = this.calculateHealthScore(this.data.assets[index]);
            this.notifyListeners("asset_updated", this.data.assets[index]);
            return this.data.assets[index];
        }
        return null;
    }

    deleteAsset(id) {
        const index = this.data.assets.findIndex(a => a.id === id);
        if (index !== -1) {
            const deleted = this.data.assets.splice(index, 1)[0];
            this.notifyListeners("asset_deleted", deleted);
            return deleted;
        }
        return null;
    }

    /* --- MAINTENANCE CRUD OPERATIONS --- */
    getMaintenance() {
        return this.data.maintenance || [];
    }

    addMaintenance(maintData) {
        if (!maintData.id) {
            maintData.id = "MAINT-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900);
        }
        this.data.maintenance.unshift(maintData);
        this.notifyListeners("maintenance_added", maintData);
        return maintData;
    }

    updateMaintenance(id, fields) {
        const index = this.data.maintenance.findIndex(m => m.id === id);
        if (index !== -1) {
            this.data.maintenance[index] = { ...this.data.maintenance[index], ...fields };
            this.notifyListeners("maintenance_updated", this.data.maintenance[index]);
            return this.data.maintenance[index];
        }
        return null;
    }

    deleteMaintenance(id) {
        const index = this.data.maintenance.findIndex(m => m.id === id);
        if (index !== -1) {
            const deleted = this.data.maintenance.splice(index, 1)[0];
            this.notifyListeners("maintenance_deleted", deleted);
            return deleted;
        }
        return null;
    }

    /* --- WORK ORDER CRUD OPERATIONS --- */
    getWorkOrders() {
        return this.data.workOrders || [];
    }

    addWorkOrder(woData) {
        if (!woData.id) {
            woData.id = "WO-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
        }
        woData.createdDate = woData.createdDate || new Date().toISOString().split('T')[0];
        woData.status = woData.status || "OPEN";
        this.data.workOrders.unshift(woData);
        this.notifyListeners("workorder_added", woData);
        return woData;
    }

    updateWorkOrderStatus(id, newStatus) {
        const wo = this.data.workOrders.find(w => w.id === id);
        if (wo) {
            wo.status = newStatus;
            this.notifyListeners("workorder_status_changed", wo);
            return wo;
        }
        return null;
    }

    deleteWorkOrder(id) {
        const index = this.data.workOrders.findIndex(w => w.id === id);
        if (index !== -1) {
            const deleted = this.data.workOrders.splice(index, 1)[0];
            this.notifyListeners("workorder_deleted", deleted);
            return deleted;
        }
        return null;
    }

    /* --- TECHNICIANS --- */
    getTechnicians() {
        return this.data.technicians || [];
    }

    addTechnician(tech) {
        if (!tech.id) {
            tech.id = "TECH-" + Math.floor(100 + Math.random() * 900);
        }
        this.data.technicians.unshift(tech);
        this.notifyListeners("technician_added", tech);
        return tech;
    }

    /* --- SPARE PARTS & INVENTORY CALCULATOR --- */
    getSpareParts() {
        return this.data.spareParts || [];
    }

    calculateStockStatus(qty, minStock) {
        if (qty === 0) return "OUT OF STOCK";
        if (qty <= minStock) return "LOW STOCK";
        return "NORMAL";
    }

    addSparePart(part) {
        if (!part.id) {
            part.id = "PART-" + Math.floor(900 + Math.random() * 100);
        }
        this.data.spareParts.unshift(part);
        this.notifyListeners("sparepart_added", part);
        return part;
    }

    updateSparePartQty(id, delta) {
        const part = this.data.spareParts.find(p => p.id === id);
        if (part) {
            part.quantity = Math.max(0, part.quantity + delta);
            this.notifyListeners("sparepart_qty_changed", part);
            return part;
        }
        return null;
    }

    /* --- ALERTS --- */
    getAlerts() {
        return this.data.alerts || [];
    }

    addAlert(alertData) {
        if (!alertData.id) {
            alertData.id = "ALT-" + Math.floor(1000 + Math.random() * 9000);
        }
        alertData.timestamp = "Just now";
        alertData.read = false;
        this.data.alerts.unshift(alertData);
        this.notifyListeners("alert_added", alertData);
        return alertData;
    }

    markAlertRead(id) {
        const alt = this.data.alerts.find(a => a.id === id);
        if (alt) {
            alt.read = true;
            this.notifyListeners("alert_read", alt);
        }
    }

    dismissAlert(id) {
        const index = this.data.alerts.findIndex(a => a.id === id);
        if (index !== -1) {
            const deleted = this.data.alerts.splice(index, 1)[0];
            this.notifyListeners("alert_dismissed", deleted);
            return deleted;
        }
        return null;
    }

    /* --- SIMULATED PREDICTIVE HEALTH COMPUTATION ALGORITHM --- */
    calculateHealthScore(asset) {
        let base = 100;
        
        // Vibration penalty (normal <= 5 mm/s)
        const vib = parseFloat(asset.vibration) || 0;
        if (vib > 5) {
            base -= (vib - 5) * 4.5;
        }

        // Temperature penalty (normal <= 70°C)
        const temp = parseFloat(asset.temperature) || 0;
        if (temp > 70) {
            base -= (temp - 70) * 1.2;
        }

        // Operating hours penalty (10,000 hrs baseline)
        const hours = parseFloat(asset.hours) || 0;
        if (hours > 5000) {
            base -= (hours - 5000) / 1000 * 1.5;
        }

        // Status penalty
        if (asset.status === "Critical") base -= 15;
        if (asset.status === "Maintenance") base -= 10;

        return Math.max(15, Math.min(100, Math.round(base)));
    }

    calculatePredictiveRisk(asset) {
        const health = this.calculateHealthScore(asset);
        let risk = "LOW";
        let prediction = "No immediate maintenance required. Operating within optimal parameters.";
        let action = "Continue routine monitoring schedule.";
        let reason = "All sensor telemetry levels (vibration, temp, pressure) are normal.";

        if (health < 70) {
            risk = "HIGH";
            prediction = "High risk of failure within 3-5 operating days.";
            action = "Schedule immediate emergency intervention & sensor diagnostic.";
            reason = `Critical vibration level (${asset.vibration} mm/s) and high operating temperature (${asset.temperature}°C).`;
        } else if (health < 88) {
            risk = "MEDIUM";
            prediction = "Predictive maintenance recommended within 7 to 14 days.";
            action = "Order spare seal/bearing kits and assign mechanical technician.";
            reason = `Elevated vibration trend (${asset.vibration} mm/s) and cumulative operating hours (${asset.hours} hrs).`;
        }

        return {
            assetId: asset.id,
            assetName: asset.name,
            healthScore: health,
            riskLevel: risk,
            prediction: prediction,
            recommendedAction: action,
            reason: reason,
            vibration: asset.vibration,
            temperature: asset.temperature,
            hours: asset.hours
        };
    }

    /* --- DASHBOARD SUMMARY KPIS --- */
    getKPIs() {
        const assets = this.getAssets();
        const alerts = this.getAlerts();
        const workOrders = this.getWorkOrders();
        const maintenance = this.getMaintenance();

        const totalAssets = assets.length;
        const operationalAssets = assets.filter(a => a.status === "Operational").length;
        const activeAlerts = alerts.filter(a => !a.read).length;
        const openWorkOrders = workOrders.filter(w => w.status === "OPEN" || w.status === "ASSIGNED" || w.status === "IN PROGRESS").length;
        
        // Total cost
        const totalCost = maintenance.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
        
        // Average health
        const avgHealth = Math.round(assets.reduce((sum, a) => sum + (a.health || 85), 0) / (totalAssets || 1));

        return {
            totalAssets,
            operationalAssets,
            activeAlerts,
            openWorkOrders,
            totalMaintenanceCost: "₹" + (totalCost / 100000).toFixed(1) + "L",
            averageHealth: avgHealth + "%"
        };
    }
}

// Instantiate Global Store Instance
const store = new PlantPulseStore();
