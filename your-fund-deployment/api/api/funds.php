<?php
// api/funds.php - Funds CRUD operations

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$response = ['success' => false];

// Create table if not exists
$createTable = "CREATE TABLE IF NOT EXISTS funds (
    id VARCHAR(36) PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$conn->query($createTable);

if ($method === 'GET') {
    // Get all funds
    $result = $conn->query("SELECT * FROM funds ORDER BY date DESC");
    
    if ($result) {
        $funds = [];
        while ($row = $result->fetch_assoc()) {
            $funds[] = $row;
        }
        $response['success'] = true;
        $response['data'] = $funds;
        http_response_code(200);
    } else {
        $response['error'] = $conn->error;
        http_response_code(500);
    }
}
elseif ($method === 'POST') {
    // Add new fund
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id = bin2hex(random_bytes(18)); // Generate UUID
    $source = $conn->real_escape_string($data['source'] ?? '');
    $amount = floatval($data['amount'] ?? 0);
    $date = $conn->real_escape_string($data['date'] ?? date('Y-m-d'));
    $description = $conn->real_escape_string($data['description'] ?? '');
    
    $sql = "INSERT INTO funds (id, source, amount, date, description) 
            VALUES ('$id', '$source', $amount, '$date', '$description')";
    
    if ($conn->query($sql)) {
        $response['success'] = true;
        $response['id'] = $id;
        $response['message'] = 'Fund added successfully';
        http_response_code(201);
    } else {
        $response['error'] = $conn->error;
        http_response_code(500);
    }
}
elseif ($method === 'DELETE') {
    // Delete fund
    parse_str($_SERVER['QUERY_STRING'], $query);
    $id = $conn->real_escape_string($query['id'] ?? '');
    
    if (!$id) {
        $response['error'] = 'ID required';
        http_response_code(400);
    } else {
        $sql = "DELETE FROM funds WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            $response['success'] = true;
            $response['message'] = 'Fund deleted successfully';
            http_response_code(200);
        } else {
            $response['error'] = $conn->error;
            http_response_code(500);
        }
    }
}
else {
    $response['error'] = 'Method not allowed';
    http_response_code(405);
}

echo json_encode($response);
$conn->close();
?>
