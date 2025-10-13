/**
 * Generate a topic-themed cover image URL for tasks
 * Uses Unsplash API for high-quality, relevant images
 */

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with actual key or use environment variable

/**
 * Generate a cover image URL based on task title and category
 */
export function generateCoverImage(taskTitle: string, category: string): string {
  // Extract keywords from title and category
  const keywords = extractKeywords(taskTitle, category);
  
  // Use Unsplash Source API for quick image retrieval
  // Format: https://source.unsplash.com/800x400/?keyword1,keyword2
  const imageUrl = `https://source.unsplash.com/800x400/?${keywords.join(',')}`;
  
  return imageUrl;
}

/**
 * Extract relevant keywords from task title and category
 */
function extractKeywords(title: string, category: string): string[] {
  const keywords: string[] = [];
  
  // Add category as primary keyword
  keywords.push(category.toLowerCase().replace(/\s+/g, '-'));
  
  // Extract meaningful words from title (remove common words)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 2); // Take first 2 meaningful words
  
  keywords.push(...titleWords);
  
  // Add generic fallbacks based on category
  const categoryMappings: Record<string, string[]> = {
    'development': ['coding', 'software', 'technology'],
    'design': ['ui', 'creative', 'art'],
    'testing': ['quality', 'testing', 'analysis'],
    'deployment': ['server', 'cloud', 'infrastructure'],
    'documentation': ['writing', 'documentation', 'guide'],
    'research': ['study', 'analysis', 'research'],
    'planning': ['strategy', 'planning', 'management'],
  };
  
  const categoryKey = category.toLowerCase();
  if (categoryMappings[categoryKey]) {
    keywords.push(categoryMappings[categoryKey][0]);
  }
  
  return keywords.slice(0, 3); // Limit to 3 keywords for better results
}

/**
 * Generate smart tags based on task content
 */
export function generateSmartTags(task: { title: string; description: string; category: string }): string[] {
  const tags: string[] = [];
  const content = `${task.title} ${task.description}`.toLowerCase();
  
  // Technology tags
  const techKeywords = ['react', 'node', 'python', 'java', 'api', 'database', 'ml', 'ai', 'cloud', 'mobile'];
  techKeywords.forEach(tech => {
    if (content.includes(tech)) tags.push(tech);
  });
  
  // Priority indicators
  if (content.includes('urgent') || content.includes('asap') || content.includes('critical')) {
    tags.push('urgent');
  }
  
  // Type indicators
  if (content.includes('bug') || content.includes('fix') || content.includes('error')) {
    tags.push('bugfix');
  }
  if (content.includes('feature') || content.includes('new') || content.includes('add')) {
    tags.push('feature');
  }
  if (content.includes('refactor') || content.includes('improve') || content.includes('optimize')) {
    tags.push('improvement');
  }
  
  return [...new Set(tags)].slice(0, 4); // Return unique tags, max 4
}

/**
 * Estimate task complexity based on description and duration
 */
export function estimateComplexity(task: { 
  description: string; 
  estimated_duration_hours: number;
  dependencies: number[];
}): 'Low' | 'Medium' | 'High' {
  let score = 0;
  
  // Factor 1: Duration
  if (task.estimated_duration_hours <= 4) score += 1;
  else if (task.estimated_duration_hours <= 16) score += 2;
  else score += 3;
  
  // Factor 2: Dependencies
  if (task.dependencies.length === 0) score += 1;
  else if (task.dependencies.length <= 2) score += 2;
  else score += 3;
  
  // Factor 3: Description complexity indicators
  const complexityIndicators = ['complex', 'multiple', 'integrate', 'system', 'architecture', 'advanced'];
  const descLower = task.description.toLowerCase();
  const indicatorCount = complexityIndicators.filter(indicator => descLower.includes(indicator)).length;
  score += indicatorCount;
  
  // Calculate complexity
  if (score <= 3) return 'Low';
  if (score <= 6) return 'Medium';
  return 'High';
}

/**
 * Generate subtasks from task description
 */
export function generateSubtasks(description: string): string[] {
  const subtasks: string[] = [];
  
  // Look for numbered lists or bullet points
  const lines = description.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    // Match patterns like "1.", "-", "*", "•"
    if (/^(\d+\.|[-*•])\s+.+/.test(trimmed)) {
      const subtask = trimmed.replace(/^(\d+\.|[-*•])\s+/, '').trim();
      if (subtask.length > 0) {
        subtasks.push(subtask);
      }
    }
  });
  
  // If no explicit subtasks found, generate based on verbs
  if (subtasks.length === 0) {
    const actionVerbs = ['create', 'implement', 'design', 'test', 'deploy', 'review', 'update', 'configure'];
    const words = description.toLowerCase().split(/\s+/);
    
    actionVerbs.forEach(verb => {
      if (words.includes(verb)) {
        const index = words.indexOf(verb);
        const context = words.slice(index, Math.min(index + 5, words.length)).join(' ');
        subtasks.push(context.charAt(0).toUpperCase() + context.slice(1));
      }
    });
  }
  
  return subtasks.slice(0, 5); // Max 5 subtasks
}
