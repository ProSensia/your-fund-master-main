<?php
// api/expenses.php - Expenses CRUD operations

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$response = ['success' => false];

// Create table if not exists
$createTable = "CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(36) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    bill_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$conn->query($createTable);

if ($method === 'GET') {
    // Get all expenses
    $result = $conn->query("SELECT * FROM expenses ORDER BY date DESC");
    
    if ($result) {
        $expenses = [];
        while ($row = $result->fetch_assoc()) {
            $expenses[] = $row;
        }
        $response['success'] = true;
        $response['data'] = $expenses;
        http_response_code(200);
    } else {
        $response['error'] = $conn->error;
        http_response_code(500);
    }
}
elseif ($method === 'POST') {
    // Add new expense
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id = bin2hex(random_bytes(18)); // Generate UUID
    $description = $conn->real_escape_string($data['description'] ?? '');
    $amount = floatval($data['amount'] ?? 0);
    $category = $conn->real_escape_string($data['category'] ?? '');
    $date = $conn->real_escape_string($data['date'] ?? date('Y-m-d'));
    $bill_image = $conn->real_escape_string($data['bill_image'] ?? '');
    
    $sql = "INSERT INTO expenses (id, description, amount, category, date, bill_image) 
            VALUES ('$id', '$description', $amount, '$category', '$date', '$bill_image')";
    
    if ($conn->query($sql)) {
        $response['success'] = true;
        $response['id'] = $id;
        $response['message'] = 'Expense added successfully';
        http_response_code(201);
    } else {
        $response['error'] = $conn->error;
        http_response_code(500);
    }
}
elseif ($method === 'DELETE') {
    // Delete expense
    parse_str($_SERVER['QUERY_STRING'], $query);
    $id = $conn->real_escape_string($query['id'] ?? '');
    
    if (!$id) {
        $response['error'] = 'ID required';
        http_response_code(400);
    } else {
        $sql = "DELETE FROM expenses WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            $response['success'] = true;
            $response['message'] = 'Expense deleted successfully';
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
