<template>
    <div style="min-height: 100vh" class="grid flex-col">
        <div class="card">
            <div class="card mt-8">
                <div class="font-semibold text-xl mb-4">
                    <img src="/demo/images/logo.png" style="width: 10%" alt="Company logo" />
                </div>
                <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                        <div class="flex flex-col gap-2">
                            <label for="warehouse_name"> إسم المخزن </label>
                            <InputText v-model="name" id="warehouse_name" type="text" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="location">موقع المخزن</label>
                            <InputText v-model="location" id="location" type="text" />
                        </div>
                        <div class="flex">
                            <Button @click="submitWarehouseInfo" label="ارسـل" type="submit" icon="pi pi-send" class="w-full"></Button>
                        </div>
                    </div>
                    <div class="w-full md:w-2/12">
                        <Divider layout="vertical" class="!hidden md:!flex"><b>معلومات عن مخزنك</b></Divider>
                        <Divider layout="horizontal" class="!flex md:!hidden" align="center"><b>معلومات عن مخزنك</b></Divider>
                    </div>
                    <div class="w-full md:w-5/12 flex items-center justify-center py-5">
                        <img src="/public/demo/cover.svg" alt="Hero Image" style="width: 50%" class="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
    name: 'WarehouseInfo',
    data() {
        return {
            name: '',
            location: ''
        };
    },
    methods: {
        async submitWarehouseInfo() {
            try {
                const user_id = this.$store.getters['auth/userId'];

                const response = await apiClient.post('/warehouses', {
                    name: this.name,
                    location: this.location,
                    user_id
                });

                const { warehouse_id, warehouse_name } = response.data;

                // Save warehouse details in Vuex store
                this.$store.commit('auth/SET_WAREHOUSE_DATA', { warehouse_id, warehouse_name });

                this.$router.push({ name: 'dashboard' }); // Redirect to the dashboard
            } catch (error) {
                console.error('Error submitting warehouse info:', error);
            }
        }
    }
};
</script>
<style scoped>
label {
    font-family: TajawalBold;
    text-align: right;
}

.w-full {
    font-family: TajawalBold;
}
input::placeholder {
    text-align: right !important;
}
</style>
