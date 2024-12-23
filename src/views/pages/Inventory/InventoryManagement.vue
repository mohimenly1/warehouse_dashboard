<script setup>
import { InventoryService } from '@/service/InventoryService';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex'; // Import Vuex
const store = useStore(); // Get the Vuex store instance
const toast = useToast();
const dt = ref();
const inventories = ref();
const products = ref([]);
const inventoryDialog = ref(false);
const deleteinventoryDialog = ref(false);
const deleteinventoriesDialog = ref(false);
const inventory = ref({
    product_id: null,
    quantity: null,
    entry_date: null,
    expiry_date: null
});

const selectedinventories = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const fetchProducts = async () => {
    try {
        products.value = await ProductService.getProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
};

// Fetch products when the dialog opens
onMounted(() => {
    fetchProducts();
});

onMounted(async () => {
    const warehouse_id = localStorage.getItem('warehouse_id');
    try {
        inventories.value = await InventoryService.fetchInventories(warehouse_id);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch inventories',
            life: 3000
        });
    }
});

const submitted = ref(false);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'LYD' });
    return;
}

function openNew() {
    inventory.value = {};
    submitted.value = false;
    inventoryDialog.value = true;
}

function hideDialog() {
    inventoryDialog.value = false;
    submitted.value = false;
}

function formatDateToMySQL(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const saveInventory = async () => {
    const warehouse_id = localStorage.getItem('warehouse_id');
    if (inventory.value.product_id && inventory.value.quantity && inventory.value.entry_date) {
        const payload = {
            product_id: inventory.value.product_id.id, // Extract the id
            quantity: inventory.value.quantity,
            entry_date: formatDateToMySQL(inventory.value.entry_date), // Format the entry date
            expiry_date: inventory.value.expiry_date
                ? formatDateToMySQL(inventory.value.expiry_date) // Format the expiry date if it exists
                : null,
            warehouse_id
        };
        try {
            await InventoryService.createInventory(payload);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Inventory added successfully',
                life: 3000
            });
            inventoryDialog.value = false;
            inventories.value = await InventoryService.fetchInventories(warehouse_id);
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add inventory',
                life: 3000
            });
        }
    } else {
        toast.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'Please fill out all required fields',
            life: 3000
        });
    }
};

function editInventory(inven) {
    inventory.value = { ...inven };
    inventoryDialog.value = true;
}

function confirmdeleteInventory(inven) {
    inventory.value = inven;
    deleteinventoryDialog.value = true;
}

function deleteInventory() {
    inventories.value = inventories.value.filter((val) => val.id !== inventory.value.id);
    deleteinventoryDialog.value = false;
    inventory.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'inventory Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < inventories.value.length; i++) {
        if (inventories.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function deleteselectedinventories() {
    inventories.value = inventories.value.filter((val) => !selectedinventories.value.includes(val));
    deleteinventoriesDialog.value = false;
    selectedinventories.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'inventory Deleted', life: 3000 });
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="إدرج منتجاً للمخزن" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="حذف" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedinventories || !selectedinventories.length" />
                </template>

                <template #end>
                    <Button label="تصدير" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="inventories" dataKey="id" :paginator="true" :rows="10" :filters="filters" :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} inventories">
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters.global.value" placeholder="Search Inventory..." />
                        </span>
                        <h4>إدارة المخزون</h4>
                    </div>
                </template>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmdeleteInventory(slotProps.data)" />
                    </template>
                </Column>
                <Column field="expiry_date" header="تاريخ الإنتهاء" />
                <Column field="entry_date" header="تاريخ الإنتاج" />
                <Column field="quantity" header="الكمية" />
                <Column field="price" header="السعر" />
                <Column field="wholesale_price" header="السعر بالجملة" />
                <Column field="product_name" header="إسم المنتج" />
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="inventoryDialog" header="Add Inventory" :modal="true" :style="{ width: '50vw' }">
            <div class="formgrid grid">
                <div class="field col-12">
                    <label for="product_id">Product</label>
                    <Select v-model="inventory.product_id" :options="products" filter optionLabel="name" placeholder="Select a Product" class="w-full">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <span>{{ slotProps.value.name }}</span>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="field col-12">
                    <label for="quantity">Quantity</label>
                    <InputNumber id="quantity" v-model="inventory.quantity" />
                </div>
                <div class="field col-12">
                    <label for="entry_date">Entry Date</label>
                    <Calendar id="entry_date" v-model="inventory.entry_date" placeholder="Select Entry Date" />
                </div>
                <div class="field col-12">
                    <label for="expiry_date">Expiry Date (Optional)</label>
                    <Calendar id="expiry_date" v-model="inventory.expiry_date" placeholder="Select Expiry Date" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveInventory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteinventoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="inventory"
                    >Are you sure you want to delete <b>{{ inventory.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteinventoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteInventory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteinventoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="inventory">Are you sure you want to delete the selected inventories?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteinventoriesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteselectedinventories" />
            </template>
        </Dialog>
    </div>
</template>
<style scoped>
label {
    text-align: right !important;
}
.p-datatable-column-header-content {
    display: none !important;
    text-align: right !important;
}
</style>
