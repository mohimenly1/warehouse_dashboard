<template>
    <div>
        <h2 class="page-title">الاشتراكات</h2>

        <!-- Subscription Table -->
        <div class="table-container">
            <table class="subscription-table">
                <thead>
                    <tr>
                        <th @click="sortTable('user_name')">User</th>
                        <th @click="sortTable('subscription_type')">Type</th>
                        <th @click="sortTable('amount')">Amount</th>
                        <th @click="sortTable('payment_method')">Payment Method</th>
                        <th @click="sortTable('status')">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="subscription in paginatedSubscriptions" :key="subscription.id" class="table-row">
                        <td>{{ subscription.user.name }}</td>
                        <td>{{ subscription.subscription_type }}</td>
                        <td>{{ subscription.amount }}</td>
                        <td>{{ subscription.payment_method }}</td>
                        <td :class="subscription.is_paid ? 'paid' : 'unpaid'">
                            {{ subscription.is_paid ? 'Paid' : 'Unpaid' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="subscriptions.length > 10" class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
    data() {
        return {
            subscriptions: [],
            currentPage: 1,
            itemsPerPage: 10,
            sortKey: '',
            sortOrder: 'asc'
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.subscriptions.length / this.itemsPerPage);
        },
        paginatedSubscriptions() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.subscriptions.slice(start, end);
        }
    },
    methods: {
        async fetchSubscriptions() {
            try {
                const response = await apiClient.get('/subscriptions');
                this.subscriptions = response.data.subscriptions;
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
            }
        },
        sortTable(column) {
            if (this.sortKey === column) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = column;
                this.sortOrder = 'asc';
            }

            this.subscriptions.sort((a, b) => {
                let valueA = a[this.sortKey];
                let valueB = b[this.sortKey];

                if (this.sortKey === 'user_name') {
                    valueA = a.user.name;
                    valueB = b.user.name;
                }

                if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
                if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        }
    },
    mounted() {
        this.fetchSubscriptions();
    }
};
</script>

<style scoped>
.page-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}

.table-container {
    overflow-x: auto;
    margin: 0 20px;
}

.subscription-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    font-size: 16px;
}

.subscription-table th,
.subscription-table td {
    padding: 10px;
    text-align: left;
}

.subscription-table th {
    background-color: #f5f5f5;
    cursor: pointer;
}

.table-row:hover {
    background-color: #f9f9f9;
}

.paid {
    color: green;
}

.unpaid {
    color: red;
}

.pagination-controls {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination-controls button {
    padding: 8px 15px;
    margin: 0 5px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

.pagination-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination-controls span {
    align-self: center;
    font-size: 16px;
}
</style>
