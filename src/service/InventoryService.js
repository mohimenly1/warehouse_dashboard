import apiClient from '@/plugins/axios';

export const InventoryService = {
    async fetchInventories(warehouse_id) {
        try {
            const response = await apiClient.get('/inventories', {
                params: { warehouse_id: warehouse_id } // Pass user_id as a query parameter
            });
            return response.data.inventories;
        } catch (error) {
            console.error('Error fetching inventories:', error);
            throw error;
        }
    },

    async createInventory(inventory) {
        try {
            const response = await apiClient.post('/inventories', inventory);
            return response.data;
        } catch (error) {
            console.error('Error creating inventory:', error);
            throw error;
        }
    }
};
