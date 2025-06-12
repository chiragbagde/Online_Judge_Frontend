const dsaPath = 'https://95689b0f.public-json-worker.pages.dev/dsa.json';
const fullstackPath = 'https://95689b0f.public-json-worker.pages.dev/fullstack.json';
const mlPath = 'https://95689b0f.public-json-worker.pages.dev/ml.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
};

// Load paths only once for mocking
let cachedPaths = [];

const loadMockPaths = async () => {
  if (cachedPaths.length === 0) {
    const [dsa, fullstack, ml] = await Promise.all([
      fetchJson(dsaPath),
      fetchJson(fullstackPath),
      fetchJson(mlPath)
    ]);
    cachedPaths = [dsa, fullstack, ml];
  }
  return cachedPaths;
};

// Mock API
const mockApi = {
  async fetchLearningPaths() {
    await delay(500);
    const paths = await loadMockPaths();

    return {
      data: paths.map(path => ({
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
    };
  },

  async fetchLearningPathById(id) {
    await delay(300);
    const paths = await loadMockPaths();
    const path = paths.find(p => p.id === id);
    if (!path) throw new Error('Learning path not found');

    return {
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
    };
  },

  async updateLessonProgress(pathId, moduleId, lessonId, completed) {
    await delay(200);
    const paths = await loadMockPaths();
    const path = paths.find(p => p.id === pathId);
    if (!path) return { success: false };

    const module = path.modules.find(m => m.id === moduleId);
    if (!module) return { success: false };

    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) lesson.completed = completed;

    return { success: true };
  },

  async toggleBookmark(pathId, isBookmarked) {
    await delay(200);
    // Mock only: no actual toggle logic
    return { success: true, bookmarked: !isBookmarked };
  },

  async getLearningPathProgress(pathId) {
    await delay(300);
    const paths = await loadMockPaths();
    const path = paths.find(p => p.id === pathId);

    if (!path) {
      return {
        progress: 0,
        completedLessons: 0,
        totalLessons: 0,
        modules: []
      };
    }

    const allLessons = path.modules.flatMap(m => m.lessons);
    const completedLessons = allLessons.filter(l => l.completed).length;
    const totalLessons = allLessons.length;
    const progress = Math.round((completedLessons / totalLessons) * 100) || 0;

    return {
      progress,
      completedLessons,
      totalLessons,
      modules: path.modules.map(module => {
        const moduleCompleted = module.lessons.filter(l => l.completed).length;
        const moduleTotal = module.lessons.length;
        return {
          id: module.id,
          title: module.title,
          progress: Math.round((moduleCompleted / moduleTotal) * 100) || 0,
          completedLessons: moduleCompleted,
          totalLessons: moduleTotal
        };
      })
    };
  }
};

export default mockApi;
