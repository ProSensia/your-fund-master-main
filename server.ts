import express, { Express, Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'premium281.web-hosting.com',
  user: process.env.DB_USER || 'prosdfwo_expenses',
  password: process.env.DB_PASSWORD || 'ExpensesProSensia@2026',
  database: process.env.DB_NAME || 'prosdfwo_Expenses',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    res.json({ success: true, message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Initialize tables
app.post('/api/initialize', async (req: Request, res: Response) => {
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
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Expenses endpoints
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [expenses] = await connection.query(
      'SELECT * FROM expenses ORDER BY date DESC'
    );
    connection.release();
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/expenses', async (req: Request, res: Response) => {
  try {
    const { description, amount, category, date, bill_image } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO expenses (description, amount, category, date, bill_image) VALUES (?, ?, ?, ?, ?)',
      [description, amount, category, date, bill_image || null]
    ) as any;

    const [inserted] = await connection.query(
      'SELECT * FROM expenses WHERE id = ?',
      [result.insertId]
    );

    connection.release();
    res.json({ success: true, data: (inserted as any)[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.delete('/api/expenses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM expenses WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Funds endpoints
app.get('/api/funds', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [funds] = await connection.query(
      'SELECT * FROM funds ORDER BY date DESC'
    );
    connection.release();
    res.json({ success: true, data: funds });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/funds', async (req: Request, res: Response) => {
  try {
    const { source, amount, date, description } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO funds (source, amount, date, description) VALUES (?, ?, ?, ?)',
      [source, amount, date, description || null]
    ) as any;

    const [inserted] = await connection.query(
      'SELECT * FROM funds WHERE id = ?',
      [result.insertId]
    );

    connection.release();
    res.json({ success: true, data: (inserted as any)[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.delete('/api/funds/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM funds WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Dashboard data
app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();

    const [expenseResult] = await connection.query(
      'SELECT SUM(amount) as total FROM expenses'
    ) as any;
    const totalExpenses = (expenseResult as any)[0]?.total || 0;

    const [fundResult] = await connection.query(
      'SELECT SUM(amount) as total FROM funds'
    ) as any;
    const totalFunds = (fundResult as any)[0]?.total || 0;

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
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

export default app;
