import mysql from 'mysql2/promise';

// MySQL connection pool configuration
const pool = mysql.createPool({
  host: import.meta.env.VITE_DB_HOST || 'premium281.web-hosting.com',
  user: import.meta.env.VITE_DB_USER || 'prosdfwo_expenses',
  password: import.meta.env.VITE_DB_PASSWORD || 'ExpensesProSensia@2026',
  database: import.meta.env.VITE_DB_NAME || 'prosdfwo_Expenses',
  port: parseInt(import.meta.env.VITE_DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

export interface MySQLResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Expense {
  id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  bill_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Fund {
  id?: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1');
    connection.release();
    console.log('✅ MySQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
};

// Initialize tables if they don't exist
export const initializeTables = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    // Create expenses table
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

    // Create funds table
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

    // Create personal_budgets table
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
    console.log('✅ Tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
  }
};

// Expense operations
export const getExpenses = async (): Promise<MySQLResponse<Expense[]>> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM expenses ORDER BY date DESC');
    connection.release();
    return { success: true, data: rows as Expense[] };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return { success: false, error: String(error) };
  }
};

export const addExpense = async (expense: Expense): Promise<MySQLResponse<Expense>> => {
  try {
    const connection = await pool.getConnection();
    const query = 'INSERT INTO expenses (description, amount, category, date, bill_image) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(query, [
      expense.description,
      expense.amount,
      expense.category,
      expense.date,
      expense.bill_image || null,
    ]) as any;

    // Fetch the inserted record
    const [inserted] = await connection.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
    connection.release();
    return { success: true, data: (inserted as any)[0] };
  } catch (error) {
    console.error('Error adding expense:', error);
    return { success: false, error: String(error) };
  }
};

export const deleteExpense = async (id: string): Promise<MySQLResponse<null>> => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM expenses WHERE id = ?', [id]);
    connection.release();
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: String(error) };
  }
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<MySQLResponse<Expense>> => {
  try {
    const connection = await pool.getConnection();
    const fields: string[] = [];
    const values: any[] = [];

    if (expense.description !== undefined) {
      fields.push('description = ?');
      values.push(expense.description);
    }
    if (expense.amount !== undefined) {
      fields.push('amount = ?');
      values.push(expense.amount);
    }
    if (expense.category !== undefined) {
      fields.push('category = ?');
      values.push(expense.category);
    }
    if (expense.date !== undefined) {
      fields.push('date = ?');
      values.push(expense.date);
    }
    if (expense.bill_image !== undefined) {
      fields.push('bill_image = ?');
      values.push(expense.bill_image);
    }

    values.push(id);

    const query = `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`;
    await connection.execute(query, values);

    const [updated] = await connection.query('SELECT * FROM expenses WHERE id = ?', [id]);
    connection.release();
    return { success: true, data: (updated as any)[0] };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, error: String(error) };
  }
};

// Fund operations
export const getFunds = async (): Promise<MySQLResponse<Fund[]>> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM funds ORDER BY date DESC');
    connection.release();
    return { success: true, data: rows as Fund[] };
  } catch (error) {
    console.error('Error fetching funds:', error);
    return { success: false, error: String(error) };
  }
};

export const addFund = async (fund: Fund): Promise<MySQLResponse<Fund>> => {
  try {
    const connection = await pool.getConnection();
    const query = 'INSERT INTO funds (source, amount, date, description) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(query, [
      fund.source,
      fund.amount,
      fund.date,
      fund.description || null,
    ]) as any;

    const [inserted] = await connection.query('SELECT * FROM funds WHERE id = ?', [result.insertId]);
    connection.release();
    return { success: true, data: (inserted as any)[0] };
  } catch (error) {
    console.error('Error adding fund:', error);
    return { success: false, error: String(error) };
  }
};

export const deleteFund = async (id: string): Promise<MySQLResponse<null>> => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM funds WHERE id = ?', [id]);
    connection.release();
    return { success: true };
  } catch (error) {
    console.error('Error deleting fund:', error);
    return { success: false, error: String(error) };
  }
};

// Dashboard data
export const getDashboardData = async () => {
  try {
    const connection = await pool.getConnection();

    // Get total expenses
    const [expenseResult] = await connection.query(
      'SELECT SUM(amount) as total FROM expenses'
    ) as any;
    const totalExpenses = expenseResult[0]?.total || 0;

    // Get total funds
    const [fundResult] = await connection.query(
      'SELECT SUM(amount) as total FROM funds'
    ) as any;
    const totalFunds = fundResult[0]?.total || 0;

    // Get recent transactions (combined)
    const [expenses] = await connection.query(
      'SELECT id, description as description, amount, date, "expense" as type FROM expenses UNION ALL SELECT id, source as description, amount, date, "fund" as type FROM funds ORDER BY date DESC LIMIT 10'
    ) as any;

    connection.release();

    return {
      success: true,
      data: {
        totalExpenses,
        totalFunds,
        balance: totalFunds - totalExpenses,
        recentTransactions: expenses || [],
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: String(error) };
  }
};

export const mysqlPool = pool;
