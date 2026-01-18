<?php
// api/health.php - Health check endpoint

require_once 'config.php';

$response = [
    'success' => false,
    'message' => 'Database not connected'
];

// Test database connection
if ($conn->ping()) {
    $response['success'] = true;
    $response['message'] = 'Database connected';
    $response['database'] = DB_NAME;
    $response['host'] = DB_HOST;
    http_response_code(200);
} else {
    http_response_code(500);
}

echo json_encode($response);
$conn->close();
?>
