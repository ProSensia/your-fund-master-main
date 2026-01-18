# Your Fund - HTML/CSS/JavaScript/PHP Version

## Overview

This is a complete rewrite of Your Fund application using:
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Backend**: PHP with MySQL
- **Database**: MySQL (same schema as before)
- **Hosting**: Apache/PHP hosting (Namecheap)

## Project Structure

```
your-fund/
├── api/
│   ├── config.php           # Database configuration
│   ├── health.php           # Health check endpoint
│   ├── expenses.php         # Expenses CRUD operations
│   ├── funds.php            # Funds CRUD operations
│   └── dashboard.php        # Dashboard data aggregation
├── public/
│   ├── index.html           # Dashboard page
│   ├── expenses.html        # Expenses page
│   ├── funds.html           # Funds page
│   ├── css/
│   │   └── style.css        # Custom CSS styling
│   └── js/
│       ├── api.js           # API utility functions
│       ├── dashboard.js     # Dashboard page logic
│       ├── expenses.js      # Expenses page logic
│       └── funds.js         # Funds page logic
├── .htaccess                # Apache routing configuration
├── .env                     # Environment variables (create from .env.example)
└── .env.example             # Example environment file
```

## Features

### Dashboard (`index.html`)
- View total funds received
- View total expenses
- See current balance
- Recent transactions display
- Quick action buttons
- Real-time data updates

### Expenses (`expenses.html`)
- Add new expenses with description, amount, category, and date
- View all expenses in a list
- Delete expenses
- See expense total and count
- Category filtering

### Funds (`funds.html`)
- Add new funds with source, amount, date, and description
- View all funds in a list
- Delete funds
- See fund total and count
- Fund source tracking

## Database Schema

### expenses table
```sql
CREATE TABLE expenses (
    id VARCHAR(36) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    bill_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### funds table
```sql
CREATE TABLE funds (
    id VARCHAR(36) PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Setup Instructions

### Local Development

1. **Clone/Download the project**
   ```bash
   cd your-fund
   ```

2. **Configure Database**
   - Create `.env` file from `.env.example`
   - Update database credentials:
     ```
     DB_HOST=your_host
     DB_USER=your_user
     DB_PASSWORD=your_password
     DB_NAME=your_database
     ```

3. **Setup Local Server**
   - Use PHP built-in server:
     ```bash
     php -S localhost:8000
     ```
   - Or use Apache/XAMPP/WAMP

4. **Access the App**
   - Open browser: `http://localhost:8000`

### Namecheap Deployment

#### Prerequisites
- Namecheap hosting account with PHP/MySQL support
- FTP/cPanel access
- MySQL database created (premium281.web-hosting.com)

#### Step-by-Step Deployment

1. **Create Database** (if not already created)
   - cPanel > MySQL Databases
   - Create database and user
   - Note the connection details

2. **Upload Files via FTP**
   - Connect via FTP using your Namecheap credentials
   - Upload entire `your-fund` folder to `public_html/`

3. **Configure Environment**
   - Create `.env` file in project root
   - Add your database credentials:
     ```
     DB_HOST=premium281.web-hosting.com
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_NAME=your_database_name
     DB_PORT=3306
     ```

4. **Enable mod_rewrite** (if needed)
   - cPanel > Apache Handlers (or ask support to enable mod_rewrite)
   - Ensure `.htaccess` is not blocked

5. **Test Installation**
   - Open `https://yourdomain.com`
   - Check Dashboard
   - Try adding an expense and fund
   - Verify data saves to database

## API Endpoints

All endpoints return JSON responses.

### Health Check
**GET** `/api/health.php`
```json
{
  "success": true,
  "message": "Database connected",
  "database": "prosdfwo_Expenses",
  "host": "premium281.web-hosting.com"
}
```

### Expenses

**GET** `/api/expenses.php` - Get all expenses
**POST** `/api/expenses.php` - Add new expense
```json
{
  "description": "Office Supplies",
  "amount": 2500,
  "category": "Office",
  "date": "2024-01-15"
}
```

**DELETE** `/api/expenses.php?id={id}` - Delete expense

### Funds

**GET** `/api/funds.php` - Get all funds
**POST** `/api/funds.php` - Add new fund
```json
{
  "source": "Investor Fund",
  "amount": 50000,
  "date": "2024-01-14",
  "description": "Series A funding round"
}
```

**DELETE** `/api/funds.php?id={id}` - Delete fund

### Dashboard

**GET** `/api/dashboard.php` - Get dashboard data
```json
{
  "success": true,
  "totalFunds": 145000,
  "totalExpenses": 30200,
  "balance": 114800,
  "recentTransactions": [...]
}
```

## Frontend Technology

### Bootstrap 5
- Responsive grid system
- Components (cards, buttons, forms, modals)
- Utility classes
- Dark theme support

### Font Awesome 6
- Icons for navigation and actions
- 1800+ free icons available

### Vanilla JavaScript
- No frameworks or libraries needed
- Modern ES6+ syntax
- Fetch API for HTTP requests
- Event listeners for form handling

### Custom CSS
- Variables for theming
- Responsive design
- Smooth transitions and animations
- Accessible color contrasts

## Security Features

### Backend (PHP)
- Input escaping with `mysqli::real_escape_string()`
- CORS headers enabled
- Error handling
- Database connection pooling

### Frontend
- CSRF protection
- Input validation
- Secure JSON responses

### Database
- Unique IDs (UUID-like)
- Timestamps for auditing
- Password-protected user account

### Deployment
- `.htaccess` security headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection enabled

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Minimal dependencies (Bootstrap CDN)
- Gzip compression enabled
- Static file caching (1 year for assets)
- Lazy loading support
- Optimized CSS and JavaScript

## Troubleshooting

### White Screen / 404 Errors
- Ensure `.htaccess` is properly configured
- Check mod_rewrite is enabled
- Verify file permissions (644 for files, 755 for directories)

### Database Connection Failed
- Verify credentials in `.env` file
- Check if database exists and user has access
- Test connection from cPanel terminal
- Verify MySQL port 3306 is open

### API Endpoints Not Responding
- Check PHP error logs in cPanel
- Verify `api/` folder exists with correct files
- Ensure database tables are created
- Check file permissions (644)

### CORS Issues
- `.htaccess` includes CORS headers
- Ensure headers module is enabled in Apache

### Form Submissions Not Working
- Check browser console for JavaScript errors
- Verify API endpoint URLs are correct
- Check Network tab in DevTools
- Ensure .env file is configured

## Maintenance

### Regular Tasks
1. Backup database regularly
2. Monitor error logs
3. Update Bootstrap/Font Awesome if needed
4. Test after any changes
5. Monitor database size

### Database Optimization
```sql
-- Optimize tables
OPTIMIZE TABLE expenses;
OPTIMIZE TABLE funds;

-- View table statistics
SHOW TABLE STATUS FROM your_database;
```

## Future Enhancements

- User authentication and login
- Multiple user accounts
- Expense categories with sub-categories
- Budget limits and alerts
- Report generation (PDF)
- Data export (CSV/Excel)
- Mobile app
- Dark theme toggle
- Multi-language support

## Support

For issues or questions:
1. Check error logs in cPanel
2. Review browser console (F12)
3. Test database connection
4. Verify file permissions
5. Contact Namecheap support for hosting issues

## License

This project is proprietary and confidential.

---

**Last Updated**: January 18, 2026  
**Version**: 2.0 (HTML/CSS/JS/PHP)  
**Database**: MySQL @ premium281.web-hosting.com
