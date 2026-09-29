# PlantPulse - Stage 2 Architecture & Migration Plan
**Target Evaluation:** LWP Review 02 (Dynamic Web Application using PHP + MySQL)

---

## 1. Migration Architecture Blueprint

Currently in **Stage 1**, all data access passes through `js/store.js` using LocalStorage:

```
Browser UI (HTML/CSS/JS)  <--->  js/store.js  <--->  LocalStorage
```

In **Stage 2**, `js/store.js` helper methods will be converted into asynchronous `fetch()` API calls targeting **PHP REST API Endpoints**, backed by a relational **MySQL Database**:

```
Browser UI (HTML/CSS/JS)
         ↓
     fetch() API
         ↓
  PHP Server (php/*.php)
         ↓
MySQL Database (plantpulse_db)
```

---

## 2. MySQL Relational Database Schema (`plantpulse.sql`)

### Tables & Key Relationships

1. **`users`**
   - `id` INT AUTO_INCREMENT PRIMARY KEY
   - `username` VARCHAR(50) UNIQUE NOT NULL
   - `password_hash` VARCHAR(255) NOT NULL
   - `role` ENUM('ADMIN', 'MANAGER', 'TECHNICIAN') DEFAULT 'TECHNICIAN'
   - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

2. **`assets`**
   - `id` VARCHAR(30) PRIMARY KEY (e.g., `CNC-001`)
   - `name` VARCHAR(100) NOT NULL
   - `type` VARCHAR(50) NOT NULL
   - `unit` VARCHAR(100) NOT NULL
   - `manufacturer` VARCHAR(100)
   - `model` VARCHAR(100)
   - `status` ENUM('Operational', 'Maintenance', 'Critical') DEFAULT 'Operational'
   - `health` INT DEFAULT 100
   - `vibration` DECIMAL(4,2) DEFAULT 3.0
   - `temperature` INT DEFAULT 60
   - `hours` INT DEFAULT 0
   - `installation_date` DATE
   - `last_maintenance` DATE
   - `description` TEXT

3. **`maintenance`**
   - `id` VARCHAR(30) PRIMARY KEY
   - `asset_id` VARCHAR(30), FOREIGN KEY REFERENCES `assets(id)` ON DELETE CASCADE
   - `type` ENUM('Preventive', 'Corrective', 'Predictive', 'Emergency')
   - `technician` VARCHAR(100)
   - `scheduled_date` DATE
   - `priority` ENUM('Low', 'Medium', 'High', 'Critical')
   - `cost` DECIMAL(10,2)
   - `status` ENUM('Scheduled', 'In Progress', 'Completed', 'Overdue')
   - `notes` TEXT

4. **`work_orders`**
   - `id` VARCHAR(30) PRIMARY KEY
   - `asset_id` VARCHAR(30), FOREIGN KEY REFERENCES `assets(id)`
   - `issue` VARCHAR(255) NOT NULL
   - `priority` ENUM('Low', 'Medium', 'High', 'Critical')
   - `technician_id` VARCHAR(30)
   - `status` ENUM('OPEN', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED')
   - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

5. **`technicians`**
   - `id` VARCHAR(30) PRIMARY KEY
   - `name` VARCHAR(100) NOT NULL
   - `specialization` VARCHAR(100)
   - `availability` ENUM('Available', 'Busy', 'On Leave')
   - `phone` VARCHAR(20)
   - `email` VARCHAR(100)

6. **`spare_parts`**
   - `id` VARCHAR(30) PRIMARY KEY
   - `name` VARCHAR(100) NOT NULL
   - `category` VARCHAR(50)
   - `quantity` INT DEFAULT 0
   - `min_stock` INT DEFAULT 10
   - `unit_cost` DECIMAL(10,2)
   - `supplier` VARCHAR(100)

7. **`alerts`**
   - `id` VARCHAR(30) PRIMARY KEY
   - `asset_id` VARCHAR(30), FOREIGN KEY REFERENCES `assets(id)`
   - `severity` ENUM('CRITICAL', 'WARNING', 'INFO')
   - `title` VARCHAR(150)
   - `description` TEXT
   - `is_read` BOOLEAN DEFAULT FALSE
   - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

---

## 3. Planned PHP Backend Endpoints
- `/php/db.php`: PDO database connection instance with prepared statement configurations.
- `/php/assets.php`: Handles `GET` (list/read), `POST` (create), `PUT` (update), `DELETE` (delete asset).
- `/php/maintenance.php`: Handles maintenance schedule CRUD.
- `/php/workorders.php`: Handles status transitions for Kanban/Table view.
- `/php/spareparts.php`: Auto calculates stock indicator server-side (`NORMAL`, `LOW STOCK`, `OUT OF STOCK`).
- `/php/login.php`: PHP Session authentication & password hashing via `password_verify()`.

---

## 4. Security & Best Practices planned for Stage 2
- **Prepared Statements (PDO):** Complete protection against SQL Injection.
- **Input Sanitization:** `filter_var()`, `htmlspecialchars()` on all form inputs.
- **Session Protection:** `session_start()`, `session_regenerate_id(true)` to prevent session fixation.
- **Server-Side Validation:** Re-validate form parameters on the server side prior to database execution.
