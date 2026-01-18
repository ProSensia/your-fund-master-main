# 🚀 YOUR FUND - QUICK DEPLOYMENT CARD

## Copy & Paste Ready-to-Deploy Commands

### 1. Create .env File (Via cPanel File Manager)
```env
DB_HOST=premium281.web-hosting.com
DB_USER=prosdfwo_expenses
DB_PASSWORD=ExpensesProSensia@2026
DB_NAME=prosdfwo_Expenses
DB_PORT=3306
APP_ENV=production
APP_DEBUG=false
```

### 2. FTP Connection Details
```
Host: premium281.web-hosting.com
Username: [Your Namecheap FTP username]
Password: [Your Namecheap FTP password]
Port: 21
Passive Mode: ON
```

### 3. Upload Instructions
```
Local Folder:  your-fund-deployment/
Upload To:     public_html/
```

### 4. File Structure After Upload
```
public_html/
├── api/
│   ├── config.php
│   ├── health.php
│   ├── expenses.php
│   ├── funds.php
│   └── dashboard.php
├── public/
│   ├── index.html
│   ├── expenses.html
│   ├── funds.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       ├── dashboard.js
│       ├── expenses.js
│       └── funds.js
├── .htaccess
├── .env
└── .env.example
```

## Test URLs After Deployment
```
Dashboard:      https://yourdomain.com
Expenses Page:  https://yourdomain.com/expenses.html
Funds Page:     https://yourdomain.com/funds.html
Health Check:   https://yourdomain.com/api/health.php
```

## Quick Test Steps
1. Open Dashboard
2. Click "+ Add Expense"
3. Fill in: Description, Amount (100), Category (Office), Date (today)
4. Click "Add Expense"
5. Go to Funds page
6. Click "+ Add Fund"
7. Fill in: Source (Test), Amount (500), Date (today)
8. Click "Add Fund"
9. Return to Dashboard
10. Verify totals show correctly

## Emergency Troubleshooting

### White Screen
```
✓ Check .htaccess is uploaded
✓ Enable mod_rewrite (cPanel)
✓ Check file permissions (644)
```

### Database Error
```
✓ Edit .env with correct credentials
✓ Test connection: mysql -h host -u user -p (enter password)
✓ Verify database exists
✓ Verify user has permission to database
```

### API Not Responding
```
✓ Check /api/ folder uploaded
✓ Check permissions on .php files (644)
✓ View error_log in cPanel
✓ Visit /api/health.php directly in browser
```

## File Sizes
```
api/config.php       ~2 KB
api/health.php       ~1 KB
api/expenses.php     ~3 KB
api/funds.php        ~3 KB
api/dashboard.php    ~2 KB
public/css/style.css ~15 KB
public/js/api.js     ~4 KB
public/js/*.js       ~3 KB each
public/*.html        ~6 KB each
Total Size:          ~50 KB (uncompressed)
```

## Estimated Deployment Time
```
FTP Upload:         5-10 minutes
.env Configuration: 2-3 minutes
First API Call:     1-2 minutes (tables auto-create)
Testing:            5-10 minutes
Total:              15-30 minutes
```

## Support Links
- Namecheap Help: https://support.namecheap.com
- PHP Errors: Check cPanel > Logs > error_log
- MySQL Connection: cPanel > Remote MySQL
- mod_rewrite: cPanel > Apache Handlers

## Database Info
```
Host:     premium281.web-hosting.com
Port:     3306
Database: prosdfwo_Expenses
User:     prosdfwo_expenses
Password: ExpensesProSensia@2026
```

## Git Commits Made
```
✓ commit 25ff12a - Phase 4 conversion to PHP/HTML
✓ commit cc73ff2 - Add deployment documentation
```

## Files Ready in your-fund-deployment/
```
✓ api/ (5 files)
✓ public/ (10 files)
✓ .htaccess
✓ .env.example
✓ README.md
```

---

**Status**: ✅ PRODUCTION READY  
**Date**: January 18, 2026  
**Deployment Time**: ~30 minutes  
**Support**: See documentation files
