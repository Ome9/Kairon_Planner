# Kairon Planner 🚀

> **AI-Powered Project Planning Application with MongoDB Backend & Authentication**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/license-MIT-green)

An intelligent task planning application featuring AI-powered plan generation, MongoDB persistence, user authentication, auto-save functionality, and 7 powerful visualization views including DataGrid, Gantt, and Scheduler.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Authentication](#-authentication)
- [Database Setup](#-database-setup)
- [API Reference](#-api-reference)
- [Views & Features](#-views--features)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)

---

## ✨ Features

### 🔐 **User Authentication**
- ✅ **MongoDB-Based Auth** - Secure user registration and login
- ✅ **JWT Tokens** - 7-day token expiry with secure signing
- ✅ **Password Hashing** - bcrypt with salt rounds 10
- ✅ **Profile Management** - User dropdown with logout functionality
- ✅ **Auto-Login Prevention** - Signup redirects to login page for credential verification

### 💾 **Auto-Save & Data Persistence**
- ✅ **Auto-Save** - Saves plan changes every 60 seconds automatically
- ✅ **Manual Save Button** - Save immediately with visual feedback (Save Changes/Saving.../Saved)
- ✅ **Smart Save Logic** - Creates new plans on first save, updates existing plans thereafter
- ✅ **Change Tracking** - Tracks unsaved changes with visual indicators
- ✅ **MongoDB Storage** - All data persisted to MongoDB Atlas (`kairon_planner` database)

### 📊 **7 Powerful Views**
1. **List View** - Expandable accordion with edit controls
2. **Timeline View** - Progress bars with colored categories
3. **Kanban Board** - Drag-and-drop workflow (5 columns: Backlog, To Do, In Progress, In Review, Done)
4. **Analytics View** - Charts and statistics with insights
5. **DataGrid View** ⚡ - Excel-like grid with search, filters, export (PDF/Excel)
6. **Gantt View** 🗓️ - Interactive timeline with dependencies
7. **Scheduler View** 📅 - Calendar with drag-drop scheduling

### 🎯 **Core Capabilities**
- ✅ **AI Plan Generation** - Generate project plans from natural language goals
- ✅ **User-Specific Data** - Plans filtered by authenticated user
- ✅ **Saved Plans Page** - View, search, filter, and load all your saved plans
- ✅ **Task Management** - Full CRUD operations across all views
- ✅ **Export Options** - PDF, Excel, JSON formats
- ✅ **Responsive Design** - Works on desktop, tablet, mobile
- ✅ **Dark Theme** - Beautiful dark UI with Tailwind + DevExtreme
- ✅ **Smooth Animations** - Framer Motion + Anime.js effects

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.9** - Lightning-fast build tool
- **React Router** - Navigation & routing
- **Axios** - HTTP client with token interceptors
- **shadcn/ui** - 40+ accessible Tailwind components
- **Tailwind CSS 3.4.1** - Utility-first styling
- **DevExtreme React** - Enterprise DataGrid, Gantt, Scheduler
- **Framer Motion** - Smooth animations
- **Anime.js** - Advanced micro-interactions

### Backend
- **Node.js** + **Express 5.1.0** - REST API server
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose 8.19.1** - ODM for schema modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie handling

### Database Collections
- **users** - User accounts with hashed passwords
- **plans** - Project plans with tasks
- **userpreferences** - User settings and preferences

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** or **Bun**
- **MongoDB Atlas Account** (connection string in `.env`)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Kairon_Planner

# Install dependencies
npm install

# Ensure .env file exists with required variables
# (Already configured with MongoDB Atlas connection)
```

### Running the Application

**Option 1: Run Both Frontend & Backend (Recommended)**
```bash
npm run dev:full
```

This starts:
- ✅ **Frontend**: http://localhost:8080
- ✅ **Backend**: http://localhost:3001

**Option 2: Run Separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### First Time Setup

1. **Start the application** using one of the methods above
2. **Navigate to** http://localhost:8080
3. **Click "Sign Up"** to create your account
4. **Fill in the form**:
   - Name: Your full name
   - Email: Your email address
   - Password: At least 6 characters
5. **After signup**, you'll be redirected to the login page
6. **Login** with your credentials
7. **Generate your first plan** by entering a project goal!

---

## 🔐 Authentication

### User Registration Flow
1. User fills signup form (name, email, password)
2. Backend hashes password with bcrypt
3. User document created in MongoDB `users` collection
4. Success message displayed
5. Redirected to login page
6. User logs in with credentials

### Login Flow
1. User enters email and password
2. Backend validates credentials against MongoDB
3. JWT token generated (7-day expiry)
4. Token stored in localStorage
5. User redirected to main app
6. Profile header displays user info

### Protected Routes
- All API requests automatically include JWT token (axios interceptor)
- Backend validates token on protected endpoints
- Invalid/expired tokens result in 401 Unauthorized

### Profile Features
- **Avatar with Initials** - Shows user's name initials
- **Dropdown Menu**:
  - Profile (user name + email)
  - Settings
  - Logout button

---

## � Database Setup

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  name: String (required),
  password: String (hashed, required, select: false),
  supabaseId: String,
  preferences: {
    theme: String,
    notifications: Boolean,
    // ...
  },
  stats: {
    totalPlans: Number,
    completedPlans: Number,
    // ...
  },
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

#### Plans Collection
```javascript
{
  _id: ObjectId,
  userId: String (required, indexed),
  projectName: String (required),
  projectSummary: String (required),
  goalText: String,
  tasks: [
    {
      id: Number,
      title: String,
      description: String,
      category: String,
      status: String,
      estimated_duration_hours: Number,
      dependencies: [Number],
      start_date: Date,
      end_date: Date,
      progress: Number,
      assignee: String,
      priority: String
    }
  ],
  status: String, // 'active', 'completed', 'archived'
  tags: [String],
  color: String,
  isStarred: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Viewing Your Data in MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Navigate to your cluster → Browse Collections
3. Select database: **`kairon_planner`** (NOT `test`)
4. View collections:
   - **users** - Your registered user accounts
   - **plans** - All saved project plans
   - **userpreferences** - User settings

---

## 📡 API Reference

Base URL: `http://localhost:3001/api`

### Authentication Endpoints

```typescript
// Sign up new user
POST /auth/signup
Body: { name: string, email: string, password: string }
Returns: { success: boolean, data: { user, token } }

// Login user
POST /auth/login
Body: { email: string, password: string }
Returns: { success: boolean, data: { user, token } }

// Get current user (requires token)
GET /auth/me
Headers: { Authorization: "Bearer <token>" }
Returns: { success: boolean, data: User }

// Update profile
PATCH /auth/profile
Body: { name?: string, email?: string, preferences?: object }
Returns: { success: boolean, data: User }

// Logout
POST /auth/logout
Returns: { success: boolean }
```

### Plans Endpoints

```typescript
// Get all user's plans
GET /plans/user/:userId
Query: ?status=active&starred=true&sortBy=updatedAt&order=desc
Returns: { success: boolean, data: Plan[] }

// Get single plan
GET /plans/:planId
Returns: { success: boolean, data: Plan }

// Create new plan
POST /plans
Body: { userId, projectName, projectSummary, tasks, status, tags, color }
Returns: { success: boolean, data: Plan }

// Update plan
PUT /plans/:planId
Body: { projectName, projectSummary, tasks, status }
Returns: { success: boolean, data: Plan }

// Toggle star
PATCH /plans/:planId/star
Returns: { success: boolean, data: Plan }

// Delete plan
DELETE /plans/:planId
Returns: { success: boolean, message: string }

// Duplicate plan
POST /plans/:planId/duplicate
Returns: { success: boolean, data: Plan }
```

---

## 🎨 Views & Features

### 1. List View
- Expandable accordion for each task
- Edit task details inline
- Color-coded categories
- Duration and dependency display

### 2. Timeline View
- Horizontal progress bars
- Color-coded by category
- Percentage completion
- Visual task organization

### 3. Kanban Board View
- **5 Columns**: Backlog → To Do → In Progress → In Review → Done
- **Drag & Drop**: Move tasks between columns
- **Visual Feedback**: Animations on drag operations
- **Status Auto-Update**: Status changes when moved
- **Auto-Save**: Changes saved automatically

### 4. Analytics View
- Task distribution by category (pie chart)
- Status breakdown (bar chart)
- Total hours estimate
- Completion percentage
- Key insights and statistics

### 5. DataGrid View (DevExtreme)
- **Excel-like Interface**: Sortable columns, row selection
- **Search & Filter**: Global search + column filters
- **Inline Editing**: Edit cells directly
- **Export**: PDF and Excel export
- **Column Chooser**: Show/hide columns
- **Responsive**: Adapts to screen size

### 6. Gantt View (DevExtreme)
- **Timeline Visualization**: Tasks on calendar
- **Dependencies**: Link tasks together
- **Drag to Reschedule**: Move tasks on timeline
- **Zoom Levels**: Day/Week/Month views
- **Progress Tracking**: Visual completion bars
- **Export**: PDF export

### 7. Scheduler View (DevExtreme)
- **Calendar Interface**: Day/Week/Month views
- **Drag & Drop**: Schedule and reschedule tasks
- **Time Slots**: Hourly scheduling
- **Task Details**: Full task info on hover
- **Color Coding**: By category

---

## 🔧 Development

### Project Structure

```
Kairon_Planner/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── HeroSection.tsx       # Landing page hero
│   │   ├── PlanDisplay.tsx       # Main plan viewer
│   │   ├── ProfileHeader.tsx     # User profile dropdown
│   │   ├── ViewToggle.tsx        # View switcher
│   │   ├── ui/                   # shadcn/ui components (40+)
│   │   └── views/
│   │       ├── ListView.tsx      # Accordion view
│   │       ├── TimelineView.tsx  # Progress bars
│   │       ├── KanbanBoardView.tsx  # Kanban board
│   │       ├── AnalyticsView.tsx # Charts & stats
│   │       ├── DataGridView.tsx  # DevExtreme grid
│   │       ├── GanttView.tsx     # DevExtreme gantt
│   │       └── SchedulerView.tsx # DevExtreme scheduler
│   ├── pages/
│   │   ├── Welcome.tsx           # Landing page
│   │   ├── Login.tsx             # Login page
│   │   ├── SignUp.tsx            # Signup page
│   │   ├── Index.tsx             # Main app with auto-save
│   │   └── SavedPlans.tsx        # Saved plans gallery
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication state
│   ├── hooks/
│   │   └── useAuth.ts            # Auth hook
│   ├── lib/
│   │   ├── api.ts                # API client with token interceptor
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── plan.ts               # TypeScript interfaces
│
├── server/                       # Backend source
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt
│   │   ├── Plan.js               # Plan schema
│   │   └── UserPreferences.js    # Preferences schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── plans.js              # Plans CRUD routes
│   │   └── userPreferences.js    # Preferences routes
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   └── index.js                  # Express server
│
├── supabase/functions/           # Supabase Edge Functions
│   └── generate-plan/
│       └── index.ts              # AI plan generation
│
├── .env                          # Environment variables
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

### Available Scripts

```bash
# Frontend Development
npm run dev              # Start Vite dev server (port 8080)
npm run build            # Build for production
npm run preview          # Preview production build

# Backend Development
npm run server           # Start Express server (port 3001)
cd server && npm run dev # Start with nodemon

# Full Stack
npm run dev:full         # Start both frontend and backend

# Testing
npm run test:db          # Test MongoDB connection
```

### Adding New Features

1. **New View**: Create component in `src/components/views/`
2. **New API Endpoint**: Add route in `server/routes/`
3. **New Schema Field**: Update models in `server/models/`
4. **New Page**: Add to `src/pages/` and update routes in `App.tsx`

---

## 🚀 Deployment (CLI Guide)

### Prerequisites
```bash
# Install Vercel CLI
npm install -g vercel

# Sign up for free accounts:
# - MongoDB Atlas: https://mongodb.com/cloud/atlas
# - Render: https://render.com
# - Vercel: https://vercel.com
```

---

### Step 1: MongoDB Atlas Setup (5 min)

1. **Create FREE M0 cluster** at https://mongodb.com/cloud/atlas
2. **Database Access** → Add User:
   - Username: `kairon_admin`
   - Password: `[generate-strong-password]`
   - Role: Atlas Admin
3. **Network Access** → Add IP: `0.0.0.0/0` (allow all)
4. **Get Connection String**:
   ```
   mongodb+srv://kairon_admin:PASSWORD@cluster.xxxxx.mongodb.net/kairon_planner?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend to Render (5 min)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Render Dashboard** (https://dashboard.render.com):
   - New → Web Service
   - Connect GitHub repo: `Kairon_Planner`
   - Name: `kairon-planner-backend`
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`
   - Plan: **Free**

3. **Add Environment Variables** (in Render):
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://kairon_admin:PASSWORD@cluster.xxxxx.mongodb.net/kairon_planner?retryWrites=true&w=majority
JWT_SECRET=generate-random-32-char-secret-key
CORS_ORIGIN=https://your-app-name.vercel.app
```

4. **Deploy** → Wait 3-5 minutes → Copy backend URL

---

### Step 3: Deploy Frontend to Vercel (2 min)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# When prompted:
# - Project name: kairon-planner
# - Directory: ./
# - Override settings: No

# Add environment variables via CLI:
vercel env add VITE_API_URL production
# Enter: https://your-backend.onrender.com/api

vercel env add VITE_SUPABASE_URL production
# Enter: https://your-project.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter: your-supabase-anon-key

# Redeploy with new env vars
vercel --prod
```

**Alternative: Add via Dashboard**
- Vercel Dashboard → Project → Settings → Environment Variables

---

### Step 4: Update CORS (1 min)

Go to Render → Your Service → Environment → Update:
```
CORS_ORIGIN=https://kairon-planner.vercel.app
```
(Use your actual Vercel URL)

---

### Step 5: Deploy Supabase Function (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy generate-plan

# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key
```

---

### ✅ Test Deployment

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Open frontend
open https://your-app.vercel.app
```

**Test Checklist**:
1. ✅ UI loads without errors (F12 console)
2. ✅ Generate AI plan works
3. ✅ Kanban drag-and-drop works
4. ✅ Smart Schedule works
5. ✅ Data persists after refresh

---

### 💰 Cost: 100% FREE

- MongoDB Atlas M0: **$0/month** (512MB)
- Render Free: **$0/month** (750 hrs)
- Vercel Hobby: **$0/month** (100GB)
- **Total: $0/month** 🎉

**Upgrade when needed**: Render Starter $7/mo (always-on) + MongoDB M10 $9/mo = $16/mo

---

### 🔧 Troubleshooting

**CORS Error**: Update `CORS_ORIGIN` in Render to exact Vercel URL (include https://)

**Backend 502**: Wait 60 seconds (cold start on free tier)

**Database Connection Failed**: 
- Check MongoDB Network Access: `0.0.0.0/0` added
- Verify connection string password (URL-encode special chars)
- Ensure database name: `/kairon_planner`

**Build Failed**: Run `npm run build` locally first to check for errors

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env` includes `/kairon_planner` database name
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Ensure database user has read/write permissions

### Authentication Issues
- Clear localStorage: `localStorage.clear()` in browser console
- Check JWT_SECRET is set in `.env`
- Verify backend server is running on port 3001

### Plans Not Showing in "My Plans"
- Ensure you're logged in with the account that created the plans
- Check MongoDB Atlas → `kairon_planner.plans` collection for data
- Verify userId matches between user and plans

### Auto-Save Not Working
- Check browser console for errors
- Verify backend is accessible at http://localhost:3001
- Make sure you've made changes (hasUnsavedChanges = true)

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **DevExtreme** - Enterprise-grade DataGrid, Gantt, Scheduler
- **MongoDB Atlas** - Cloud database platform
- **Supabase** - Backend and AI gateway
- **Tailwind CSS** - Utility-first CSS framework

---

## 📧 Support

For issues, questions, or contributions:
- Create an issue in the GitHub repository
- Check existing documentation files in the project root
- Review the `AUTH_IMPLEMENTATION.md` for authentication details
- See `SAVE_FEATURES_IMPLEMENTED.md` for auto-save documentation

---

**Built with ❤️ by Omkar Choudhury**

🚀 Happy Planning!
bun install

# Or using npm
npm install

# Start development server
npm run dev
# Or with bun
bun run dev
```

Visit **http://localhost:8080** (or the port shown in terminal)

---

## 📖 Usage Guide

### 1. Generate a Plan

1. Enter your project goal in the hero section text area
2. Click **"Generate"** button
3. Wait for AI to generate tasks (powered by Supabase Edge Functions)
4. Tasks automatically populate with realistic estimates and dependencies

### 2. Switch Between Views

Use the horizontal **view toggle** at the top of the plan display:

- **List** - Quick overview with expand/collapse
- **Timeline** - Visual progress with duration bars
- **Board** - Kanban with drag-drop between status columns
- **Analytics** - Charts showing task distribution and progress
- **DataGrid** - Powerful grid with sorting, filtering, search
- **Gantt** - Timeline with dependencies and critical path
- **Scheduler** - Calendar view with day/week/month modes

### 3. Edit Tasks

**Three ways to edit:**

1. **Inline Editing** (DataGrid/Board):
   - Click directly on task fields
   - Changes save automatically

2. **Task Details Modal**:
   - Click on any task card/row
   - Opens full modal with tabs (Details, Dependencies, Subtasks)
   - Edit all fields with rich form controls

3. **Drag & Drop** (Board/Gantt/Scheduler):
   - Drag cards between status columns (Kanban)
   - Drag task bars to reschedule (Gantt)
   - Drag appointments to new time slots (Scheduler)

### 4. Export Data

- **Excel Export**: DataGrid view → Click **"Excel"** button
- **PDF Export**: DataGrid/Gantt view → Click **"PDF"** button  
- **JSON Export**: Any view → Click **"Export JSON"** button (top-right)

### 4. Export Data

- **Excel Export**: DataGrid view → Click **"Excel"** button
- **PDF Export**: DataGrid/Gantt view → Click **"PDF"** button  
- **JSON Export**: Any view → Click **"Export JSON"** button (top-right)

### 5. Advanced Features

**DataGrid View:**
- **Search**: Global search box (top-left)
- **Filter**: Click filter icon in column headers
- **Sort**: Click column names (multi-column with Shift+Click)
- **Column Chooser**: Show/hide columns with "Columns" button
- **Pagination**: Adjust items per page (10/20/50/100)

**Gantt View:**
- **Dependencies**: Visual arrows show task relationships
- **Zoom**: Adjust timeline scale with +/- buttons
- **Critical Path**: Automatically calculated and highlighted
- **Task Editing**: Double-click bars to edit task details

**Scheduler View:**
- **View Modes**: Switch between Day, Week, Month
- **Drag-and-Drop**: Move appointments across time slots
- **Time Zones**: Respects local timezone settings
- **Recurring Tasks**: Support for repeated events

---

## 🏗️ Project Structure

```
kairon-planner/
├── src/
│   ├── components/
│   │   ├── DevExtremeProvider.tsx       # Theme wrapper for DevExtreme
│   │   ├── TaskDetailsModal.tsx         # Full task editor with tabs
│   │   ├── PlanDisplay.tsx              # Main container for all views
│   │   ├── ViewToggle.tsx               # 7-view selector component
│   │   ├── HeroSection.tsx              # Landing page with lamp effect
│   │   ├── ui/                          # shadcn/ui components (40+)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (accordion, tabs, etc.)
│   │   └── views/
│   │       ├── ListView.tsx             # Expandable accordion list
│   │       ├── TimelineView.tsx         # Progress bars with durations
│   │       ├── KanbanView.tsx           # Drag-drop Kanban board
│   │       ├── AnalyticsView.tsx        # Charts and statistics
│   │       ├── DataGridView.tsx         # DevExtreme DataGrid
│   │       ├── GanttView.tsx            # DevExtreme Gantt chart
│   │       └── SchedulerView.tsx        # DevExtreme Scheduler
│   ├── types/
│   │   └── plan.ts                      # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts                     # Utility functions
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                # Supabase client config
│   │       └── types.ts                 # Database types
│   ├── pages/
│   │   ├── Index.tsx                    # Main app page
│   │   └── NotFound.tsx                 # 404 page
│   ├── App.tsx                          # Root component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles
├── supabase/
│   ├── functions/
│   │   └── generate-plan/               # Edge function for AI
│   │       └── index.ts
│   └── config.toml                      # Supabase config
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── components.json                      # shadcn/ui config
├── tailwind.config.ts                   # Tailwind configuration
├── vite.config.ts                       # Vite build config
├── tsconfig.json                        # TypeScript config
└── package.json                         # Dependencies
```

---

## 📊 Views Documentation

### 1. List View
**Purpose**: Quick overview with expandable sections

**Features**:
- Accordion-style expandable items
- Category color badges
- Duration and dependency indicators
- Edit button per task
- Compact design for large task lists

**Best For**: Quick scanning, simple task lists

---

### 2. Timeline View
**Purpose**: Visual representation of task durations

**Features**:
- Horizontal progress bars
- Color-coded by category
- Shows start/end dates
- Duration labels
- Responsive grid layout

**Best For**: Understanding task timelines at a glance

---

### 3. Board View (Kanban)
**Purpose**: Workflow management with drag-and-drop

**Features**:
- 4 status columns: Not Started, In Progress, Review, Completed
- Drag cards between columns to update status
- Visual feedback during drag
- Category color indicators
- Task count per column
- Automatic state updates

**Technology**: `react-beautiful-dnd`

**Best For**: Agile workflows, sprint planning, visual task management

**How It Works**:
```typescript
// Drag-and-drop flow
onDragEnd(result) {
  1. Extract source/destination columns
  2. Update task status based on column
  3. Reorder tasks within column
  4. Update state and persist changes
}
```

---

### 4. Analytics View
**Purpose**: Visual insights and statistics

**Features**:
- Task distribution by category (pie chart)
- Task distribution by status (bar chart)
- Progress metrics (completion percentage)
- Total task count
- Estimated total duration
- Interactive charts with hover tooltips

**Technology**: `recharts`

**Best For**: Project reporting, stakeholder updates, progress tracking

---

### 5. DataGrid View
**Purpose**: Excel-like data management

**Features**:
- **Search**: Global instant search across all fields
- **Filtering**: Header filters for each column
- **Sorting**: Multi-column sorting (Shift+Click)
- **Column Chooser**: Show/hide columns dynamically
- **Pagination**: 10/20/50/100 items per page
- **Inline Editing**: Click cells to edit
- **Selection**: Multi-row selection with checkboxes
- **Export**: PDF and Excel with one click
- **Virtual Scrolling**: Smooth performance with large datasets
- **Responsive**: Mobile-friendly grid layout

**Technology**: `DevExtreme DataGrid`

**Best For**: Data analysis, bulk editing, reporting, exports

**Columns**:
- ID, Title, Category, Description
- Duration, Dependencies, Start Date, End Date

**Export Features**:
- **Excel**: Full data with formatting, formulas, colors
- **PDF**: Auto-generated table with headers and pagination

---

### 6. Gantt View
**Purpose**: Project timeline with dependencies

**Features**:
- **Interactive Timeline**: Drag bars to reschedule
- **Resize**: Adjust task duration by dragging edges
- **Dependencies**: Visual arrows showing task relationships
- **Zoom Controls**: Scale timeline (day/week/month/year)
- **Critical Path**: Automatically highlighted
- **Progress Indicators**: Visual completion percentage
- **Resource Assignment**: See who's working on what
- **Export to PDF**: Print-ready Gantt charts

**Technology**: `DevExtreme Gantt`

**Best For**: Project planning, timeline visualization, dependency management

**Dependency Types**:
- Finish-to-Start (FS)
- Start-to-Start (SS)
- Finish-to-Finish (FF)
- Start-to-Finish (SF)

---

### 7. Scheduler View
**Purpose**: Calendar-based task scheduling

**Features**:
- **View Modes**: Day, Week, Month
- **Drag-and-Drop**: Move appointments across time slots
- **Resize**: Adjust appointment duration
- **Time Slots**: Customizable intervals (15/30/60 min)
- **All-Day Events**: Support for full-day tasks
- **Timezone Support**: Respects local timezone
- **Recurring Events**: Repeat daily/weekly/monthly
- **Color Coding**: Category-based colors

**Technology**: `DevExtreme Scheduler`

**Best For**: Time-based planning, meeting scheduling, deadline tracking

---

## 🎨 Theme & Styling

### Color Palette
- **Primary**: Cyan (`#06b6d4`)
- **Background**: Slate-950 (`#020617`)
- **Text**: Slate-100 (`#f1f5f9`)
- **Accent**: Purple (`#8b5cf6`)

### Category Colors (10 distinct)
1. Blue - `#3b82f6`
2. Purple - `#8b5cf6`
3. Green - `#10b981`
4. Orange - `#f97316`
5. Red - `#ef4444`
6. Cyan - `#06b6d4`
7. Yellow - `#eab308`
8. Emerald - `#059669`
9. Indigo - `#6366f1`
10. Pink - `#ec4899`

### DevExtreme Theme
- **Base**: `dx.dark.css` (DevExtreme dark theme)
- **Integration**: Tailwind utilities for custom styling
- **Consistency**: CSS variables for color synchronization

---

## 🧪 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Adding New Views

1. Create view component in `src/components/views/`
2. Add view type to `ViewType` in `src/types/plan.ts`
3. Update `ViewToggle.tsx` with new button
4. Add render case in `PlanDisplay.tsx`

Example:
```typescript
// 1. Create NewView.tsx
export const NewView = ({ plan }: { plan: ProjectPlan }) => {
  return <div>Your new view</div>;
};

// 2. Add to types/plan.ts
export type ViewType = 'list' | 'timeline' | 'board' | 'analytics' 
  | 'datagrid' | 'gantt' | 'scheduler' | 'newview';

// 3. Update ViewToggle.tsx
<Button onClick={() => onViewChange('newview')}>
  New View
</Button>

// 4. Update PlanDisplay.tsx
{currentView === 'newview' && <NewView plan={plan} />}
```

---

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Drag 'dist' folder to Netlify drop zone
```

### Build for Production

```bash
npm run build
# Output will be in 'dist' folder
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add comments for complex logic
- Test all views after changes
- Update this README if adding new features

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **DevExtreme** - Enterprise UI components
- **shadcn/ui** - Beautiful component library
- **Supabase** - Backend and AI infrastructure
- **Aceternity UI** - Lamp effect inspiration

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🎨 Theme

- **Primary Color**: Purple (`#8b5cf6`)
- **Dark Mode**: Supported with DevExtreme dark theme
- **10 Category Colors**: Blue, Purple, Green, Orange, Red, Cyan, Yellow, Emerald, Indigo, Pink

---

**Made with ❤️ using React, TypeScript, and DevExtreme**
