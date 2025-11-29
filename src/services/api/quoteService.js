import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

/**
 * Quote service - Handles all quote-related API calls
 */
export const quoteService = {
    /**
     * Get all quotes with filters
     */
    getAll: async (page = 1, limit = 5, search = '', status = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (search) params.append('search', search);
        if (status) params.append('status', status);

        const response = await axiosInstance.get(`${API_PATHS.QUOTE.GET_ALL}?${params.toString()}`);
        return response.data;
    },

    /**
     * Get quote by ID
     */
    getById: async (id) => {
        const response = await axiosInstance.get(API_PATHS.QUOTE.GET_BY_ID(id));
        return response.data;
    },

    /**
     * Create new quote
     */
    create: async (data) => {
        const response = await axiosInstance.post(API_PATHS.QUOTE.CREATE, data);
        return response.data;
    },

    /**
     * Update quote
     */
    update: async (id, data) => {
        const response = await axiosInstance.put(API_PATHS.QUOTE.UPDATE(id), data);
        return response.data;
    },

    /**
     * Delete quote
     */
    delete: async (id) => {
        const response = await axiosInstance.delete(API_PATHS.QUOTE.DELETE(id));
        return response.data;
    },

    /**
     * Convert quote to invoice
     */
    convertToInvoice: async (id) => {
        const response = await axiosInstance.post(API_PATHS.QUOTE.CONVERT_TO_INVOICE(id));
        return response.data;
    },

    /**
     * Clone quote
     */
    clone: async (id) => {
        const response = await axiosInstance.post(API_PATHS.QUOTE.CLONE(id));
        return response.data;
    },

    /**
     * Generate quote with AI
     */
    generateWithAI: async (prompt) => {
        console.log("prompt", prompt);
        const response = await axiosInstance.post(API_PATHS.AI.PARSE_QUOTE_TEXT, { text: prompt });
        return response.data;
    },

    /**
     * Generate reminder email for quote
     */
    generateReminder: async (quoteId) => {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUOTE_REMINDER, { quoteId });
        return response.data;
    },
};

export default quoteService;
