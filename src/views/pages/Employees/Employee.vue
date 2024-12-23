<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="إضافة موظف" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="حذف" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedStaff || !selectedStaff.length" />
                </template>

                <template #end>
                    <Button label="تصدير" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedStaff"
                :value="staff"
                dataKey="id"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} staff"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="globalFilter" placeholder="البحث عن موظف..." />
                        </IconField>
                        <h4 class="m-0">إدارة الموظفين</h4>
                    </div>
                </template>

                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editStaff(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteStaff(slotProps.data)" />
                    </template>
                </Column>

                <Column field="user.email" header="البريد الإلكتروني" sortable style="min-width: 15rem"></Column>
                <Column field="user.name" header="الاسم" sortable style="min-width: 10rem"></Column>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            </DataTable>
        </div>

        <!-- Add/Edit Staff Dialog -->
        <Dialog v-model:visible="staffDialog" :style="{ width: '450px' }" header="إضافة موظف" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">إسم الموظف</label>
                    <InputText id="name" v-model="staffForm.name" required="true" autofocus :invalid="submitted && !staffForm.name" fluid />
                    <small v-if="submitted && !staffForm.name" class="text-red-500">الاسم مطلوب</small>
                </div>

                <div>
                    <label for="email" class="block font-bold mb-3">البريد الإلكتروني</label>
                    <InputText id="email" v-model="staffForm.email" required="true" fluid />
                </div>

                <div>
                    <label for="username" class="block font-bold mb-3">اسم المستخدم</label>
                    <InputText id="username" v-model="staffForm.username" required="true" fluid />
                </div>

                <div>
                    <label for="password" class="block font-bold mb-3">كلمة المرور</label>
                    <Password v-model="staffForm.password" required="true" toggleMask />
                </div>
            </div>

            <template #footer>
                <Button label="إلغاء" icon="pi pi-times" text @click="hideDialog" />
                <Button label="حفظ" icon="pi pi-check" @click="saveStaff" />
            </template>
        </Dialog>

        <!-- Confirm Delete Dialog -->
        <Dialog v-model:visible="deleteStaffDialog" :style="{ width: '450px' }" header="تأكيد الحذف" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedStaff"
                    >هل أنت متأكد من حذف <b>{{ selectedStaff.name }}</b
                    >؟</span
                >
            </div>
            <template #footer>
                <Button label="لا" icon="pi pi-times" text @click="deleteStaffDialog = false" />
                <Button label="نعم" icon="pi pi-check" @click="deleteStaff" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import apiClient from '@/plugins/axios';
import { onMounted, ref } from 'vue';

export default {
    setup() {
        const staff = ref([]);
        const selectedStaff = ref([]);
        const globalFilter = ref('');
        const staffDialog = ref(false);
        const deleteStaffDialog = ref(false);
        const staffForm = ref({});
        const submitted = ref(false);

        const fetchStaff = async () => {
            const warehouseId = localStorage.getItem('warehouse_id');
            apiClient.defaults.headers.common['warehouse_id'] = warehouseId;
            try {
                const response = await apiClient.get('/warehouse-staff');
                staff.value = response.data;
            } catch (error) {
                console.error(error);
            }
        };

        const openNew = () => {
            staffForm.value = {};
            submitted.value = false;
            staffDialog.value = true;
        };

        const saveStaff = async () => {
            try {
                // Add warehouse_id from localStorage to the form data
                staffForm.value.warehouse_id = localStorage.getItem('warehouse_id');

                // Send the POST request
                await apiClient.post('/register-staff', staffForm.value);

                // Refresh the staff list and close the dialog
                fetchStaff();
                staffDialog.value = false;
            } catch (error) {
                console.error('Error saving staff:', error.response?.data || error.message);
            }
        };

        const deleteStaff = async () => {
            try {
                await apiClient.delete(`/warehouse-staff/${selectedStaff.value.id}`);
                fetchStaff();
                deleteStaffDialog.value = false;
            } catch (error) {
                console.error(error);
            }
        };

        const confirmDeleteStaff = (staffMember) => {
            selectedStaff.value = staffMember;
            deleteStaffDialog.value = true;
        };

        onMounted(fetchStaff);

        return {
            staff,
            selectedStaff,
            globalFilter,
            staffDialog,
            deleteStaffDialog,
            staffForm,
            submitted,
            openNew,
            saveStaff,
            deleteStaff,
            confirmDeleteStaff
        };
    }
};
</script>
