import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  category: { type: String, required: true },
  estimated_duration_hours: { type: Number, required: true },
  dependencies: [{ type: Number }],
  status: { 
    type: String, 
    enum: ['not_started', 'todo', 'in_progress', 'review', 'completed'],
    default: 'not_started'
  },
  completed: { type: Boolean, default: false },
  start_date: { type: String },
  end_date: { type: String },
  due_date: { type: String }, // Scheduled due date
  scheduled_start: { type: String }, // Auto-scheduled start time
  scheduled_end: { type: String }, // Auto-scheduled end time
  actual_start: { type: String }, // When task actually started
  actual_end: { type: String }, // When task actually completed
  progress: { type: Number, default: 0 },
  assignee: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  order: { type: Number, default: 0 },
  kanban_column: { type: String },
  kanban_position: { type: Number, default: 0 },
  cover_image: { type: String }, // Topic-themed cover image URL
  tags: [{ type: String }], // Smart tags
  estimated_complexity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  subtasks: [{ type: String }], // Subtask checklist
  is_milestone: { type: Boolean, default: false }, // Mark as milestone
  blocked_by: [{ type: Number }], // Tasks blocking this one
  blocking: [{ type: Number }], // Tasks this one is blocking
  slack_time: { type: Number, default: 0 }, // Buffer time in hours
  is_critical_path: { type: Boolean, default: false } // Part of critical path

}, { _id: false });

const planSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  projectName: { 
    type: String, 
    required: true 
  },
  projectSummary: { 
    type: String, 
    required: true 
  },
  goalText: { 
    type: String, 
    required: true 
  },
  tasks: [taskSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  tags: [{ type: String }],
  color: { 
    type: String, 
    default: '#06b6d4' 
  },
  thumbnail: { type: String },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  progressPercentage: { type: Number, default: 0 },
  estimatedDuration: { type: Number, default: 0 },
  project_start_date: { type: String }, // Overall project start
  project_end_date: { type: String }, // Overall project end
  working_hours: {
    start: { type: String, default: '09:00' }, // Work day start
    end: { type: String, default: '17:00' }, // Work day end
    hours_per_day: { type: Number, default: 8 }
  },
  working_days: {
    type: [Number], // 0=Sunday, 1=Monday, etc.
    default: [1, 2, 3, 4, 5] // Monday-Friday
  },
  schedule_settings: {
    auto_schedule_enabled: { type: Boolean, default: false },
    last_scheduled_at: { type: Date },
    schedule_from: { type: String, enum: ['now', 'project_start'], default: 'now' },
    respect_dependencies: { type: Boolean, default: true },
    respect_working_hours: { type: Boolean, default: true }
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastAccessedAt: { type: Date },
  isStarred: { 
    type: Boolean, 
    default: false 
  },
  sharedWith: [{
    userId: String,
    permission: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
planSchema.index({ userId: 1, createdAt: -1 });
planSchema.index({ userId: 1, status: 1 });
planSchema.index({ userId: 1, isStarred: 1 });

// Update calculated fields before saving
planSchema.pre('save', function(next) {
  if (this.tasks && this.tasks.length > 0) {
    this.totalTasks = this.tasks.length;
    // Check both completed field and status for backward compatibility
    this.completedTasks = this.tasks.filter(t => t.completed === true || t.status === 'completed').length;
    this.progressPercentage = Math.round((this.completedTasks / this.totalTasks) * 100);
    this.estimatedDuration = this.tasks.reduce((sum, t) => sum + t.estimated_duration_hours, 0);
  }
  this.updatedAt = new Date();
  next();
});

// Virtual for completion status
planSchema.virtual('isCompleted').get(function() {
  return this.completedTasks === this.totalTasks && this.totalTasks > 0;
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
