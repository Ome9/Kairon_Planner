# Testing Checklist for Save Functionality

## Setup
1. Make sure both servers are running:
   - Backend: Port 3001 (should show "Server running on http://localhost:3001")
   - Frontend: Port 8080 (Vite dev server)
2. Open browser to: http://localhost:8080/
3. Open browser console (F12)

## Test Scenario 1: New Plan Generation
**Goal**: Verify that a newly generated plan can be saved and updated

### Steps:
1. Click "Generate Plan" on home page
2. Enter a goal (e.g., "Build a mobile app")
3. Wait for plan to generate
4. Check console for: `💾 savePlanToDatabase called:` with `hasSavedPlanId: false`
5. After auto-save, check for: `Plan saved to database!` toast
6. **Make a change**: Drag a Kanban card to a different column
7. Check console for: 
   - `📋 Task update received:` showing the kanban_column change
   - `🔄 Plan updated:`
8. Click **"Save Changes"** button
9. Check console for:
   - `💾 Manual save triggered.`
   - `💾 savePlanToDatabase called:` with `hasSavedPlanId: true` and the plan ID
   - `📝 Updating plan with ID:` showing the same ID
   - `✅ Plan saved successfully!` toast
10. Refresh page (F5)
11. **Expected**: Card should be in same position

### What to Check:
- [ ] Auto-save creates a plan ID after generation
- [ ] Manual save uses UPDATE (not CREATE) path
- [ ] Changes persist after refresh

---

## Test Scenario 2: Open Saved Plan
**Goal**: Verify that opening a saved plan from "My Plans" allows updates

### Steps:
1. Go to "My Plans" (top right button)
2. Click on a saved plan to open it
3. Check console for: `📂 Plan loaded from My Plans:` showing:
   - planId (should be a MongoDB ObjectId like "67a...")
   - projectName
   - tasksCount
   - firstTaskPositions array showing existing positions
4. **Verify savedPlanId**: In console, the log should show the plan ID
5. **Make a change**: 
   - Switch to Kanban view
   - Drag a card from "Backlog" to "In Progress"
6. Check console for:
   - `📋 Task update received:` with `kanban_column: "In Progress"`
   - `🔄 Plan updated:`
7. Click **"Save Changes"** button
8. Check console for:
   - `💾 Manual save triggered.` showing `hasUnsavedChanges: true`
   - `💾 savePlanToDatabase called:` showing `hasSavedPlanId: true`
   - `📝 Updating plan with ID:` (should be the SAME ID from step 3)
   - Backend log: `📝 PUT /:planId - Received update request`
   - Backend log: `✅ Plan saved. Progress: X %`
   - `Plan saved successfully!` toast
9. Refresh page (F5)
10. Go back to "My Plans"
11. Open the same plan again
12. **Expected**: Card should be in "In Progress" column where you moved it

### What to Check:
- [ ] Plan ID is correctly loaded from My Plans
- [ ] savedPlanId is set when plan loads
- [ ] Save uses UPDATE path (not CREATE)
- [ ] Backend receives the correct plan ID
- [ ] Changes persist in database

---

## Test Scenario 3: DataGrid Edits
**Goal**: Verify DataGrid edits persist

### Steps:
1. Open a saved plan (from My Plans)
2. Check console for plan ID
3. Switch to DataGrid view
4. Double-click a cell (e.g., task title or duration)
5. Edit the value
6. Press Enter
7. Check console for: `📋 Task update received:`
8. Click "Save Changes"
9. Check console for save flow
10. Refresh page
11. Go to My Plans → Open same plan
12. **Expected**: Your edit should still be there

---

## Test Scenario 4: List View Completion
**Goal**: Verify completion checkbox updates progress

### Steps:
1. Open a saved plan
2. Note the completion percentage in the stat card (e.g., "20%")
3. Switch to List view
4. Check a task as completed
5. **Immediately observe**:
   - Stat card updates (e.g., "20%" → "30%")
   - Console shows: `📋 Task update received:` with `completed: true`
