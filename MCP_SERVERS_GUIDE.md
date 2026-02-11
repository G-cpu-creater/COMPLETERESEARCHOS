# 🚀 MCP Servers Guide for ResearchOS

## 📦 Installed: 13 FREE MCP Servers

All configured and ready to use in VS Code! No API keys needed.

---

## 🎨 Frontend & Landing Page

### 1. Browserbase
**What**: Advanced browser automation & visual testing
**Use for**: Testing animations, screenshots, mobile responsiveness
**Commands**:
```
"Open localhost:3000 and take a screenshot"
"Test the hero section animation on scroll"
"Check mobile view of the landing page"
```

### 2. Puppeteer
**What**: Browser automation & E2E testing
**Use for**: Automated testing, form submissions, user flows
**Commands**:
```
"Test the login flow"
"Fill out the registration form"
"Navigate through the dashboard"
```

### 3. YouTube Transcript
**What**: Extract video transcripts & captions
**Use for**: Embedding video content, testimonials
**Commands**:
```
"Get transcript from YouTube video: [URL]"
"Extract captions for landing page"
```

---

## ⚙️ Backend Development

### 4. PostgreSQL
**What**: Direct database access (your Neon DB)
**Use for**: Queries, data inspection, schema changes
**Commands**:
```
"Show all users in the database"
"SELECT * FROM projects WHERE status = 'active'"
"Show database schema for the projects table"
```

### 5. SQLite
**What**: Local database for dev/testing
**Use for**: Caching, prototyping, testing
**Commands**:
```
"Create a cache table in SQLite"
"Query local session data"
"Set up a test database"
```

### 6. Git
**What**: Git operations without terminal
**Use for**: Commits, branches, diffs, merges
**Commands**:
```
"Show git status"
"Create branch 'feature/animated-hero'"
"Commit changes with message 'Add landing animations'"
"Show git diff for App.tsx"
```

### 7. Fetch
**What**: HTTP requests & API testing
**Use for**: Testing Next.js API routes, debugging APIs
**Commands**:
```
"POST to /api/projects with this data: {...}"
"Test the /api/auth/login endpoint"
"Fetch data from external API: [URL]"
```

### 8. Docker
**What**: Container management
**Use for**: Dev environments, services, deployment
**Commands**:
```
"List running Docker containers"
"Start the PostgreSQL container"
"Show Docker compose services"
```

---

## 🧠 AI & Development Tools

### 9. Sequential Thinking
**What**: Enhanced AI reasoning
**Use for**: Complex problem solving, architecture decisions
**Commands**:
```
"Design the database schema for [feature]"
"Solve this complex algorithm problem"
"Plan the implementation of [feature]"
```

### 10. Memory
**What**: Persistent memory across sessions
**Use for**: Remembering project context, preferences
**Commands**:
```
"Remember: I prefer Tailwind CSS for styling"
"What was the last feature we worked on?"
"Store this API endpoint for later"
```

### 11. Time
**What**: Time/date operations
**Use for**: Timestamps, scheduling, timezone handling
**Commands**:
```
"Convert this timestamp to UTC"
"What time is it in Tokyo?"
"Schedule a reminder for tomorrow"
```

---

## 📊 Monitoring & Logging

### 12. Axiom
**What**: Logging and real-time analytics
**Use for**: Debugging, monitoring, error tracking
**Commands**:
```
"Show recent error logs"
"Analyze API response times"
"Check server performance"
```

---

## 📁 File Operations

### 13. Filesystem
**What**: Direct file system access
**Use for**: Reading/writing files efficiently
**Commands**:
```
"Read all TypeScript files in components/"
"Search for all API routes"
"Update the schema.prisma file"
```

---

## 🎯 Quick Start Examples

### For Animated Landing Page:
```bash
# 1. Test animations
"Open localhost:3000 and test the hero animation"

# 2. Take screenshots
"Take a screenshot of the landing page in mobile view"

# 3. Commit changes
"Commit these animation changes to git"
```

### For Backend Development:
```bash
# 1. Database query
"Show all projects with more than 5 datasets"

# 2. API testing
"POST to /api/projects/create with sample data"

# 3. Git operations
"Show git diff for all changed files"
```

### For Full Stack Development:
```bash
# 1. Database + API
"Query the database and test the API response"

# 2. Frontend + Backend
"Test the complete user registration flow"

# 3. Commit + Deploy
"Commit changes and show deployment status"
```

---

## 🔄 How to Reload MCP Servers

If a server stops working:
1. Press `Ctrl+Shift+P`
2. Type: "Developer: Reload Window"
3. Hit Enter

---

## 📝 Tips

1. **Be specific**: "Test /api/auth/login with valid credentials"
2. **Combine servers**: "Query database, then test the API"
3. **Use context**: "Based on the last commit, test the new feature"

---

## 🎉 All FREE, No API Keys!

Every server listed here is completely free and requires no API keys.

Last updated: $(date)
