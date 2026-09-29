# PlantPulse - Multi-Role User Specification & Permission Matrix

---

## 1. Overview
PlantPulse supports four distinct industrial personnel roles, each with tailored workspace dashboards, sidebar navigation items, and granular permission access controls.

---

## 2. Pre-Configured Demo Credentials

| Role Title | Name | Username | Password | Employee ID | Department |
|---|---|---|---|---|---|
| **Plant Manager** | Rajesh Kumar | `admin` | `admin123` | PM-001 | Plant Operations |
| **Maintenance Technician** | Arun Kumar | `technician` | `tech123` | TECH-001 | Maintenance |
| **Maintenance Supervisor** | Priya Sharma | `supervisor` | `super123` | SUP-001 | Maintenance Operations |
| **Inventory Manager** | Vikram Singh | `inventory` | `inventory123` | INV-001 | Stores & Inventory |

---

## 3. Role-Based Access Control (RBAC) Matrix

| Module / Action | Plant Manager (Admin) | Supervisor | Technician | Inventory Manager |
|---|:---:|:---:|:---:|:---:|
| **Dashboard** | Command Center | Operations | My Workspace | Stores Overview |
| **Assets Management** | Full CRUD | View | Assigned Only | View Only |
| **Maintenance Schedules** | Full CRUD | Create / Update | Assigned Only | Relevant Parts |
| **Work Orders** | Full CRUD | Assign / Create | Update Assigned | No |
| **Technicians Roster** | Full CRUD | View Workload | Profile Only | No |
| **Spare Parts Inventory** | Full CRUD | View Only | View Only | Full CRUD / Movements |
| **Analytics Dashboard** | Full Access | Full Access | No | Inventory Analytics |
| **Predictive Engine** | Full Access | Full Access | No | No |
| **Alert Center** | All Alarms | All Alarms | Assigned Alarms | Stock Alarms |
| **System Settings** | Full Access | No | No | No |
