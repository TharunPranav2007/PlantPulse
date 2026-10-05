<?php
/* ==========================================================================
   PLANTPULSE - User Authentication REST Endpoint
   Verifies username and password credentials against MySQL `users` table.
   ========================================================================== */

require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Username and password are required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();

    if ($user) {
        // Verify hash or match default fallback passwords
        $isMatch = password_verify($password, $user['password_hash']) || 
                   ($username === 'admin' && $password === 'admin123') ||
                   ($username === 'technician' && $password === 'tech123') ||
                   ($username === 'supervisor' && $password === 'super123') ||
                   ($username === 'inventory' && $password === 'inventory123');

        if ($isMatch) {
            echo json_encode([
                "status" => "success",
                "message" => "Authentication successful",
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "name" => $user['name'],
                    "role" => $user['role'],
                    "roleKey" => $user['role_key'],
                    "employeeId" => $user['employee_id'],
                    "department" => $user['department'],
                    "avatar" => $user['avatar']
                ]
            ]);
            exit();
        }
    }

    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid username or password credentials."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
}
