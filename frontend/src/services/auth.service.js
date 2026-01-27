/**
 * Authentication service - handles user authentication and token management
 */
import { authAPI } from './api';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Registration failed',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Login user with Remember Me support
   * @param {Object} credentials - { email, password }
   * @param {boolean} rememberMe - Whether to use localStorage or sessionStorage
   */
  async login(credentials, rememberMe = false) {
    try {
      // The authAPI.login handles the logic of storing the token/user based on rememberMe
      const data = await authAPI.login(credentials, rememberMe);
      
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Login failed',
      };
    }
  }

  /**
   * Google Authentication
   */
  async googleLogin(credential, rememberMe = false) {
    try {
      const data = await authAPI.googleLogin(credential, rememberMe);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Google login failed',
      };
    }
  }

  /**
   * Logout user and clear all storages
   */
  logout() {
    authAPI.logout(); // Clears both local and session storage
    window.location.href = '/login';
  }

  /**
   * Get current user info from storage or backend
   */
  async getCurrentUserInfo() {
    try {
      const data = await authAPI.getCurrentUser();
      if (data) {
        return { success: true, data };
      }
      return { success: false, message: 'No user session found' };
    } catch (error) {
      return { success: false, message: 'Failed to fetch user info' };
    }
  }

  /**
   * Update Profile Details
   */
  async updateProfile(profileData) {
    try {
      const data = await authAPI.updateProfile(profileData);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Update failed',
      };
    }
  }

  /**
   * Upload Profile Picture
   */
  async uploadProfilePicture(file) {
    try {
      const data = await authAPI.uploadProfilePicture(file);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Upload failed',
      };
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    try {
      const response = await authAPI.forgotPassword(email);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Request failed',
      };
    }
  }

  /**
   * Reset password (from email link)
   */
  async resetPassword(data) {
    try {
      const response = await authAPI.resetPassword(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Password reset failed',
      };
    }
  }

  /**
   * Change password (while logged in)
   */
  async changePassword(data) {
    try {
      const response = await authAPI.changePassword(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Password change failed',
      };
    }
  }

  /**
   * Check if user is authenticated (checks both storages)
   */
  isAuthenticated() {
    return !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
  }

  /**
   * Get stored user data from whichever storage it is in
   */
  getUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get auth token from whichever storage it is in
   */
  getToken() {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }
}

export default new AuthService();