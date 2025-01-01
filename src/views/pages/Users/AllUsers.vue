<script setup>
import apiClient from '@/plugins/axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const users = ref([]);
const toast = useToast();

const fetchUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        users.value = response.data.users;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch users'
        });
    }
};

const updateUser = async (userId, status, isPaid) => {
    try {
        await apiClient.put(`/users/${userId}`, {
            status,
            is_paid: isPaid
        });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
        });
        fetchUsers();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user'
        });
    }
};

const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        await apiClient.delete(`/users/${userId}`);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully'
        });
        fetchUsers();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user'
        });
    }
};

onMounted(fetchUsers);
</script>

<template>
    <div>
        <div class="card">
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Subscription Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Paid</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.name }}</td>
                        <td>{{ user.subscription?.subscription_type }}</td>
                        <td>{{ user.subscription?.amount }}</td>
                        <td>
                            <select v-model="user.status" :class="{ 'remark-background': user.status === 'pending' }" @change="updateUser(user.id, user.status, user.is_paid)">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="user.is_paid" :class="{ 'remark-background': user.is_paid === false || user.is_paid === 0 }" @change="updateUser(user.id, user.status, user.is_paid)">
                                <option :value="true">Yes</option>
                                <option :value="false">No</option>
                            </select>
                        </td>
                        <td>
                            <button @click="updateUser(user.id, user.status, user.is_paid)" class="btn btn-primary">Update</button>
                            <button @click="deleteUser(user.id)" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style>
.table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.table th {
    background-color: #f2f2f2;
}

.btn {
    padding: 6px 12px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-primary {
    background-color: #007bff;
    color: #fff;
}

/* Remark background style */
.remark-background {
    background-color: #ffa500; /* Orange background for remark */
    color: #fff; /* Optional: white text for better readability */
}
</style>
