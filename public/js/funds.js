// js/funds.js - Funds page functionality

async function loadFunds() {
    const data = await getFunds();
    
    if (data && data.success) {
        displayFunds(data.data);
        updateFundStats(data.data);
    }
}

function displayFunds(funds) {
    const container = document.getElementById('fundsList');
    
    if (!funds || funds.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-5">No funds yet. Add one to get started!</p>';
        return;
    }

    container.innerHTML = funds.map(fund => `
        <div class="fund-item">
            <div class="item-info flex-grow-1">
                <h6>${fund.description || fund.source}</h6>
                <small class="text-muted">
                    <i class="fas fa-calendar"></i> ${formatDate(fund.date)}
                    ${fund.description ? `<br><span>${fund.source}</span>` : ''}
                </small>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="item-amount">+ ${formatCurrency(fund.amount)}</div>
                <button class="btn btn-sm btn-outline-success" onclick="removeFund('${fund.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateFundStats(funds) {
    const total = funds.reduce((sum, fund) => sum + parseFloat(fund.amount), 0);
    document.getElementById('fundTotal').textContent = formatCurrency(total);
    document.getElementById('fundCount').textContent = funds.length;
}

async function removeFund(id) {
    if (confirm('Are you sure you want to delete this fund?')) {
        const result = await deleteFund(id);
        if (result && result.success) {
            showNotification('Fund deleted successfully', 'success');
            loadFunds();
        }
    }
}

document.getElementById('fundForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fund = {
        source: document.getElementById('source').value,
        amount: parseFloat(document.getElementById('fundAmount').value),
        date: document.getElementById('fundDate').value,
        description: document.getElementById('description').value
    };

    const result = await addFund(fund);
    
    if (result && result.success) {
        showNotification('Fund added successfully', 'success');
        document.getElementById('fundForm').reset();
        document.getElementById('fundDate').valueAsDate = new Date();
        loadFunds();
    }
});

// Load funds on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('fundDate');
    if (dateInput) {
        dateInput.value = today;
    }

    loadFunds();
});
