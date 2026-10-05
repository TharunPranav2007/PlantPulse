<?php
/* ==========================================================================
   PLANTPULSE - Spare Parts Inventory REST API Endpoint
   Handles inventory listing, stock updates, stock movement logs, and low-stock alerts.
   ========================================================================== */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmtParts = $pdo->query("SELECT * FROM spare_parts ORDER BY name ASC");
        $parts = $stmtParts->fetchAll();

        $stmtMovements = $pdo->query("SELECT * FROM stock_movements ORDER BY created_at DESC LIMIT 20");
        $movements = $stmtMovements->fetchAll();

        echo json_encode([
            "status" => "success",
            "parts" => $parts,
            "movements" => $movements
        ]);
    }
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $action = $input['action'] ?? '';

        if ($action === 'update_stock') {
            $partId = $input['partId'];
            $changeQty = (int)$input['changeQty'];
            $type = $input['type']; // 'IN' or 'OUT'
            $user = $input['user'] ?? 'Inventory Manager';

            // Get existing part
            $stmt = $pdo->prepare("SELECT * FROM spare_parts WHERE id = :id");
            $stmt->execute([':id' => $partId]);
            $part = $stmt->fetch();

            if (!$part) {
                http_response_code(444);
                echo json_encode(["status" => "error", "message" => "Spare Part not found"]);
                exit();
            }

            $newQty = ($type === 'IN') ? ($part['quantity'] + $changeQty) : max(0, $part['quantity'] - $changeQty);

            // Update spare_parts table
            $updateStmt = $pdo->prepare("UPDATE spare_parts SET quantity = :qty WHERE id = :id");
            $updateStmt->execute([':qty' => $newQty, ':id' => $partId]);

            // Log stock movement
            $logStmt = $pdo->prepare("INSERT INTO stock_movements (part_id, part_name, type, quantity, user, date) 
                                     VALUES (:part_id, :part_name, :type, :qty, :user, :date)");
            $logStmt->execute([
                ':part_id' => $partId,
                ':part_name' => $part['name'],
                ':type' => $type,
                ':qty' => $changeQty,
                ':user' => $user,
                ':date' => date('Y-m-d')
            ]);

            // Check if quantity fell below min_stock -> Trigger Alert
            if ($newQty < $part['min_stock']) {
                $alertId = "ALT-" . time();
                $alertStmt = $pdo->prepare("INSERT INTO alerts (id, asset_id, severity, title, description) 
                                           VALUES (:id, :part_id, 'WARNING', :title, :desc)");
                $alertStmt->execute([
                    ':id' => $alertId,
                    ':part_id' => $partId,
                    ':title' => "Low Stock Warning: " . $part['name'],
                    ':desc' => "Inventory level ({$newQty} units) dropped below minimum safety threshold ({$part['min_stock']} units)."
                ]);
            }

            echo json_encode(["status" => "success", "newQuantity" => $newQty, "message" => "Stock updated successfully"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
