import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

/**
 * User service - Handles all user-related API calls
 */
export const userService = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get(API_PATHS.AUTH.ME);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData) => {
    const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
    return response.data;
  }
};

export default userService;
