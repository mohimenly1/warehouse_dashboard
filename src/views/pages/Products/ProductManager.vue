<script setup>
import apiClient from '@/plugins/axios';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex'; // Import Vuex
const store = useStore(); // Get the Vuex store instance
const categories = ref([]); // Categories list

const userType = computed(() => store.getters['auth/userType']);
const storageRecord = ref({
    quantity: null,
    entry_date: null,
    expiry_date: null
});

// const statuses = ref([]); // Add your statuses

async function fetchProducts() {
    try {
        const data = await ProductService.getProducts();
        products.value = data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch products', life: 3000 });
    }
}

onMounted(() => {
    fetchProducts();
});

onMounted(() => {
    const user_id = store.getters['auth/userId']; // Retrieve user_id from Vuex store
    const warehouse_id = localStorage.getItem('warehouse_id');

    // Fetch categories with user_id
    apiClient
        .get(`/categories?warehouse_id=${warehouse_id}`)
        .then((response) => {
            categories.value = response.data.categories; // Assign fetched categories
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 });
        });
});
function onUpload() {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}
const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const productDialogUpdate = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'LYD' });
    return;
}

function openNew() {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
}

function saveProduct() {
    submitted.value = true;

    if (product?.value.name?.trim()) {
        const user_id = store.getters['auth/userId']; // Retrieve user_id from Vuex store
        const warehouse_id = localStorage.getItem('warehouse_id');
        const statusValue = product.value.status?.value;

        const formData = new FormData();
        formData.append('name', product.value.name);
        formData.append('description', product.value.description || '');
        formData.append('price', product.value.price || '');
        formData.append('category_id', product.value.category_id);
        formData.append('warehouse_id', warehouse_id);
        formData.append('is_long_term', product.value.is_long_term ? 1 : 0);
        formData.append('status', statusValue);
        formData.append('user_id', user_id);

        if (product.value.code) {
            formData.append('code', product.value.code);
        }
        if (product.value.image) {
            formData.append('image', product.value.image);
        }

        const apiCall = product.value.id
            ? apiClient.put(`/products/${product.value.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : apiClient.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        apiCall
            .then(() => {
                toast.add({ severity: 'success', summary: 'Successful', detail: product.value.id ? 'Product Updated' : 'Product Created', life: 3000 });
                productDialog.value = false;
                fetchProducts();
            })
            .catch((error) => {
                console.error(error);

                // Extract and display the error message from the backend
                const errorMessage = error.response?.data?.error || 'Failed to save product';
                toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
            });
    }
}

async function editProduct(prod) {
    const warehouse_id = localStorage.getItem('warehouse_id');

    if (!warehouse_id) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Warehouse ID is required', life: 3000 });
        return;
    }

    try {
        // Fetch product details along with the storage record from the API
        const response = await apiClient.get(`/products/${prod.id}?warehouse_id=${warehouse_id}`);

        // Extract product and storageRecord data
        const fetchedProduct = response.data.product;
        const storageRecordData = response.data;

        // Populate the product object with the fetched product data
        product.value = { ...fetchedProduct };

        // Update storageRecord with the received data
        storageRecord.value = {
            quantity: storageRecordData.quantity,
            entry_date: storageRecordData.entry_date,
            expiry_date: storageRecordData.expiry_date
        };

        // alert(JSON.stringify(storageRecord.value)); // Debugging storageRecord

        productDialogUpdate.value = true;
    } catch (error) {
        console.error('Error fetching product details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch product details', life: 3000 });
    }
}

async function updateProduct() {
    const warehouse_id = localStorage.getItem('warehouse_id');

    if (!warehouse_id) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Warehouse ID is required', life: 3000 });
        return;
    }

    try {
        const payload = {
            name: product.value.name,
            description: product.value.description,
            price: product.value.price,
            wholesale_price: product.value.wholesale_price,
            category_id: product.value.category_id,
            warehouse_id: warehouse_id,
            quantity: storageRecord.value.quantity,
            entry_date: storageRecord.value.entry_date,
            expiry_date: storageRecord.value.expiry_date
        };

        const response = await apiClient.put(`/products/${product.value.id}`, payload);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully', life: 3000 });

        productDialogUpdate.value = false; // Close the dialog after update
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error('Error updating product:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message || error.response.data.error, life: 3000 });
    }
}

function confirmDeleteProduct(prod) {
    product.value = prod;
    deleteProductDialog.value = true;
}

function deleteProduct() {
    apiClient
        .delete(`/products/${product.value.id}`)
        .then(() => {
            // Remove the product from the local list
            products.value = products.value.filter((val) => val.id !== product.value.id);
            deleteProductDialog.value = false;
            product.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.error || 'Failed to delete product';
            toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
        });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
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

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'instock':
            return 'success';

        case 'lowstock':
            return 'warn';

        case 'outofstock':
            return 'danger';

        default:
            return null;
    }
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="أضف منتج جديد" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="حذف" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <Button label="تصدير" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="products"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="...البحث" />
                        </IconField>
                        <h4 class="m-0">إدارة المنتجات</h4>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="code" header="كود المنتج" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="إسم المنتج" sortable style="min-width: 16rem"></Column>
                <Column header="صورة المنتج">
                    <template #body="slotProps">
                        <img :src="`http://127.0.0.1:8000/storage/${slotProps.data.image}`" :alt="slotProps.data.name" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column v-if="!userType === 'normal' || userType === 'staff' || userType === 'trader'" field="price" header="سعر المنتج" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="category.name" header="التصنيف" sortable style="min-width: 10rem"></Column>

                <Column field="status" header="حالة المخزون" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="تفاصيل المنتج" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">إسم المنتج</label>
                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">الوصف</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="code" class="block font-bold mb-3">Code</label>
                    <InputText id="code" v-model="product.code" required />
                </div>
                <div class="col-span-full lg:col-span-6">
                    <div class="card">
                        <div class="font-semibold text-right text-xl mb-4">صورة للمنتج</div>
                        <input type="file" id="image" @change="(e) => (product.image = e.target.files[0])" accept="image/*" />
                    </div>
                </div>
                <div>
                    <label for="inventoryStatus" class="block font-bold mb-3">حالة المخزون</label>
                    <Select id="inventoryStatus" v-model="product.status" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>

                <div>
                    <span class="block font-bold mb-4 text-right">التصنيف</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="category in categories" :key="category.id" class="flex items-center gap-2 col-span-6">
                            <RadioButton :id="`category${category.id}`" v-model="product.category_id" :name="`category`" :value="category.id" />
                            <label :for="`category${category.id}`">{{ category.name }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="userType === 'trader' || userType === 'stuff'" class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">السعر</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="LYD" locale="en-US" fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="إلغاء العملية" icon="pi pi-times" text @click="hideDialog" />
                <Button label="حفظ" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="productDialogUpdate" :style="{ width: '450px' }" header="تعديل المنتج" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="product.image" :alt="product.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">إسم المنتج</label>
                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">الوصف</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="code" class="block font-bold mb-3">Code</label>
                    <InputText id="code" v-model="product.code" required />
                </div>
                <div>
                    <label for="quantity" class="block font-bold mb-3">الكمية</label>
                    <InputNumber id="quantity" v-model="storageRecord.quantity" fluid />
                </div>
                <div>
                    <label for="entryDate" class="block font-bold mb-3">تاريخ الدخول</label>
                    <InputText id="entryDate" v-model="storageRecord.entry_date" type="date" fluid />
                </div>
                <div>
                    <label for="expiryDate" class="block font-bold mb-3">تاريخ الانتهاء</label>
                    <InputText id="expiryDate" v-model="storageRecord.expiry_date" type="date" fluid />
                </div>
                <div class="col-span-full lg:col-span-6">
                    <div class="card">
                        <div class="font-semibold text-right text-xl mb-4">صورة للمنتج</div>
                        <input type="file" id="image" @change="(e) => (product.image = e.target.files[0])" accept="image/*" />
                    </div>
                </div>
                <div>
                    <label for="inventoryStatus" class="block font-bold mb-3">حالة المخزون</label>
                    <Select id="inventoryStatus" v-model="product.status" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>
            </div>

            <template #footer>
                <Button label="إلغاء العملية" icon="pi pi-times" text @click="hideDialog" />
                <Button label="حفظ" icon="pi pi-check" @click="updateProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >Are you sure you want to delete <b>{{ product.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
<style scoped>
label {
    text-align: right !important;
}
</style>
