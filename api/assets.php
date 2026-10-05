<?php
/* ==========================================================================
   PLANTPULSE - Industrial Assets REST API Endpoint
   Supports GET (list/item), POST (create), PUT (update), DELETE (delete).
   ========================================================================== */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM assets WHERE id = :id");
            $stmt->execute([':id' => $_GET['id']]);
            $asset = $stmt->fetch();
            echo json_encode($asset ? $asset : ["status" => "error", "message" => "Asset not found"]);
        } else {
            $stmt = $pdo->query("SELECT * FROM assets ORDER BY created_at DESC");
            $assets = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $assets]);
        }
    } 
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        
        $sql = "INSERT INTO assets (id, name, type, unit, manufacturer, model, status, health, vibration, temperature, hours, installation_date, last_maintenance, description)
                VALUES (:id, :name, :type, :unit, :manufacturer, :model, :status, :health, :vibration, :temperature, :hours, :installation_date, :last_maintenance, :description)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':name' => $input['name'],
            ':type' => $input['type'],
            ':unit' => $input['unit'],
            ':manufacturer' => $input['manufacturer'],
            ':model' => $input['model'],
            ':status' => $input['status'] ?? 'Operational',
            ':health' => $input['health'] ?? 100,
            ':vibration' => $input['vibration'] ?? 2.50,
            ':temperature' => $input['temperature'] ?? 65,
            ':hours' => $input['hours'] ?? 0,
            ':installation_date' => $input['installation_date'] ?? $input['installationDate'] ?? date('Y-m-d'),
            ':last_maintenance' => $input['last_maintenance'] ?? $input['lastMaintenance'] ?? date('Y-m-d'),
            ':description' => $input['description'] ?? ''
        ]);

        echo json_encode(["status" => "success", "message" => "Asset created successfully", "id" => $input['id']]);
    }
    elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);
        
        $sql = "UPDATE assets SET name = :name, type = :type, unit = :unit, manufacturer = :manufacturer, 
                model = :model, status = :status, health = :health, vibration = :vibration, temperature = :temperature, 
                hours = :hours, last_maintenance = :last_maintenance, description = :description WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':name' => $input['name'],
            ':type' => $input['type'],
            ':unit' => $input['unit'],
            ':manufacturer' => $input['manufacturer'],
            ':model' => $input['model'],
            ':status' => $input['status'],
            ':health' => $input['health'],
            ':vibration' => $input['vibration'],
            ':temperature' => $input['temperature'],
            ':hours' => $input['hours'],
            ':last_maintenance' => $input['last_maintenance'] ?? $input['lastMaintenance'] ?? date('Y-m-d'),
            ':description' => $input['description']
        ]);

        echo json_encode(["status" => "success", "message" => "Asset updated successfully"]);
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM assets WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["status" => "success", "message" => "Asset deleted successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing asset ID"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
