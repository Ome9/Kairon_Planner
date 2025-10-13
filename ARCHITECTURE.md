# Kairon Planner - System Architecture

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:8080                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Welcome    │  │    Login     │  │   SignUp     │          │
│  │   Page (/)   │  │  (/login)    │  │  (/signup)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Main App (/app)                          │           │
│  │  - AI Plan Generator (Supabase Functions)       │           │
│  │  - Auto-save to MongoDB                         │           │
│  │  - Load plan from state                         │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Saved Plans (/app/plans)                 │           │
│  │  - Card-based grid UI                           │           │
│  │  - Search & filter                              │           │
│  │  - Star, Archive, Duplicate, Delete             │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests (Axios)
                              │ VITE_API_URL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Express)                       │
│                     http://localhost:3001                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                   API Routes (/api)                     │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                          │     │
│  │  GET    /plans/user/:userId    → List all plans        │     │
│  │  GET    /plans/:planId         → Get single plan       │     │
│  │  POST   /plans                 → Create new plan       │     │
│  │  PUT    /plans/:planId         → Update plan           │     │
│  │  PUT    /plans/:planId/tasks   → Update tasks          │     │
│  │  PATCH  /plans/:planId/star    → Toggle star           │     │
│  │  DELETE /plans/:planId         → Delete plan           │     │
│  │  PATCH  /plans/:planId/archive → Toggle archive        │     │
│  │  POST   /plans/:planId/duplicate → Duplicate plan      │     │
│  │                                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                  Health Check                           │     │
│  │  GET /health → Server status                           │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              │ MONGODB_URI
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB Atlas)                       │
│         Cluster0.fv4seiu.mongodb.net                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Collection: plans                                      │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  - userId (indexed)                                     │     │
│  │  - projectName                                          │     │
│  │  - projectSummary                                       │     │
│  │  - goalText                                             │     │
│  │  - tasks []                                             │     │
│  │    - id, title, description, category                   │     │
│  │    - estimated_duration_hours                           │     │
│  │    - dependencies, status, dates, progress              │     │
│  │    - assignee, priority                                 │     │
│  │  - status (active/completed/archived)                   │     │
│  │  - tags []                                              │     │
│  │  - color, thumbnail                                     │     │
│  │  - totalTasks (auto-calculated)                         │     │
│  │  - completedTasks (auto-calculated)                     │     │
│  │  - progressPercentage (auto-calculated)                 │     │
│  │  - estimatedDuration (auto-calculated)                  │     │
│  │  - isStarred                                            │     │
│  │  - sharedWith []                                        │     │
│  │  - createdAt, updatedAt, lastAccessedAt                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Collection: users                                      │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  - email, name, supabaseId                              │     │
│  │  - avatar                                               │     │
│  │  - preferences (defaultView, theme, notifications)      │     │
│  │  - stats (totalPlans, completedPlans, totalTasks, etc.) │     │
│  │  - subscription (tier, expiresAt)                       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES (Supabase)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Edge Function: generate-plan                          │     │
│  │  - Takes goalText input                                │     │
│  │  - Generates ProjectPlan via AI                        │     │
│  │  - Returns structured plan                             │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Authentication (Future)                               │     │
│  │  - User sign up / login                                │     │
│  │  - JWT token management                                │     │
│  │  - Protected routes                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Generate New Plan
```
User Input (Goal Text)
  → Frontend: HeroSection component
  → Supabase Edge Function: generate-plan
  → AI generates ProjectPlan
  → Frontend: setPlan(data)
  → API Call: POST /api/plans
  → Backend: Create plan in MongoDB
  → Response: Plan saved with _id
  → Frontend: Display plan + toast notification
```

### 2. View Saved Plans
```
User clicks "My Plans"
  → Navigate to /app/plans
  → Frontend: SavedPlans component
  → API Call: GET /api/plans/user/:userId
  → Backend: Query MongoDB with filters
  → Response: Array of plans
  → Frontend: Display cards in grid
```

