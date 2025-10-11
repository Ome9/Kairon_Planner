import express from 'express';
import Plan from '../models/Plan.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all plans for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, starred, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { userId };
    
    if (status) {
      query.status = status;
    }
    
    if (starred === 'true') {
      query.isStarred = true;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const plans = await Plan.find(query)
      .sort(sortOptions)
      .lean();

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plans'
    });
  }
});

// Get a single plan by ID
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID format'
      });
    }
    
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    // Update last accessed time
    plan.lastAccessedAt = new Date();
    await plan.save();

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plan'
    });
  }
});

// Create a new plan
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new plan...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { userId, projectName, projectSummary, goalText, tasks, tags, color } = req.body;

    if (!userId || !projectName || !projectSummary || !tasks) {
      console.error('❌ Missing required fields:', { userId, projectName, projectSummary, tasksLength: tasks?.length });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, projectName, projectSummary, and tasks are required'
      });
    }

    const plan = new Plan({
      userId,
      projectName,
      projectSummary,
      goalText,
      tasks,
      tags: tags || [],
      color: color || '#06b6d4',
      status: 'active'
    });

    await plan.save();
    
    console.log('✅ Plan created successfully!');
    console.log('Plan ID:', plan._id);

    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('❌ Error creating plan:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create plan',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update a plan
router.put('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID format'
      });
    }

    const plan = await Plan.findByIdAndUpdate(
      planId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update plan'
    });
  }
});

// Update plan tasks
router.put('/:planId/tasks', async (req, res) => {
  try {
    const { planId } = req.params;
    const { tasks } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID format'
      });
    }

    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    plan.tasks = tasks;
    await plan.save();

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tasks'
    });
  }
});

// Toggle star status
router.patch('/:planId/star', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    plan.isStarred = !plan.isStarred;
    await plan.save();

    res.json({
      success: true,
      data: { isStarred: plan.isStarred }
    });
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle star'
    });
  }
});

// Delete a plan
router.delete('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await Plan.findByIdAndDelete(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete plan'
    });
  }
});

// Archive a plan
router.patch('/:planId/archive', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    plan.status = plan.status === 'archived' ? 'active' : 'archived';
    await plan.save();

    res.json({
      success: true,
      data: { status: plan.status }
    });
  } catch (error) {
    console.error('Error archiving plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to archive plan'
    });
  }
});

// Duplicate a plan
router.post('/:planId/duplicate', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const originalPlan = await Plan.findById(planId);
    
    if (!originalPlan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    const duplicatePlan = new Plan({
      ...originalPlan.toObject(),
      _id: undefined,
      projectName: `${originalPlan.projectName} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: undefined,
      isStarred: false
    });

    await duplicatePlan.save();

    res.status(201).json({
      success: true,
      data: duplicatePlan
    });
  } catch (error) {
    console.error('Error duplicating plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to duplicate plan'
    });
  }
});

export default router;
