import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';

const clientService = {
    // Get all clients with pagination and filters
    getAll: async (page = 1, limit = 5, clientType = '', search = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (clientType) params.append('clientType', clientType);
        if (search) params.append('search', search);

        const response = await axiosInstance.get(`${API_PATHS.CLIENT.GET_ALL}?${params.toString()}`);
        return response.data;
    },

    // Get client by ID
    getById: async (id) => {
        const response = await axiosInstance.get(API_PATHS.CLIENT.GET_BY_ID(id));
        return response.data;
    },

    // Create new client
    create: async (clientData) => {
        const response = await axiosInstance.post(API_PATHS.CLIENT.CREATE, clientData);
        return response.data;
    },

    // Update client
    update: async (id, clientData) => {
        const response = await axiosInstance.put(API_PATHS.CLIENT.UPDATE(id), clientData);
        return response.data;
    },

    // Delete client
    delete: async (id) => {
        const response = await axiosInstance.delete(API_PATHS.CLIENT.DELETE(id));
        return response.data;
    },
};

export default clientService;