### 3. Load Existing Plan
```
User clicks plan card
  → Frontend: handleLoadPlan(plan)
  → Navigate to /app with state
  → Index component receives plan via location.state
  → setPlan(loadedPlan)
  → Display PlanDisplay component
```

### 4. Update Plan
```
User modifies plan
  → Frontend: handlePlanUpdate(updatedPlan)
  → API Call: PUT /api/plans/:planId
  → Backend: Update in MongoDB
  → Response: Updated plan
  → Frontend: Sync state + toast
```

## 🔐 Security Considerations

### Current State:
- ❌ **No authentication** - Using temporary userId: "temp-user-123"
- ✅ **CORS configured** - Only localhost:8080 allowed
- ✅ **Environment variables** - Sensitive data in .env
- ✅ **MongoDB connection** - Secure connection string

### Future Enhancements:
- 🔄 Add Supabase Auth integration
- 🔄 Implement JWT token validation
- 🔄 Add protected API routes
- 🔄 Implement rate limiting
- 🔄 Add input sanitization
- 🔄 Implement RBAC (Role-Based Access Control)

## 🚀 Performance Optimizations

### Implemented:
- ✅ **Connection pooling** - maxPoolSize: 10
- ✅ **Database indexes** - On userId, createdAt, status, isStarred
- ✅ **Auto-calculated fields** - Pre-save hooks for metrics
- ✅ **Cached connection** - Prevents reconnection on hot reload
- ✅ **Axios instance** - Reusable HTTP client

### Future Optimizations:
- 🔄 Add Redis caching layer
- 🔄 Implement pagination (limit/offset)
- 🔄 Add GraphQL for efficient queries
- 🔄 Implement lazy loading for images
- 🔄 Add service workers for offline support
- 🔄 Use WebSockets for real-time updates

## 📦 Technology Stack Details

### Frontend Dependencies:
```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.28.1",
  "axios": "^1.7.9",
  "framer-motion": "^11.15.0",
  "@radix-ui/*": "Various UI components",
  "tailwindcss": "^3.4.1",
  "typescript": "~5.6.2",
  "vite": "^5.4.11"
}
```

### Backend Dependencies:
```json
{
  "express": "^4.21.2",
  "mongoose": "^8.9.5",
  "mongodb": "^6.12.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3"
}
```

## 🎯 API Response Examples

### GET /api/plans/user/:userId
```json
{
  "success": true,
  "data": [
    {
      "_id": "6789abc123def456",
      "userId": "temp-user-123",
      "projectName": "E-commerce Platform",
      "projectSummary": "Build a modern e-commerce website",
      "tasks": [...],
      "status": "active",
      "totalTasks": 15,
      "completedTasks": 3,
      "progressPercentage": 20,
      "estimatedDuration": 120,
      "isStarred": true,
      "createdAt": "2025-06-15T10:30:00Z",
      "updatedAt": "2025-06-15T14:20:00Z"
    }
  ],
  "count": 1
}
```

### POST /api/plans
```json
{
  "success": true,
  "message": "Plan created successfully",
  "data": {
    "_id": "6789abc123def456",
    "userId": "temp-user-123",
    "projectName": "New Project",
    ...
  }
}
```

## 🏗️ Folder Structure
```
Kairon_Planner/
├── server/
│   ├── models/          # Mongoose schemas
│   │   ├── Plan.js
│   │   └── User.js
│   ├── routes/          # API routes
│   │   └── plans.js
│   ├── config/          # Configuration
│   │   └── database.js
│   └── index.js         # Express server entry point
├── src/
│   ├── pages/           # Route pages
│   │   ├── Welcome.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── Index.tsx
│   │   ├── SavedPlans.tsx
│   │   └── NotFound.tsx
│   ├── components/      # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   └── views/       # View components
│   ├── lib/
│   │   ├── api.ts       # API client
│   │   └── utils.ts
│   ├── types/
│   │   └── plan.ts      # TypeScript types
│   └── App.tsx          # Root component with routing
├── .env                 # Environment variables
├── package.json         # Dependencies & scripts
├── SETUP.md            # Setup guide
└── IMPLEMENTATION_SUMMARY.md
```
