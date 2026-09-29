/* ==========================================================================
   PLANTPULSE - Centralized Data Store & Event Bus (Stage 1)
   Single source of truth for all modules: Assets, Maintenance, Work Orders,
   Technicians, Spare Parts, Stock Movements, Alerts, Notifications, Activity Log.
   ========================================================================== */

const STORAGE_KEY = "plantpulse_state_v1";

class PlantPulseStore {
    constructor() {
        this.listeners = [];
        this.data = this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure new schema objects exist
                if (!parsed.activityFeed) parsed.activityFeed = [];
                if (!parsed.stockMovements) parsed.stockMovements = [];
                if (!parsed.notifications) parsed.notifications = [];
                return parsed;
            }
        } catch (e) {
            console.error("Failed to load state from localStorage:", e);
        }

        // Initialize from mock data with initial activity log
        const initial = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
        initial.activityFeed = [
            { id: "ACT-1", user: "Rajesh Kumar", role: "Plant Manager", action: "Initialized PlantPulse Command Platform database.", time: "1 hour ago" },
            { id: "ACT-2", user: "Priya Sharma", role: "Maintenance Supervisor", action: "Assigned Work Order WO-2026-0192 to Arun Kumar.", time: "30 mins ago" },
            { id: "ACT-3", user: "Vikram Singh", role: "Inventory Manager", action: "Restocked High Pressure Viton Seal Kits (+25 qty).", time: "15 mins ago" }
        ];
        initial.stockMovements = [
            { id: "MOV-101", partId: "PART-901", partName: "High Pressure Viton Seal Kit", type: "IN", qty: 25, user: "Vikram Singh", date: "2026-09-28" },
            { id: "MOV-102", partId: "PART-902", partName: "Synthetic Way Lube ISO VG 220", type: "OUT", qty: 2, user: "Arun Kumar", date: "2026-09-27" }
        ];
        initial.notifications = [
            { id: "NOTIF-1", targetRole: "technician", title: "New Work Order Assigned", message: "WO-2026-0192 assigned to you for Hydraulic Press PRESS-009.", time: "30 mins ago", read: false },
            { id: "NOTIF-2", targetRole: "inventory", title: "Low Stock Alert", message: "Synthetic Way Lube ISO VG 220 quantity below minimum threshold.", time: "1 hour ago", read: false }
        ];

        this.saveState(initial);
        return initial;
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
        localStorage.removeItem(STORAGE_KEY);
        this.data = this.loadState();
        this.notifyListeners("reset");
    }

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

    /* --- ACTIVITY LOG ENGINE --- */
    getActivityFeed() {
        return this.data.activityFeed || [];
    }

    addActivity(actionText) {
        const user = (typeof PlantPulseAuth !== "undefined" && PlantPulseAuth.getCurrentUser()) || { name: "System", role: "Automated" };
        const act = {
            id: "ACT-" + Date.now(),
            user: user.name,
            role: user.role,
            action: actionText,
            time: "Just now"
        };
        this.data.activityFeed.unshift(act);
        if (this.data.activityFeed.length > 25) this.data.activityFeed.pop(); // Keep recent 25
        this.saveState();
        return act;
    }

    /* --- NOTIFICATIONS ENGINE --- */
    getNotifications(role = null) {
        const notifs = this.data.notifications || [];
        if (!role || role === "admin" || role === "Plant Manager") return notifs;
        
        // Map role keys
        const roleKeyMap = {
            "Maintenance Technician": "technician",
            "Maintenance Supervisor": "supervisor",
            "Inventory Manager": "inventory"
        };
        const target = roleKeyMap[role] || role.toLowerCase();
        return notifs.filter(n => n.targetRole === target || n.targetRole === "all");
    }

    addNotification(targetRole, title, message) {
        const notif = {
            id: "NOTIF-" + Date.now(),
            targetRole,
            title,
            message,
            time: "Just now",
            read: false
        };
        this.data.notifications.unshift(notif);
        this.saveState();
        return notif;
    }

    /* --- ASSET CRUD OPERATIONS --- */
    getAssets() {
        return this.data.assets || [];
    }

    getAssetById(id) {
        return this.data.assets.find(a => a.id === id);
    }

    addAsset(assetData) {
        assetData.health = this.calculateHealthScore(assetData);
        this.data.assets.unshift(assetData);
        this.addActivity(`Registered new industrial asset: ${assetData.id} - ${assetData.name}`);
        this.evaluateAlerts();
        this.notifyListeners("asset_added", assetData);
        return assetData;
    }

    updateAsset(id, updatedFields) {
        const index = this.data.assets.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.assets[index] = { ...this.data.assets[index], ...updatedFields };
            this.data.assets[index].health = this.calculateHealthScore(this.data.assets[index]);
            this.addActivity(`Updated telemetry/status for asset: ${id}`);
            this.evaluateAlerts();
            this.notifyListeners("asset_updated", this.data.assets[index]);
            return this.data.assets[index];
        }
        return null;
    }

    deleteAsset(id) {
        const index = this.data.assets.findIndex(a => a.id === id);
        if (index !== -1) {
            const deleted = this.data.assets.splice(index, 1)[0];
            this.addActivity(`Decommissioned asset: ${id} (${deleted.name})`);
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
        this.addActivity(`Scheduled ${maintData.type} maintenance for asset ${maintData.assetId}`);
        this.addNotification("technician", "Maintenance Scheduled", `New maintenance event assigned to ${maintData.technician} for ${maintData.assetId}`);
        this.notifyListeners("maintenance_added", maintData);
        return maintData;
    }

    updateMaintenance(id, fields) {
        const index = this.data.maintenance.findIndex(m => m.id === id);
        if (index !== -1) {
            this.data.maintenance[index] = { ...this.data.maintenance[index], ...fields };
            this.addActivity(`Updated maintenance ${id} status to ${fields.status || 'modified'}`);
            this.notifyListeners("maintenance_updated", this.data.maintenance[index]);
            return this.data.maintenance[index];
        }
        return null;
    }

    deleteMaintenance(id) {
        const index = this.data.maintenance.findIndex(m => m.id === id);
        if (index !== -1) {
            const deleted = this.data.maintenance.splice(index, 1)[0];
            this.addActivity(`Cancelled maintenance record: ${id}`);
            this.notifyListeners("maintenance_deleted", deleted);
            return deleted;
        }
        return null;
    }

    /* --- WORK ORDER CRUD & LIFECYCLE --- */
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
        this.addActivity(`Dispatched Work Order ${woData.id} for asset ${woData.assetId} (${woData.priority} Priority)`);
        this.addNotification("technician", "New Work Order Dispatched", `Work Order ${woData.id} (${woData.issue}) assigned to ${woData.technician}`);
        this.notifyListeners("workorder_added", woData);
        return woData;
    }

    updateWorkOrderStatus(id, newStatus, workNotes = "", timeSpent = "", partsUsed = "") {
        const wo = this.data.workOrders.find(w => w.id === id);
        if (wo) {
            const oldStatus = wo.status;
            wo.status = newStatus;
            if (workNotes) wo.workNotes = workNotes;
            if (timeSpent) wo.timeSpent = timeSpent;
            if (partsUsed) wo.partsUsed = partsUsed;
            wo.updatedAt = new Date().toISOString().split('T')[0];

            this.addActivity(`Work Order ${id} status changed from ${oldStatus} to ${newStatus}.`);
            this.addNotification("supervisor", "Work Order Status Advanced", `Work Order ${id} is now ${newStatus}`);
            this.notifyListeners("workorder_status_changed", wo);
            return wo;
        }
        return null;
    }

    deleteWorkOrder(id) {
        const index = this.data.workOrders.findIndex(w => w.id === id);
        if (index !== -1) {
            const deleted = this.data.workOrders.splice(index, 1)[0];
            this.addActivity(`Deleted Work Order: ${id}`);
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
        if (!tech.id) tech.id = "TECH-" + Math.floor(100 + Math.random() * 900);
        this.data.technicians.unshift(tech);
        this.addActivity(`Added new technician: ${tech.name} (${tech.specialization})`);
        this.notifyListeners("technician_added", tech);
        return tech;
    }

    /* --- SPARE PARTS & STOCK MOVEMENTS --- */
    getSpareParts() {
        return this.data.spareParts || [];
    }

    calculateStockStatus(qty, minStock) {
        if (qty === 0) return "OUT OF STOCK";
        if (qty <= minStock) return "LOW STOCK";
        return "NORMAL";
    }

    addSparePart(part) {
        if (!part.id) part.id = "PART-" + Math.floor(900 + Math.random() * 100);
        this.data.spareParts.unshift(part);
        this.addActivity(`Registered new spare part: ${part.id} - ${part.name}`);
        this.evaluateAlerts();
        this.notifyListeners("sparepart_added", part);
        return part;
    }

    updateSparePartQty(id, delta, movementType = "ADJUSTMENT") {
        const part = this.data.spareParts.find(p => p.id === id);
        if (part) {
            part.quantity = Math.max(0, part.quantity + delta);
            const user = (typeof PlantPulseAuth !== "undefined" && PlantPulseAuth.getCurrentUser()) || { name: "Store Manager" };
            
            // Record stock movement log
            const mov = {
                id: "MOV-" + Date.now(),
                partId: part.id,
                partName: part.name,
                type: movementType,
                qty: Math.abs(delta),
                user: user.name,
                date: new Date().toISOString().split('T')[0]
            };
            this.data.stockMovements.unshift(mov);

            const status = this.calculateStockStatus(part.quantity, part.minStock);
            this.addActivity(`Inventory ${movementType}: ${part.name} quantity changed by ${delta > 0 ? '+' + delta : delta} (New Qty: ${part.quantity} - ${status})`);
            
            if (status === "LOW STOCK" || status === "OUT OF STOCK") {
                this.addNotification("inventory", "Inventory Alert", `${part.name} is now ${status} (Qty: ${part.quantity})`);
            }

            this.evaluateAlerts();
            this.notifyListeners("sparepart_qty_changed", part);
            return part;
        }
        return null;
    }

    getStockMovements() {
        return this.data.stockMovements || [];
    }

    /* --- AUTOMATED ALERTS EVALUATION --- */
    getAlerts() {
        return this.data.alerts || [];
    }

    evaluateAlerts() {
        const alerts = [];
        
        // Machine health alerts
        this.getAssets().forEach(a => {
            if (a.health < 70) {
                alerts.push({
                    id: "ALT-SYS-" + a.id,
                    assetId: a.id,
                    severity: "CRITICAL",
                    title: `Critical Telemetry Alert: ${a.id}`,
                    description: `Machine health score dropped to ${a.health}%. Vibration: ${a.vibration} mm/s, Temp: ${a.temperature}°C.`,
                    timestamp: "Active Alarm",
                    read: false
                });
            }
        });

        // Inventory alerts
        this.getSpareParts().forEach(p => {
            const status = this.calculateStockStatus(p.quantity, p.minStock);
            if (status === "OUT OF STOCK") {
                alerts.push({
                    id: "ALT-INV-" + p.id,
                    assetId: p.id,
                    severity: "CRITICAL",
                    title: `Inventory Depleted: ${p.name}`,
                    description: `Stock quantity is 0. Immediate reorder required from ${p.supplier}.`,
                    timestamp: "Stock Alert",
                    read: false
                });
            } else if (status === "LOW STOCK") {
                alerts.push({
                    id: "ALT-INV-" + p.id,
                    assetId: p.id,
                    severity: "WARNING",
                    title: `Low Stock Threshold: ${p.name}`,
                    description: `Available stock (${p.quantity}) is below minimum required (${p.minStock}).`,
                    timestamp: "Stock Alert",
                    read: false
                });
            }
        });

        // Combine with user alerts
        const existing = this.data.alerts || [];
        existing.forEach(ex => {
            if (!alerts.some(a => a.id === ex.id)) {
                alerts.push(ex);
            }
        });

        this.data.alerts = alerts;
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

    markAlertRead(id) {
        const alt = this.data.alerts.find(a => a.id === id);
        if (alt) {
            alt.read = true;
            this.notifyListeners("alert_read", alt);
        }
    }

    /* --- SIMULATED PREDICTIVE HEALTH COMPUTATION --- */
    calculateHealthScore(asset) {
        let base = 100;
        const vib = parseFloat(asset.vibration) || 0;
        if (vib > 5) base -= (vib - 5) * 4.5;

        const temp = parseFloat(asset.temperature) || 0;
        if (temp > 70) base -= (temp - 70) * 1.2;

        const hours = parseFloat(asset.hours) || 0;
        if (hours > 5000) base -= (hours - 5000) / 1000 * 1.5;

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

    /* --- DYNAMIC ROLE-AWARE KPI CALCULATIONS --- */
    getKPIs() {
        const assets = this.getAssets();
        const alerts = this.getAlerts();
        const workOrders = this.getWorkOrders();
        const maintenance = this.getMaintenance();
        const spareParts = this.getSpareParts();

        const currentUser = (typeof PlantPulseAuth !== "undefined" && PlantPulseAuth.getCurrentUser()) || { roleKey: "admin", name: "User" };

        const totalAssets = assets.length;
        const operationalAssets = assets.filter(a => a.status === "Operational").length;
        const activeAlerts = alerts.filter(a => !a.read).length;
        const openWorkOrders = workOrders.filter(w => w.status === "OPEN" || w.status === "ASSIGNED" || w.status === "IN PROGRESS").length;
        const totalCost = maintenance.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
        const avgHealth = Math.round(assets.reduce((sum, a) => sum + (a.health || 85), 0) / (totalAssets || 1));

        // Technician specific KPIs
        const myWorkOrders = workOrders.filter(w => w.technician === currentUser.name);
        const myOpenOrders = myWorkOrders.filter(w => w.status !== "CLOSED" && w.status !== "RESOLVED").length;
        const myCompletedOrders = myWorkOrders.filter(w => w.status === "RESOLVED" || w.status === "CLOSED").length;

        // Inventory specific KPIs
        const totalParts = spareParts.length;
        const lowStockParts = spareParts.filter(p => this.calculateStockStatus(p.quantity, p.minStock) === "LOW STOCK").length;
        const outOfStockParts = spareParts.filter(p => p.quantity === 0).length;
        const inventoryVal = spareParts.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);

        return {
            totalAssets,
            operationalAssets,
            activeAlerts,
            openWorkOrders,
            totalMaintenanceCost: "₹" + (totalCost / 100000).toFixed(1) + "L",
            averageHealth: avgHealth + "%",
            myOpenOrders,
            myCompletedOrders,
            totalParts,
            lowStockParts,
            outOfStockParts,
            inventoryValue: "₹" + (inventoryVal / 100000).toFixed(1) + "L"
        };
    }
}

// Instantiate Global Central Store
const store = new PlantPulseStore();
