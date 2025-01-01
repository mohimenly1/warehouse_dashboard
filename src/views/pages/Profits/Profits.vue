<template>
    <div class="profits-overview">
        <h2 class="title">احصائيات الاشتراكات</h2>

        <!-- Total Amount Section -->
        <div class="card total-amount">
            <div class="card-header">
                <h3>اجمالي الارباح</h3>
            </div>
            <div class="card-body">
                <p class="amount">{{ totalAmount }} د.ل</p>
            </div>
        </div>

        <!-- Subscription Type Section -->
        <div class="card subscription-type">
            <div class="card-header">
                <h3>الاشتراك حسب الباقة</h3>
            </div>
            <div class="card-body">
                <ul>
                    <li v-for="(count, type) in subscriptionsByType" :key="type">
                        <span class="type-label">{{ type }}</span
                        >: <strong>{{ count }}</strong>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Payment Method Section -->
        <div class="card payment-method">
            <div class="card-header">
                <h3>الاشتراك حسب طريقة الدفع</h3>
            </div>
            <div class="card-body">
                <ul>
                    <li v-for="(count, method) in subscriptionsByPaymentMethod" :key="method">
                        <span class="method-label">{{ method }}</span
                        >: <strong>{{ count }}</strong>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import apiClient from '@/plugins/axios';

export default {
    data() {
        return {
            totalAmount: 0,
            subscriptionsByType: {},
            subscriptionsByPaymentMethod: {}
        };
    },
    methods: {
        async fetchProfitsData() {
            try {
                const response = await apiClient.get('/subscriptions/profits');
                const data = response.data;

                this.totalAmount = data.total_amount;
                this.subscriptionsByType = data.subscriptions_by_type.reduce((acc, { subscription_type, count }) => {
                    acc[subscription_type] = count;
                    return acc;
                }, {});
                this.subscriptionsByPaymentMethod = data.subscriptions_by_payment_method.reduce((acc, { payment_method, count }) => {
                    acc[payment_method] = count;
                    return acc;
                }, {});
            } catch (error) {
                console.error('Failed to fetch profits data:', error);
            }
        }
    },
    created() {
        this.fetchProfitsData();
    }
};
</script>
<style scoped>
.profits-overview {
    padding: 20px;
    background-color: #fafafa;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2.title {
    text-align: center;
    font-size: 28px;
    color: #333;
    margin-bottom: 30px;
}

.card {
    background-color: white;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
    background-color: #00065e;
    color: white !important;
    padding: 10px;
    font-size: 20px;
    border-radius: 8px 8px 0 0;
}

.card-header h3 {
    color: white !important;
    text-align: center;
}
.card-body {
    padding: 20px;
}

.amount {
    font-size: 40px;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

li {
    font-size: 18px;
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
}

strong {
    font-weight: bold;
    color: #333;
}

.type-label,
.method-label {
    font-weight: 500;
    color: #003975;
}
</style>
