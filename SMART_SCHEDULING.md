# Smart Task Scheduling Feature

## Overview
The Smart Task Scheduling feature automatically schedules your tasks based on dependencies, duration, working hours, and constraints using the **Critical Path Method (CPM)** algorithm.

## Features

### 🎯 Key Capabilities
1. **Dependency-Aware Scheduling** - Respects task dependencies
2. **Working Hours Management** - Schedules within business hours
3. **Critical Path Identification** - Highlights bottleneck tasks
4. **Slack Time Calculation** - Shows buffer time for each task
5. **Conflict Detection** - Prevents overlapping schedules
6. **Flexible Configuration** - Customizable settings

### 📊 Scheduling Algorithm
Uses **Critical Path Method (CPM)**:
- **Forward Pass**: Calculates earliest start times
- **Backward Pass**: Calculates latest start times
- **Slack Time**: Difference between earliest and latest start
- **Critical Path**: Tasks with zero slack time (any delay affects project)

## Database Schema

### Task Fields
```javascript
{
  // Existing fields...
  
  // Scheduling fields
  due_date: String,              // Manually set due date
  scheduled_start: String,        // Auto-calculated start time
  scheduled_end: String,          // Auto-calculated end time
  actual_start: String,           // When task actually started
  actual_end: String,             // When task actually completed
  
  // Critical path analysis
  is_milestone: Boolean,          // Mark as project milestone
  blocked_by: [Number],           // Tasks blocking this one
  blocking: [Number],             // Tasks this one blocks
  slack_time: Number,             // Buffer time in hours
  is_critical_path: Boolean       // Part of critical path
}
```

### Project Settings
```javascript
{
  // Project timeline
  project_start_date: String,     // Overall project start
  project_end_date: String,       // Overall project end
  
  // Working hours
  working_hours: {
    start: String,                // e.g., "09:00"
    end: String,                  // e.g., "17:00"
    hours_per_day: Number         // e.g., 8
  },
  
  // Working days (0=Sunday, 1=Monday, etc.)
  working_days: [Number],         // e.g., [1, 2, 3, 4, 5]
  
  // Schedule settings
  schedule_settings: {
    auto_schedule_enabled: Boolean,
    last_scheduled_at: Date,
    schedule_from: String,        // 'now' or 'project_start'
    respect_dependencies: Boolean,
    respect_working_hours: Boolean
  }
}
```

## Usage

### 1. Open Smart Schedule Dialog
Click the **"Smart Schedule"** button in the project header.

### 2. Configure Settings

#### Project Start Date
- **Purpose**: When the project begins
- **Default**: Today
- **Impact**: All tasks schedule from this date

#### Working Hours
- **Start Time**: Beginning of work day (e.g., 09:00)
- **End Time**: End of work day (e.g., 17:00)
- **Hours per Day**: Total working hours (typically 8)

#### Options
- **Respect Dependencies**: 
  - ✅ ON: Tasks wait for dependencies to complete
  - ❌ OFF: Tasks scheduled independently
  
- **Respect Working Hours**:
  - ✅ ON: Tasks only scheduled during work hours
  - ❌ OFF: Tasks can span 24/7

### 3. Generate Schedule
Click **"Generate Schedule"** to run the algorithm.

### 4. Review Preview

#### Statistics Shown:
- **Total Days**: Project duration
- **Total Tasks**: Number of tasks
- **Critical Tasks**: Tasks on critical path
- **Target Completion**: Estimated end date

#### Critical Path Tasks
- Highlighted in **RED**
- Must complete on time
- Any delay affects project deadline
- Need closest monitoring

### 5. Apply Schedule
Click **"Apply Schedule to All Tasks"** to save the generated schedule.

## How It Works

### Step 1: Topological Sort
```
Tasks ordered by dependencies:
Task 1 (no deps) → Task 2 (depends on 1) → Task 3 (depends on 2)
```

### Step 2: Forward Pass (Earliest Times)
```
Task 1: Start = Day 1, End = Day 3 (2 days)
Task 2: Start = Day 3, End = Day 6 (3 days, after Task 1)
Task 3: Start = Day 6, End = Day 8 (2 days, after Task 2)
```

### Step 3: Backward Pass (Latest Times)
```
Calculate from project end backwards:
- When can each task start at the latest?
- Without delaying the project
```

### Step 4: Calculate Slack
```
Slack = Latest Start - Earliest Start

Task 1: 2 days slack (can delay 2 days)
Task 2: 0 days slack (CRITICAL - no buffer)
Task 3: 1 day slack (can delay 1 day)
```

### Step 5: Identify Critical Path
```
Tasks with 0 slack = Critical Path
Any delay in these tasks delays the project
```

## Examples

### Example 1: Simple Linear Dependencies
```
Tasks:
1. Design (5h) → 2. Develop (20h) → 3. Test (8h)

Schedule:
1. Mon 9am-2pm (5h)
2. Mon 2pm-Fri 2pm (20h over 3 days)
3. Fri 2pm-Mon 10am (8h)

Critical Path: All 3 tasks (no slack)
Total Duration: 4.1 days
```

