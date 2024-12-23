import apiClient from '@/plugins/axios';

export const CategoryService = {
    async fetchCategories(warehouse_id) {
        try {
            const response = await apiClient.get('/categories', {
                params: { warehouse_id: warehouse_id } // Pass user_id as a query parameter
            });
            return response.data.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async createCategory(category) {
        try {
            const response = await apiClient.post('/categories', category);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }
};
