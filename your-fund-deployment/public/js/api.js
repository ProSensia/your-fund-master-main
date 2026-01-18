// js/api.js - API utility functions

const API_BASE_URL = '/api';

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-PK', options);
}

// Show notification
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container-fluid');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => alertDiv.remove(), 4000);
    }
}

// Fetch with error handling
async function apiFetch(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'API Error');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'danger');
        return null;
    }
}

// Get all expenses
async function getExpenses() {
    return await apiFetch('expenses.php', 'GET');
}

// Add expense
async function addExpense(expense) {
    return await apiFetch('expenses.php', 'POST', expense);
}

// Delete expense
async function deleteExpense(id) {
    const url = `${API_BASE_URL}/expenses.php?id=${id}`;
    try {
        const response = await fetch(url, { method: 'DELETE' });
        return await response.json();
    } catch (error) {
        showNotification('Failed to delete expense', 'danger');
        return null;
    }
}

// Get all funds
async function getFunds() {
    return await apiFetch('funds.php', 'GET');
}

// Add fund
async function addFund(fund) {
    return await apiFetch('funds.php', 'POST', fund);
}

// Delete fund
async function deleteFund(id) {
    const url = `${API_BASE_URL}/funds.php?id=${id}`;
    try {
        const response = await fetch(url, { method: 'DELETE' });
        return await response.json();
    } catch (error) {
        showNotification('Failed to delete fund', 'danger');
        return null;
    }
}

// Get dashboard data
async function getDashboard() {
    return await apiFetch('dashboard.php', 'GET');
}

// Check API health
async function checkHealth() {
    return await apiFetch('health.php', 'GET');
}
