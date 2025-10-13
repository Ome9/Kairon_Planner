# Fix: Kanban Column Status Mapping

## Problem Identified

The issue was that **"Backlog" and "To Do" both mapped to 'not_started'** in the backend, making it impossible to differentiate between these two columns when saving/loading.

### Original Mapping (BROKEN):
```
Frontend (TaskStatus) → Backend (status enum)
-------------------------------------------------
"Backlog"      → 'not_started'
"To Do"        → 'not_started'  ⚠️ DUPLICATE!
"In Progress"  → 'in_progress'
"In Review"    → 'review'
"Done"         → 'completed'
```

### New Mapping (FIXED):
```
Frontend (TaskStatus) → Backend (status enum)
-------------------------------------------------
"Backlog"      → 'not_started'
"To Do"        → 'todo'           ✅ UNIQUE!
"In Progress"  → 'in_progress'
"In Review"    → 'review'
"Done"         → 'completed'
```

---

## Changes Made

### 1. ✅ Updated Backend Schema
**File**: `server/models/Plan.js`

**Before**:
```javascript
status: { 
  type: String, 
  enum: ['not_started', 'in_progress', 'review', 'completed'],
  default: 'not_started'
},
```

**After**:
```javascript
status: { 
  type: String, 
  enum: ['not_started', 'todo', 'in_progress', 'review', 'completed'],
  default: 'not_started'
},
```

**Why**: Added 'todo' to the enum so MongoDB accepts it as a valid status.

---

### 2. ✅ Updated Frontend → Backend Conversion
**File**: `src/pages/Index.tsx`

**Function**: `convertStatus()`

**Before**:
```typescript
const statusMap: Record<string, 'not_started' | 'in_progress' | 'review' | 'completed'> = {
  'Backlog': 'not_started',
  'To Do': 'not_started',  // ⚠️ Same as Backlog!
  'In Progress': 'in_progress',
  'In Review': 'review',
  'Done': 'completed',
  // ...
};
```

**After**:
```typescript
const statusMap: Record<string, 'not_started' | 'todo' | 'in_progress' | 'review' | 'completed'> = {
  'Backlog': 'not_started',
  'To Do': 'todo',          // ✅ Now unique!
  'In Progress': 'in_progress',
  'In Review': 'review',
  'Done': 'completed',
  // ...
};
```

---

### 3. ✅ Updated Backend → Frontend Conversion
**File**: `src/pages/Index.tsx`

**Function**: `convertAPIStatusToTaskStatus()`

**Before**:
```typescript
const statusMap: Record<string, string> = {
  'not_started': 'Backlog',
  // 'todo' was missing!
  'in_progress': 'In Progress',
  'review': 'In Review',
  'completed': 'Done',
};
```

**After**:
```typescript
const statusMap: Record<string, string> = {
  'not_started': 'Backlog',
  'todo': 'To Do',           // ✅ Added!
  'in_progress': 'In Progress',
  'review': 'In Review',
  'completed': 'Done',
};
```

---

### 4. ✅ Updated TypeScript Type Definition
**File**: `src/lib/api.ts`

**Before**:
```typescript
status?: 'not_started' | 'in_progress' | 'review' | 'completed';
```

**After**:
```typescript
status?: 'not_started' | 'todo' | 'in_progress' | 'review' | 'completed';
```

---

### 5. ✅ Enhanced Logging
**File**: `src/components/views/KanbanView.tsx`

Added more detailed logging:
```javascript
console.log('🎯 Sending task update:', { 
  taskId, 
  updates,
  statusType: typeof newStatus,
  statusValue: newStatus
});
```

This will help debug what exact status value is being sent.

---

## Why This Fixes the Issue

### Before:
1. User drags card from "Backlog" to "To Do"
2. Frontend sends: `{ status: "To Do", kanban_column: "To Do" }`
3. Backend converts "To Do" → 'not_started' (same as Backlog!)
4. Saves to MongoDB: `{ status: 'not_started', kanban_column: "To Do" }`
5. On reload, backend returns: `{ status: 'not_started' }`
6. Frontend converts 'not_started' → "Backlog"
7. **Card appears in Backlog instead of To Do!** ❌

### After:
1. User drags card from "Backlog" to "To Do"
2. Frontend sends: `{ status: "To Do", kanban_column: "To Do" }`
3. Backend converts "To Do" → 'todo' (unique!)
4. Saves to MongoDB: `{ status: 'todo', kanban_column: "To Do" }`
5. On reload, backend returns: `{ status: 'todo' }`
6. Frontend converts 'todo' → "To Do"
7. **Card appears in To Do!** ✅

---

## How to Test

### Step 1: Restart Backend Server
**IMPORTANT**: The schema change requires a server restart!

```powershell
# Stop all Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Start backend
cd server
npm start
```

### Step 2: Clear Browser Cache (Optional but Recommended)
```
1. Open DevTools (F12)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"
```

### Step 3: Test Each Column

#### Test Backlog Column:
1. Open a saved plan
2. Switch to Kanban view
3. Drag a card TO "Backlog" column
4. Check console:
   ```
   🎯 Sending task update: { 
     taskId: X, 
     updates: { status: "Backlog", kanban_column: "Backlog" },
     statusValue: "Backlog"
   }
   ```
5. Click "Save Changes"
6. Check console:
   ```
   📝 Tasks being saved: [{ status: 'not_started', kanban_column: "Backlog" }]
   ```
