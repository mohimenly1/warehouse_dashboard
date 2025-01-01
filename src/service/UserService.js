import apiClient from '@/plugins/axios';

export const UserService = {
    async fetchUsers() {
        try {
            const response = await apiClient.get('/all-users');
            return response.data.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
};
