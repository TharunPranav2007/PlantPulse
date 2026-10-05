<?php
/* ==========================================================================
   PLANTPULSE - Work Orders REST API Endpoint
   Supports GET (list/filter), POST (create), PUT (update status/notes).
   ========================================================================== */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM work_orders ORDER BY created_at DESC");
        $workOrders = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $workOrders]);
    }
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        
        $sql = "INSERT INTO work_orders (id, asset_id, asset_name, issue, priority, technician, assigned_by, status, created_date, due_date, resolution_notes)
                VALUES (:id, :asset_id, :asset_name, :issue, :priority, :technician, :assigned_by, :status, :created_date, :due_date, :resolution_notes)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':asset_id' => $input['asset_id'] ?? $input['assetId'],
            ':asset_name' => $input['asset_name'] ?? $input['assetName'],
            ':issue' => $input['issue'],
            ':priority' => $input['priority'] ?? 'Medium',
            ':technician' => $input['technician'],
            ':assigned_by' => $input['assigned_by'] ?? 'Priya Sharma',
            ':status' => $input['status'] ?? 'OPEN',
            ':created_date' => $input['created_date'] ?? date('Y-m-d'),
            ':due_date' => $input['due_date'] ?? date('Y-m-d', strtotime('+3 days')),
            ':resolution_notes' => $input['resolution_notes'] ?? ''
        ]);

        echo json_encode(["status" => "success", "message" => "Work Order created successfully", "id" => $input['id']]);
    }
    elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);
        
        $sql = "UPDATE work_orders SET status = :status, technician = :technician, resolution_notes = :resolution_notes WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':status' => $input['status'],
            ':technician' => $input['technician'] ?? '',
            ':resolution_notes' => $input['resolution_notes'] ?? $input['resolutionNotes'] ?? ''
        ]);

        echo json_encode(["status" => "success", "message" => "Work Order status updated"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
