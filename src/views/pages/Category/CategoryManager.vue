<script setup>
import apiClient from '@/plugins/axios';
import { CategoryService } from '@/service/CategoryService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex'; // Import Vuex
const store = useStore(); // Get the Vuex store instance
onMounted(async () => {
    try {
        // const userId = store.getters['auth/userId']; // Get user_id from Vuex
        const warehouse_id = localStorage.getItem('warehouse_id');
        categories.value = await CategoryService.fetchCategories(warehouse_id);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 });
    }
});

const toast = useToast();
const dt = ref();
const categories = ref();
const categoryDialog = ref(false);
const deletecategoryDialog = ref(false);
const deleteCategoriesDialog = ref(false);
const category = ref({});
const selectedCategories = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'LYD' });
    return;
}

function openNew() {
    category.value = {};
    submitted.value = false;
    categoryDialog.value = true;
}

function hideDialog() {
    categoryDialog.value = false;
    submitted.value = false;
}

function saveCategory() {
    submitted.value = true;

    if (category?.value.name?.trim()) {
        const userId = store.getters['auth/userId']; // Retrieve user_id from Vuex store
        const warehouse_id = localStorage.getItem('warehouse_id');
        const payload = {
            ...category.value,
            warehouse_id: warehouse_id,
            user_id: userId
        };

        if (category.value.id) {
            // Update logic
            apiClient
                .put(`/categories/${category.value.id}`, payload)
                .then(async () => {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
                    categoryDialog.value = false;
                    // Reload categories
                    categories.value = await CategoryService.fetchCategories(warehouse_id);
                })
                .catch((error) => {
                    console.error(error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category', life: 3000 });
                });
        } else {
            // Create logic
            CategoryService.createCategory(payload)
                .then(async () => {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
                    categoryDialog.value = false;
                    // Reload categories
                    categories.value = await CategoryService.fetchCategories(warehouse_id);
                })
                .catch((error) => {
                    console.error(error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category', life: 3000 });
                });
        }
    }
}

function editCategory(categ) {
    category.value = { ...categ };
    categoryDialog.value = true;
}

function confirmdeleteCategory(categ) {
    category.value = categ;
    deletecategoryDialog.value = true;
}

function deleteCategory() {
    categories.value = categories.value.filter((val) => val.id !== category.value.id);
    deletecategoryDialog.value = false;
    category.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'category Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < categories.value.length; i++) {
        if (categories.value[i].id === id) {
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
    deleteCategoriesDialog.value = true;
}

function deleteselectedCategories() {
    categories.value = categories.value.filter((val) => !selectedCategories.value.includes(val));
    deleteCategoriesDialog.value = false;
    selectedCategories.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'category Deleted', life: 3000 });
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="أضف تصنيف جديد" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="حذف" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedCategories || !selectedCategories.length" />
                </template>

                <template #end>
                    <Button label="تصدير" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedCategories"
                :value="categories"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="...البحث" />
                        </IconField>
                        <h4 class="m-0">إدارة التصنيفات</h4>
                    </div>
                </template>

                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmdeleteCategory(slotProps.data)" />
                    </template>
                </Column>
                <Column field="name" header="التصنيف" sortable style="min-width: 10rem; width: 15rem; text-align: right !important"></Column>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="اضافة تصنيف" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">إسم التصنيف</label>
                    <InputText id="name" v-model.trim="category.name" required="true" autofocus :invalid="submitted && !category.name" fluid />
                    <small v-if="submitted && !category.name" class="text-red-500">Name is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="إلغاء العملية" icon="pi pi-times" text @click="hideDialog" />
                <Button label="حفظ" icon="pi pi-check" @click="saveCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deletecategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="category"
                    >Are you sure you want to delete <b>{{ category.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deletecategoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="category">Are you sure you want to delete the selected categories?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoriesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteselectedCategories" />
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
