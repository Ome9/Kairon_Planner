import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Please provide your email'], 
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  name: { 
    type: String, 
    required: [true, 'Please provide your name'],
    trim: true
  },
  supabaseId: { 
    type: String, 
    unique: true,
    sparse: true,
    index: true
  },
  avatar: { type: String },
  bio: { type: String, default: '' },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    defaultView: {
      type: String,
      enum: ['list', 'timeline', 'board', 'analytics', 'datagrid', 'gantt', 'scheduler'],
      default: 'board'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    emailNotifications: { type: Boolean, default: true },
    taskReminders: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    defaultPlanColor: { type: String, default: '#06b6d4' },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' }
  },
  stats: {
    totalPlans: { type: Number, default: 0 },
    completedPlans: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    accountCreatedAt: { type: Date, default: Date.now }
  },
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    expiresAt: { type: Date }
  },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLoginAt: { type: Date },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ supabaseId: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.stats.lastLoginAt = new Date();
  this.lastLoginAt = new Date();
  return this.save();
};

// Method to get public profile (without sensitive data)
userSchema.methods.toPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    role: this.role,
    preferences: this.preferences,
    stats: this.stats,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt
  };
};

const User = mongoose.model('User', userSchema);

export default User;
