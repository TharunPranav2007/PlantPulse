# PlantPulse - Stage 2 MySQL & PHP Integration Guide
**Academic Evaluation Target:** LWP Review 02 (Dynamic Web Application using MySQL & PHP 8.x)

---

## 🟢 Overview of Stage 2 Architecture

In **Stage 2**, PlantPulse transitions from client-side storage to a relational **MySQL Server 8.0** database backend powered by a RESTful **PHP 8.x (PDO)** API layer:

```
+-----------------------------------------------------------------------+
|                      PRESENTATION LAYER (HTML5/CSS3/JS)               |
|            Command Center Dashboard, Assets, Work Orders, etc.        |
+-----------------------------------------------------------------------+
                                   │
                           fetch() HTTP Requests
                                   │
                                   ▼
+-----------------------------------------------------------------------+
|                       PHP RESTful API LAYER (api/*.php)               |
|    db.php | login.php | assets.php | workorders.php | spareparts.php |  |
+-----------------------------------------------------------------------+
                                   │
                         PDO Prepared Statements
                                   │
                                   ▼
+-----------------------------------------------------------------------+
|                   RELATIONAL MYSQL DATABASE (plantpulse_db)           |
|  users | assets | maintenance | work_orders | technicians | spare_parts |
+-----------------------------------------------------------------------+
```

---

## 🛠️ Step-by-Step MySQL Database Setup Instructions

Since **MySQL Server 8.0 & MySQL Workbench 8.0** are already installed on your PC, follow these simple steps to initialize the database:

### Step 1: Execute SQL Schema & Data Seed Script

1. Open **MySQL Workbench 8.0** or **MySQL Shell / Command Line**.
2. Connect to your local MySQL instance (e.g. `localhost:3306` with user `root`).
3. Open the generated script file:
   `c:\Users\work\Downloads\WT Lab Project\database\plantpulse_schema.sql`
4. Execute the entire script. It will automatically:
   - Create database `plantpulse_db`
   - Create all 9 relational tables with primary keys, foreign keys, and indexes
   - Insert all initial demo data (users, assets, work orders, technicians, spare parts, alerts)

#### Alternatively, via PowerShell Command Line:
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "c:\Users\work\Downloads\WT Lab Project\database\plantpulse_schema.sql"
```

---

## 🌐 Running the PHP Server

To run the PHP REST API endpoints:

### Option A: Using Built-in PHP Development Server
If you have PHP installed:
```powershell
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

### Option B: Using XAMPP / WAMP Server
1. Copy or symlink the project folder `WT Lab Project` into your web root (e.g. `C:\xampp\htdocs\WT Lab Project`).
2. Start **Apache** and **MySQL** in XAMPP Control Panel.
3. Access the application in your web browser:
   `http://localhost/WT%20Lab%20Project/`

---

## 📁 REST API Endpoints Created in Stage 2

| Endpoint | Method | Description | MySQL Query / Operation |
|---|---|---|---|
| `api/db.php` | N/A | Central PDO database connection helper | Configures `PDO::ERRMODE_EXCEPTION` and UTF-8 charset |
| `api/login.php` | `POST` | Authenticates user credentials | `SELECT * FROM users WHERE username = :username` |
| `api/assets.php` | `GET`, `POST`, `PUT`, `DELETE` | Full asset management CRUD | `SELECT`, `INSERT`, `UPDATE`, `DELETE` on `assets` table |
| `api/workorders.php` | `GET`, `POST`, `PUT` | Work Orders Kanban & Table | `INSERT` & `UPDATE` on `work_orders` table |
| `api/spareparts.php` | `GET`, `POST` | Inventory stock management | `UPDATE spare_parts` + `INSERT stock_movements` + Auto Alert |
| `api/analytics.php` | `GET` | SQL Analytical Aggregations | `SELECT COUNT(*), AVG(health), SUM(cost) FROM ... GROUP BY` |
| `api/alerts.php` | `GET`, `POST` | Critical telemetry alert center | `SELECT * FROM alerts ORDER BY created_at DESC` |
| `api/activity.php` | `GET`, `POST` | Real-time audit activity feed | `SELECT * FROM activity_log ORDER BY id DESC LIMIT 25` |

---

## 🔒 Security Features Implemented
1. **PDO Prepared Statements**: Prevents SQL Injection attacks on all queries.
2. **Auto Fallback / Hybrid Mode**: If PHP/MySQL is active, the app reads and writes directly to MySQL database `plantpulse_db`. If offline, it smoothly falls back to LocalStorage without breaking any UI!
