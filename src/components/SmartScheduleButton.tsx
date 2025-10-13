import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Settings,
} from 'lucide-react';
import { ProjectPlan, Task } from '@/types/plan';
import { scheduleTasksAutomatically, getScheduleStatistics } from '@/lib/smartScheduler';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ScheduleStats {
  projectStart: string;
  projectEnd: string;
  totalDays: number;
  criticalPathLength: number;
  totalTasks: number;
  criticalPathTasks: Array<{
    id: number;
    title: string;
    duration: number;
  }>;
}

interface SmartScheduleButtonProps {
  plan: ProjectPlan;
  onScheduleApplied: (scheduledPlan: ProjectPlan) => void;
}

export const SmartScheduleButton: React.FC<SmartScheduleButtonProps> = ({
  plan,
  onScheduleApplied,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulePreview, setSchedulePreview] = useState<{
    tasks: Task[];
    stats: ScheduleStats;
  } | null>(null);

  // Schedule settings
  const [projectStartDate, setProjectStartDate] = useState(
    plan.project_start_date || new Date().toISOString().split('T')[0]
  );
  const [workingHoursStart, setWorkingHoursStart] = useState(
    plan.working_hours?.start || '09:00'
  );
  const [workingHoursEnd, setWorkingHoursEnd] = useState(
    plan.working_hours?.end || '17:00'
  );
  const [hoursPerDay, setHoursPerDay] = useState(
    plan.working_hours?.hours_per_day || 8
  );
  const [respectDependencies, setRespectDependencies] = useState(
    plan.schedule_settings?.respect_dependencies ?? true
  );
  const [respectWorkingHours, setRespectWorkingHours] = useState(
    plan.schedule_settings?.respect_working_hours ?? true
  );

  const handleGenerateSchedule = () => {
    setIsScheduling(true);
    
    try {
      // Run scheduling algorithm
      const scheduledTasks = scheduleTasksAutomatically(plan.tasks, {
        projectStartDate: new Date(projectStartDate).toISOString(),
        workingHoursStart,
        workingHoursEnd,
        hoursPerDay,
        workingDays: [1, 2, 3, 4, 5], // Monday-Friday
        respectDependencies,
        respectWorkingHours,
      });

      // Get statistics
      const stats = getScheduleStatistics(scheduledTasks);

      setSchedulePreview({
        tasks: scheduledTasks,
        stats,
      });

      toast.success('Schedule generated successfully!');
    } catch (error) {
      console.error('Scheduling error:', error);
      toast.error('Failed to generate schedule. Please check your task dependencies.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleApplySchedule = () => {
    if (!schedulePreview) return;

    const updatedPlan: ProjectPlan = {
      ...plan,
      tasks: schedulePreview.tasks,
      project_start_date: schedulePreview.stats.projectStart,
      project_end_date: schedulePreview.stats.projectEnd,
      working_hours: {
        start: workingHoursStart,
        end: workingHoursEnd,
        hours_per_day: hoursPerDay,
      },
      schedule_settings: {
        auto_schedule_enabled: true,
        last_scheduled_at: new Date(),
        respect_dependencies: respectDependencies,
        respect_working_hours: respectWorkingHours,
      },
    };

    onScheduleApplied(updatedPlan);
    setIsOpen(false);
    toast.success('Schedule applied to all tasks!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          Smart Schedule
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            Smart Task Scheduler
          </DialogTitle>
          <DialogDescription>
            Automatically schedule your tasks based on dependencies, duration, and working hours.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Settings Section */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Schedule Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Start Date */}
              <div className="space-y-2">
                <Label htmlFor="project-start" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Project Start Date
                </Label>
                <Input
                  id="project-start"
                  type="date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Working Hours */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Working Hours
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={workingHoursStart}
                    onChange={(e) => setWorkingHoursStart(e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center">to</span>
                  <Input
                    type="time"
                    value={workingHoursEnd}
                    onChange={(e) => setWorkingHoursEnd(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Hours per Day */}
              <div className="space-y-2">
                <Label htmlFor="hours-per-day">Hours per Day</Label>
                <Input
                  id="hours-per-day"
                  type="number"
                  min="1"
                  max="24"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="respect-deps" className="cursor-pointer">
                    Respect Dependencies
                  </Label>
                  <Switch
                    id="respect-deps"
                    checked={respectDependencies}
                    onCheckedChange={setRespectDependencies}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="respect-hours" className="cursor-pointer">
                    Respect Working Hours
                  </Label>
                  <Switch
                    id="respect-hours"
                    checked={respectWorkingHours}
                    onCheckedChange={setRespectWorkingHours}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateSchedule}
              disabled={isScheduling}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              {isScheduling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Generating Schedule...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Schedule
                </>
              )}
            </Button>
          </Card>

          {/* Preview Section */}
          {schedulePreview && (
            <>
              {/* Statistics */}
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Schedule Overview
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {schedulePreview.stats.totalDays}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {schedulePreview.stats.totalTasks}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {schedulePreview.stats.criticalPathLength}
                    </div>
                    <div className="text-xs text-muted-foreground">Critical Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {format(new Date(schedulePreview.stats.projectEnd), 'MMM dd')}
                    </div>
                    <div className="text-xs text-muted-foreground">Target Completion</div>
                  </div>
                </div>

                {/* Critical Path Tasks */}
                {schedulePreview.stats.criticalPathTasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold">Critical Path Tasks:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {schedulePreview.stats.criticalPathTasks.map((task) => (
                        <Badge
                          key={task.id}
                          variant="destructive"
                          className="bg-red-500/10 text-red-500 border-red-500/20"
                        >
                          #{task.id} {task.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Task Timeline Preview */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold mb-4">Scheduled Tasks</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {schedulePreview.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xs rounded">
                          {task.id}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {task.scheduled_start &&
                              format(new Date(task.scheduled_start), 'MMM dd, h:mm a')}
                            {' → '}
                            {task.scheduled_end &&
                              format(new Date(task.scheduled_end), 'MMM dd, h:mm a')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.is_critical_path && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {task.estimated_duration_hours}h
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Apply Button */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  onClick={handleApplySchedule}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Apply Schedule to All Tasks
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
