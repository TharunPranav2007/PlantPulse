<?php
/* ==========================================================================
   PLANTPULSE - Central PDO Database Connection Manager
   Provides secure, error-handled PDO connection to MySQL Server 8.0
   ========================================================================== */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = "127.0.0.1";
$db_name = "plantpulse_db";
$db_user = "root";
$db_pass = ""; // User can update root password if needed

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database Connection Failure: " . $e->getMessage(),
        "hint" => "Ensure MySQL Server 8.0 is running and database 'plantpulse_db' has been imported via plantpulse_schema.sql"
    ]);
    exit();
}
