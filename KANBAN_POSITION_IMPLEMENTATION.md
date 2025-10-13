# Kanban Position Tracking Implementation

## Changes Made

### 1. ✅ Updated KanbanView.tsx - Drag & Drop Handler
**File**: `src/components/views/KanbanView.tsx`

**What Changed**:
- Enhanced `onDragEnd` to capture and save:
  - `kanban_column`: The TaskStatus enum value (e.g., "Backlog", "To Do", "In Progress")
  - `kanban_position`: The exact index position within that column
  - `completed`: Auto-set to true when moved to "Done"

**New Console Logs**:
```javascript
🎯 Kanban drag completed: { taskId, from: {...}, to: {...}, isMovingToNewColumn }
🎯 Sending task update: { taskId, updates: {...} }
```

### 2. ✅ Added Position-Based Sorting
**File**: `src/components/views/KanbanView.tsx`

**What Changed**:
- Tasks are now sorted by their saved `kanban_position` within each column
- Sorting logic:
  1. If both tasks have positions → sort by position (ascending)
  2. If only one has position → that one comes first
  3. If neither has position → sort by task ID

**Algorithm**:
```javascript
sortedColumnTasks = columnTasks.sort((a, b) => {
  if (a.kanban_position !== undefined && b.kanban_position !== undefined) {
    return a.kanban_position - b.kanban_position;
  }
  if (a.kanban_position !== undefined) return -1;
  if (b.kanban_position !== undefined) return 1;
  return a.id - b.id;
});
```

### 3. ✅ Enhanced Save Logging
**File**: `src/pages/Index.tsx`

**What Changed**:
- Added detailed logging before saving to database
- Shows exact data being sent to backend
- Helps debug what's being saved vs what's being loaded

**New Console Log**:
```javascript
📝 Tasks being saved (first 3): [
  { id, title, status, kanban_column, kanban_position, completed }
]
```

---

## How It Works

### 1. **When You Drag a Card**:
```
User drags task #3 from "Backlog" position 2 → "To Do" position 0
    ↓
onDragEnd captures:
  - taskId: 3
  - from: { column: "Backlog", position: 2 }
  - to: { column: "To Do", position: 0 }
    ↓
Updates sent to parent:
  - status: "To Do"
  - kanban_column: "To Do"
  - kanban_position: 0
  - completed: false
    ↓
PlanDisplay.handleTaskUpdate updates the plan
    ↓
Index.handlePlanUpdate sets hasUnsavedChanges = true
    ↓
User clicks "Save" or waits 60 seconds
    ↓
savePlanToDatabase sends to backend API
    ↓
Backend saves to MongoDB
```

### 2. **When You Load a Plan**:
```
User opens plan from "My Plans"
    ↓
Index.tsx loads plan and sets savedPlanId
    ↓
Tasks are passed to KanbanView
    ↓
Tasks filtered by status → grouped into columns
    ↓
Within each column, tasks sorted by kanban_position
    ↓
Cards appear in the exact order they were saved
```

---

## Testing Instructions

### Step 1: Verify Logging is Working
1. Open browser console (F12)
2. You should see: `🔗 API Base URL: http://localhost:3001/api`

### Step 2: Test Drag & Drop
1. Open a saved plan (from "My Plans")
2. Switch to Kanban view
3. Drag a card (e.g., move "Select Date & Time" from "Backlog" to "To Do")
4. **Check console** for these logs in order:
   ```
   🎯 Kanban drag completed: {
     taskId: 3,
     from: { column: "Backlog", position: 2 },
     to: { column: "To Do", position: 1 },
     isMovingToNewColumn: true
   }
   🎯 Sending task update: {
     taskId: 3,
     updates: {
       status: "To Do",
       kanban_column: "To Do",
       kanban_position: 1,
       completed: false
     }
   }
   📋 Task update received: { taskId: 3, updates: {...} }
   🔄 Plan updated: { projectName: "...", tasks: [...] }
   ```

### Step 3: Test Save
1. After dragging, click **"Save Changes"**
2. **Check console** for:
   ```
   💾 Manual save triggered. hasUnsavedChanges: true
   💾 savePlanToDatabase called: { hasSavedPlanId: true, savedPlanId: "67a..." }
   📝 Updating plan with ID: 67a...
   📝 Tasks being saved (first 3): [
     { id: 3, title: "Select Date & Time", kanban_column: "To Do", kanban_position: 1, ... }
   ]
   ```
3. **Check backend console** for:
   ```
   📝 PUT /:planId - Received update request
   📝 Plan ID: 67a...
   📝 About to save. Sample tasks: [
     { id: 3, kanban_column: "To Do", kanban_position: 1, ... }
   ]
   ✅ Plan saved. Progress: X %
   ```

### Step 4: Test Persistence
1. **Refresh the page** (F5)
2. Go to "My Plans"
3. Open the same plan
4. **Check console** for:
   ```
   📂 Plan loaded from My Plans: {
     planId: "67a...",
     firstTaskPositions: [
       { id: 3, title: "Select Date & Time", kanban_column: "To Do", kanban_position: 1 }
     ]
   }
   ```
