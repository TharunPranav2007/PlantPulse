<?php
/* ==========================================================================
   PLANTPULSE - Analytical Aggregations REST API Endpoint
   Executes SQL GROUP BY, SUM, COUNT aggregations directly on MySQL tables.
   ========================================================================== */

require_once __DIR__ . '/db.php';

try {
    // 1. Overall Fleet Statistics
    $totalAssets = $pdo->query("SELECT COUNT(*) FROM assets")->fetchColumn();
    $operationalAssets = $pdo->query("SELECT COUNT(*) FROM assets WHERE status = 'Operational'")->fetchColumn();
    $avgHealth = round($pdo->query("SELECT AVG(health) FROM assets")->fetchColumn(), 1);
    
    // 2. Open Work Orders & Critical Alerts
    $openWorkOrders = $pdo->query("SELECT COUNT(*) FROM work_orders WHERE status NOT IN ('RESOLVED', 'CLOSED')")->fetchColumn();
    $activeAlerts = $pdo->query("SELECT COUNT(*) FROM alerts WHERE is_read = FALSE")->fetchColumn();

    // 3. Maintenance Cost by Category
    $costQuery = $pdo->query("SELECT type, SUM(cost) as total_cost FROM maintenance GROUP BY type");
    $costDistribution = $costQuery->fetchAll();

    // 4. Asset Status Distribution
    $statusQuery = $pdo->query("SELECT status, COUNT(*) as count FROM assets GROUP BY status");
    $statusDistribution = $statusQuery->fetchAll();

    echo json_encode([
        "status" => "success",
        "kpis" => [
            "totalAssets" => (int)$totalAssets,
            "operationalAssets" => (int)$operationalAssets,
            "fleetUptime" => round(($operationalAssets / max(1, $totalAssets)) * 100, 1),
            "avgHealthScore" => (float)$avgHealth,
            "openWorkOrders" => (int)$openWorkOrders,
            "activeAlerts" => (int)$activeAlerts
        ],
        "costDistribution" => $costDistribution,
        "statusDistribution" => $statusDistribution
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
