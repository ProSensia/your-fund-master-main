// js/expenses.js - Expenses page functionality

async function loadExpenses() {
    const data = await getExpenses();
    
    if (data && data.success) {
        displayExpenses(data.data);
        updateExpenseStats(data.data);
    }
}

function displayExpenses(expenses) {
    const container = document.getElementById('expensesList');
    
    if (!expenses || expenses.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-5">No expenses yet. Add one to get started!</p>';
        return;
    }

    container.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="item-info flex-grow-1">
                <h6>${expense.description}</h6>
                <small class="text-muted">
                    <i class="fas fa-calendar"></i> ${formatDate(expense.date)} 
                    <span class="ms-2">
                        <span class="category-badge">${expense.category}</span>
                    </span>
                </small>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="item-amount">- ${formatCurrency(expense.amount)}</div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeExpense('${expense.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateExpenseStats(expenses) {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    document.getElementById('expenseTotal').textContent = formatCurrency(total);
    document.getElementById('expenseCount').textContent = expenses.length;
}

async function removeExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        const result = await deleteExpense(id);
        if (result && result.success) {
            showNotification('Expense deleted successfully', 'success');
            loadExpenses();
        }
    }
}

document.getElementById('expenseForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const expense = {
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('expenseDate').value
    };

    const result = await addExpense(expense);
    
    if (result && result.success) {
        showNotification('Expense added successfully', 'success');
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').valueAsDate = new Date();
        loadExpenses();
    }
});

// Load expenses on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('expenseDate');
    if (dateInput) {
        dateInput.value = today;
    }

    loadExpenses();
});
