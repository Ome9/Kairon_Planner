/**
 * Smart Task Scheduling Algorithm
 * Automatically schedules tasks based on dependencies, duration, and constraints
 */

import { Task } from '@/types/plan';

export interface ScheduleSettings {
  projectStartDate?: string;
  workingHoursStart?: string; // e.g., "09:00"
  workingHoursEnd?: string; // e.g., "17:00"
  hoursPerDay?: number;
  workingDays?: number[]; // 0=Sunday, 1=Monday, etc.
  respectDependencies?: boolean;
  respectWorkingHours?: boolean;
}

interface ScheduledTask extends Task {
  scheduled_start?: string;
  scheduled_end?: string;
  is_critical_path?: boolean;
  slack_time?: number;
  earliest_start?: Date;
  latest_start?: Date;
}

/**
 * Main scheduling function - uses Critical Path Method (CPM)
 */
export function scheduleTasksAutomatically(
  tasks: Task[],
  settings: ScheduleSettings = {}
): ScheduledTask[] {
  const {
    projectStartDate = new Date().toISOString(),
    workingHoursStart = '09:00',
    workingHoursEnd = '17:00',
    hoursPerDay = 8,
    workingDays = [1, 2, 3, 4, 5], // Monday-Friday
    respectDependencies = true,
    respectWorkingHours = true,
  } = settings;

  const startDate = new Date(projectStartDate);
  const scheduledTasks: ScheduledTask[] = tasks.map(t => ({ ...t }));

  // Step 1: Calculate earliest start times (forward pass)
  const earliestTimes = calculateEarliestTimes(
    scheduledTasks,
    startDate,
    hoursPerDay,
    workingDays,
    respectWorkingHours,
    respectDependencies
  );

  // Step 2: Calculate latest start times (backward pass)
  const latestTimes = calculateLatestTimes(
    scheduledTasks,
    earliestTimes,
    hoursPerDay
  );

  // Step 3: Calculate slack time and identify critical path
  scheduledTasks.forEach((task, index) => {
    const earliest = earliestTimes.get(task.id);
    const latest = latestTimes.get(task.id);

    if (earliest && latest) {
      task.earliest_start = earliest.start;
      task.latest_start = latest.start;
      task.slack_time = calculateSlackTime(earliest.start, latest.start);
      task.is_critical_path = task.slack_time === 0;

      // Set scheduled times
      task.scheduled_start = earliest.start.toISOString();
      task.scheduled_end = earliest.end.toISOString();
    }
  });

  // Step 4: Sort by scheduled start time
  scheduledTasks.sort((a, b) => {
    const aStart = a.scheduled_start ? new Date(a.scheduled_start).getTime() : 0;
    const bStart = b.scheduled_start ? new Date(b.scheduled_start).getTime() : 0;
    return aStart - bStart;
  });

  return scheduledTasks;
}

/**
 * Forward pass: Calculate earliest start and end times
 */
function calculateEarliestTimes(
  tasks: ScheduledTask[],
  projectStart: Date,
  hoursPerDay: number,
  workingDays: number[],
  respectWorkingHours: boolean,
  respectDependencies: boolean
): Map<number, { start: Date; end: Date }> {
  const times = new Map<number, { start: Date; end: Date }>();
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  // Process tasks in dependency order (topological sort)
  const processed = new Set<number>();
  const toProcess = [...tasks];

  while (toProcess.length > 0) {
    const task = toProcess.shift()!;

    // Check if all dependencies are processed
    const depsProcessed = task.dependencies.every(depId => processed.has(depId));
    
    if (!depsProcessed && respectDependencies) {
      toProcess.push(task); // Re-queue for later
      continue;
    }

    // Calculate earliest start time
    let earliestStart = new Date(projectStart);

    if (respectDependencies && task.dependencies.length > 0) {
      // Start after all dependencies complete
      task.dependencies.forEach(depId => {
        const depTime = times.get(depId);
        if (depTime && depTime.end > earliestStart) {
          earliestStart = new Date(depTime.end);
        }
      });
    }

    // Adjust to next working period
    if (respectWorkingHours) {
      earliestStart = adjustToWorkingHours(earliestStart, workingDays, true);
    }

    // Calculate end time
    const earliestEnd = addWorkingHours(
      earliestStart,
      task.estimated_duration_hours,
      hoursPerDay,
      workingDays,
      respectWorkingHours
    );

    times.set(task.id, { start: earliestStart, end: earliestEnd });
    processed.add(task.id);
  }

  return times;
}

/**
 * Backward pass: Calculate latest start and end times
 */
