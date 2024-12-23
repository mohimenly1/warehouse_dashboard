import apiClient from '@/plugins/axios';

export const AdminService = {
    async getStatistics() {
        try {
            const response = await apiClient.get(`/statistics-users-warehouses-count`); // Replace with your API endpoint
            return response.data; // Ensure the response structure matches this
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
};
