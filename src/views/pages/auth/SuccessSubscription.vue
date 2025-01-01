<template>
    <div class="success-container" dir="rtl">
        <div class="success-header">
            <i class="icon-check-circle"></i>
            <h2>تم الاشتراك بنجاح!</h2>
        </div>
        <p class="success-message">شكراً لاشتراكك. تمت معالجة اشتراكك بنجاح.</p>

        <div v-if="subscription && warehouse" class="details-container">
            <div class="subscription-details">
                <h3>تفاصيل الاشتراك</h3>
                <ul>
                    <li><strong>النوع:</strong> {{ subscription.subscription_type }}</li>
                    <li><strong>طريقة الدفع:</strong> {{ subscription.payment_method }}</li>
                    <!-- <li><strong>المبلغ المدفوع:</strong> ${{ subscription }}</li> -->
                    <li v-if="subscription.voucher_amount"><strong>مبلغ القسيمة:</strong> ${{ subscription.voucher_amount }}</li>
                    <li>
                        <strong>الحالة:</strong> <span :class="subscription.is_paid ? 'status-paid' : 'status-pending'">{{ subscription.is_paid ? 'مدفوع' : 'قيد الانتظار' }}</span>
                    </li>
                </ul>
            </div>

            <div class="warehouse-details">
                <h3>معلومات المستودع</h3>
                <ul>
                    <li><strong>اسم المستودع:</strong> {{ warehouse.name }}</li>
                    <li><strong>موقع المستودع:</strong> {{ warehouse.location }}</li>
                </ul>
            </div>
        </div>

        <button @click="goToDashboard" class="btn-primary">الذهاب إلى لوحة التحكم</button>
    </div>
</template>

<script>
export default {
    name: 'SuccessSubscription',
    data() {
        return {
            subscription: null,
            warehouse: null
        };
    },
    created() {
        const { subscription, warehouse } = this.$route.query;

        if (subscription && warehouse) {
            try {
                this.subscription = JSON.parse(subscription); // Parse the JSON strings
                this.warehouse = JSON.parse(warehouse);

                console.log(this.subscription);
            } catch (error) {
                console.error('Failed to parse query parameters', error);
            }
        } else {
            console.error('Missing subscription or warehouse data');
        }
    },
    methods: {
        goToDashboard() {
            this.$router.push({ name: 'dashboard' }); // Adjust to your dashboard route
        }
    }
};
</script>

<style scoped>
.success-container {
    padding: 30px;
    max-width: 600px;
    margin: 50px auto;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: 'Arial', sans-serif;
}

.success-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: green;
}

.icon-check-circle {
    font-size: 2em;
    color: green;
}

h2 {
    font-size: 2em;
    margin: 0;
}

.success-message {
    margin: 15px 0;
    font-size: 1.2em;
    color: #555;
}

.details-container {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    text-align: left;
}

.subscription-details,
.warehouse-details {
    flex: 1;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.5em;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    margin: 10px 0;
    font-size: 1.1em;
}

.status-paid {
    color: green;
    font-weight: bold;
}

.status-pending {
    color: red;
    font-weight: bold;
}

button {
    margin-top: 30px;
    padding: 12px 25px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
</style>
