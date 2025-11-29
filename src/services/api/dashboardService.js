import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

/**
 * Dashboard service - Handles dashboard-related API calls
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICES_SUMMARY);
    return response.data;
  },

  /**
   * Get AI insights for dashboard
   */
  getAiInsights: async () => {
    const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
    return response.data;
  }
};

export default dashboardService;