function calculateLatestTimes(
  tasks: ScheduledTask[],
  earliestTimes: Map<number, { start: Date; end: Date }>,
  hoursPerDay: number
): Map<number, { start: Date; end: Date }> {
  const latestTimes = new Map<number, { start: Date; end: Date }>();

  // Find project end (latest end time of all tasks)
  let projectEnd = new Date(0);
  earliestTimes.forEach(time => {
    if (time.end > projectEnd) {
      projectEnd = new Date(time.end);
    }
  });

  // Build dependency graph (reverse)
  const dependents = new Map<number, number[]>();
  tasks.forEach(task => {
    task.dependencies.forEach(depId => {
      if (!dependents.has(depId)) {
        dependents.set(depId, []);
      }
      dependents.get(depId)!.push(task.id);
    });
  });

  // Process tasks in reverse order
  const processed = new Set<number>();
  const toProcess = [...tasks].reverse();

  while (toProcess.length > 0) {
    const task = toProcess.shift()!;

    // Check if all dependents are processed
    const taskDependents = dependents.get(task.id) || [];
    const depsProcessed = taskDependents.every(depId => processed.has(depId));

    if (!depsProcessed && taskDependents.length > 0) {
      toProcess.push(task); // Re-queue
      continue;
    }

    let latestEnd = new Date(projectEnd);

    // If this task has dependents, it must finish before they start
    if (taskDependents.length > 0) {
      taskDependents.forEach(depId => {
        const depLatest = latestTimes.get(depId);
        if (depLatest && depLatest.start < latestEnd) {
          latestEnd = new Date(depLatest.start);
        }
      });
    }

    // Calculate latest start
    const durationMs = task.estimated_duration_hours * 60 * 60 * 1000;
    const latestStart = new Date(latestEnd.getTime() - durationMs);

    latestTimes.set(task.id, { start: latestStart, end: latestEnd });
    processed.add(task.id);
  }

  return latestTimes;
}

/**
 * Add working hours to a date, respecting working days and hours
 */
function addWorkingHours(
  startDate: Date,
  hours: number,
  hoursPerDay: number,
  workingDays: number[],
  respectWorkingHours: boolean
): Date {
  if (!respectWorkingHours) {
    return new Date(startDate.getTime() + hours * 60 * 60 * 1000);
  }

  let remainingHours = hours;
  let currentDate = new Date(startDate);

  while (remainingHours > 0) {
    // Skip non-working days
    while (!workingDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(9, 0, 0, 0); // Start of work day
    }

    // Calculate hours remaining in current day
    const currentHour = currentDate.getHours() + currentDate.getMinutes() / 60;
    const endHour = 17; // 5 PM
    const hoursLeftInDay = Math.max(0, endHour - currentHour);

    if (remainingHours <= hoursLeftInDay) {
      // Can finish today
      currentDate = new Date(currentDate.getTime() + remainingHours * 60 * 60 * 1000);
      remainingHours = 0;
    } else {
      // Move to next working day
      remainingHours -= hoursLeftInDay;
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(9, 0, 0, 0);
    }
  }

  return currentDate;
}

/**
 * Adjust date to next working period
 */
function adjustToWorkingHours(
  date: Date,
  workingDays: number[],
  moveForward: boolean
): Date {
  const adjusted = new Date(date);

  // Move to next working day if needed
  while (!workingDays.includes(adjusted.getDay())) {
    adjusted.setDate(adjusted.getDate() + (moveForward ? 1 : -1));
  }

  // Adjust time to working hours
  const hour = adjusted.getHours();
  if (hour < 9) {
    adjusted.setHours(9, 0, 0, 0);
  } else if (hour >= 17) {
    adjusted.setDate(adjusted.getDate() + 1);
    adjusted.setHours(9, 0, 0, 0);
  }

  return adjusted;
}

/**
 * Calculate slack time between earliest and latest start
 */
function calculateSlackTime(earliest: Date, latest: Date): number {
  const diffMs = latest.getTime() - earliest.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
}

/**
 * Get scheduling statistics
 */
export function getScheduleStatistics(scheduledTasks: ScheduledTask[]) {
  const criticalPathTasks = scheduledTasks.filter(t => t.is_critical_path);
  
  let projectStart = new Date();
  let projectEnd = new Date(0);
  
  scheduledTasks.forEach(task => {
    if (task.scheduled_start) {
      const start = new Date(task.scheduled_start);
      if (start < projectStart) projectStart = start;
    }
    if (task.scheduled_end) {
      const end = new Date(task.scheduled_end);
      if (end > projectEnd) projectEnd = end;
    }
  });

  const totalDays = Math.ceil(
    (projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    projectStart: projectStart.toISOString(),
    projectEnd: projectEnd.toISOString(),
    totalDays,
    criticalPathLength: criticalPathTasks.length,
    totalTasks: scheduledTasks.length,
    criticalPathTasks: criticalPathTasks.map(t => ({
      id: t.id,
      title: t.title,
      duration: t.estimated_duration_hours,
    })),
  };
}
