// js/dashboard.js - Dashboard functionality

async function loadDashboard() {
    const data = await getDashboard();
    
    if (data && data.success) {
        // Update stats
        document.getElementById('totalFunds').textContent = formatCurrency(data.totalFunds);
        document.getElementById('totalExpenses').textContent = formatCurrency(data.totalExpenses);
        document.getElementById('balance').textContent = formatCurrency(data.balance);
        document.getElementById('transactionCount').textContent = data.recentTransactions.length;

        // Display transactions
        displayTransactions(data.recentTransactions);

        // Hide status alert
        const statusAlert = document.getElementById('statusAlert');
        if (statusAlert) {
            statusAlert.classList.add('d-none');
        }
    } else {
        showNotification('Failed to load dashboard data', 'danger');
    }
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-5">No transactions yet</p>';
        return;
    }

    container.innerHTML = transactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="d-flex align-items-center flex-grow-1">
                <div class="transaction-icon">
                    ${transaction.type === 'fund' 
                        ? '<i class="fas fa-arrow-up"></i>' 
                        : '<i class="fas fa-arrow-down"></i>'}
                </div>
                <div class="ms-3">
                    <h6 class="mb-1">${transaction.description}</h6>
                    <small class="text-muted">
                        <i class="fas fa-calendar"></i> ${formatDate(transaction.date)}
                    </small>
                </div>
            </div>
            <div class="transaction-amount">
                ${transaction.type === 'fund' ? '+' : '-'} ${formatCurrency(Math.abs(transaction.amount))}
            </div>
        </div>
    `).join('');
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    checkHealth().then(() => {
        loadDashboard();
    });

    // Refresh dashboard every 30 seconds
    setInterval(loadDashboard, 30000);
});
