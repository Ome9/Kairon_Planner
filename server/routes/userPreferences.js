import express from 'express';
import UserPreferences from '../models/UserPreferences.js';

const router = express.Router();

// Get user preferences
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let preferences = await UserPreferences.findOne({ userId });
    
    // If user doesn't exist, create default preferences
    if (!preferences) {
      return res.status(404).json({
        success: false,
        error: 'User preferences not found'
      });
    }

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user preferences'
    });
  }
});

// Create or update user preferences
router.post('/', async (req, res) => {
  try {
    const { userId, email, name, preferences, settings } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'userId and email are required'
      });
    }

    // Check if user already exists
    let userPrefs = await UserPreferences.findOne({ userId });

    if (userPrefs) {
      // Update existing preferences
      if (name) userPrefs.name = name;
      if (preferences) userPrefs.preferences = { ...userPrefs.preferences, ...preferences };
      if (settings) userPrefs.settings = { ...userPrefs.settings, ...settings };
      
      await userPrefs.save();
    } else {
      // Create new user preferences
      userPrefs = new UserPreferences({
        userId,
        email,
        name,
        preferences,
        settings
      });
      
      await userPrefs.save();
    }

    res.status(userPrefs ? 200 : 201).json({
      success: true,
      data: userPrefs
    });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to save user preferences'
    });
  }
});

// Update user preferences (partial update)
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const userPrefs = await UserPreferences.findOne({ userId });

    if (!userPrefs) {
      return res.status(404).json({
        success: false,
        error: 'User preferences not found'
      });
    }

    // Update fields
    if (updates.name) userPrefs.name = updates.name;
    if (updates.email) userPrefs.email = updates.email;
    if (updates.preferences) {
      userPrefs.preferences = { ...userPrefs.preferences, ...updates.preferences };
    }
    if (updates.settings) {
      userPrefs.settings = { ...userPrefs.settings, ...updates.settings };
    }

    await userPrefs.save();

    res.json({
      success: true,
      data: userPrefs
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user preferences'
    });
  }
});

// Update last login
router.post('/:userId/login', async (req, res) => {
  try {
    const { userId } = req.params;

    const userPrefs = await UserPreferences.findOne({ userId });

    if (!userPrefs) {
      return res.status(404).json({
        success: false,
        error: 'User preferences not found'
      });
    }

    await userPrefs.updateLastLogin();

    res.json({
      success: true,
      data: userPrefs
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update last login'
    });
  }
});

// Delete user preferences
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await UserPreferences.findOneAndDelete({ userId });

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'User preferences not found'
      });
    }

    res.json({
      success: true,
      message: 'User preferences deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user preferences'
    });
  }
});

export default router;
