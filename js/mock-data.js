/* ==========================================================================
   PLANTPULSE - Comprehensive Industrial Realistic Mock Data
   Stage 1: Client-side Data Store Initializer
   ========================================================================== */

const INITIAL_MOCK_DATA = {
    assets: [
        {
            id: "CNC-001",
            name: "CNC 5-Axis Milling Machine",
            type: "Milling",
            unit: "Precision Bay A",
            manufacturer: "Haas Automation",
            model: "VF-4SS",
            status: "Operational",
            health: 94,
            vibration: 4.2, // mm/s
            temperature: 72, // °C
            hours: 8421,
            installationDate: "2021-03-15",
            lastMaintenance: "2026-08-10",
            criticality: "High",
            description: "High-precision 5-axis vertical machining center used for aerospace alloy turbine housing components."
        },
        {
            id: "ROB-014",
            name: "6-Axis Heavy Payload Robotic Arm",
            type: "Robotics",
            unit: "Assembly Line 2",
            manufacturer: "KUKA Robotics",
            model: "KR 500 FORTEC",
            status: "Operational",
            health: 88,
            vibration: 6.1,
            temperature: 68,
            hours: 12450,
            installationDate: "2020-07-22",
            lastMaintenance: "2026-07-18",
            criticality: "Critical",
            description: "Heavy lifting automotive chassis welding and sub-assembly positioning robot."
        },
        {
            id: "PRESS-009",
            name: "1200-Ton Hydraulic Stamping Press",
            type: "Stamping",
            unit: "Heavy Press Shop",
            manufacturer: "Schuler Pressen",
            model: "HP-1200T",
            status: "Critical",
            health: 64,
            vibration: 14.8,
            temperature: 91,
            hours: 16890,
            installationDate: "2019-11-05",
            lastMaintenance: "2026-05-12",
            criticality: "Critical",
            description: "Deep-draw hydraulic press for heavy sheet metal structural panel forming."
        },
        {
            id: "COMP-004",
            name: "Rotary Screw Air Compressor System",
            type: "Compressors",
            unit: "Utility Block",
            manufacturer: "Atlas Copco",
            model: "GA 110 VSD+",
            status: "Operational",
            health: 96,
            vibration: 2.1,
            temperature: 58,
            hours: 6300,
            installationDate: "2022-01-10",
            lastMaintenance: "2026-09-01",
            criticality: "Medium",
            description: "Plant-wide compressed air supply system delivering 7.5 bar clean dry instrument air."
        },
        {
            id: "LATHE-007",
            name: "CNC Heavy Duty Lathe",
            type: "Turning",
            unit: "Machining Bay B",
            manufacturer: "Mazak",
            model: "Quick Turn 350",
            status: "Maintenance",
            health: 78,
            vibration: 8.4,
            temperature: 80,
            hours: 9840,
            installationDate: "2021-09-30",
            lastMaintenance: "2026-09-20",
            criticality: "High",
            description: "Precision CNC turning center configured with live tooling and sub-spindle."
        },
        {
            id: "PUMP-012",
            name: "Centrifugal High-Pressure Slurry Pump",
            type: "Pumps",
            unit: "Fluid Transfer Station",
            manufacturer: "KSB Pumps",
            model: "MegaCPK 100",
            status: "Operational",
            health: 91,
            vibration: 3.8,
            temperature: 64,
            hours: 5120,
            installationDate: "2022-05-14",
            lastMaintenance: "2026-08-25",
            criticality: "Medium",
            description: "Coolant re-circulation pump handling abrasive industrial grinding fluid."
        },
        {
            id: "CONV-003",
            name: "Automated Roller Conveyor Network",
            type: "Conveyors",
            unit: "Packaging & Logistics",
            manufacturer: "Interroll",
            model: "MCP 24V",
            status: "Operational",
            health: 89,
            vibration: 4.0,
            temperature: 52,
            hours: 14200,
            installationDate: "2020-02-18",
            lastMaintenance: "2026-07-30",
            criticality: "Low",
            description: "High-throughput pallet sortation and automated warehouse transfer conveyor."
        },
        {
            id: "BOILER-002",
            name: "Industrial Steam Boiler 5.0 Ton",
            type: "Thermodynamics",
            unit: "Energy Plant",
            manufacturer: "Thermax",
            model: "Compac 5000",
            status: "Warning",
            health: 74,
            vibration: 7.9,
            temperature: 185,
            hours: 21500,
            installationDate: "2018-04-12",
            lastMaintenance: "2026-06-15",
            criticality: "Critical",
            description: "Process steam generation system delivering saturated steam at 10.5 bar."
        },
        {
            id: "INJ-008",
            name: "Electric Plastic Injection Molding Machine",
            type: "Molding",
            unit: "Polymers Wing",
            manufacturer: "Sumitomo Demag",
            model: "SE180EV-A",
            status: "Operational",
            health: 92,
            vibration: 3.1,
            temperature: 70,
            hours: 7450,
            installationDate: "2021-11-20",
            lastMaintenance: "2026-08-04",
            criticality: "High",
            description: "All-electric high-precision injection molding unit for medical grade enclosures."
        },
        {
            id: "TRANS-005",
            name: "Primary Distribution Transformer 2.5 MVA",
            type: "Electrical",
            unit: "Main Substation",
            manufacturer: "Siemens",
            model: "GEAFOL Cast Resin",
            status: "Operational",
            health: 97,
            vibration: 1.2,
            temperature: 62,
            hours: 32000,
            installationDate: "2017-08-10",
            lastMaintenance: "2026-04-10",
            criticality: "Critical",
            description: "Step-down transformer 11kV to 415V supplying main shop floor power grids."
        }
    ],

    maintenance: [
        {
            id: "MAINT-2026-089",
            assetId: "CNC-001",
            type: "Preventive",
            technician: "Arun Kumar",
            scheduledDate: "2026-09-30",
            priority: "Medium",
            status: "Scheduled",
            cost: 14500,
            notes: "Routine spindle alignment, ball screw lubrication, and coolant filter replacement."
        },
        {
            id: "MAINT-2026-088",
            assetId: "PRESS-009",
            type: "Emergency",
            technician: "Sanjay Verma",
            scheduledDate: "2026-09-28",
            priority: "Critical",
            status: "In Progress",
            cost: 48000,
            notes: "Immediate overhaul of main hydraulic valve block due to severe pressure leakage."
        },
        {
            id: "MAINT-2026-087",
            assetId: "ROB-014",
            type: "Predictive",
            technician: "Priya Sharma",
            scheduledDate: "2026-10-04",
            priority: "High",
            status: "Scheduled",
            cost: 22000,
            notes: "Predictive harmonic drive gearbox grease analysis and Joint 3 backlash check."
        },
        {
            id: "MAINT-2026-086",
            assetId: "LATHE-007",
            type: "Corrective",
            technician: "Rajesh Patel",
            scheduledDate: "2026-09-27",
            priority: "High",
            status: "In Progress",
            cost: 18500,
            notes: "Replacement of worn turret indexing encoder unit."
        },
        {
            id: "MAINT-2026-085",
            assetId: "BOILER-002",
            type: "Preventive",
            technician: "Vikram Singh",
            scheduledDate: "2026-09-25",
            priority: "High",
            status: "Overdue",
            cost: 32000,
            notes: "Annual safety blowdown valve calibration and burner soot cleaning."
        },
        {
            id: "MAINT-2026-084",
            assetId: "COMP-004",
            type: "Preventive",
            technician: "Arun Kumar",
            scheduledDate: "2026-09-01",
            priority: "Low",
            status: "Completed",
            cost: 8500,
            notes: "Air-oil separator filter replacement and moisture trap purging."
        }
    ],

    workOrders: [
        {
            id: "WO-2026-0192",
            assetId: "PRESS-009",
            issue: "Abnormal Hydraulic Line Pressure Fluctuation",
            priority: "Critical",
            technician: "Sanjay Verma",
            createdDate: "2026-09-27",
            status: "IN PROGRESS",
            description: "Vibration sensors triggered alert ALT-1001. Hydraulic pressure dropping below 180 bar during peak stroke."
        },
        {
            id: "WO-2026-0191",
            assetId: "BOILER-002",
            issue: "High Exhaust Flue Gas Temperature Warning",
            priority: "High",
            technician: "Vikram Singh",
            createdDate: "2026-09-26",
            status: "ASSIGNED",
            description: "Efficiency monitor indicated 8% drop due to scaling on heat exchanger tubes."
        },
        {
            id: "WO-2026-0190",
            assetId: "LATHE-007",
            issue: "Tool Turret Indexing Position Error #402",
            priority: "High",
            technician: "Rajesh Patel",
            createdDate: "2026-09-25",
            status: "IN PROGRESS",
            description: "Turret misaligning by 0.15mm on station 4 during heavy rough turning passes."
        },
        {
            id: "WO-2026-0189",
            assetId: "ROB-014",
            issue: "Robot Joint 4 Servo Motor Temperature Spikes",
            priority: "Medium",
            technician: "Priya Sharma",
            createdDate: "2026-09-24",
            status: "RESOLVED",
            description: "Re-greased cable harness track and recalibrated thermal overload relay."
        },
        {
            id: "WO-2026-0188",
            assetId: "CNC-001",
            issue: "Scheduled 500-Hour Preventive Maintenance Package",
            priority: "Medium",
            technician: "Arun Kumar",
            createdDate: "2026-09-28",
            status: "OPEN",
            description: "Standard PM protocol inspection, way lube check, and coolant concentration audit."
        },
        {
            id: "WO-2026-0187",
            assetId: "COMP-004",
            issue: "Condensed Water Drain Solenoid Replacement",
            priority: "Low",
            technician: "Arun Kumar",
            createdDate: "2026-09-20",
            status: "CLOSED",
            description: "Auto drain valve stuck open. Replaced coil and seal pack."
        }
    ],

    technicians: [
        {
            id: "TECH-101",
            name: "Arun Kumar",
            specialization: "CNC & Machining Systems",
            activeJobs: 2,
            completedJobs: 142,
            availability: "Available",
            phone: "+91 98765 43210",
            email: "arun.kumar@plantpulse.io"
        },
        {
            id: "TECH-102",
            name: "Sanjay Verma",
            specialization: "Heavy Hydraulics & Presses",
            activeJobs: 2,
            completedJobs: 189,
            availability: "Busy",
            phone: "+91 98765 43211",
            email: "sanjay.v@plantpulse.io"
        },
        {
            id: "TECH-103",
            name: "Priya Sharma",
            specialization: "Industrial Robotics & Automation",
            activeJobs: 1,
            completedJobs: 98,
            availability: "Available",
            phone: "+91 98765 43212",
            email: "priya.s@plantpulse.io"
        },
        {
            id: "TECH-104",
            name: "Rajesh Patel",
            specialization: "Precision Lathes & Tooling",
            activeJobs: 1,
            completedJobs: 115,
            availability: "Busy",
            phone: "+91 98765 43213",
            email: "rajesh.p@plantpulse.io"
        },
        {
            id: "TECH-105",
            name: "Vikram Singh",
            specialization: "Thermodynamics & Steam Systems",
            activeJobs: 1,
            completedJobs: 156,
            availability: "Available",
            phone: "+91 98765 43214",
            email: "vikram.s@plantpulse.io"
        }
    ],

    spareParts: [
        {
            id: "PART-901",
            name: "High Pressure Viton Seal Kit 45mm",
            category: "Hydraulics",
            quantity: 45,
            minStock: 20,
            unitCost: 1850,
            supplier: "Apex Industrial Seals Ltd."
        },
        {
            id: "PART-902",
            name: "Synthetic Way Lube ISO VG 220 (20L)",
            category: "Lubricants",
            quantity: 8,
            minStock: 10,
            unitCost: 4500,
            supplier: "Castrol Industrial Lubricants"
        },
        {
            id: "PART-903",
            name: "Ceramic Milling Insert Carbide WNMG08",
            category: "Tooling",
            quantity: 120,
            minStock: 50,
            unitCost: 650,
            supplier: "Sandvik Coromant"
        },
        {
            id: "PART-904",
            name: "Proximity Sensor Inductive PNP 24V",
            category: "Electronics",
            quantity: 0,
            minStock: 5,
            unitCost: 2100,
            supplier: "IFM Efector Controls"
        },
        {
            id: "PART-905",
            name: "Heavy Duty Servo Drive Timing Belt 50mm",
            category: "Mechanical",
            quantity: 14,
            minStock: 15,
            unitCost: 3200,
            supplier: "Gates Power Transmission"
        },
        {
            id: "PART-906",
            name: "Compressed Air Inline Oil Filter Cartridge",
            category: "Pneumatics",
            quantity: 28,
            minStock: 10,
            unitCost: 1250,
            supplier: "Atlas Copco Parts"
        }
    ],

    alerts: [
        {
            id: "ALT-1001",
            assetId: "PRESS-009",
            severity: "CRITICAL",
            title: "Abnormal Peak Vibration Detected",
            description: "Vibration sensors measured 14.8 mm/s surpassing safety threshold of 10.0 mm/s.",
            timestamp: "12 mins ago",
            read: false
        },
        {
            id: "ALT-1002",
            assetId: "BOILER-002",
            severity: "WARNING",
            title: "Maintenance Schedule Overdue by 3 Days",
            description: "Preventive soot purge and valve inspection date has elapsed without sign-off.",
            timestamp: "2 hours ago",
            read: false
        },
        {
            id: "ALT-1003",
            assetId: "CNC-001",
            severity: "INFO",
            title: "Preventive Maintenance Scheduled Tomorrow",
            description: "Arun Kumar is assigned for routine 500-hour spindle lubrication cycle.",
            timestamp: "5 hours ago",
            read: true
        },
        {
            id: "ALT-1004",
            assetId: "LATHE-007",
            severity: "WARNING",
            title: "Operating Temp Spike (80°C)",
            description: "Coolant temperature elevated by 12% during high-speed roughing pass.",
            timestamp: "1 day ago",
            read: true
        }
    ],

    healthHistory: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"],
        overallHealth: [92, 91, 89, 90, 88, 86, 87],
        downtimeHours: [1.2, 0.5, 2.8, 0, 1.4, 4.2, 0.8],
        maintenanceCosts: [12000, 8500, 35000, 0, 14000, 48000, 18500]
    }
};
