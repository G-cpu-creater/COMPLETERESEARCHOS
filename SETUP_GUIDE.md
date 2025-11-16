# ElctrDc Setup Guide

**Complete installation and setup instructions for Windows and Linux**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation - Windows](#installation---windows)
3. [Installation - Linux](#installation---linux)
4. [VS Code Setup](#vs-code-setup)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Optional: AI Features](#optional-ai-features)
9. [Troubleshooting](#troubleshooting)
10. [Production Deployment](#production-deployment)

---

## Prerequisites

Before installing ElctrDc, ensure you have:

### Required Software

- **Node.js** 18.17 or later ([Download](https://nodejs.org/))
- **npm** or **pnpm** or **yarn** (package manager)
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/))
- **VS Code** ([Download](https://code.visualstudio.com/))

### System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4 GB
- Disk: 1 GB free space
- OS: Windows 10+ or Linux (Ubuntu 20.04+)

**Recommended:**
- CPU: 4+ cores
- RAM: 8+ GB
- Disk: 5+ GB free space (with datasets)
- OS: Windows 11 or Ubuntu 22.04+

---

## Installation - Windows

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Choose **LTS (Long Term Support)** version
3. Run the installer
4. Keep default settings
5. Check "Add to PATH" option
6. Click **Install**

**Verify Installation:**
```powershell
node --version
npm --version
```

You should see versions like:
```
v20.x.x
10.x.x
```

### Step 2: Install Git

1. Download Git from https://git-scm.com/download/win
2. Run the installer
3. Use default settings
4. Check "Add Git Bash to PATH"
5. Click **Install**

**Verify Installation:**
```powershell
git --version
```

### Step 3: Install PostgreSQL

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password for `postgres` user (remember this!)
4. Default port: 5432
5. Install all components (including pgAdmin)
6. Click **Finish**

**Verify Installation:**
```powershell
psql --version
```

### Step 4: Clone ElctrDc Repository

Open **PowerShell** or **Command Prompt**:

```powershell
# Navigate to desired location
cd C:\Users\YourName\Projects

# Clone repository
git clone https://github.com/yourusername/ElctrDc.git

# Enter directory
cd ElctrDc
```

### Step 5: Install Dependencies

```powershell
# Install packages
npm install

# Or if you prefer pnpm (faster)
npm install -g pnpm
pnpm install
```

This will take 2-5 minutes depending on your internet speed.

### Step 6: Setup Database

Open **pgAdmin** or **SQL Shell (psql)**:

```sql
-- Create database
CREATE DATABASE elctrdc;

-- Create user (optional, for security)
CREATE USER elctrdc_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE elctrdc TO elctrdc_user;
```

### Step 7: Configure Environment

Create `.env.local` file in project root:

```powershell
# Create file
New-Item .env.local
```

Edit `.env.local` with Notepad or VS Code:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/elctrdc"

# Or if you created custom user:
# DATABASE_URL="postgresql://elctrdc_user:your_secure_password@localhost:5432/elctrdc"

# Next Auth (generate random secret)
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 8: Initialize Database

```powershell
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### Step 9: Run Development Server

```powershell
npm run dev
```

Open browser to: http://localhost:3000

**Success!** You should see ElctrDc login page! 🎉

---

## Installation - Linux

### Step 1: Update System

```bash
# Ubuntu/Debian
sudo apt update
sudo apt upgrade -y

# Fedora/RHEL
sudo dnf update -y

# Arch Linux
sudo pacman -Syu
```

### Step 2: Install Node.js

**Ubuntu/Debian:**
```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

**Fedora/RHEL:**
```bash
sudo dnf install -y nodejs npm

# Or using NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

**Arch Linux:**
```bash
sudo pacman -S nodejs npm
```

### Step 3: Install Git

```bash
# Ubuntu/Debian
sudo apt install -y git

# Fedora/RHEL
sudo dnf install -y git

# Arch Linux
sudo pacman -S git
```

**Verify:**
```bash
git --version
```

### Step 4: Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Fedora/RHEL:**
```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Arch Linux:**
```bash
sudo pacman -S postgresql
sudo -u postgres initdb -D /var/lib/postgres/data
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Verify:**
```bash
sudo systemctl status postgresql
```

### Step 5: Clone Repository

```bash
# Navigate to desired location
cd ~/Projects

# Clone repository
git clone https://github.com/yourusername/ElctrDc.git

# Enter directory
cd ElctrDc
```

### Step 6: Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (recommended, faster)
npm install -g pnpm
pnpm install

# Or using yarn
npm install -g yarn
yarn install
```

### Step 7: Setup Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
```

```sql
-- Create database
CREATE DATABASE elctrdc;

-- Create user
CREATE USER elctrdc_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE elctrdc TO elctrdc_user;

-- Exit
\q
```

### Step 8: Configure Environment

```bash
# Create .env.local file
touch .env.local

# Edit with your favorite editor
nano .env.local
# or
vim .env.local
# or
code .env.local
```

Add to `.env.local`:

```env
# Database
DATABASE_URL="postgresql://elctrdc_user:your_secure_password@localhost:5432/elctrdc"

# Next Auth
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 9: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### Step 10: Run Development Server

```bash
npm run dev
```

Open browser to: http://localhost:3000

**Success!** You should see ElctrDc login page! 🎉

---

## VS Code Setup

### Install VS Code

**Windows:**
1. Download from https://code.visualstudio.com/
2. Run installer
3. Check "Add to PATH"
4. Install

**Linux:**
```bash
# Ubuntu/Debian
sudo snap install code --classic

# Or using apt
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code

# Arch Linux
yay -S visual-studio-code-bin
```

### Open Project in VS Code

**Windows:**
```powershell
cd C:\Users\YourName\Projects\ElctrDc
code .
```

**Linux:**
```bash
cd ~/Projects/ElctrDc
code .
```

### Install Recommended Extensions

VS Code will prompt to install recommended extensions. Click **Install All**.

Or install manually:

1. Press `Ctrl+Shift+X` (Extensions panel)
2. Search and install:

**Required Extensions:**
- ✅ **ESLint** - Code linting
- ✅ **Prettier** - Code formatting
- ✅ **Prisma** - Database schema
- ✅ **Tailwind CSS IntelliSense** - CSS autocomplete

**Recommended Extensions:**
- 📘 **TypeScript Error Translator** - Better error messages
- 📘 **GitLens** - Advanced Git features
- 📘 **Auto Rename Tag** - HTML/JSX tags
- 📘 **Path Intellisense** - File path autocomplete
- 📘 **Error Lens** - Inline errors
- 📘 **Thunder Client** - API testing (like Postman)

### Configure VS Code Settings

Press `Ctrl+,` (Settings) or `Cmd+,` (Mac)

**Recommended Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**Save settings:**
- File → Preferences → Settings (Windows/Linux)
- Code → Preferences → Settings (Mac)

### VS Code Keyboard Shortcuts

**Essential Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` / `Cmd+P` | Quick file open |
| `Ctrl+Shift+P` / `Cmd+Shift+P` | Command palette |
| `Ctrl+B` / `Cmd+B` | Toggle sidebar |
| `Ctrl+`` | Toggle terminal |
| `Ctrl+Shift+F` / `Cmd+Shift+F` | Search in files |
| `F2` | Rename symbol |
| `F12` | Go to definition |
| `Ctrl+.` / `Cmd+.` | Quick fix |
| `Alt+Up/Down` | Move line up/down |

### VS Code Integrated Terminal

**Windows:**
- Default: PowerShell
- Change to Git Bash: `Ctrl+Shift+P` → "Terminal: Select Default Profile"

**Linux:**
- Default: bash
- Change to zsh: `Ctrl+Shift+P` → "Terminal: Select Default Profile"

**Tips:**
- Split terminal: Click split icon or `Ctrl+Shift+5`
- Multiple terminals: Click `+` icon
- Close terminal: `Ctrl+D` or type `exit`

---

## Database Setup

### PostgreSQL Configuration

**Increase Performance (Optional):**

Edit `postgresql.conf`:

**Windows:** `C:\Program Files\PostgreSQL\15\data\postgresql.conf`
**Linux:** `/etc/postgresql/15/main/postgresql.conf`

```conf
# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB

# Connection settings
max_connections = 100

# Write-Ahead Log
wal_buffers = 16MB
```

Restart PostgreSQL:

**Windows:**
```powershell
net stop postgresql-x64-15
net start postgresql-x64-15
```

**Linux:**
```bash
sudo systemctl restart postgresql
```

### Prisma Studio (Database GUI)

View and edit database visually:

```bash
npx prisma studio
```

Opens at: http://localhost:5555

**Features:**
- Browse all tables
- Edit records
- Run queries
- View relationships

---

## Environment Configuration

### Full `.env.local` Template

```env
# ======================
# DATABASE
# ======================
DATABASE_URL="postgresql://user:password@localhost:5432/elctrdc"

# ======================
# NEXT AUTH
# ======================
NEXTAUTH_SECRET="generate-with-openssl-or-node"
NEXTAUTH_URL="http://localhost:3000"

# ======================
# OAUTH PROVIDERS (Optional)
# ======================

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# ======================
# AI FEATURES (Optional)
# ======================
OLLAMA_URL="http://localhost:11434"

# ======================
# FILE STORAGE
# ======================
MAX_FILE_SIZE=104857600  # 100MB in bytes
UPLOAD_DIR="/uploads"

# ======================
# EMAIL (Optional)
# ======================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
SMTP_FROM="ElctrDc <noreply@elctrdc.com>"

# ======================
# ENVIRONMENT
# ======================
NODE_ENV="development"
# For production: NODE_ENV="production"
```

### Environment Variables Explained

**DATABASE_URL:**
- Format: `postgresql://username:password@host:port/database`
- Example: `postgresql://postgres:mypassword@localhost:5432/elctrdc`

**NEXTAUTH_SECRET:**
- Required for NextAuth.js
- Generate with: `openssl rand -base64 32`
- Or: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**NEXTAUTH_URL:**
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

---

## Running the Application

### Development Mode

```bash
# Start dev server
npm run dev

# Or with specific port
PORT=3001 npm run dev

# With pnpm
pnpm dev

# With yarn
yarn dev
```

**Features:**
- ✅ Hot reload (instant updates)
- ✅ TypeScript checking
- ✅ Error overlay
- ✅ Fast refresh

**Access:**
- Main app: http://localhost:3000
- API routes: http://localhost:3000/api/*
- Prisma Studio: http://localhost:5555 (separate command)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Production Optimizations:**
- Minified code
- Image optimization
- Static generation
- Server-side rendering
- API routes

### Useful Commands

```bash
# Lint code
npm run lint

# Format code with Prettier
npm run format

# Type check
npm run type-check

# Database commands
npx prisma studio          # GUI database browser
npx prisma migrate dev     # Run migrations
npx prisma migrate reset   # Reset database
npx prisma db push         # Push schema changes
npx prisma generate        # Generate Prisma Client

# Git commands
git status                 # Check status
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Push to remote
```

---

## Optional: AI Features

ElctrDc includes AI-powered data insights using Ollama (local AI).

### Install Ollama

**Windows:**
1. Download from: https://ollama.com/download/windows
2. Run installer
3. Ollama will start automatically

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Pull AI Model

```bash
# Pull Llama 2 (7B, ~4GB)
ollama pull llama2

# Or smaller model (1.5GB)
ollama pull phi

# Or larger model (13GB)
ollama pull llama2:13b
```

### Start Ollama Server

**Windows:**
- Starts automatically
- Or: Search "Ollama" in Start Menu

**Linux:**
```bash
# Start service
sudo systemctl start ollama

# Enable on boot
sudo systemctl enable ollama

# Check status
sudo systemctl status ollama
```

### Verify Ollama

```bash
# Test API
curl http://localhost:11434/api/version

# Should return version info
```

### Update `.env.local`

```env
OLLAMA_URL="http://localhost:11434"
```

**AI Features Now Work:**
- AI-powered data insights
- Anomaly detection explanations
- Experimental recommendations
- Natural language analysis

---

## Troubleshooting

### Common Errors

#### Error: "Cannot find module 'next'"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm -f package-lock.json
npm install
```

#### Error: "Port 3000 already in use"

**Solution:**

**Windows:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

**Or use different port:**
```bash
PORT=3001 npm run dev
```

#### Error: "Database connection failed"

**Solutions:**

1. **Check PostgreSQL is running:**
   - Windows: `net start postgresql-x64-15`
   - Linux: `sudo systemctl start postgresql`

2. **Verify DATABASE_URL** in `.env.local`

3. **Test connection:**
   ```bash
   psql -U postgres -d elctrdc
   ```

4. **Check credentials** (username, password, database name)

#### Error: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

#### Error: "EACCES: permission denied"

**Linux:**
```bash
# Fix npm global permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Or use nvm (recommended):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install 20
nvm use 20
```

### Performance Issues

**Slow startup:**
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

**High memory usage:**
- Close other applications
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run dev`

**Slow database queries:**
- Add indexes (check Prisma schema)
- Analyze queries in Prisma Studio
- Check PostgreSQL logs

### Windows-Specific Issues

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Path issues:**
- Add to PATH: `C:\Program Files\nodejs\`
- Restart terminal after installing Node.js

### Linux-Specific Issues

**Permission denied (npm global):**
```bash
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/.config
```

**PostgreSQL authentication:**
Edit `/etc/postgresql/15/main/pg_hba.conf`:
```
# Change to 'md5' for password auth
local   all   all   md5
host    all   all   127.0.0.1/32   md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## Production Deployment

### Build for Production

```bash
# Install dependencies
npm ci

# Build application
npm run build

# Test production build
npm start
```

### Environment Variables (Production)

Update `.env.production`:

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@production-host:5432/elctrdc"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="very-secure-random-string"
```

### Deployment Options

#### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel: https://vercel.com/import
3. Add environment variables
4. Deploy!

**Automatic:**
- SSL certificates
- CDN distribution
- Serverless functions
- Auto-scaling

#### Option 2: Docker

```dockerfile
# Dockerfile included in project
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t elctrdc .
docker run -p 3000:3000 elctrdc
```

#### Option 3: Linux Server (VPS)

1. **Setup server:**
   ```bash
   sudo apt update
   sudo apt install -y nginx nodejs npm postgresql
   ```

2. **Clone and build:**
   ```bash
   git clone https://github.com/yourusername/ElctrDc.git
   cd ElctrDc
   npm ci
   npm run build
   ```

3. **PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "elctrdc" -- start
   pm2 save
   pm2 startup
   ```

4. **Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Additional Resources

### Documentation
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs

### Learning Resources
- **Next.js Tutorial:** https://nextjs.org/learn
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **React Docs:** https://react.dev/

### Community
- **GitHub Issues:** https://github.com/yourusername/ElctrDc/issues
- **Discord:** discord.gg/elctrdc
- **Forum:** forum.elctrdc.com

---

## Checklist

Use this checklist to verify your setup:

### Installation
- [ ] Node.js installed and verified
- [ ] Git installed and configured
- [ ] PostgreSQL installed and running
- [ ] VS Code installed with extensions
- [ ] Repository cloned
- [ ] Dependencies installed

### Configuration
- [ ] `.env.local` created and configured
- [ ] DATABASE_URL set correctly
- [ ] NEXTAUTH_SECRET generated
- [ ] Database created
- [ ] Prisma migrations run
- [ ] Prisma Client generated

### Development
- [ ] Dev server starts successfully
- [ ] Can access http://localhost:3000
- [ ] Can create account and login
- [ ] Database operations work
- [ ] Hot reload working

### Optional
- [ ] Ollama installed (for AI features)
- [ ] OAuth providers configured
- [ ] SMTP configured (for emails)

---

**Congratulations!** 🎉

You've successfully set up ElctrDc on your system!

For usage instructions, see **USER_MANUAL.md**

---

**Version:** 2.0.0
**Last Updated:** November 16, 2025
**Document:** SETUP_GUIDE.md

© 2025 ElctrDc - The Ultimate Electrochemistry Research Platform
