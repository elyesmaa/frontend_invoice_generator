import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

/**
 * Invoice service - Handles all invoice-related API calls
 */
export const invoiceService = {
  /**
   * Get all invoices with filters
   */
  getAll: async (page = 1, limit = 5, search = '', status = '') => {
    const url = API_PATHS.INVOICE.GET_ALL_INVOICES(page, limit, search, status);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Get invoice by ID
   */
  getById: async (id) => {
    const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICE_BY_ID(id));
    return response.data;
  },

  /**
   * Create new invoice
   */
  create: async (data) => {
    const response = await axiosInstance.post(API_PATHS.INVOICE.CREATE, data);
    return response.data;
  },

  /**
   * Update invoice
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(id), data);
    return response.data;
  },

  /**
   * Delete invoice
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
    return response.data;
  },

  /**
   * Generate invoice with AI
   */
  generateWithAI: async (prompt) => {
    console.log("prompt", prompt)
    const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text: prompt });
    return response.data;
  },

  /**
   * Generate payment reminder email with AI
   */
  generateReminder: async (invoiceId) => {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_REMINDER_EMAIL,
      { invoiceId }
    );
    return response.data;
  }
};

export default invoiceService;
