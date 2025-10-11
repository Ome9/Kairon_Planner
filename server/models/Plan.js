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
    enum: ['not_started', 'in_progress', 'review', 'completed'],
    default: 'not_started'
  },
  completed: { type: Boolean, default: false },
  start_date: { type: String },
  end_date: { type: String },
  progress: { type: Number, default: 0 },
  assignee: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
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
    this.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
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
