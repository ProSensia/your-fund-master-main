# MySQL Database Setup - Your Fund App

## ✅ Database Connection Configured

Your app is now configured to use **MySQL** with these credentials:

- **Host:** premium281.web-hosting.com
- **Database:** prosdfwo_Expenses
- **Username:** prosdfwo_expenses
- **Password:** ExpensesProSensia@2026
- **Port:** 3306

## 🚀 Getting Started

### Step 1: Start the Backend API Server

Open a **new terminal** and run:

```bash
npm run server
```

You should see:
```
API server running on http://localhost:3001
```

### Step 2: Start the Frontend Dev Server

In your **current terminal**, keep running:

```bash
npm run dev
```

The frontend will be on http://localhost:8080/

### Optional: Run Both Simultaneously

If you want both servers in one command:

```bash
npm run dev:full
```

This starts both the API server (port 3001) and Vite dev server (port 8080).

---

## 📋 How It Works

```
Frontend (Vite + React)
    ↓
API Calls (http://localhost:3001/api)
    ↓
Backend Server (Express + TypeScript)
    ↓
MySQL Database (premium281.web-hosting.com)
```

### API Endpoints

**Health Check:**
- `GET /api/health` - Test database connection

**Initialize Tables:**
- `POST /api/initialize` - Create tables if they don't exist

**Expenses:**
- `GET /api/expenses` - Fetch all expenses
- `POST /api/expenses` - Add new expense
- `DELETE /api/expenses/:id` - Delete expense

**Funds:**
- `GET /api/funds` - Fetch all funds
- `POST /api/funds` - Add new fund
- `DELETE /api/funds/:id` - Delete fund

**Dashboard:**
- `GET /api/dashboard` - Get dashboard data (totals + recent transactions)

---

## 🛠️ Environment Variables

Your `.env` file is configured:

```
VITE_DB_HOST="premium281.web-hosting.com"
VITE_DB_USER="prosdfwo_expenses"
VITE_DB_PASSWORD="ExpensesProSensia@2026"
VITE_DB_NAME="prosdfwo_Expenses"
VITE_DB_PORT="3306"
VITE_DB_TYPE="mysql"
```

---

## ✨ Features Implemented

✅ **MySQL Connection Pool** - Efficient database access  
✅ **Express Backend** - RESTful API server  
✅ **React Query Integration** - Smart caching and updates  
✅ **Full CRUD Operations** - Create, Read, Update, Delete  
✅ **Error Handling** - User-friendly error messages  
✅ **Toast Notifications** - Real-time feedback  
✅ **Loading States** - Skeleton UI while loading  
✅ **Type Safety** - Full TypeScript support  

---

## 🔄 Data Flow Example

### Adding an Expense

1. **User fills form** in React component
2. **Frontend calls API**: `POST /api/expenses`
3. **Express validates** and prepares data
4. **MySQL executes** INSERT query
5. **Database responds** with inserted record
6. **React Query** invalidates cache
7. **UI automatically updates** with new expense
8. **Toast notification** shows success message

---

## 🧪 Testing

### Manual Test Steps

1. **Both servers running?**
   - Terminal 1: `npm run server`
   - Terminal 2: `npm run dev`

2. **See success message?**
   - Check top-right of app for "MySQL Database Connected"

3. **Test Add Expense:**
   - Go to http://localhost:8080/expenses
   - Click "Add Expense"
   - Fill form and submit
   - Should appear immediately in the list

4. **Test Add Fund:**
   - Go to http://localhost:8080/funds
   - Click "Add Fund"
   - Fill form and submit
   - Should appear immediately in the list

5. **Check Dashboard:**
   - Go to http://localhost:8080/
   - Should show real totals from database
   - Should show recent transactions

---

## ⚠️ Troubleshooting

### "Failed to connect to database"

**Problem:** API server not running

**Solution:**
```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```

### API Server Not Starting

**Problem:** Port 3001 already in use

**Solution:**
```bash
# Find process on port 3001 and kill it
# Or change port in server.ts

# Or edit package.json scripts to use different port
"server": "ts-node server.ts --port 3002"
```

### Data Not Persisting

**Problem:** Database connection issue

**Check:**
1. Is MySQL server running?
2. Are credentials correct?
3. Does database exist?
4. Check browser console (F12) for errors
5. Check terminal output for API errors

### Slow Performance

**Solution:**
- API responses are cached for 5 seconds
- Manual refresh resets cache
- Add pagination for large datasets

---

## 📁 File Structure

```
project/
├── server.ts                    # Express backend server
├── .env                         # MySQL credentials
├── src/
│   ├── hooks/
│   │   ├── useExpenses.ts      # Expense operations
│   │   ├── useFunds.ts         # Fund operations
│   │   └── useDashboard.ts     # Dashboard data
│   ├── integrations/
│   │   └── mysql/
│   │       └── client.ts       # MySQL utilities
│   └── pages/
│       ├── Dashboard.tsx        # Dashboard page
│       ├── Expenses.tsx         # Expenses page
│       └── Funds.tsx            # Funds page
└── package.json                 # npm scripts
```

---

## 📚 Available Commands

```bash
# Start API server only
npm run server

# Start Vite dev server only
npm run dev

# Start both servers together
npm run dev:full

# Build for production
npm build

# Run tests
npm test

# Lint code
npm lint
```

---

## 🔒 Security Notes

- Credentials in `.env` are for development only
- In production, use environment variables
- Never commit `.env` with real passwords
- Use `.env.example` for sharing configuration template

---

## 📊 Database Tables Created

### expenses table
```sql
CREATE TABLE expenses (
  id VARCHAR(36) PRIMARY KEY,
  description VARCHAR(255),
  amount DECIMAL(15, 2),
  category VARCHAR(100),
  date DATE,
  bill_image VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### funds table
```sql
CREATE TABLE funds (
  id VARCHAR(36) PRIMARY KEY,
  source VARCHAR(255),
  amount DECIMAL(15, 2),
  date DATE,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### personal_budgets table
```sql
CREATE TABLE personal_budgets (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(100),
  budget_limit DECIMAL(15, 2),
  spent DECIMAL(15, 2),
  month DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 🎯 What's Next

- ✅ MySQL connection configured
- ✅ Backend API server created
- ✅ Frontend hooks updated
- ✅ CRUD operations working
- ⏳ (Optional) Add bill image storage
- ⏳ (Optional) Implement personal budgets
- ⏳ (Optional) Implement reports

---

**Status: Ready to Run!**

Start both servers and visit http://localhost:8080/ to use the app.

All data will be saved to your MySQL database.
