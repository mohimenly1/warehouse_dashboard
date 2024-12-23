<template>
    <div>
        <!-- Main Warehouse DataTable -->
        <DataTable v-if="warehouses" :value="warehouses" :selection="selectedWarehouses" selectionMode="multiple" dataKey="id" responsiveLayout="scroll" class="p-datatable-gridlines">
            <Column field="limits.max_quantity" header="الحد الأقصى للكمية"></Column>
            <Column field="limits.max_products" header="الحد الأقصى للمنتجات"></Column>

            <!-- Limitation Column -->

            <Column field="location" header="الموقع"></Column>
            <Column field="user.name" header="المستخدمين"></Column>

            <Column field="total_quantity" header="إجمالي كمية المنتجات"></Column>

            <Column field="product_count" header="المنتجات في المخزون">
                <template #body="slotProps">
                    <span class="product-count" @click="showProducts(slotProps.data)" style="cursor: pointer; color: blue; text-decoration: underline">
                        {{ slotProps.data.product_count }}
                    </span>
                </template>
            </Column>
            <Column field="total_products" header="إجمالي المنتجات"></Column>
            <Column field="name" header="إسم المخزن"></Column>
            <Column header="الإعدادات">
                <template #body="slotProps">
                    <Button icon="pi pi-cog" class="p-button-rounded p-button-text" @click="setLimitations(slotProps.data)" />
                </template>
            </Column>
            <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
            <!-- New column -->
        </DataTable>

        <!-- Dialog for Product Details -->
        <Dialog v-model:visible="dialogVisible" header="Products in Warehouse" :modal="true" :closable="true" :style="{ width: '70vw' }">
            <DataTable v-if="selectedWarehouseProducts" :value="selectedWarehouseProducts" responsiveLayout="scroll" class="p-datatable-gridlines">
                <Column field="product.name" header="Product Name"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column field="entry_date" header="Entry Date"></Column>
                <Column field="expiry_date" header="Expiry Date"></Column>
            </DataTable>
            <p v-else>No products found.</p>
        </Dialog>

        <!-- Set Limitations Dialog -->
        <Dialog v-model:visible="dialogVisibleLimit" header="تحديد الحد الأقصى" :modal="true" :style="{ width: '30vw' }">
            <form @submit.prevent="submitLimitations">
                <div>
                    <label for="max_products">الحد الأقصى للمنتجات:</label>
                    <InputText v-model="limitsForm.max_products" id="max_products" />
                </div>
                <div>
                    <label for="max_quantity">الحد الأقصى للكمية:</label>
                    <InputText v-model="limitsForm.max_quantity" id="max_quantity" />
                </div>
                <Button label="حفظ" type="submit" />
            </form>
        </Dialog>
    </div>
</template>
<script>
import apiClient from '@/plugins/axios';
import { onMounted, ref } from 'vue';

export default {
    name: 'Stocks',
    setup() {
        const warehouses = ref([]);
        const selectedWarehouses = ref([]);
        const dialogVisible = ref(false);
        const dialogVisibleLimit = ref(false);
        const currentWarehouse = ref(null);
        const selectedWarehouseProducts = ref(null);
        const limitsForm = ref({
            max_products: 0,
            max_quantity: 0
        });
        const showProducts = (warehouse) => {
            selectedWarehouseProducts.value = warehouse.storage_records;
            dialogVisible.value = true;
        };

        // Open dialog to set limitations
        const setLimitations = (warehouse) => {
            currentWarehouse.value = warehouse;
            limitsForm.value = {
                max_products: warehouse.limits?.max_products || 0,
                max_quantity: warehouse.limits?.max_quantity || 0
            };
            dialogVisibleLimit.value = true;
        };

        // Submit limitations
        const submitLimitations = async () => {
            try {
                await apiClient.post(`/warehouses/${currentWarehouse.value.id}/set-limitations`, limitsForm.value);
                dialogVisible.value = false;
                onMounted(async () => {
                    try {
                        const response = await apiClient.get('/info-warehouses');
                        warehouses.value = response.data;
                    } catch (error) {
                        console.error('Error fetching warehouses:', error);
                    }
                });
            } catch (error) {
                console.error('Failed to set limitations:', error);
            }
        };

        onMounted(async () => {
            try {
                const response = await apiClient.get('/info-warehouses');
                warehouses.value = response.data;
            } catch (error) {
                console.error('Error fetching warehouses:', error);
            }
        });

        return {
            warehouses,
            selectedWarehouses,
            dialogVisible,
            dialogVisibleLimit,
            selectedWarehouseProducts,
            showProducts,
            setLimitations,
            limitsForm,
            submitLimitations
        };
    }
};
</script>
