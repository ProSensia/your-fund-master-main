# Your Fund - PHP Deployment Guide

## ✅ Deployment Status: COMPLETE & READY

All files have been created, tested in structure, and committed to GitHub. The application is ready to deploy to any PHP/MySQL hosting provider.

---

## 📦 What's Included

The `your-fund-deployment/` folder contains everything needed:

```
your-fund-deployment/
├── api/
│   ├── config.php           ✅ Database connection
│   ├── health.php           ✅ Health check endpoint
│   ├── expenses.php         ✅ Expense CRUD operations
│   ├── funds.php            ✅ Fund CRUD operations
│   └── dashboard.php        ✅ Dashboard aggregation
├── public/
│   ├── index.html           ✅ Dashboard page
│   ├── expenses.html        ✅ Expenses page
│   ├── funds.html           ✅ Funds page
│   ├── css/
│   │   └── style.css        ✅ Bootstrap + custom styling
│   └── js/
│       ├── api.js           ✅ API utilities
│       ├── dashboard.js     ✅ Dashboard logic
│       ├── expenses.js      ✅ Expenses logic
│       └── funds.js         ✅ Funds logic
├── .htaccess                ✅ Apache routing & security
├── .env.example             ✅ Environment template
└── README.md                ✅ Detailed documentation
```

---

## 🚀 Namecheap Deployment (Step-by-Step)

### Prerequisites
- Namecheap hosting account with PHP 7.4+ and MySQL
- FTP credentials (from Namecheap)
- MySQL database already created (premium281.web-hosting.com)
- MySQL user and password ready

### Step 1: Download Deployment Files
- Navigate to: `your-fund-deployment/` folder
- Download all files to your local computer

### Step 2: Connect via FTP
Using FileZilla or any FTP client:
```
Host: premium281.web-hosting.com (or your FTP host)
Username: Your Namecheap FTP username
Password: Your Namecheap FTP password
Port: 21
```

