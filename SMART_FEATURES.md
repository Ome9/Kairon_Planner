# Smart Task Planner - New Features Documentation

## Overview
The Kairon Planner has been enhanced with intelligent features that automatically enrich your tasks with visual and organizational elements.

## New Features

### 1. **Topic-Themed Cover Images** 🖼️
Every task card now displays a beautiful, relevant cover image based on:
- **Task Title**: Extracts keywords from the task name
- **Category**: Uses the task category for context
- **Smart Keywords**: Filters out common words and focuses on meaningful terms

**How it works:**
- Uses Unsplash API to fetch high-quality images
- Automatically generates relevant search terms
- Falls back to gradient if image fails to load
- Images are 800x400px, optimized for cards

**Example:**
- Task: "Implement User Authentication System"
- Category: "Development"
- Generated Keywords: `development, authentication, system, coding`
- Result: Professional tech-themed image

### 2. **Smart Tags** 🏷️
Automatically generated tags based on task content:

**Technology Detection:**
- Identifies: React, Node, Python, Java, API, Database, ML, AI, Cloud, Mobile
- Example: "Build React Dashboard" → Tags: `#react`, `#feature`

**Priority Indicators:**
- Detects: urgent, asap, critical
- Adds: `#urgent` tag

**Type Classification:**
- Bug fixes: `#bugfix`
- New features: `#feature`
- Improvements: `#improvement`

**Benefits:**
- Quick visual categorization
- Better filtering and search
- Instant context at a glance

### 3. **Complexity Estimation** 📊
AI-powered complexity scoring based on:

**Factors Analyzed:**
- **Duration**: Longer tasks = higher complexity
  - ≤4 hours: Low impact
  - 4-16 hours: Medium impact
  - >16 hours: High impact

- **Dependencies**: More dependencies = more complex
  - 0 deps: Simple
  - 1-2 deps: Moderate
  - 3+ deps: Complex

- **Description Keywords**: Detects complexity indicators
  - Words like: "complex", "multiple", "integrate", "system", "architecture", "advanced"

**Visual Indicators:**
- 🟢 **Low**: Green badge
- 🟡 **Medium**: Yellow badge
- 🔴 **High**: Red badge

### 4. **Subtask Generation** ✅
Automatically extracts or generates subtasks:

**From Explicit Lists:**
```
1. Create database schema
2. Implement API endpoints
3. Add authentication
```

**From Action Verbs:**
- Detects: create, implement, design, test, deploy, review, update, configure
- Generates: "Create database", "Implement endpoints", "Test functionality"

**Benefits:**
- Break down complex tasks
- Track granular progress
- Visual progress bar shows completion

### 5. **Enhanced Card Design** 🎨
**New Layout Structure:**
```
┌─────────────────────────┐
│  Cover Image (if any)   │
├─────────────────────────┤
│ #ID | Task Title    ✏️  │
│ Category Badge          │
│ Description             │
├─────────────────────────┤
│ ⏱️ Time | 🔗 Deps | 🔴 High │
│ #tag1 #tag2 #tag3       │
│ ▰▰▰▱▱ 3 subtasks       │
└─────────────────────────┘
```

**Features:**
- Cover image at top (optional)
- Complexity badge in metadata row
- Smart tags below main info
- Subtask progress bar at bottom
- Smooth hover effects
- Maintains drag-and-drop functionality

## Database Schema Updates

### New Task Fields:
```javascript
{
  cover_image: String,           // Unsplash image URL
  tags: [String],                // Smart generated tags
  estimated_complexity: String,  // 'Low', 'Medium', 'High'
  subtasks: [String]            // List of subtask descriptions
}
```

## Usage

### Automatic Enhancement
All new plans automatically get:
- ✅ Cover images for all tasks
- ✅ Smart tags based on content
- ✅ Complexity estimation
- ✅ Subtask extraction/generation

### Manual Enhancement
You can regenerate features by:
1. Editing task title/description
2. Saving the task
3. Features auto-update on next load

## Configuration

### Unsplash API Setup
To use custom images, add your Unsplash Access Key:

```typescript
// In src/lib/imageGenerator.ts
const UNSPLASH_ACCESS_KEY = 'your-key-here';
```

Or use environment variable:
```bash
VITE_UNSPLASH_ACCESS_KEY=your-key-here
```

## Benefits

### For Project Managers:
- 📊 Quick complexity assessment
- 🎯 Better task prioritization
- 📈 Visual progress tracking
- 🏷️ Improved organization

### For Teams:
- 🎨 More engaging task cards
- 🔍 Better searchability with tags
- ✅ Clear subtask breakdown
- 🖼️ Visual context with images

### For Developers:
- 🔧 Tech stack visibility (tags)
- 📊 Complexity awareness
- 🔗 Dependency tracking
- ✅ Granular task breakdown

## Future Enhancements

### Planned Features:
1. **Custom Cover Upload**: Upload your own images
2. **AI Task Breakdown**: More intelligent subtask generation
3. **Time Estimation AI**: Better duration predictions
4. **Risk Assessment**: Identify potential blockers
5. **Team Member Suggestions**: Auto-assign based on skills
6. **Deadline Predictions**: Smart due date recommendations

## Technical Details

### Image Loading:
- Lazy loading for performance
- Fallback gradients on error
- Cached by browser
- Responsive sizing

### Performance:
- Smart features generated once at creation
- Cached in database
- No runtime overhead
- Fast card rendering

### Accessibility:
- Alt text for all images
- Color-blind friendly badges
- Keyboard navigation maintained
- Screen reader compatible

## Troubleshooting

### Images Not Loading:
1. Check internet connection
2. Verify Unsplash API status
3. Check browser console for errors
4. Fallback gradient will appear

### Tags Not Generating:
1. Ensure task has description
2. Check for relevant keywords
3. May need more descriptive content

### Complexity Incorrect:
1. Review task duration estimate
2. Add more detail to description
3. Check dependency count

## Support

For issues or feature requests:
- GitHub: [Repository Issues](https://github.com/Ome9/Kairon_Planner/issues)
- Documentation: [Wiki](https://github.com/Ome9/Kairon_Planner/wiki)
