import apiClient from '@/plugins/axios';

export const ProductService = {
    async getProducts() {
        const warehouse_id = localStorage.getItem('warehouse_id');
        try {
            const response = await apiClient.get(`/products?warehouse_id=${warehouse_id}`); // Replace with your API endpoint
            return response.data; // Ensure the response structure matches this
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
};

export const WarehouseService = {
    async getWarehouseStatistics() {
        const warehouse_id = localStorage.getItem('warehouse_id');
        try {
            const response = await apiClient.get(`/warehouses/${warehouse_id}/statistics`);
            return response.data;
        } catch (error) {
            console.error('Error fetching warehouse statistics:', error);
            throw error;
        }
    }
};
