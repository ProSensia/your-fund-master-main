<?php
// api/dashboard.php - Dashboard data endpoint

require_once 'config.php';

// Get total funds
$fundsResult = $conn->query("SELECT SUM(amount) as total FROM funds");
$fundsRow = $fundsResult->fetch_assoc();
$totalFunds = floatval($fundsRow['total'] ?? 0);

// Get total expenses
$expensesResult = $conn->query("SELECT SUM(amount) as total FROM expenses");
$expensesRow = $expensesResult->fetch_assoc();
$totalExpenses = floatval($expensesRow['total'] ?? 0);

// Calculate balance
$balance = $totalFunds - $totalExpenses;

// Get recent transactions
$recentResult = $conn->query("
    (SELECT id, description, amount, date, 'expense' as type FROM expenses ORDER BY date DESC LIMIT 5)
    UNION ALL
    (SELECT id, description, amount, date, 'fund' as type FROM funds ORDER BY date DESC LIMIT 5)
    ORDER BY date DESC LIMIT 10
");

$recentTransactions = [];
if ($recentResult) {
    while ($row = $recentResult->fetch_assoc()) {
        $recentTransactions[] = $row;
    }
}

$response = [
    'success' => true,
    'totalFunds' => $totalFunds,
    'totalExpenses' => $totalExpenses,
    'balance' => $balance,
    'recentTransactions' => $recentTransactions
];

http_response_code(200);
echo json_encode($response);
$conn->close();
?>
