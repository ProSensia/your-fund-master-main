<?php
// config.php - Database configuration

define('DB_HOST', getenv('DB_HOST') ?: 'premium281.web-hosting.com');
define('DB_USER', getenv('DB_USER') ?: 'prosdfwo_expenses');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: 'ExpensesProSensia@2026');
define('DB_NAME', getenv('DB_NAME') ?: 'prosdfwo_Expenses');
define('DB_PORT', getenv('DB_PORT') ?: 3306);

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON headers by default
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset to utf8
$conn->set_charset("utf8");

?>
