import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

/**
 * Authentication service - Handles all auth-related API calls
 */
export const authService = {
  /**
   * User login
   */
  login: async (credentials) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * User registration
   */
  signup: async (userData) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Check if email exists
   */
  checkEmail: async (email) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.CHECK_EMAIL, { email });
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token) => {
    const response = await axiosInstance.get(API_PATHS.AUTH.VERIFY_EMAIL(token));
    return response.data;
  },

  /**
   * User logout
   */
  logout: async () => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    const response = await axiosInstance.get(API_PATHS.AUTH.ME);
    return response.data;
  }
};

export default authService;
