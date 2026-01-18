#!/bin/bash
# Namecheap Deployment Package Script
# This script creates a ready-to-upload folder for Namecheap hosting

DEPLOY_FOLDER="your-fund-deployment"

# Create deployment folder
mkdir -p "$DEPLOY_FOLDER"

echo "📦 Creating deployment package..."

# Copy frontend build
cp -r dist "$DEPLOY_FOLDER/"
echo "✓ Copied React build (dist/)"

# Copy backend
cp server.cjs "$DEPLOY_FOLDER/"
echo "✓ Copied API server (server.cjs)"

# Copy config files
cp package.json "$DEPLOY_FOLDER/"
cp package-lock.json "$DEPLOY_FOLDER/" 2>/dev/null || true
echo "✓ Copied package.json"

# Copy environment template
cp .env.production "$DEPLOY_FOLDER/.env"
echo "✓ Copied environment config (.env)"

# Create README for deployment
cat > "$DEPLOY_FOLDER/DEPLOY_README.txt" << 'EOF'
YOUR FUND - NAMECHEAP DEPLOYMENT INSTRUCTIONS

1. EXTRACT THIS FOLDER on your Namecheap hosting

2. INSTALL DEPENDENCIES
   cd your-fund-deployment
   npm install --production

3. START THE SERVER
   node server.cjs
   
   OR use PM2 for production:
   npm install -g pm2
   pm2 start server.cjs --name "your-fund-api"
   pm2 save
   pm2 startup

4. CONFIGURE YOUR DOMAIN
   - Point your domain to the public_html folder
   - React app will be served from dist/ folder
   - API server runs on port 3001

5. DATABASE
   - Credentials are in .env file
   - Update .env with your actual database details if different

6. ACCESS YOUR APP
   - Frontend: https://yourdomain.com
   - API Health: https://yourdomain.com/api/health

For detailed instructions, see NAMECHEAP_DEPLOYMENT.md
EOF

echo "✓ Created deployment README"

# Create a simple setup script
cat > "$DEPLOY_FOLDER/setup.sh" << 'EOF'
#!/bin/bash
echo "🚀 Setting up Your Fund on Namecheap..."
npm install --production
echo "✓ Dependencies installed"
echo "💡 Run: node server.cjs to start the API server"
echo "📝 Remember to update .env with your database credentials if needed"
EOF

chmod +x "$DEPLOY_FOLDER/setup.sh"
echo "✓ Created setup script"

# Create Windows batch version
cat > "$DEPLOY_FOLDER/setup.bat" << 'EOF'
@echo off
echo 🚀 Setting up Your Fund on Namecheap...
npm install --production
echo ✓ Dependencies installed
echo 💡 Run: node server.cjs to start the API server
echo 📝 Remember to update .env with your database credentials if needed
pause
EOF

echo "✓ Created Windows setup script"

# Create a gitignore for the deployment folder
cat > "$DEPLOY_FOLDER/.gitignore" << 'EOF'
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
EOF

echo "✓ Created .gitignore"

# Show summary
echo ""
echo "✅ DEPLOYMENT PACKAGE READY!"
echo ""
echo "📁 Folder: $DEPLOY_FOLDER"
echo ""
echo "📋 Contents:"
ls -la "$DEPLOY_FOLDER"
echo ""
echo "📤 NEXT STEPS:"
echo "1. Upload the '$DEPLOY_FOLDER' folder to Namecheap via FTP/cPanel"
echo "2. SSH into Namecheap and run: cd $DEPLOY_FOLDER && bash setup.sh"
echo "3. Start server: node server.cjs"
echo "4. Access: https://yourdomain.com"
echo ""
