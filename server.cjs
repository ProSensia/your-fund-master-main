const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// MySQL connection pool with timeouts
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'premium281.web-hosting.com',
  user: process.env.DB_USER || 'prosdfwo_expenses',
  password: process.env.DB_PASSWORD || 'ExpensesProSensia@2026',
  database: process.env.DB_NAME || 'prosdfwo_Expenses',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Test connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    res.json({ success: true, message: 'Database connected' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize tables
app.post('/api/initialize', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        bill_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS funds (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        source VARCHAR(255) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS personal_budgets (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        category VARCHAR(100) NOT NULL,
        budget_limit DECIMAL(15, 2) NOT NULL,
        spent DECIMAL(15, 2) DEFAULT 0,
        month DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    res.json({ success: true, message: 'Tables created' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [expenses] = await connection.query(
      'SELECT * FROM expenses ORDER BY date DESC'
    );
    connection.release();
    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category, date, bill_image } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO expenses (description, amount, category, date, bill_image) VALUES (?, ?, ?, ?, ?)',
      [description, amount, category, date, bill_image || null]
    );

    const [inserted] = await connection.query(
      'SELECT * FROM expenses WHERE id = ?',
      [result.insertId]
    );

    connection.release();
    res.json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM expenses WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all funds
app.get('/api/funds', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [funds] = await connection.query(
      'SELECT * FROM funds ORDER BY date DESC'
    );
    connection.release();
    res.json({ success: true, data: funds });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add fund
app.post('/api/funds', async (req, res) => {
  try {
    const { source, amount, date, description } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO funds (source, amount, date, description) VALUES (?, ?, ?, ?)',
      [source, amount, date, description || null]
    );

    const [inserted] = await connection.query(
      'SELECT * FROM funds WHERE id = ?',
      [result.insertId]
    );

    connection.release();
    res.json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete fund
app.delete('/api/funds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM funds WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [expenseResult] = await connection.query(
      'SELECT SUM(amount) as total FROM expenses'
    );
    const totalExpenses = expenseResult[0]?.total || 0;

    const [fundResult] = await connection.query(
      'SELECT SUM(amount) as total FROM funds'
    );
    const totalFunds = fundResult[0]?.total || 0;

    const [transactions] = await connection.query(`
      SELECT id, description as description, amount, date, 'expense' as type FROM expenses
      UNION ALL
      SELECT id, source as description, amount, date, 'fund' as type FROM funds
      ORDER BY date DESC
      LIMIT 10
    `);

    connection.release();

    res.json({
      success: true,
      data: {
        totalExpenses,
        totalFunds,
        balance: totalFunds - totalExpenses,
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`\n✅ API Server Running on http://localhost:${port}`);
  console.log(`📊 Database: prosdfwo_Expenses @ premium281.web-hosting.com`);
  console.log(`\n🌐 Frontend should connect to: http://localhost:${port}/api\n`);
});
