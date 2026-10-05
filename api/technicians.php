<?php
/* ==========================================================================
   PLANTPULSE - Technicians Roster REST API Endpoint
   ========================================================================== */

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM technicians ORDER BY name ASC");
    $techs = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $techs]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
