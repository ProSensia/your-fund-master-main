# Database Setup Instructions

## Supabase Configuration

Your Supabase project is already configured with the following credentials (in `.env`):

```
VITE_SUPABASE_PROJECT_ID=fyhfridoqojpxgqynttu
VITE_SUPABASE_URL=https://fyhfridoqojpxgqynttu.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Creating Tables in Supabase

1. **Go to Supabase Dashboard**: https://app.supabase.com/
2. **Select Your Project**: `fyhfridoqojpxgqynttu`
3. **Navigate to SQL Editor** in the left sidebar
4. **Create new query** and paste the SQL from `supabase/migrations/001_initial_schema.sql`
5. **Run the query** to create all tables and sample data

## Table Structure

### Expenses Table
- `id`: UUID (Primary Key)
- `description`: Text (required)
- `amount`: Decimal (required)
- `category`: Text (required)
- `date`: Date (required)
- `bill_image`: Text (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Funds Table
- `id`: UUID (Primary Key)
- `source`: Text (required)
- `amount`: Decimal (required)
- `date`: Date (required)
- `description`: Text (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Personal Budgets Table
- `id`: UUID (Primary Key)
- `category`: Text (required)
- `budget_limit`: Decimal (required)
- `spent`: Decimal
- `month`: Date (required)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Database Hooks

Created hooks for database operations:

### `useExpenses()` - Query all expenses
```typescript
const { data: expenses, isLoading } = useExpenses();
```

### `useAddExpense()` - Add new expense
```typescript
const { mutate: addExpense } = useAddExpense();
addExpense({ description, amount, category, date });
```

### `useDeleteExpense()` - Delete expense
```typescript
const { mutate: deleteExpense } = useDeleteExpense();
deleteExpense(expenseId);
```

### `useFunds()` - Query all funds
```typescript
const { data: funds, isLoading } = useFunds();
```

### `useAddFund()` - Add new fund
```typescript
const { mutate: addFund } = useAddFund();
addFund({ source, amount, date });
```

### `useDashboardData()` - Get combined dashboard data
```typescript
const { data, isLoading } = useDashboardData();
// Returns: { totalFunds, totalExpenses, balance, recentTransactions }
```

## Testing the Connection

The app will automatically test the database connection on startup. You'll see a toast notification:
- ✅ "Database connected successfully" - if connection works
- ❌ "Failed to connect to database" - if there's an issue

## Data Persistence

All data operations use React Query with automatic cache invalidation, ensuring:
- Changes are immediately reflected in the UI
- Data is synchronized across all open tabs
- Proper error handling and user feedback

## Troubleshooting

If you see "Failed to connect to database":

1. **Check Supabase Status**: Is the project running?
2. **Verify Credentials**: Are the .env values correct?
3. **Check RLS Policies**: Are policies allowing read/write access?
4. **Check Browser Console**: Look for detailed error messages
5. **Test SQL Directly**: Try the query in Supabase SQL Editor
