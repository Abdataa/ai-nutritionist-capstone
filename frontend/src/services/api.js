/**
 * API service for communication with FastAPI backend
 */
import axios from 'axios';

// --- AXIOS CONFIGURATION ---

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper to get token from either storage
 */
const getStoredToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

/**
 * Helper to get the active storage (where the token currently lives)
 */
const getActiveStorage = () => localStorage.getItem('access_token') ? localStorage : sessionStorage;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all possible storage on auth failure
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- AUTH API CALLS ---

export const authAPI = {
  register: (userData) => api.post('/api/v1/auth/register', userData),
  
  login: async (credentials, rememberMe = false) => {
    // Standard OAuth2 form data for FastAPI
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.access_token) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('access_token', response.data.access_token);
      
      // Fetch user profile immediately after login
      const userResponse = await api.get('/api/v1/auth/me');
      storage.setItem('user', JSON.stringify(userResponse.data));
    }
    return response.data;
  },

  googleLogin: async (credential, rememberMe = false) => {
    const response = await api.post('/api/v1/auth/google-login', { credential });
    if (response.data.access_token) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('access_token', response.data.access_token);
      
      const userResponse = await api.get('/api/v1/auth/me');
      storage.setItem('user', JSON.stringify(userResponse.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      // 1. Check storage first
      let userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userJson) return JSON.parse(userJson);
      
      // 2. If not in storage but token exists, fetch from API
      if (getStoredToken()) {
        const response = await api.get('/api/v1/auth/me');
        getActiveStorage().setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/v1/auth/profile', profileData);
    getActiveStorage().setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/v1/auth/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // Update local user state with new picture path
    const currentUser = await authAPI.getCurrentUser();
    if (currentUser) {
      currentUser.profile_picture = response.data.file_path;
      getActiveStorage().setItem('user', JSON.stringify(currentUser));
    }
    return response.data;
  },

  forgotPassword: (email) => api.post('/api/v1/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/v1/auth/reset-password', data),
  changePassword: (data) => api.post('/api/v1/auth/change-password', data),
};

// --- MEAL PLAN API CALLS ---

export const mealPlanAPI = {
  generate: (mealPlanData) => api.post('/api/meal-plans/generate', mealPlanData),
  getAll: (skip = 0, limit = 20) => api.get(`/api/meal-plans?skip=${skip}&limit=${limit}`),
  getUserMealPlans: () => api.get('/api/meal-plans/user'), // Merged from second file
  getById: (id) => api.get(`/api/meal-plans/${id}`),
  delete: (id) => api.delete(`/api/meal-plans/${id}`),
  duplicate: (id, newClientName) => 
    api.post(`/api/meal-plans/${id}/duplicate`, { new_client_name: newClientName }),
  exportPDF: (id) => api.get(`/api/meal-plans/${id}/export/pdf`, { responseType: 'blob' }),
};

// --- CLIENTS API CALLS ---

export const clientsAPI = {
  getAll: () => api.get('/api/clients'),
};

export default api;