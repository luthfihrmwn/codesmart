# 🚀 CodeSmart LMS - Production Deployment Guide

## Overview

This guide will help you deploy CodeSmart LMS to production with best practices for security, performance, and reliability.

---

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors
- [ ] All TODO comments removed or addressed
- [ ] Code commented where necessary
- [ ] Git repository up to date
- [ ] Environment variables documented

### Database Preparation
- [ ] Supabase production database created
- [ ] All migrations run
- [ ] Indexes added for performance
- [ ] Backup strategy defined
- [ ] Connection pooling configured

### Security Preparation
- [ ] All secrets moved to environment variables
- [ ] CORS configured for production domain
- [ ] Rate limiting implemented
- [ ] Input validation complete
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified

---

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, etc.)
### Option 2: Platform as a Service (Heroku, Railway, Render)
### Option 3: Serverless (Vercel, Netlify)

We'll cover **Option 1** and **Option 2** as they're most suitable for this full-stack app.

---

## Option 1: VPS Deployment (Ubuntu Server)

### 1. Server Setup

**Provision Server:**
- Provider: DigitalOcean, Linode, Vultr, AWS EC2
- OS: Ubuntu 22.04 LTS
- RAM: Minimum 1GB (2GB+ recommended)
- Storage: Minimum 25GB

**Initial Setup:**
```bash
# SSH into server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be 18+
npm --version

# Install Nginx
sudo apt install nginx -y

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 2. Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www/codesmart
sudo chown -R $USER:$USER /var/www/codesmart

# Clone repository
cd /var/www
git clone https://github.com/yourusername/codesmart.git
cd codesmart
```

### 3. Configure Backend

**Install Dependencies:**
```bash
cd /var/www/codesmart/backend
npm install --production
```

**Create Production Environment File:**
```bash
nano .env.production
```

**Add:**
```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=your-supabase-connection-string
DB_HOST=your-supabase-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true

# JWT
JWT_SECRET=your-very-secure-random-string-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-very-secure-refresh-secret
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/var/www/codesmart/backend/uploads

# Email (if you add email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Secure .env file:**
```bash
chmod 600 .env.production
```

**Start Backend with PM2:**
```bash
pm2 start npm --name "codesmart-backend" -- run start
pm2 save
pm2 startup  # Follow instructions to enable startup on boot
```

**Check Status:**
```bash
pm2 status
pm2 logs codesmart-backend
```

### 4. Configure Frontend

**Update API URLs:**
```bash
cd /var/www/codesmart/src/js
nano api-service.js
```

**Change:**
```javascript
// From:
this.baseURL = 'http://localhost:5000/api/v1';

// To:
this.baseURL = 'https://api.yourdomain.com/api/v1';
// OR if same domain:
this.baseURL = 'https://yourdomain.com/api/v1';
```

**Build Frontend (if using build process):**
```bash
cd /var/www/codesmart
# If you have a build script, run it
# Otherwise, files are ready as-is
```

### 5. Configure Nginx

**Create Nginx Config:**
```bash
sudo nano /etc/nginx/sites-available/codesmart
```

**Add Configuration:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (we'll add these with Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend (Static Files)
    root /var/www/codesmart;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend Routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;

    # Static Files Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/codesmart /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 6. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically:
# 1. Get certificates
# 2. Update Nginx config
# 3. Setup auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

### 7. Setup Firewall

```bash
# Enable UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

### 8. Database Optimization

**In Supabase Dashboard:**
1. Go to Database → Settings
2. Enable Connection Pooling (Transaction mode)
3. Note the pooler connection string
4. Update .env.production with pooler URL

**Add Indexes for Performance:**
```sql
-- In Supabase SQL Editor
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_module_id ON enrollments(module_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_classes_module_id ON classes(module_id);
```

### 9. Setup Monitoring

**Install Monitoring Tools:**
```bash
# PM2 Monitoring
pm2 install pm2-logrotate

# Setup monitoring dashboard (optional)
pm2 link your-secret-key your-public-key
```

**Setup Logs:**
```bash
# Create log directory
sudo mkdir -p /var/log/codesmart
sudo chown -R $USER:$USER /var/log/codesmart

# Update PM2 to use custom logs
pm2 delete codesmart-backend
pm2 start npm --name "codesmart-backend" -- run start \
  --log /var/log/codesmart/backend.log \
  --error /var/log/codesmart/backend-error.log

pm2 save
```

---

## Option 2: Platform as a Service (Heroku/Railway/Render)

### Using Heroku

**1. Install Heroku CLI:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

**2. Prepare Backend:**
```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Ensure package.json has start script
# "start": "node server.js"
```

**3. Create Heroku App:**
```bash
heroku create codesmart-api

# Add PostgreSQL (or use existing Supabase)
# heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set DATABASE_URL=your-supabase-url
heroku config:set CORS_ORIGIN=https://codesmart-frontend.herokuapp.com
```

**4. Deploy Backend:**
```bash
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a codesmart-api
git push heroku main
```

**5. Deploy Frontend to Netlify/Vercel:**

**Using Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd /path/to/frontend
netlify deploy --prod

# Or use Netlify web interface:
# 1. Drag and drop frontend folder
# 2. Set environment variable: API_URL=https://codesmart-api.herokuapp.com
```

**Using Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /path/to/frontend
vercel --prod
```

---

## Post-Deployment Tasks

### 1. Verify Deployment

