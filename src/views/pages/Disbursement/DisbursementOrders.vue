<template>
    <div></div>
</template>

<script>
import apiClient from '@/services/apiClient';
import { Column } from 'primevue/column';
import { DataTable } from 'primevue/datatable';

export default {
    components: {
        DataTable,
        Column
    },
    data() {
        return {
            orders: []
        };
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await apiClient.get('/disbursement-orders');
                this.orders = response.data;
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch disbursement orders.',
                    life: 3000
                });
            }
        }
    }
};
</script>
