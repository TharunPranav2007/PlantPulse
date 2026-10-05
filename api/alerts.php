<?php
/* ==========================================================================
   PLANTPULSE - Telemetry Alert Center REST API Endpoint
   Supports GET (list alerts) and POST (mark as read).
   ========================================================================== */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM alerts ORDER BY created_at DESC");
        $alerts = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $alerts]);
    }
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $alertId = $input['alertId'] ?? null;
        if ($alertId) {
            $stmt = $pdo->prepare("UPDATE alerts SET is_read = TRUE WHERE id = :id");
            $stmt->execute([':id' => $alertId]);
            echo json_encode(["status" => "success", "message" => "Alert marked as read"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
