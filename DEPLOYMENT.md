# CareLink Deployment Guide - Amazon Lightsail

## Overview

This guide covers deploying CareLink to Amazon Lightsail with:
- **Backend**: FastAPI on Uvicorn
- **Frontend**: React built static files served by Nginx
- **Database**: PostgreSQL (Lightsail managed database or self-hosted)
- **Reverse Proxy**: Nginx

---

## Option 1: Lightsail Instance + Managed Database (Recommended)

### Step 1: Create Lightsail Resources

#### 1.1 Create a Lightsail Instance
1. Go to [Amazon Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click "Create instance"
3. Select:
   - **Region**: Choose closest to your users
   - **Platform**: Linux/Unix
   - **Blueprint**: Ubuntu 22.04 LTS
   - **Plan**: Minimum $10/month (2GB RAM) recommended
4. Name it: `carelink-server`
5. Click "Create instance"

#### 1.2 Create a Managed PostgreSQL Database
1. In Lightsail, go to "Databases"
2. Click "Create database"
3. Select:
   - **Engine**: PostgreSQL 15
   - **Plan**: $15/month (1GB RAM, 40GB storage)
4. Set credentials:
   - **Master username**: `carelink`
   - **Master password**: (save this securely!)
5. Name it: `carelink-db`
6. Click "Create database"

#### 1.3 Configure Networking
1. Go to your instance → Networking tab
2. Add firewall rules:
   - HTTP (80)
   - HTTPS (443)
   - Custom TCP 8000 (temporary, for testing)

---

### Step 2: Connect to Your Server

```bash
# Download your SSH key from Lightsail console
# Then connect:
ssh -i ~/path-to-your-key.pem ubuntu@YOUR_INSTANCE_IP
```

---

### Step 3: Install Dependencies on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install Redis (optional, for caching)
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

---

### Step 4: Deploy the Application

#### 4.1 Clone/Upload Your Code

```bash
# Create app directory
sudo mkdir -p /var/www/carelink
sudo chown ubuntu:ubuntu /var/www/carelink
cd /var/www/carelink

# Option A: Clone from Git (if you have a repo)
git clone https://github.com/yourusername/carelink.git .

# Option B: Upload via SCP from your local machine
# Run this from YOUR LOCAL MACHINE:
scp -i ~/path-to-key.pem -r /Users/kaliyev.arsengmail.com/Desktop/infomatrix/* ubuntu@YOUR_IP:/var/www/carelink/
```

#### 4.2 Setup Backend

```bash
cd /var/www/carelink/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create production .env file
cat > .env << 'EOF'
# Database - Get these from Lightsail database details
DATABASE_URL=postgresql://carelink:YOUR_DB_PASSWORD@YOUR_DB_ENDPOINT:5432/carelink

# Redis (local)
REDIS_URL=redis://localhost:6379/0

# JWT Settings - CHANGE THIS!
SECRET_KEY=your-super-secret-production-key-change-this-to-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Insurance Provider
INSURANCE_PROVIDER=mock

# Mock API Settings
MOCK_API_MIN_DELAY_MS=800
MOCK_API_MAX_DELAY_MS=2000

# App Settings
DEBUG=false
CORS_ORIGINS=["https://yourdomain.com","http://YOUR_IP"]
EOF

# Edit the .env file with your actual values
nano .env
```

#### 4.3 Initialize Database

```bash
# First, create the database on Lightsail managed PostgreSQL
# Connect using psql (install if needed: sudo apt install postgresql-client)
psql -h YOUR_DB_ENDPOINT -U carelink -d postgres -c "CREATE DATABASE carelink;"

# Then seed the application
cd /var/www/carelink/backend
source venv/bin/activate
python -m app.seed
```

#### 4.4 Build Frontend

```bash
cd /var/www/carelink/frontend

# Install dependencies
npm install

# Create production environment
cat > .env.production << 'EOF'
VITE_API_URL=https://yourdomain.com/api
EOF

# Build for production
npm run build
```

---

### Step 5: Configure Systemd Service (Backend)

```bash
sudo cat > /etc/systemd/system/carelink.service << 'EOF'
[Unit]
Description=CareLink API Server
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/var/www/carelink/backend
Environment="PATH=/var/www/carelink/backend/venv/bin"
EnvironmentFile=/var/www/carelink/backend/.env
ExecStart=/var/www/carelink/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable carelink
sudo systemctl start carelink

# Check status
sudo systemctl status carelink
```

---

### Step 6: Configure Nginx

```bash
sudo cat > /etc/nginx/sites-available/carelink << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend - serve static files
    location / {
        root /var/www/carelink/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - proxy to uvicorn
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/carelink /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

### Step 7: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

---

## Accessing the Database

### Option A: From Your Server (SSH)

```bash
# Connect to your Lightsail instance first
ssh -i ~/your-key.pem ubuntu@YOUR_IP

# Then connect to database
psql -h YOUR_DB_ENDPOINT -U carelink -d carelink

# Example queries:
# List all users
SELECT email, full_name, role FROM users;

# List recent eligibility checks
SELECT * FROM eligibility_checks ORDER BY created_at DESC LIMIT 10;

# Count checks by insurance company
SELECT insurance_company, COUNT(*) FROM eligibility_checks GROUP BY insurance_company;
```

### Option B: SSH Tunnel (Access from Your Local Machine)

```bash
# Create SSH tunnel (run on your LOCAL machine)
ssh -i ~/your-key.pem -L 5433:YOUR_DB_ENDPOINT:5432 ubuntu@YOUR_INSTANCE_IP -N

# Now connect locally (in another terminal)
psql -h localhost -p 5433 -U carelink -d carelink

# Or use a GUI tool like:
# - pgAdmin
# - DBeaver
# - TablePlus
# Connection: localhost:5433, user: carelink, database: carelink
```

### Option C: Lightsail Database Console

1. Go to Lightsail Console → Databases → your database
2. Click "Connect" tab
3. Enable "Public mode" temporarily (not recommended for production)
4. Use the provided endpoint with any PostgreSQL client

---

## Quick Commands Reference

```bash
# SSH to server
ssh -i ~/key.pem ubuntu@YOUR_IP

# View backend logs
sudo journalctl -u carelink -f

# Restart backend
sudo systemctl restart carelink

# Restart nginx
sudo systemctl restart nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Database backup
pg_dump -h YOUR_DB_ENDPOINT -U carelink carelink > backup_$(date +%Y%m%d).sql

# Update application
cd /var/www/carelink
git pull  # if using git
sudo systemctl restart carelink
cd frontend && npm run build
```

---

## Environment Variables Reference

| Variable | Production Value |
|----------|------------------|
| DATABASE_URL | `postgresql://carelink:PASSWORD@db-endpoint:5432/carelink` |
| REDIS_URL | `redis://localhost:6379/0` |
| SECRET_KEY | Random 64+ character string |
| DEBUG | `false` |
| CORS_ORIGINS | `["https://yourdomain.com"]` |
| INSURANCE_PROVIDER | `mock` |

---

## Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u carelink -n 50

# Test manually
cd /var/www/carelink/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Database connection issues
```bash
# Test database connection
psql -h YOUR_DB_ENDPOINT -U carelink -d carelink -c "SELECT 1"

# Check if port is accessible
nc -zv YOUR_DB_ENDPOINT 5432
```

### Frontend not loading
```bash
# Check if build exists
ls -la /var/www/carelink/frontend/dist

# Rebuild if needed
cd /var/www/carelink/frontend
npm run build

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Cost Estimate

| Resource | Monthly Cost |
|----------|--------------|
| Lightsail Instance (2GB) | $10 |
| Managed PostgreSQL | $15 |
| **Total** | **$25/month** |

Optional:
- Static IP: $3/month (free if attached to running instance)
- Snapshots: $0.05/GB
