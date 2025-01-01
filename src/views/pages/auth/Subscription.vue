<template>
    <div class="form-container" dir="rtl">
        <h2>نموذج الاشتراك</h2>

        <form @submit.prevent="submitSubscription" class="subscription-form">
            <!-- Subscription Type -->
            <div class="form-group">
                <label for="subscription_type">نوع الاشتراك:</label>
                <select v-model="form.subscription_type" id="subscription_type" class="form-control" required>
                    <option value="normal">عادي</option>
                    <option value="trader">تاجر</option>
                </select>
            </div>

            <!-- Payment Method -->
            <div class="form-group">
                <label for="payment_method">طريقة الدفع:</label>
                <select v-model="form.payment_method" id="payment_method" class="form-control" required>
                    <option value="credit_card">بطاقة ائتمان</option>
                    <option value="voucher">Keep space card</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                </select>
            </div>

            <!-- Voucher Code (only if payment method is voucher) -->
            <div v-if="form.payment_method === 'voucher'" class="form-group">
                <label for="voucher_code">رمز keep space card:</label>
                <input type="text" v-model="form.voucher_code" id="voucher_code" class="form-control" placeholder="أدخل رمز card" />
            </div>

            <!-- Warehouse Info -->
            <div class="warehouse-info">
                <h3>معلومات المستودع</h3>
                <div class="form-group">
                    <label for="warehouse_name">اسم المستودع:</label>
                    <input type="text" v-model="form.warehouse_name" id="warehouse_name" class="form-control" placeholder="أدخل اسم المستودع" required />
                </div>
                <div class="form-group">
                    <label for="warehouse_location">موقع المستودع:</label>
                    <input type="text" v-model="form.warehouse_location" id="warehouse_location" class="form-control" placeholder="أدخل موقع المستودع" required />
                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit">إرسال الدفع</button>
        </form>
    </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
    data() {
        return {
            form: {
                subscription_type: 'normal', // Default subscription type
                payment_method: 'credit_card', // Default payment method
                voucher_code: '',
                warehouse_name: '',
                warehouse_location: ''
            }
        };
    },
    methods: {
        async submitSubscription() {
            try {
                const userId = this.$store.state.auth.user?.id || localStorage.getItem('user_id');

                if (!userId) {
                    throw new Error('User is not logged in.');
                }

                const requestData = {
                    user_id: userId,
                    subscription_type: this.form.subscription_type,
                    payment_method: this.form.payment_method,
                    voucher_code: this.form.payment_method === 'voucher' ? this.form.voucher_code : '',
                    warehouse_name: this.form.warehouse_name,
                    warehouse_location: this.form.warehouse_location
                };

                const response = await apiClient.post('/pay', requestData);

                if (response.data) {
                    const subscription = {
                        subscription_type: this.form.subscription_type,
                        payment_method: this.form.payment_method,
                        amount: response.data.amount,
                        is_paid: response.data.is_paid,
                        voucher_amount: response.data.voucher_amount || null // Add voucher amount
                    };

                    const warehouse = {
                        name: this.form.warehouse_name,
                        location: this.form.warehouse_location
                    };

                    this.$router
                        .push({
                            name: 'SuccessSubscription',
                            query: {
                                subscription: JSON.stringify(subscription),
                                warehouse: JSON.stringify(warehouse)
                            }
                        })
                        .then(() => {
                            console.log('Redirected successfully');
                        })
                        .catch((err) => {
                            console.error('Redirection failed:', err);
                        });
                }
            } catch (error) {
                console.error('Subscription failed', error);

                if (error.response && error.response.data && error.response.data.message) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'An unexpected error occurred. Please try again later.'
                    });
                }
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.auth.user;
        }
    },
    created() {
        const userData = this.$route.query.user;
        if (userData) {
            this.user = JSON.parse(userData);
        }
    }
};
</script>

<style scoped>
.form-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: right;
}

h2 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
}

.subscription-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.form-control {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

.form-control:focus {
    border-color: #007bff;
    outline: none;
}

.warehouse-info h3 {
    font-size: 1.4em;
    color: #007bff;
    margin-bottom: 10px;
}

.btn-submit {
    padding: 10px 20px;
    font-size: 1.2em;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    text-align: center;
}

.btn-submit:hover {
    background-color: #0056b3;
}
</style>
