# Your Fund - Namecheap Deployment Complete Guide

## 📦 What You Have Ready

Your deployment folder `your-fund-deployment/` contains everything needed to run on Namecheap:

```
your-fund-deployment/
├── dist/                    # React production app (optimized)
├── server.cjs              # Express API backend
├── package.json            # Dependencies list
└── .env                    # Database configuration
```

## 🚀 Quick Start (5 Steps)

### Step 1: Upload to Namecheap
1. Open **cPanel File Manager** or use **FileZilla**
2. Navigate to `/home/youruser/public_html` (or your app root)
3. Upload the entire `your-fund-deployment` folder
4. Extract/decompress if uploaded as ZIP

### Step 2: Install Dependencies
1. In cPanel, open **Terminal**
2. Run these commands:
```bash
cd ~/public_html/your-fund-deployment
npm install --production
```

### Step 3: Verify Database Connection
1. Edit `.env` file in the folder:
```
DB_HOST=premium281.web-hosting.com
DB_USER=prosdfwo_expenses
DB_PASSWORD=ExpensesProSensia@2026
DB_NAME=prosdfwo_Expenses
DB_PORT=3306
API_PORT=3001
```

2. Test from terminal:
```bash
node server.cjs
```
Should show:
```
✅ API Server Running on http://localhost:3001
📊 Database: prosdfwo_Expenses @ premium281.web-hosting.com
```

### Step 4: Setup for Continuous Running (Production)
Use PM2 to keep server running:

```bash
npm install -g pm2
pm2 start server.cjs --name "your-fund-api"
pm2 save
pm2 startup
```

### Step 5: Access Your App
- **Frontend:** `https://yourdomain.com`
- **API Health:** `https://yourdomain.com/api/health`

---

## 📋 Deployment Checklist

### Pre-Deployment (Local)
- [x] React app built (`dist/` folder created)
- [x] Server configured (`server.cjs` ready)
- [x] Database credentials verified
- [x] Environment file prepared (`.env`)
- [x] All files packaged (`your-fund-deployment/` folder)

### On Namecheap Server
- [ ] Folder uploaded to public_html
- [ ] `npm install --production` completed
- [ ] `.env` verified with correct credentials
- [ ] `node server.cjs` runs without errors
- [ ] Test `/api/health` endpoint responds
- [ ] Frontend displays correctly in browser
- [ ] PM2 process running (if production setup)

---

## 🔧 File Descriptions

### `server.cjs`
- Express.js API backend
- Handles all database operations
- Endpoints: `/api/expenses`, `/api/funds`, `/api/dashboard`, etc.
- Runs on port 3001

### `dist/` folder
- Production React build (minified/optimized)
- Static HTML, CSS, JS files
- Served by web server on port 80/443
- No build step needed on Namecheap

### `package.json`
- Lists all Node.js dependencies
- Run `npm install --production` to install them

### `.env`
- Database connection details
- API port configuration
- Edit this if credentials change

---

## 🌐 URL Configuration

Once deployed, update your DNS/domain settings:

**If Namecheap hosting is default:**
- Just point domain to Namecheap nameservers
- App automatically available at your domain

**If using external domain:**
- Create A record pointing to Namecheap IP
- Update cPanel domain pointer

**Test URLs:**
```
Frontend:  https://yourdomain.com
API Test:  https://yourdomain.com/api/health
Response:  {"success":true,"message":"Database connected"}
```

---

## 🛠️ Common Issues & Solutions

### Issue: "Module not found" error
**Solution:** Ensure you ran `npm install --production`
```bash
cd ~/public_html/your-fund-deployment
npm install --production
```

### Issue: Database connection timeout
**Solution:** Check if Namecheap allows connections to premium281.web-hosting.com
```bash
mysql -h premium281.web-hosting.com -u prosdfwo_expenses -p
```
Enter password: `ExpensesProSensia@2026`

### Issue: Port 3001 not accessible
**Solution:** Some Namecheap plans restrict ports. Check:
1. Namecheap control panel for available ports
2. Use cPanel's Node.js app manager (if available)
3. Configure reverse proxy (nginx/Apache) to forward requests

### Issue: "Cannot find tailwindcss" or CSS errors
**Solution:** This shouldn't happen since CSS is pre-built in `dist/`. If it does:
```bash
cd ~/public_html/your-fund-deployment
rm -rf node_modules
npm install --production
```

### Issue: PM2 not starting on server reboot
**Solution:** After running PM2 startup, reboot and verify:
```bash
pm2 list
pm2 logs your-fund-api
```

---

## 📊 API Endpoints Available

Once server is running:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Test database connection |
| POST | `/api/initialize` | Create database tables |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add new expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/funds` | Get all funds |
| POST | `/api/funds` | Add new fund |
| DELETE | `/api/funds/:id` | Delete fund |
| GET | `/api/dashboard` | Get dashboard summary |

**Example API call:**
```bash
curl https://yourdomain.com/api/health
```

---

## 💾 Database Schema

The API automatically creates these tables on first run:

### expenses
- id (UUID)
- description
- amount (DECIMAL)
- category
- date
- bill_image
- created_at, updated_at

### funds
- id (UUID)
- source
- amount (DECIMAL)
- date
- description
- created_at, updated_at

### personal_budgets
- id (UUID)
- category
- budget_limit (DECIMAL)
- spent (DECIMAL)
- month
- created_at, updated_at

---

## 🔐 Security Notes

1. **Change Database Password** (recommended)
   - Update `.env` with new password
   - Change password in MySQL server

2. **Use HTTPS** (Namecheap provides SSL)
   - Force HTTPS in cPanel settings
   - Update API URLs to use `https://`

3. **Restrict API Access**
   - Consider adding authentication
   - Add rate limiting to API
   - Setup CORS properly

4. **Backup Database**
   - Use Namecheap's backup tools
   - Export SQL regularly

---

## 📞 Support & Troubleshooting

### Check Server Logs
```bash
# PM2 logs
pm2 logs your-fund-api

# Namecheap error logs
tail -f ~/logs/error_log
tail -f ~/logs/access_log

# Application logs
cd ~/public_html/your-fund-deployment
node server.cjs  # Run directly to see output
```

### Test Database Connection
```bash
# From terminal
mysql -h premium281.web-hosting.com -u prosdfwo_expenses -p
# Password: ExpensesProSensia@2026

# Check if tables exist
SHOW DATABASES;
USE prosdfwo_Expenses;
SHOW TABLES;
```

### Verify Node.js Installed
```bash
node --version
npm --version
```

### Restart Everything
```bash
pm2 restart your-fund-api
pm2 logs your-fund-api  # Check for errors
```

---

## 🎯 Next Steps

1. ✅ Upload `your-fund-deployment/` folder to Namecheap
2. ✅ Run `npm install --production`
3. ✅ Verify `.env` database credentials
4. ✅ Start server: `node server.cjs` or setup PM2
5. ✅ Test: Visit `https://yourdomain.com`
6. ✅ Add some expenses/funds to test functionality
7. ✅ Setup automated backups
8. ✅ Monitor logs regularly

---

## 📚 Additional Resources

- [Namecheap Node.js Guide](https://www.namecheap.com)
- [PM2 Documentation](https://pm2.keymetrics.io)
- [Express.js Docs](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc)

---

**Deployment Date:** January 18, 2026  
**Database:** MySQL @ premium281.web-hosting.com  
**Status:** Ready for Production
