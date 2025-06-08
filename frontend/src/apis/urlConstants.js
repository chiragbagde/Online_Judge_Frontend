const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const urlConstants = {
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  googleLogin: `${API_BASE_URL}/auth/google`,
  microsoftLogin: `${API_BASE_URL}/auth/microsoft`,
  logout: `${API_BASE_URL}/auth/logout`,
  refreshToken: `${API_BASE_URL}/auth/refresh-token`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
  verifyToken: `${API_BASE_URL}/auth/verify-token`,
  
  // User
  users: `${API_BASE_URL}/users`,
  profile: `${API_BASE_URL}/users/profile`,
  changePassword: `${API_BASE_URL}/users/change-password`,
  
  // Problems
  problems: `${API_BASE_URL}/problems`,
  submit: `${API_BASE_URL}/code/submit`,
  run: `${API_BASE_URL}/code/run`,
  submissions: `${API_BASE_URL}/code/submissions`,
  getDailyProblem: `${API_BASE_URL}/problems/daily-problem`,
  
  // Test Cases
  testCases: `${API_BASE_URL}/testcases`,
  
  // Competitions
  competitions: `${API_BASE_URL}/competitions`,
  
  // Social
  social: `${API_BASE_URL}/social-profile`,
  
  // Images
  images: `${API_BASE_URL}/images`,
  
  // Notifications
  notifications: `${API_BASE_URL}/notifications`,
  
  // Lists
  lists: `${API_BASE_URL}/lists`,
  
  // Blogs
  blogs: `${API_BASE_URL}/blogs`,
  blogsBySlug: `${API_BASE_URL}/blogs/slug`,
  
  // Learning Paths
  learningPaths: `${API_BASE_URL}/learning-paths`,
};

export default urlConstants;