**Test Checklist:**
- [ ] Homepage loads (https://yourdomain.com)
- [ ] Login works
- [ ] Register works
- [ ] All API calls succeed
- [ ] File uploads work
- [ ] Database connections stable
- [ ] SSL certificate valid
- [ ] All pages load without errors

**Test Commands:**
```bash
# Check backend health
curl https://yourdomain.com/api/health

# Check SSL
curl -I https://yourdomain.com

# Check response time
curl -w "@-" -o /dev/null -s https://yourdomain.com/api/health <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### 2. Setup Backups

**Database Backups (Supabase):**
1. Go to Supabase Dashboard
2. Database → Backups
3. Enable daily backups
4. Configure backup retention

**File Backups (VPS):**
```bash
# Create backup script
nano /home/codesmart/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/codesmart"
mkdir -p $BACKUP_DIR

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/codesmart/backend/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
chmod +x /home/codesmart/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/codesmart/backup.sh
```

### 3. Setup Monitoring

**UptimeRobot:**
1. Go to uptimerobot.com
2. Add monitors for:
   - https://yourdomain.com (homepage)
   - https://yourdomain.com/api/health (API)
3. Set alert email

**Error Tracking (Optional):**
- Sentry.io for error tracking
- LogRocket for session replay
- Google Analytics for usage stats

### 4. Performance Optimization

**Enable Caching:**
```bash
# In backend/server.js add:
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet());
app.use(compression());
```

**CDN Setup (Optional):**
- Cloudflare for CDN + DDoS protection
- Configure Cloudflare to cache static assets

### 5. Security Hardening

**Update Dependencies:**
```bash
npm audit
npm audit fix
```

**Add Rate Limiting:**
```javascript
// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

module.exports = limiter;
```

**Environment Security:**
```bash
# Ensure .env files are in .gitignore
echo ".env*" >> .gitignore
```

---

## Maintenance Guide

### Regular Tasks

**Daily:**
- [ ] Check error logs
- [ ] Monitor server resources (CPU/RAM/Disk)
- [ ] Check uptime monitor

**Weekly:**
- [ ] Review application logs
- [ ] Check database size
- [ ] Test backups

**Monthly:**
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] Database optimization

### Update Deployment

**Code Updates:**
```bash
# On server
cd /var/www/codesmart
git pull origin main

# Backend
cd backend
npm install
pm2 restart codesmart-backend

# Frontend (if needed)
# No restart needed, files served directly

# Clear Nginx cache if using
sudo systemctl reload nginx
```

### Rollback Procedure

**If deployment fails:**
```bash
# Check git log
git log --oneline

# Rollback to previous version
git checkout <previous-commit-hash>

# Restart services
pm2 restart codesmart-backend
sudo systemctl reload nginx
```

---

## Troubleshooting

### Common Issues

**Issue: 502 Bad Gateway**
```bash
# Check if backend is running
pm2 status

# Check logs
pm2 logs codesmart-backend

# Restart backend
pm2 restart codesmart-backend
```

**Issue: Database connection failed**
```bash
# Check environment variables
pm2 env codesmart-backend

# Test database connection
psql "your-connection-string"

# Update connection string if needed
pm2 delete codesmart-backend
# Update .env.production
pm2 start npm --name "codesmart-backend" -- run start
```

**Issue: File uploads not working**
```bash
# Check upload directory permissions
ls -la /var/www/codesmart/backend/uploads

# Fix permissions
sudo chown -R www-data:www-data /var/www/codesmart/backend/uploads
chmod 755 /var/www/codesmart/backend/uploads
```

**Issue: SSL certificate expired**
```bash
# Renew certificate
sudo certbot renew

# Check expiry
sudo certbot certificates
```

---

## Production Environment Variables Reference

```env
# Complete .env.production template

# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT Authentication
JWT_SECRET=min-32-char-random-string
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=different-32-char-random-string
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/var/www/codesmart/backend/uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,zip,js,html,css,txt

# Email (if implemented)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=CodeSmart LMS

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/codesmart/backend.log

# Session
SESSION_SECRET=another-random-32-char-string
SESSION_TIMEOUT=3600000

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

---

## Cost Estimation

### VPS Option (DigitalOcean)
- **Server:** $6-12/month (1-2GB RAM)
- **Domain:** $12/year
- **SSL:** Free (Let's Encrypt)
- **Supabase:** Free tier (or $25/month for Pro)
- **Total:** ~$10-40/month

### PaaS Option (Heroku)
- **Backend:** $7/month (Hobby dyno)
- **Frontend:** Free (Netlify/Vercel)
- **Domain:** $12/year
- **SSL:** Free
- **Supabase:** Free tier (or $25/month for Pro)
- **Total:** ~$10-35/month

---

## Success Metrics

Track these metrics post-deployment:

**Performance:**
- Page load time < 2 seconds
- API response time < 500ms
- Uptime > 99.9%

**Usage:**
- Daily active users
- Enrollment rate
- Assignment completion rate
- Average grading time

**Technical:**
- Error rate < 0.1%
- Database query time < 100ms
- CPU usage < 70%
- RAM usage < 80%

---

## 🎉 Deployment Complete!

Your CodeSmart LMS is now live and ready for users!

**Next Steps:**
1. Test all features in production
2. Monitor logs and metrics
3. Gather user feedback
4. Plan next iteration

**Production URL:** https://yourdomain.com

**Good luck with your LMS! 🚀**
