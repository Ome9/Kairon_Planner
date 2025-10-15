# Kairon Planner 🚀

> **AI-Powered Project Planning Application with Smart Scheduling, MongoDB & Authentication**

![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

Intelligent task planning application with AI plan generation, smart scheduling (CPM algorithm), auto-save, user authentication, and 7 visualization views including Kanban, DataGrid, Gantt, and Scheduler.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Tech Stack](#-tech-stack)


## ✨ Features

### Core Features
- 🤖 **AI Plan Generation** - Generate project plans from natural language using Supabase Edge Functions
- 🧠 **Smart Scheduling** - Auto-schedule tasks with Critical Path Method (CPM) algorithm
- 🔐 **User Authentication** - Secure JWT-based auth with MongoDB
- 💾 **Auto-Save** - Saves changes every 60 seconds + manual save button
- 📸 **Smart Features** - Cover images, tags, complexity estimation, subtasks
- 📊 **7 Views** - List, Timeline, Kanban, Analytics, DataGrid, Gantt, Scheduler
- 🎯 **Full CRUD** - Create, edit, delete tasks across all views
- 💼 **Saved Plans** - Browse and manage all your saved plans
- 📤 **Export** - PDF, Excel, JSON export options

### Smart Scheduling
- Automatic task scheduling using Critical Path Method
- Dependency-aware scheduling with working hours/days
- Critical path identification
- Slack time calculation
- Customizable schedule settings (work hours, start date)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- MongoDB Atlas account (free tier)

### Installation & Run

```bash
# Clone repository
git clone <your-repo-url>
cd Kairon_Planner

# Install dependencies
npm install

# Run both frontend & backend
npm run dev:full
```

**Access the app**: http://localhost:8080
- Frontend: Port 8080
- Backend: Port 3001

### First Time Setup
1. Navigate to http://localhost:8080
2. Click "Sign Up" → Create account
3. Login with credentials
4. Generate your first plan!

## 🚀 Deployment

### Prerequisites
```bash
npm install -g vercel  # Install Vercel CLI
```

Free accounts needed:
- MongoDB Atlas: https://mongodb.com/cloud/atlas
- Render: https://render.com
- Vercel: https://vercel.com

---

### Step 1: MongoDB Atlas (5 min)
1. Create FREE M0 cluster at https://mongodb.com/cloud/atlas
2. Database Access → Add User (username + password)
3. Network Access → Add IP: `0.0.0.0/0`
4. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/kairon_planner
   ```

---

### Step 2: Deploy Backend to Render (5 min)

```bash
# Push code to GitHub
git add .
git commit -m "Deploy to production"
git push origin main
```

**Render Dashboard** (https://dashboard.render.com):
- New → Web Service → Connect GitHub repo
- Name: `kairon-planner-backend`
- Build: `cd server && npm install`
- Start: `cd server && npm start`
- Plan: **Free**

**Environment Variables** (add in Render):
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kairon_planner
JWT_SECRET=your-random-32-char-secret
CORS_ORIGIN=https://your-app.vercel.app
```

Wait 3-5 min → Copy your backend URL (e.g., `https://your-app.onrender.com`)

---

### Step 3: Deploy Frontend to Vercel (2 min)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add environment variables
vercel env add VITE_API_URL production
# Enter: https://your-backend.onrender.com/api

vercel env add VITE_SUPABASE_URL production
# Enter: https://your-project.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter: your-supabase-anon-key

# Redeploy with new variables
vercel --prod
```

---

### Step 4: Update CORS (1 min)
Render → Your Service → Environment → Update:
```
CORS_ORIGIN=https://your-app.vercel.app
```

---

### ✅ Test Deployment
```bash
# Test backend
curl https://your-backend.onrender.com/health

# Open frontend
https://your-app.vercel.app
```

**Test**: Generate plan, drag tasks in Kanban, use Smart Schedule, verify data persists

---

### 🔧 Troubleshooting
- **CORS Error**: Update `CORS_ORIGIN` in Render with exact Vercel URL
- **Backend 502**: Wait 60s (cold start on free tier)
- **DB Connection Failed**: Check MongoDB IP whitelist (`0.0.0.0/0`) and connection string
- **Build Failed**: Run `npm run build` locally to check errors

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, DevExtreme (DataGrid/Gantt/Scheduler)  
**Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**AI**: Supabase Edge Functions, OpenAI  
**Deployment**: Vercel (frontend), Render (backend), MongoDB Atlas

## 📝 Available Scripts

```bash
# Development
npm run dev              # Frontend only (port 8080)
npm run dev:full         # Frontend + Backend
cd server && npm run dev # Backend only (port 3001)

# Production
npm run build            # Build frontend
npm run preview          # Preview build
```

## 📁 Project Structure

```
Kairon_Planner/
├── src/
│   ├── components/
│   │   ├── views/                    # 7 view components
│   │   ├── SmartScheduleButton.tsx   # Smart scheduling UI
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   └── smartScheduler.ts         # CPM algorithm
│   ├── pages/
│   │   ├── Index.tsx                 # Main app
│   │   └── SavedPlans.tsx            # Saved plans page
│   └── types/
│       └── plan.ts                   # TypeScript types
├── server/
│   ├── models/                       # MongoDB schemas
│   ├── routes/                       # API routes
│   └── index.js                      # Express server
├── supabase/functions/
│   └── generate-plan/                # AI plan generation
├── .env                              # Environment variables
└── package.json
```

## 📄 License

MIT License

---

**Built with ❤️ by Omkar Choudhury**

