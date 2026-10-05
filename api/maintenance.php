<?php
/* ==========================================================================
   PLANTPULSE - Maintenance Schedules REST API Endpoint
   ========================================================================== */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM maintenance ORDER BY scheduled_date ASC");
        $maint = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $maint]);
    }
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $sql = "INSERT INTO maintenance (id, asset_id, asset_name, type, technician, scheduled_date, priority, cost, status, notes)
                VALUES (:id, :asset_id, :asset_name, :type, :technician, :scheduled_date, :priority, :cost, :status, :notes)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':asset_id' => $input['asset_id'] ?? $input['assetId'],
            ':asset_name' => $input['asset_name'] ?? $input['assetName'],
            ':type' => $input['type'],
            ':technician' => $input['technician'],
            ':scheduled_date' => $input['scheduled_date'] ?? $input['scheduledDate'],
            ':priority' => $input['priority'] ?? 'Medium',
            ':cost' => $input['cost'] ?? 0.00,
            ':status' => $input['status'] ?? 'Scheduled',
            ':notes' => $input['notes'] ?? ''
        ]);
        echo json_encode(["status" => "success", "message" => "Maintenance record created"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
