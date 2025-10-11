import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/Plan.js';
import UserPreferences from './models/UserPreferences.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database name: ${dbName}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Count documents
    const planCount = await Plan.countDocuments();
    const userPrefCount = await UserPreferences.countDocuments();
    
    console.log('\n📈 Document counts:');
    console.log(`  - Plans: ${planCount}`);
    console.log(`  - User Preferences: ${userPrefCount}`);
    
    // Test create a sample plan
    console.log('\n🧪 Testing plan creation...');
    const testPlan = new Plan({
      userId: 'test-user-123',
      projectName: 'Test Project',
      projectSummary: 'This is a test project',
      goalText: 'Test goal',
      tasks: [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test task description',
          category: 'Development',
          estimated_duration_hours: 2,
          dependencies: [],
          status: 'not_started',
          priority: 'medium'
        }
      ],
      status: 'active',
      tags: ['test'],
      color: '#06b6d4'
    });
    
    await testPlan.save();
    console.log('✅ Test plan created successfully!');
    console.log('Plan ID:', testPlan._id);
    
    // Clean up test data
    await Plan.findByIdAndDelete(testPlan._id);
    console.log('✅ Test plan deleted successfully!');
    
    console.log('\n✨ All tests passed! Database is ready to use.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connection closed');
    process.exit(0);
  }
}

testConnection();