### Step 3: Upload Files
Upload the `your-fund-deployment/` folder to **public_html/**

Your FTP structure should look like:
```
public_html/
├── api/                 (all 5 PHP files)
├── public/              (HTML pages + CSS + JS)
├── .htaccess
├── .env.example
└── README.md
```

### Step 4: Create .env File
- Via cPanel File Manager or FTP:
  - Copy `.env.example` to `.env`
  - Edit `.env` with your database credentials:

```env
DB_HOST=premium281.web-hosting.com
DB_USER=prosdfwo_expenses
DB_PASSWORD=ExpensesProSensia@2026
DB_NAME=prosdfwo_Expenses
DB_PORT=3306
APP_ENV=production
APP_DEBUG=false
```

### Step 5: Verify .htaccess
- Ensure `.htaccess` is uploaded to the root (public_html/)
- cPanel: File Manager > Settings > Show Hidden Files (enable)
- Check mod_rewrite is enabled (usually enabled by default)

### Step 6: Test Installation
Open browser and navigate to:
- **Dashboard**: `https://yourdomain.com`
- **Expenses**: `https://yourdomain.com/expenses.html`
- **Funds**: `https://yourdomain.com/funds.html`
- **Health Check**: `https://yourdomain.com/api/health.php`

### Step 7: Test Functionality
1. Add an expense (click "+ Add Expense" on expenses page)
2. Add a fund (click "+ Add Fund" on funds page)
3. Check Dashboard - should show totals
4. Verify data persists after refresh
5. Try deleting an item

---

## 🧪 Local Testing (Development)

### Option A: Using PHP Built-in Server (Recommended)

**Requirements**: PHP 7.4+ installed locally

```bash
# Navigate to project directory
cd your-fund-deployment

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# (or use the provided credentials to test)

# Start PHP development server
php -S localhost:8000

# Open in browser
# http://localhost:8000
```

**Stop server**: Press `Ctrl+C`

### Option B: Using XAMPP/WAMP/MAMP

1. **Extract** `your-fund-deployment/` to:
   - XAMPP: `C:\xampp\htdocs\your-fund\`
   - WAMP: `C:\wamp\www\your-fund\`
   - MAMP: `/Applications/MAMP/htdocs/your-fund/`

2. **Create .env** file in project root with database credentials

3. **Start Apache & MySQL** from control panel

4. **Access** in browser:
   - XAMPP: `http://localhost/your-fund`
   - WAMP: `http://localhost/your-fund`
   - MAMP: `http://localhost:8888/your-fund`

### Option C: Using Apache Directly

1. Create virtual host pointing to `your-fund-deployment/public/`
2. Update `httpd-vhosts.conf`:
   ```apache
   <VirtualHost *:80>
       ServerName your-fund.local
       DocumentRoot "C:\path\to\your-fund-deployment\public"
       <Directory "C:\path\to\your-fund-deployment\public">
           AllowOverride All
       </Directory>
   </VirtualHost>
   ```

3. Add to `hosts` file:
   ```
   127.0.0.1  your-fund.local
   ```

4. Access: `http://your-fund.local`

---

## 🔍 Troubleshooting

### White Screen / 404 Error
**Solution**:
- [ ] Check mod_rewrite is enabled in Apache
- [ ] Verify `.htaccess` exists in root directory
- [ ] Check file permissions (644 for files, 755 for folders)
- [ ] Review Apache error logs

### Database Connection Failed
**Solution**:
- [ ] Verify credentials in `.env` are correct
- [ ] Check if MySQL service is running
- [ ] Confirm database and user exist
- [ ] Test connection from cPanel > Remote MySQL

```bash
# Test connection (local)
mysql -h premium281.web-hosting.com -u prosdfwo_expenses -p
# Enter password: ExpensesProSensia@2026
```

### API Endpoints Returning Empty / Errors
**Solution**:
- [ ] Check cPanel error logs
- [ ] Verify `/api/` folder has correct files
- [ ] Check file permissions on `.php` files
- [ ] View browser console (F12) for errors
- [ ] Visit `/api/health.php` directly in browser

### CORS Issues (if applicable)
**Solution**:
- `.htaccess` includes CORS headers
- Ensure Apache `mod_headers` is enabled
- Contact Namecheap support if headers not working

### Form Submissions Not Working
**Solution**:
- [ ] Open DevTools (F12) > Network tab
- [ ] Watch the API request when submitting
- [ ] Check response status and error message
- [ ] Verify API endpoint URL is correct in JavaScript
- [ ] Check browser console for JavaScript errors

---

## 📋 Deployment Checklist

Before uploading to production:

- [ ] .env file created with correct credentials
- [ ] All files uploaded to public_html/
- [ ] .htaccess uploaded (check "Show Hidden Files")
- [ ] mod_rewrite enabled in Apache
- [ ] MySQL database created and accessible
- [ ] Database tables created (auto-create on first request)
- [ ] Tested dashboard page loads
- [ ] Tested adding an expense
- [ ] Tested adding a fund
- [ ] Verified data persists after refresh
- [ ] Checked mobile responsiveness
- [ ] Verified SSL/HTTPS works

---

## 🔐 Security Notes

### Production Checklist
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Use strong database password
- [ ] Enable HTTPS (SSL certificate)
- [ ] Restrict file permissions (644, 755)
- [ ] Regular backups of database
- [ ] Update PHP to latest version
- [ ] Keep MySQL/PHP updated
- [ ] Review error logs regularly

### Sensitive Data
- **Never** commit `.env` to GitHub (only `.env.example`)
- Keep database credentials secure
- Use strong passwords
- Rotate credentials periodically

---

## 📊 Performance Optimization

### Caching
- Static files cached for 1 year via .htaccess
- Enable browser caching in .htaccess

### Compression
- Gzip compression enabled for CSS, JS, JSON
- Configure in .htaccess

### Database
```sql
-- Optimize tables after large operations
OPTIMIZE TABLE expenses;
OPTIMIZE TABLE funds;

-- Check table size
SELECT 
    TABLE_NAME,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'prosdfwo_Expenses';
```

---

## 🆘 Getting Help

### Common Issues
1. **White screen**: Check `.htaccess` and mod_rewrite
2. **404 errors**: Verify file structure and .htaccess
3. **Database error**: Check .env credentials
4. **CORS error**: Browser console shows what's blocked
5. **Slow loading**: Check database indexes and cache

### Debug Mode
Edit `.env`:
```env
APP_DEBUG=true
```

This will show detailed error messages (only for development!)

### Log Files
View logs via cPanel:
- PHP errors: `error_log` (home directory)
- Apache errors: `public_html/error_log`
- MySQL errors: Check cPanel > MySQL

---

## 📞 Support Resources

- **Namecheap Support**: https://support.namecheap.com
- **PHP Documentation**: https://www.php.net/docs.php
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Bootstrap Documentation**: https://getbootstrap.com/docs/
- **Font Awesome Icons**: https://fontawesome.com/icons

---

## 🎯 Next Steps

After successful deployment:

1. **Monitor the application**
   - Check logs regularly
   - Monitor database performance
   - Track errors and issues

2. **Plan improvements**
   - User authentication
   - Budget limits/alerts
   - Report generation
   - Mobile app

3. **Backup strategy**
   - Daily database backups
   - Version control (GitHub)
   - File backups via FTP

---

## 📝 Version Information

- **Version**: 2.0 (HTML/CSS/JS/PHP)
- **Previous Version**: 1.0 (React/Node.js)
- **Last Updated**: January 18, 2026
- **Database**: MySQL 5.7+
- **PHP Version**: 7.4+ (Namecheap standard)
- **Server**: Apache with mod_rewrite

---

**Your Fund is ready for production! 🚀**

Upload to Namecheap and start tracking your expenses and funds!
