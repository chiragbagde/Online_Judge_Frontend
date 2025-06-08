import dsaPath from './learningPaths/dsa.json';
import fullstackPath from './learningPaths/fullstack.json';
import mlPath from './learningPaths/ml.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API object
const mockApi = {
  // Fetch all learning paths
  async fetchLearningPaths() {
    console.log('Fetching learning paths...');
    await delay(1000); // Simulate network delay
    
    const paths = [dsaPath, fullstackPath, mlPath];
    
    return paths;
  },

  // Fetch a single learning path by ID
  async fetchLearningPathById(pathId) {
    console.log('Fetching learning path:', pathId);
    await delay(800); // Simulate network delay
    
    const path = [dsaPath, fullstackPath, mlPath].find(p => p.id === pathId);
    console.log('Found learning path:', path);
    
    if (!path) {
      throw new Error('Learning path not found');
    }
    
    return path;
  },

  // Toggle bookmark status for a learning path
  async toggleBookmark(pathId) {
    console.log('Toggling bookmark for path:', pathId);
    await delay(500); // Simulate network delay
    
    const path = [dsaPath, fullstackPath, mlPath].find(p => p.id === pathId);
    if (!path) {
      throw new Error('Learning path not found');
    }
    
    // In a real API, this would update the server
    // For mock purposes, we'll just return success
    return { success: true, message: 'Bookmark status updated' };
  },

  // Mark a lesson as completed
  async markLessonCompleted(pathId, moduleId, lessonId) {
    console.log('Marking lesson as completed:', { pathId, moduleId, lessonId });
    await delay(500); // Simulate network delay
    
    const path = [dsaPath, fullstackPath, mlPath].find(p => p.id === pathId);
    if (!path) {
      throw new Error('Learning path not found');
    }
    
    const module = path.modules.find(m => m.id === moduleId);
    if (!module) {
      throw new Error('Module not found');
    }
    
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    
    // In a real API, this would update the server
    // For mock purposes, we'll just return success
    return { success: true, message: 'Lesson marked as completed' };
  }
};

export default mockApi; 