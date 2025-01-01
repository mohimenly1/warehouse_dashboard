<template>
    <div class="voucher-management">
        <header class="header">
            <h1>Voucher Management</h1>
        </header>

        <section class="form-section">
            <div class="form-wrapper">
                <h2>Create Voucher</h2>
                <form @submit.prevent="generateVoucher" class="voucher-form">
                    <label>
                        Voucher Code:
                        <input v-model="newVoucherCode" placeholder="Enter voucher code" />
                    </label>
                    <label>
                        Amount:
                        <input v-model.number="amount" type="number" placeholder="Enter amount" />
                    </label>
                    <button type="submit">Generate</button>
                </form>
            </div>

            <div class="form-wrapper">
                <h2>Create Random Vouchers</h2>
                <form @submit.prevent="generateRandomVouchers" class="voucher-form">
                    <label>
                        Quantity:
                        <input v-model.number="quantity" type="number" placeholder="Enter quantity" />
                    </label>
                    <label>
                        Amount per Voucher:
                        <input v-model.number="randomAmount" type="number" placeholder="Enter amount" />
                    </label>
                    <button type="submit">Generate</button>
                </form>
            </div>

            <button @click="exportToCSV" class="export-button">Export to CSV</button>
        </section>

        <section class="table-section">
            <h2>Voucher List</h2>
            <table class="voucher-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="voucher in paginatedVouchers" :key="voucher.id">
                        <td>{{ voucher.code }}</td>
                        <td>{{ voucher.is_used ? 'Used' : 'Available' }}</td>
                        <td>{{ voucher.creator.name }}</td>
                        <td>{{ voucher.amount }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination">
                <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
            </div>
        </section>
    </div>
</template>
<script>
import apiClient from '@/plugins/axios';

export default {
    data() {
        return {
            vouchers: [],
            newVoucherCode: '',
            amount: 0,
            quantity: 1,
            randomAmount: 0,
            currentPage: 1,
            itemsPerPage: 10
        };
    },
    computed: {
        paginatedVouchers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.vouchers.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.vouchers.length / this.itemsPerPage);
        }
    },
    methods: {
        async fetchVouchers() {
            try {
                const response = await apiClient.get('/vouchers');
                this.vouchers = response.data.vouchers;
            } catch (error) {
                console.error('Failed to fetch vouchers:', error);
            }
        },
        async generateVoucher() {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('User ID not found in local storage');
                return;
            }
            try {
                await apiClient.post('/vouchers', {
                    code: this.newVoucherCode,
                    amount: this.amount,
                    user_id: userId
                });
                this.newVoucherCode = '';
                this.amount = 0;
                this.fetchVouchers();
            } catch (error) {
                console.error('Failed to generate voucher:', error);
            }
        },
        async generateRandomVouchers() {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('User ID not found in local storage');
                return;
            }
            try {
                await apiClient.post('/vouchers', {
                    quantity: this.quantity,
                    amount: this.randomAmount,
                    user_id: userId
                });
                this.quantity = 1;
                this.randomAmount = 0;
                this.fetchVouchers();
            } catch (error) {
                console.error('Failed to generate random vouchers:', error);
            }
        },
        exportToCSV() {
            const csvContent = 'data:text/csv;charset=utf-8,' + ['Code,Status,Created By,Amount', ...this.vouchers.map((voucher) => `${voucher.code},${voucher.is_used ? 'Used' : 'Available'},${voucher.creator.name},${voucher.amount}`)].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'vouchers.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    mounted() {
        this.fetchVouchers();
    }
};
</script>

<style scoped>
.voucher-management {
    max-width: 900px;
    margin: 20px auto;
    font-family: Arial, sans-serif;
    color: #333;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

.header h1 {
    color: #555;
}

.form-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;
}

.form-wrapper {
    flex: 1 1 calc(50% - 20px);
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.voucher-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.voucher-form label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.voucher-form input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
}

.voucher-form button {
    align-self: flex-start;
    padding: 10px 20px;
    font-size: 14px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.voucher-form button:hover {
    background-color: #0056b3;
}

.export-button {
    padding: 10px 20px;
    font-size: 14px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.export-button:hover {
    background-color: #218838;
}

.table-section {
    margin-top: 20px;
}

.table-section h2 {
    margin-bottom: 10px;
    font-size: 18px;
}

.voucher-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.voucher-table th,
.voucher-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.voucher-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.voucher-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.voucher-table tr:hover {
    background-color: #f1f1f1;
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.pagination button {
    padding: 5px 10px;
    cursor: pointer;
}

.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
