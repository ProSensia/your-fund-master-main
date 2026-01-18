# Namecheap Deployment Guide

## Overview
This guide explains how to deploy the Your Fund application to Namecheap hosting.

## Prerequisites
- Namecheap hosting account with Node.js support
- SSH access to your Namecheap hosting
- FileZilla or FTP client for uploading files
- MySQL database already created at premium281.web-hosting.com

## Files to Upload

### Production Build Files
1. **dist/** - React production build (generated from `npm run build`)
2. **server.cjs** - Express API server
3. **package.json** - Dependencies
4. **.env.production** - Production environment variables (update with your actual values)
5. **node_modules/** - OR run `npm install --production` after upload

## Deployment Steps

### Option 1: Using cPanel File Manager (Easiest)

1. **Build the React App**
   ```bash
   npm run build
   ```
   This creates the `dist/` folder with optimized production files.

2. **Prepare Files**
   - Copy these files/folders to a deployment folder:
     - `dist/` (React app)
     - `server.cjs` (API server)
     - `package.json`
     - `.env.production` (with your settings)

3. **Upload via cPanel**
   - Login to cPanel
   - Open File Manager
   - Navigate to `/home/youruser/public_html` or your app root
   - Upload all files

4. **Install Dependencies**
   - Open cPanel Terminal
   - Navigate to your app directory: `cd /home/youruser/public_html`
   - Run: `npm install --production`

5. **Start the Server**
   ```bash
   node server.cjs
   ```
   Or use cPanel's Node.js app installer to manage the process

### Option 2: Using SSH (Advanced)

1. **Connect via SSH**
   ```bash
   ssh youruser@yourdomain.com
   cd ~/public_html
   ```

2. **Clone or Upload Project**
   ```bash
   # Option A: Clone from Git
   git clone https://your-repo-url.git
   cd your-fund
   
   # Option B: Upload via SCP
   scp -r ./dist youruser@yourdomain.com:~/public_html/dist
   scp server.cjs package.json .env.production youruser@yourdomain.com:~/public_html/
   ```

3. **Install Dependencies**
   ```bash
   npm install --production
   ```

4. **Start with PM2 (Recommended for Production)**
   ```bash
   npm install -g pm2
   pm2 start server.cjs --name "your-fund-api"
   pm2 save
   pm2 startup
   ```

5. **Configure Reverse Proxy (if needed)**
   - Set up nginx or Apache to forward requests to Node.js server

## Environment Variables (.env.production)

Update `.env.production` with your Namecheap settings:

```
DB_HOST=premium281.web-hosting.com
DB_USER=prosdfwo_expenses
DB_PASSWORD=ExpensesProSensia@2026
DB_NAME=prosdfwo_Expenses
DB_PORT=3306
API_PORT=3001
NODE_ENV=production
VITE_API_URL=https://yourdomain.com/api
```

**Note:** Change `VITE_API_URL` to your actual domain.

## Connecting Frontend to Backend

The React app (in `dist/`) needs to know where the API is. Update in `src/App.tsx` before building:

```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

// Then use API_URL in your fetch calls
fetch(`${API_URL}/api/health`)
```

## Testing Connection

Once deployed:

1. **Check Health Endpoint**
   ```bash
   curl https://yourdomain.com/api/health
   ```
   Should return: `{"success":true,"message":"Database connected"}`

2. **Check React App**
   - Open `https://yourdomain.com` in browser
   - Should show the Your Fund dashboard

3. **View Logs**
   ```bash
   # If using PM2
   pm2 logs your-fund-api
   
   # Or check Namecheap logs
   tail -f ~/logs/error_log
   ```

## Troubleshooting

### Port Issues
- Namecheap may have restrictions on ports
- Ask support for available Node.js ports
- May need to run on port 80/443 with reverse proxy

### Database Connection Issues
- Verify MySQL credentials are correct
- Check if Namecheap allows external connections to premium281.web-hosting.com
- Test connection with: `mysql -h premium281.web-hosting.com -u prosdfwo_expenses -p`

### Module Not Found Errors
- Ensure `npm install --production` was run
- Check that package.json is in the root directory
- Verify node_modules folder exists

### API Not Responding
- Check if Node.js process is running: `pm2 list` or `ps aux | grep node`
- Restart server: `pm2 restart your-fund-api` or `node server.cjs`
- Check logs for errors

## File Structure on Namecheap

```
/home/youruser/public_html/
├── dist/                  # React production build
├── server.cjs            # API server
├── package.json          # Dependencies
├── .env.production       # Environment config
└── node_modules/         # Dependencies (created after npm install)
```

## Next Steps

1. Run `npm run build` locally to generate `dist/` folder
2. Upload all files to Namecheap
3. Run `npm install --production`
4. Start the server with `node server.cjs` or PM2
5. Test API endpoints
6. Configure domain/DNS if needed

## Support

If you encounter issues:
1. Check the Namecheap knowledge base
2. Contact Namecheap support for Node.js configuration questions
3. Check server logs: `tail -f ~/logs/error_log`
4. Verify database connectivity from Namecheap terminal