7. Refresh page → Card should be in Backlog ✅

#### Test To Do Column:
1. Drag a card TO "To Do" column
2. Check console:
   ```
   🎯 Sending task update: { 
     statusValue: "To Do"  ← Should be "To Do" not "Backlog"
   }
   ```
3. Click "Save Changes"
4. Check console:
   ```
   📝 Tasks being saved: [{ status: 'todo', kanban_column: "To Do" }]
   ```
5. Refresh page → Card should be in To Do ✅

#### Test In Progress Column:
1. Drag a card TO "In Progress" column
2. Check console: `statusValue: "In Progress"`
3. Save and refresh → Card should be in In Progress ✅

#### Test In Review Column:
1. Drag a card TO "In Review" column
2. Check console: `statusValue: "In Review"`
3. Save and refresh → Card should be in In Review ✅

#### Test Done Column:
1. Drag a card TO "Done" column
2. Check console: `statusValue: "Done"`
3. Save and refresh → Card should be in Done ✅
4. **Bonus**: Check that completion percentage increases

---

## Expected Console Output

### When moving to "To Do":
```
🎯 Kanban drag completed: {
  taskId: 3,
  from: { column: "Backlog", position: 2 },
  to: { column: "To Do", position: 0 },
  isMovingToNewColumn: true
}
🎯 Sending task update: {
  taskId: 3,
  updates: {
    status: "To Do",
    kanban_column: "To Do",
    kanban_position: 0,
    completed: false
  },
  statusType: "string",
  statusValue: "To Do"
}
📋 Task update received: { ... }
🔄 Plan updated: { ... }

[After clicking Save]
💾 savePlanToDatabase called: { ... }
📝 Updating plan with ID: 67a...
📝 Tasks being saved (first 3): [
  {
    id: 3,
    title: "Select Date & Time",
    status: 'todo',           ← Should be 'todo' not 'not_started'
    kanban_column: "To Do",
    kanban_position: 0,
    completed: false
  }
]

[Backend Console]
📝 PUT /:planId - Received update request
📝 About to save. Sample tasks: [
  { id: 3, kanban_column: "To Do", kanban_position: 0, ... }
]
✅ Plan saved. Progress: X %
```

---

## Troubleshooting

### Issue: Cards in "To Do" still return to "Backlog" after refresh

**Check**:
1. Did you restart the backend server? (Schema changes require restart)
2. Backend console: Does it show `status: 'todo'` when saving?
3. Frontend console when loading: Does `📂 Plan loaded` show `kanban_column: "To Do"`?

**Fix**:
- If backend shows 'not_started' instead of 'todo', the conversion isn't working
- If frontend shows wrong column on load, the reverse conversion isn't working

### Issue: MongoDB error "Invalid status value"

**Error Message**:
```
ValidationError: Plan validation failed: tasks.0.status: 'todo' is not a valid enum value
```

**Cause**: MongoDB still has the old schema cached

**Fix**:
```powershell
# Completely restart the backend
cd server
npm start
```

If still failing, you may need to manually update existing documents:
```javascript
// In MongoDB shell or Compass
db.plans.updateMany(
  { "tasks.status": "not_started" },
  { $set: { "tasks.$[elem].status": "not_started" } },
  { arrayFilters: [{ "elem.kanban_column": "To Do" }] }
)
```

### Issue: Some cards work, others don't

**Likely Cause**: Mixed old and new data

**Fix**:
1. Delete the plan completely
2. Generate a fresh plan
3. Test with the new plan

---

## Data Migration (Optional)

If you have existing plans with cards stuck in wrong columns:

### Option 1: Manual Fix in MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Find collection: `plans`
4. Filter: `{ "tasks.kanban_column": "To Do" }`
5. For each task with `kanban_column: "To Do"`, update `status: "todo"`

### Option 2: Migration Script
```javascript
// In server directory, create migrate-todo-status.js
const mongoose = require('mongoose');
const Plan = require('./models/Plan');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const plans = await Plan.find({});
  
  for (const plan of plans) {
    let updated = false;
    
    plan.tasks.forEach(task => {
      if (task.kanban_column === "To Do" && task.status === 'not_started') {
        task.status = 'todo';
        updated = true;
      }
    });
    
    if (updated) {
      await plan.save();
      console.log(`Updated plan: ${plan._id}`);
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate();
```

---

## Summary

**Root Cause**: Backend couldn't differentiate between "Backlog" and "To Do" because both mapped to 'not_started'

**Solution**: Added 'todo' as a valid status in backend schema and updated all conversion functions

**Files Changed**:
1. `server/models/Plan.js` - Added 'todo' to enum
2. `src/pages/Index.tsx` - Updated both conversion functions
3. `src/lib/api.ts` - Updated TypeScript type
4. `src/components/views/KanbanView.tsx` - Enhanced logging

**Test Status**:
- [ ] Backlog column saves/loads correctly
- [ ] To Do column saves/loads correctly (THIS WAS BROKEN, NOW FIXED)
- [ ] In Progress column saves/loads correctly
- [ ] In Review column saves/loads correctly
- [ ] Done column saves/loads correctly

**Next Steps**:
1. Restart backend server
2. Test moving cards to ALL 5 columns
3. Save after each move
4. Refresh and verify positions persist
5. Report results with console logs