### Example 2: Parallel Tasks
```
Tasks:
1. Design (8h)
   ├→ 2. Frontend (16h)
   └→ 3. Backend (24h)
4. Integration (8h) - depends on 2 & 3

Schedule:
1. Mon 9am-5pm (8h)
2. Tue 9am-Wed 5pm (16h)
3. Tue 9am-Thu 5pm (24h) ← CRITICAL
4. Fri 9am-5pm (8h)

Critical Path: 1 → 3 → 4 (longest path)
Task 2 has 8h slack (can delay without affecting project)
```

### Example 3: Complex Dependencies
```
Tasks:
1. Requirements (4h)
2. Database Design (8h) - depends on 1
3. API Design (8h) - depends on 1
4. Implementation (16h) - depends on 2, 3
5. Testing (8h) - depends on 4

Schedule & Critical Path:
1 → 2 → 4 → 5 (longest path, no slack)
3 has slack (can start anytime after 1, before 4)
```

## Best Practices

### 1. Accurate Estimates
- Use realistic duration estimates
- Include buffer for unknowns
- Review past project data

### 2. Clear Dependencies
- Define all task dependencies
- Avoid circular dependencies
- Use optional vs. required dependencies

### 3. Regular Updates
- Re-schedule when tasks complete early/late
- Update estimates based on actual time
- Monitor critical path changes

### 4. Working Hours
- Set realistic working hours
- Account for meetings/overhead
- Consider time zones for distributed teams

### 5. Slack Time Management
- Use slack for risk mitigation
- Don't over-schedule slack tasks
- Focus resources on critical path

## Advanced Features

### Milestone Tracking
```javascript
task.is_milestone = true;
// Automatically highlighted in schedule
// Used for phase gates/deliverables
```

### Blocked Tasks
```javascript
task.blocked_by = [5, 7];
// Tasks 5 and 7 must complete first
// Visual indicators in UI
```

### Actual vs. Scheduled
```javascript
// Track progress
task.scheduled_start = "2025-01-15T09:00:00Z";
task.actual_start = "2025-01-15T10:30:00Z"; // Started late
task.scheduled_end = "2025-01-17T17:00:00Z";
task.actual_end = "2025-01-18T15:00:00Z"; // Finished late

// Calculate variance for future estimates
```

## Troubleshooting

### Issue: Circular Dependency Error
**Problem**: Task A depends on Task B, which depends on Task A
**Solution**: Review and break the circular dependency

### Issue: Unrealistic Timeline
**Problem**: Schedule shows project completing in 2 days when estimates total 100 hours
**Solution**: Check if "Respect Working Hours" is off, or review parallel tasks

### Issue: All Tasks Critical
**Problem**: Every task shows as critical path
**Solution**: This is normal for linear dependencies. Add parallel tasks where possible.

### Issue: Tasks Scheduled on Weekends
**Problem**: Working days not configured correctly
**Solution**: Ensure `working_days: [1, 2, 3, 4, 5]` for Mon-Fri

## API Integration

### Schedule Tasks Programmatically
```typescript
import { scheduleTasksAutomatically } from '@/lib/smartScheduler';

const scheduled = scheduleTasksAutomatically(tasks, {
  projectStartDate: new Date().toISOString(),
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  hoursPerDay: 8,
  workingDays: [1, 2, 3, 4, 5],
  respectDependencies: true,
  respectWorkingHours: true,
});

// Use scheduled tasks
scheduled.forEach(task => {
  console.log(`Task ${task.id}: ${task.scheduled_start} - ${task.scheduled_end}`);
  if (task.is_critical_path) {
    console.log('⚠️ CRITICAL PATH TASK');
  }
});
```

### Get Statistics
```typescript
import { getScheduleStatistics } from '@/lib/smartScheduler';

const stats = getScheduleStatistics(scheduledTasks);
console.log('Project Duration:', stats.totalDays, 'days');
console.log('Critical Path:', stats.criticalPathTasks);
```

## Performance

### Time Complexity
- **Forward Pass**: O(n + e) where n=tasks, e=dependencies
- **Backward Pass**: O(n + e)
- **Overall**: O(n + e) - Linear time

### Scalability
- ✅ Handles 1000+ tasks efficiently
- ✅ Complex dependency graphs
- ✅ Real-time calculation (<1 second)

## Future Enhancements

### Planned Features
1. **Resource Allocation** - Assign team members, prevent overallocation
2. **Multi-Project Scheduling** - Coordinate across projects
3. **Auto-Reschedule on Changes** - Dynamically adjust when tasks update
4. **What-If Analysis** - Test scenarios before committing
5. **Constraint Programming** - Handle complex business rules
6. **Monte Carlo Simulation** - Probabilistic scheduling
7. **Gantt Chart Integration** - Visual timeline editor
8. **Export to MS Project** - Integration with enterprise tools

## Support

For issues or questions:
- 📖 Documentation: `SMART_FEATURES.md`
- 🐛 Bug Reports: GitHub Issues
- 💡 Feature Requests: GitHub Discussions

## License
MIT License - See LICENSE file for details
