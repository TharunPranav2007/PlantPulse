<?php
/* ==========================================================================
   PLANTPULSE - Activity Log Feed REST API Endpoint
   ========================================================================== */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM activity_log ORDER BY id DESC LIMIT 25");
        $logs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $logs]);
    }
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO activity_log (user, role, action) VALUES (:user, :role, :action)");
        $stmt->execute([
            ':user' => $input['user'] ?? 'System',
            ':role' => $input['role'] ?? 'Automated',
            ':action' => $input['action']
        ]);
        echo json_encode(["status" => "success", "message" => "Activity logged"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
