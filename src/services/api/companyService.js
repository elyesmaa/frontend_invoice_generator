import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

/**
 * Company service - Handles all company-related API calls
 */
export const companyService = {
    /**
     * Get all companies for the current user
     */
    getAll: async () => {
        const response = await axiosInstance.get(API_PATHS.COMPANY.GET_ALL);
        return response.data;
    },

    /**
     * Get a single company by ID
     */
    getById: async (id) => {
        const response = await axiosInstance.get(API_PATHS.COMPANY.GET_BY_ID(id));
        return response.data;
    },

    /**
     * Create a new company
     */
    create: async (companyData) => {
        const response = await axiosInstance.post(API_PATHS.COMPANY.CREATE, companyData);
        return response.data;
    },

    /**
     * Update an existing company
     */
    update: async (id, companyData) => {
        const response = await axiosInstance.put(API_PATHS.COMPANY.UPDATE(id), companyData);
        return response.data;
    },

    /**
     * Delete a company
     */
    delete: async (id) => {
        const response = await axiosInstance.delete(API_PATHS.COMPANY.DELETE(id));
        return response.data;
    }
};

export default companyService;
