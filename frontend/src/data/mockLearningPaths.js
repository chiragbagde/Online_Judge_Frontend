
// Import learning paths from JSON files
import dsaPath from './learningPaths/dsa.json';
import fullstackPath from './learningPaths/fullstack.json';
import mlPath from './learningPaths/ml.json';

const mockLearningPaths = [
  dsaPath,
  fullstackPath,
  mlPath
];

// Mock API functions
const mockApi = {
  fetchLearningPaths: () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log('Mock API: Returning learning paths:', mockLearningPaths); // Debug log
        resolve({
          data: mockLearningPaths.map(path => ({
            ...path,
            modules: path.modules.map(module => ({
              ...module,
              lessons: module.lessons.map(lesson => ({
                ...lesson,
                type: lesson.type || 'text',
                content: lesson.content || '',
                duration: lesson.duration || '20 min',
                preview: lesson.preview || false,
                resources: lesson.resources || [],
                completed: lesson.completed || false
              }))
            }))
          }))
        });
      }, 500);
    });
  },

  fetchLearningPathById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const path = mockLearningPaths.find(p => p.id === id);
        if (path) {
          resolve({ 
            data: {
              ...path,
              modules: path.modules.map(module => ({
                ...module,
                lessons: module.lessons.map(lesson => ({
                  ...lesson,
                  type: lesson.type || 'text',
                  content: lesson.content || '',
                  duration: lesson.duration || '20 min',
                  preview: lesson.preview || false,
                  resources: lesson.resources || [],
                  completed: lesson.completed || false
                }))
              }))
            }
          });
        } else {
          reject(new Error('Learning path not found'));
        }
      }, 300);
    });
  },

  updateLessonProgress: (pathId, moduleId, lessonId, completed) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const path = mockLearningPaths.find(p => p.id === pathId);
        if (path) {
          const module = path.modules.find(m => m.id === moduleId);
          if (module) {
            const lesson = module.lessons.find(l => l.id === lessonId);
            if (lesson) {
              lesson.completed = completed;
            }
          }
        }
        resolve({ success: true });
      }, 200);
    });
  },

  toggleBookmark: (pathId, isBookmarked) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update the backend
        resolve({ success: true, bookmarked: !isBookmarked });
      }, 200);
    });
  },

  getLearningPathProgress: (pathId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const path = mockLearningPaths.find(p => p.id === pathId);
        if (path) {
          const allLessons = path.modules.flatMap(m => m.lessons);
          const completedLessons = allLessons.filter(l => l.completed).length;
          const totalLessons = allLessons.length;
          const progress = Math.round((completedLessons / totalLessons) * 100) || 0;
          
          resolve({
            progress,
            completedLessons,
            totalLessons,
            modules: path.modules.map(module => ({
              id: module.id,
              title: module.title,
              progress: Math.round((module.lessons.filter(l => l.completed).length / module.lessons.length) * 100) || 0,
              completedLessons: module.lessons.filter(l => l.completed).length,
              totalLessons: module.lessons.length
            }))
          });
        } else {
          resolve({
            progress: 0,
            completedLessons: 0,
            totalLessons: 0,
            modules: []
          });
        }
      }, 300);
    });
  }
};


export default mockApi;
