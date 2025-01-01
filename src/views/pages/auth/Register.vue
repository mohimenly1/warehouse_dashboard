<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img class="mb-8 w-16 shrink-0 mx-auto" src="/public/demo/images/logo.png" style="width: 60% !important" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">KEEP SPACE يسعدنا جداً إنظمامك لـ</div>
                        <span class="text-muted-color font-medium">يمكنك بدء تسجيل بياناتك وطبيعة الخدمة التي تريد الحصول عليها</span>
                    </div>

                    <form @submit.prevent="registerSubmit">
                        <label for="name" class="block text-right text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">الإسم</label>
                        <InputText id="name" type="text" placeholder="الإسم بالكامل" class="w-full md:w-[30rem] mb-8" v-model="name" />

                        <label for="username" class="block text-right text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">إسم المستخدم</label>
                        <InputText id="username" type="text" placeholder="إسم المستخدم" class="w-full md:w-[30rem] mb-8" v-model="username" />

                        <label for="email" class="block text-right text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">البريد الإلكتروني</label>
                        <InputText id="email" type="email" placeholder="البريد الإلكتروني" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="userType" class="block text-right text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">نوع الإشتراك</label>
                        <Select class="w-full md:w-[30rem] mb-8" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />

                        <label for="password" class="block text-right text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">كلمة المرور</label>
                        <Password id="password" v-model="password" placeholder="كلمة المرور" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button class="w-full" type="submit">تسجيل الدخول</Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import apiClient from '@/plugins/axios';

export default {
    name: 'Register',
    data() {
        return {
            name: '',
            username: '',
            email: '',
            password: '',
            dropdownValue: '',
            dropdownValues: [
                { name: 'Trader', code: 'trader' },
                { name: 'Normal', code: 'normal' }
            ]
        };
    },
    components: {
        FloatingConfigurator
    },
    methods: {
        async registerSubmit() {
            try {
                const response = await apiClient.post('/register', {
                    name: this.name,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    user_type: this.dropdownValue.code
                });

                const { user } = response.data;

                // Update Vuex store with user data
                this.$store.commit('auth/SET_USER_TYPE', this.dropdownValue.code);
                this.$store.commit('auth/SET_USER_DATA', user);

                // Notify success
                this.$toast.add({
                    severity: 'success',
                    summary: 'Registration Successful',
                    detail: 'Awaiting admin approval and payment verification.',
                    life: 5000
                });

                // Redirect to the next step
                // this.$router.push({ name: 'warehouseInfo' });
                this.$router.push({
                    name: 'subscription',
                    query: {
                        user: JSON.stringify(this.user)
                    }
                });
            } catch (error) {
                if (error.response) {
                    // Handle validation or server errors
                    const errorMessage = error.response.data.message || 'An error occurred.';
                    const errorDetails = error.response.data.errors ? Object.values(error.response.data.errors).flat().join(', ') : '';
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Registration Failed',
                        detail: `${errorMessage} ${errorDetails}`,
                        life: 5000
                    });
                } else if (error.request) {
                    // No response from server
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Network Error',
                        detail: 'No response received from the server.',
                        life: 5000
                    });
                } else {
                    // Other errors
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message,
                        life: 5000
                    });
                }
            }
        }
    }
};
</script>

<style scoped>
@font-face {
    font-family: 'TajawalBold';
    src: url('../../../../public/TajawalBold.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

label {
    font-family: TajawalBold;
}

.w-full {
    font-family: TajawalBold;
}
input::placeholder {
    text-align: right !important;
}
#password1::placeholder {
    text-align: right;
}
</style>