5. Switch to Kanban view
6. **Verify**: "Select Date & Time" should be in "To Do" at position 1 (second card)

---

## What to Look For

### ✅ Success Indicators:
- `🎯 Kanban drag completed:` appears after every drag
- `🎯 Sending task update:` shows `kanban_column` and `kanban_position`
- `📝 Tasks being saved:` shows the correct column and position
- Backend log `📝 About to save` shows matching data
- After refresh, card appears in the same position

### ❌ Failure Indicators:
- `kanban_column` is `undefined` in logs
- `kanban_position` is `undefined` or always `0`
- After refresh, card returns to original position
- Backend log shows different position than what you saved
- Error messages in console

---

## Common Issues

### Issue: Card moves but doesn't save position
**Check**:
1. Console log `🎯 Sending task update:` - Does it show `kanban_position`?
2. Console log `📝 Tasks being saved:` - Does it include the position?
3. Backend log - Does it receive the position?

**Fix**: If any step is missing the position data, the issue is at that step.

### Issue: Card saves but returns to original position after refresh
**Check**:
1. Backend log `✅ Plan saved` - Confirms save succeeded
2. On reload, `📂 Plan loaded` - Does it show the new position?
3. If loaded position is correct but display is wrong, issue is in sorting logic

### Issue: Multiple cards in same column don't maintain order
**Check**:
1. Move 3 cards to specific positions in one column
2. Check if all have unique `kanban_position` values (0, 1, 2, etc.)
3. After save & reload, check if they load with the same positions

---

## Expected Console Output

### Full Flow Example:

```
// When opening plan
📂 Plan loaded from My Plans: {
  planId: "67a123abc...",
  projectName: "Party Planning",
  tasksCount: 18,
  firstTaskPositions: [
    { id: 1, title: "Define Party Vision", kanban_column: "In Progress", kanban_position: 0, completed: false },
    { id: 2, title: "Create Guest List", kanban_column: "To Do", kanban_position: 0, completed: false },
    { id: 3, title: "Select Date & Time", kanban_column: "Backlog", kanban_position: 2, completed: false }
  ]
}

// When dragging card
🎯 Kanban drag completed: {
  taskId: 3,
  from: { column: "Backlog", position: 2 },
  to: { column: "To Do", position: 1 },
  isMovingToNewColumn: true
}
🎯 Sending task update: {
  taskId: 3,
  updates: {
    status: "To Do",
    kanban_column: "To Do",
    kanban_position: 1,
    completed: false
  }
}
📋 Task update received: { taskId: 3, updates: {...} }
🔄 Plan updated: { projectName: "Party Planning", tasks: [18 items] }

// When saving
💾 Manual save triggered. hasUnsavedChanges: true
💾 savePlanToDatabase called: {
  hasSavedPlanId: true,
  savedPlanId: "67a123abc...",
  projectName: "Party Planning",
  tasksCount: 18
}
📝 Updating plan with ID: 67a123abc...
📝 Tasks being saved (first 3): [
  { id: 1, title: "Define Party Vision", kanban_column: "In Progress", kanban_position: 0, completed: false },
  { id: 2, title: "Create Guest List", kanban_column: "To Do", kanban_position: 0, completed: false },
  { id: 3, title: "Select Date & Time", kanban_column: "To Do", kanban_position: 1, completed: false }
]

// Backend console
📝 PUT /:planId - Received update request
📝 Plan ID: 67a123abc...
📝 Updates keys: ["projectName", "projectSummary", "tasks", "status"]
📝 First 3 tasks: [
  { id: 1, kanban_column: "In Progress", kanban_position: 0 },
  { id: 2, kanban_column: "To Do", kanban_position: 0 },
  { id: 3, kanban_column: "To Do", kanban_position: 1 }
]
✅ Plan saved. Progress: 5 %
```

---

## Technical Details

### Data Structure

**Task Object** (after drag):
```typescript
{
  id: 3,
  title: "Select Date & Time",
  status: "To Do",              // TaskStatus enum for filtering
  kanban_column: "To Do",       // Saved column (matches status)
  kanban_position: 1,           // Position within that column (0-indexed)
  completed: false,
  // ... other fields
}
```

### Sorting Algorithm Explained

```typescript
// Given tasks in "To Do" column:
[
  { id: 2, kanban_position: undefined },  // Will be last
  { id: 5, kanban_position: 0 },          // Will be first
  { id: 3, kanban_position: 1 },          // Will be second
  { id: 7, kanban_position: undefined },  // Will be after id:2
]

// After sorting:
[
  { id: 5, kanban_position: 0 },    // Has position, comes first
  { id: 3, kanban_position: 1 },    // Has position, sorted by value
  { id: 2, kanban_position: undefined }, // No position, sorted by ID
  { id: 7, kanban_position: undefined }  // No position, sorted by ID
]
```

---

## Next Steps

1. **Test the drag & drop** following the instructions above
2. **Copy all console logs** (both browser and backend if accessible)
3. **Report results**:
   - Does `🎯 Kanban drag completed` appear?
   - Does the position data appear in all subsequent logs?
   - Does the card stay in place after refresh?

If any step fails, share the console output and I'll help debug the exact issue!
