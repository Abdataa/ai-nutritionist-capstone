import api from './api';

const login = async (email, password, rememberMe = false) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.access_token) {
    // Determine storage based on rememberMe option
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', response.data.access_token);
    
    // Fetch user profile and store it
    const userResponse = await api.get('/auth/me');
    storage.setItem('user', JSON.stringify(userResponse.data));
  }
  return response.data;
};

const googleLogin = async (credential, rememberMe = false) => {
  const response = await api.post('/auth/google-login', { credential });
  if (response.data.access_token) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', response.data.access_token);
    
    const userResponse = await api.get('/auth/me');
    storage.setItem('user', JSON.stringify(userResponse.data));
  }
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

const logout = () => {
  // Clear from both localStorage and sessionStorage to be safe
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

const getCurrentUser = async () => {
  try {
    // Check both localStorage and sessionStorage
    let userJson = localStorage.getItem('user');
    if (!userJson) {
      userJson = sessionStorage.getItem('user');
    }
    
    if (userJson) {
      return JSON.parse(userJson);
    }
    
    // If no user data in storage, try to fetch from the API
    const token = getToken();
    if (token) {
      const response = await api.get('/auth/me');
      // Store user data in the same location as the token
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const getToken = () => {
  // Check both localStorage and sessionStorage for token
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  // Update stored user data after successful update
  const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/auth/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  // Update stored user data with the new profile picture
  const currentUser = await getCurrentUser();
  if (currentUser) {
    currentUser.profile_picture = response.data.file_path;
    const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(currentUser));
  }
  
  return response.data;
};

const getUserMealPlans = async () => {
  try {
    const response = await api.get('/api/mealplan/user');
    return response.data;
  } catch (error) {
    console.error('Error getting user meal plans:', error);
    throw error;
  }
};

export default { login, googleLogin, register, logout, getCurrentUser, getToken, updateProfile, uploadProfilePicture, getUserMealPlans };