6. Click "Save Changes"
7. Check console for save flow
8. Refresh page
9. Go to My Plans → Open same plan
10. **Expected**: 
    - Progress percentage should match
    - Checked task should still be marked complete

---

## Common Issues & What They Mean

### Issue: "hasSavedPlanId: false" when it should be true
**Meaning**: The plan ID wasn't set correctly when loading from My Plans
**Check**: 
- Look for `📂 Plan loaded from My Plans:` log
- Verify it shows a valid planId

### Issue: Save creates new plan instead of updating
**Symptoms**: Each save creates a duplicate in My Plans
**Check**:
- Console log shows `hasSavedPlanId: false`
- Backend log shows CREATE instead of UPDATE

### Issue: Backend says "Plan not found"
**Meaning**: Plan ID is invalid or doesn't exist
**Check**:
- Console shows which ID is being sent
- Verify ID matches what's in MongoDB

### Issue: Changes saved but don't persist after reload
**Meaning**: Frontend cache issue OR data not actually being saved
**Check**:
- Backend log: `✅ Plan saved. Progress: X %`
- Look at MongoDB directly to see if data updated
- Try hard refresh: Ctrl+Shift+R

### Issue: No console logs appearing
**Meaning**: Code changes haven't been loaded
**Solution**: 
- Stop and restart `npm run dev`
- Hard refresh browser: Ctrl+Shift+R
- Check browser console for any errors

---

## Console Log Cheat Sheet

### Expected Flow for Saved Plan Update:
```
📂 Plan loaded from My Plans: { planId: "67a...", ... }
[User makes change]
📋 Task update received: { taskId: 1, updates: { kanban_column: "In Progress" } }
📋 Updated plan: { projectName: "...", tasks: [...] }
🔄 Plan updated: { projectName: "...", tasks: [...] }
⏰ Auto-save effect triggered: { hasPlan: true, hasUnsavedChanges: true, isSaving: false }
[User clicks Save]
💾 Manual save triggered. hasUnsavedChanges: true
💾 savePlanToDatabase called: { hasSavedPlanId: true, savedPlanId: "67a...", ... }
📝 Updating plan with ID: 67a...
📝 Plan data being sent: { projectName: "...", tasks: [...] }
[Backend Console]
📝 PUT /:planId - Received update request
📝 Plan ID: 67a...
📝 Updates keys: ["projectName", "projectSummary", "tasks", "status"]
📝 About to save. Sample tasks: [...]
✅ Plan saved. Progress: 30 %
```

---

## Debugging Commands

### Check if servers are running:
```powershell
# Backend (port 3001)
Test-NetConnection -ComputerName localhost -Port 3001

# Frontend (port 8080)
Test-NetConnection -ComputerName localhost -Port 8080
```

### View running Node processes:
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

### Start servers:
```powershell
# Backend (in server directory)
cd server
npm start

# Frontend (in root directory)
npm run dev
```

---

## Report Template

When reporting an issue, please provide:

1. **Which scenario** you were testing (1, 2, 3, or 4)
2. **Complete console output** (copy all logs with emoji markers)
3. **Backend console output** (if you have access)
4. **Screenshot** of:
   - Browser console
   - The action you took (e.g., which card you moved)
5. **Expected vs Actual**:
   - What should have happened
   - What actually happened

Example:
```
Scenario: 2 (Open Saved Plan)
Issue: Changes don't save after opening from My Plans

Console Output:
📂 Plan loaded from My Plans: { planId: "67a123...", projectName: "My App", tasksCount: 5 }
📋 Task update received: { taskId: 1, updates: { kanban_column: "In Progress" } }
[... rest of logs ...]

Expected: Card stays in "In Progress" after refresh
Actual: Card returns to "Backlog" after refresh
```
