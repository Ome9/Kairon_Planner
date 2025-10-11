import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    unique: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String 
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    taskReminders: {
      type: Boolean,
      default: true
    },
    weeklyDigest: {
      type: Boolean,
      default: false
    }
  },
  settings: {
    defaultView: {
      type: String,
      enum: ['list', 'kanban', 'timeline', 'analytics'],
      default: 'list'
    },
    defaultPlanColor: {
      type: String,
      default: '#06b6d4'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  stats: {
    totalPlansCreated: { type: Number, default: 0 },
    totalTasksCompleted: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    accountCreatedAt: { type: Date, default: Date.now }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Update timestamp before saving
userPreferencesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update last login
userPreferencesSchema.methods.updateLastLogin = async function() {
  this.stats.lastLoginAt = new Date();
  return this.save();
};

// Increment plan count
userPreferencesSchema.methods.incrementPlanCount = async function() {
  this.stats.totalPlansCreated += 1;
  return this.save();
};

// Increment task completion count
userPreferencesSchema.methods.incrementTaskCount = async function(count = 1) {
  this.stats.totalTasksCompleted += count;
  return this.save();
};

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;
