const dsaPath = 'https://95689b0f.public-json-worker.pages.dev/dsa.json';
const fullstackPath = 'https://95689b0f.public-json-worker.pages.dev/fullstack.json';
const mlPath = 'https://95689b0f.public-json-worker.pages.dev/ml.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
};

// Mock API
const mockApi = {
  async fetchLearningPaths() {
    await delay(1000);
    const paths = await Promise.all([fetchJson(dsaPath), fetchJson(fullstackPath), fetchJson(mlPath)]);
    return paths;
  },

  async fetchLearningPathById(pathId) {
    await delay(800);

    const paths = await Promise.all([fetchJson(dsaPath), fetchJson(fullstackPath), fetchJson(mlPath)]);
    const path = paths.find(p => p.id === pathId);

    if (!path) {
      throw new Error('Learning path not found');
    }

    return path;
  },

  async toggleBookmark(pathId) {
    await delay(500);

    const paths = await Promise.all([fetchJson(dsaPath), fetchJson(fullstackPath), fetchJson(mlPath)]);
    const path = paths.find(p => p.id === pathId);

    if (!path) {
      throw new Error('Learning path not found');
    }

    // Pretend toggle logic
    return { success: true, message: 'Bookmark status updated' };
  },

  async markLessonCompleted(pathId, moduleId, lessonId) {
    await delay(500);

    const paths = await Promise.all([fetchJson(dsaPath), fetchJson(fullstackPath), fetchJson(mlPath)]);
    const path = paths.find(p => p.id === pathId);
    if (!path) throw new Error('Learning path not found');

    const module = path.modules.find(m => m.id === moduleId);
    if (!module) throw new Error('Module not found');

    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');

    return { success: true, message: 'Lesson marked as completed' };
  }
};

export default mockApi;
