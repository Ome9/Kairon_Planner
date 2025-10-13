# 🔌 API Reference - Kairon Planner

Base URL: `http://localhost:3001/api`

## 📋 Plans API

### Get All Plans for User
```http
GET /plans/user/:userId?status=active&starred=true&sortBy=createdAt&order=desc
```

**Query Parameters:**
- `status` (optional): `active` | `completed` | `archived`
- `starred` (optional): `true` | `false`
- `sortBy` (optional): `createdAt` | `updatedAt` | `projectName`
- `order` (optional): `asc` | `desc`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Get Single Plan
```http
GET /plans/:planId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "projectName": "...",
    ...
  }
}
```

### Create Plan
```http
POST /plans
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user-123",
  "projectName": "My Project",
  "projectSummary": "Brief description",
  "goalText": "The original goal",
  "tasks": [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Task description",
      "category": "Development",
      "estimated_duration_hours": 2,
      "dependencies": [],
      "status": "not_started",
      "start_date": "2025-10-12T00:00:00.000Z",
      "end_date": "2025-10-12T02:00:00.000Z",
      "progress": 0,
      "assignee": "",
      "priority": "medium"
    }
  ],
  "status": "active",
  "tags": ["tag1", "tag2"],
  "color": "#06b6d4"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    ...
  }
}
```

### Update Plan
```http
PUT /plans/:planId
Content-Type: application/json
```

**Body:** (Partial update supported)
```json
{
  "projectName": "Updated Name",
  "status": "completed"
}
```

### Update Plan Tasks
```http
PUT /plans/:planId/tasks
Content-Type: application/json
```

**Body:**
```json
{
  "tasks": [...]
}
```

### Toggle Star
```http
PATCH /plans/:planId/star
```

### Toggle Archive
```http
PATCH /plans/:planId/archive
```

### Duplicate Plan
```http
POST /plans/:planId/duplicate
```

### Delete Plan
```http
DELETE /plans/:planId
```

---

## 👤 User Preferences API

### Get User Preferences
```http
GET /user-preferences/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {
      "theme": "dark",
      "emailNotifications": true,
      "taskReminders": true,
      "weeklyDigest": false
    },
    "settings": {
      "defaultView": "list",
      "defaultPlanColor": "#06b6d4",
      "timezone": "UTC",
      "language": "en"
    },
    "stats": {
      "totalPlansCreated": 5,
      "totalTasksCompleted": 23,
      "lastLoginAt": "2025-10-12T...",
      "accountCreatedAt": "2025-10-01T..."
    }
  }
}
```

### Create/Update User Preferences
```http
POST /user-preferences
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "theme": "dark",
    "emailNotifications": true,
    "taskReminders": true,
    "weeklyDigest": false
  },
  "settings": {
    "defaultView": "kanban",
    "defaultPlanColor": "#10b981",
    "timezone": "America/New_York",
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

### Partial Update
```http
PATCH /user-preferences/:userId
Content-Type: application/json
```

**Body:** (Only include fields to update)
```json
{
  "preferences": {
    "theme": "light"
  }
}
```

### Update Last Login
```http
POST /user-preferences/:userId/login
```

### Delete User Preferences
```http
DELETE /user-preferences/:userId
```

---

## 🚨 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Stack trace (development only)"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Server Error

---

## 💡 Usage Examples (TypeScript)

### Frontend API Client

```typescript
import { plansAPI, userPreferencesAPI } from '@/lib/api';

// Create a plan
const response = await plansAPI.createPlan({
  userId: "user-123",
  projectName: "My Project",
  projectSummary: "Description",
  goalText: "Goal",
  tasks: [...],
  status: "active",
  tags: [],
  color: "#06b6d4"
});

// Get user's plans
const plans = await plansAPI.getPlans({
  userId: "user-123",
  status: "active",
  starred: true,
  sortBy: "createdAt",
  order: "desc"
});

// Save user preferences
await userPreferencesAPI.saveUserPreferences({
  userId: "user-123",
  email: "user@example.com",
  name: "John Doe",
  preferences: {
    theme: 'dark'
  }
});

// Get user preferences
const prefs = await userPreferencesAPI.getUserPreferences("user-123");
```

### Testing with PowerShell

```powershell
# Get plans
Invoke-RestMethod -Uri "http://localhost:3001/api/plans/user/user-123" -Method GET

# Create plan
$body = @{
  userId = "user-123"
  projectName = "Test"
  projectSummary = "Test Summary"
  goalText = "Test"
  tasks = @(
    @{
      id = 1
      title = "Task 1"
      description = "Desc"
      category = "Dev"
      estimated_duration_hours = 2
      dependencies = @()
      status = "not_started"
      priority = "medium"
    }
  )
  status = "active"
  tags = @()
  color = "#06b6d4"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3001/api/plans" -Method POST -Body $body -ContentType "application/json"

# Save user preferences
$userPrefs = @{
  userId = "user-123"
  email = "test@example.com"
  name = "Test User"
  preferences = @{
    theme = "dark"
    emailNotifications = $true
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3001/api/user-preferences" -Method POST -Body $userPrefs -ContentType "application/json"
```

### Testing with cURL

```bash
# Get plans
curl http://localhost:3001/api/plans/user/user-123

# Create plan
curl -X POST http://localhost:3001/api/plans \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","projectName":"Test",...}'

# Get user preferences
curl http://localhost:3001/api/user-preferences/user-123
```

---

## 🔍 Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-12T...",
  "uptime": 123.456
}
```
