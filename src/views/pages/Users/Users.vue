<script>
import apiClient from '@/plugins/axios';

export default {
    data() {
        return {
            users: [], // Raw user data fetched from API
            selectedUsers: [],
            filters: {
                global: { value: null } // Ensure this structure matches your binding
            },
            userDialog: false,
            user: {
                name: '',
                user_type: null,
                warehouses: []
            },
            userTypes: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }
            ],
            warehousesOptions: [], // Populate this with your warehouse options
            submitted: false
        };
    },

    computed: {
        processedUsers() {
            // Transform the raw user data to include a warehouse_names field
            return this.users.map((user) => ({
                ...user,
                warehouse_names: user.warehouses ? user.warehouses.map((warehouse) => warehouse.warehouse_name).join(', ') : 'No Warehouses'
            }));
        }
    },

    methods: {
        async fetchUsers() {
            try {
                const response = await apiClient.get('/get-users-with-warehouses');
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        openNewUser() {
            this.userDialog = true;
            this.user = { name: '', user_type: '', warehouses: [] };
            this.submitted = false;
        },
        hideDialog() {
            this.userDialog = false;
        },
        saveUser() {
            this.submitted = true;
            if (this.user.name && this.user.user_type && this.user.warehouses.length) {
                // Save logic here
                console.log('Saving user:', this.user);
                this.userDialog = false;
            }
        },
        editUser(user) {
            this.user = { ...user };
            this.userDialog = true;
        },
        confirmdeleteUser(user) {
            // Confirm delete logic here
            console.log('Deleting user:', user);
        },
        exportCSV(event) {
            // Export logic here
            console.log('Exporting CSV');
        }
    },
    mounted() {
        this.fetchUsers();
    }
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="أضف مستخدم جديد" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNewUser" />
                    <Button label="حذف" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                </template>

                <template #end>
                    <Button label="تصدير" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedUsers"
                :value="processedUsers"
                dataKey="user_id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="...البحث" />
                        </IconField>
                        <h4 class="m-0">إدارة المستخدمين</h4>
                    </div>
                </template>

                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmdeleteUser(slotProps.data)" />
                    </template>
                </Column>
                <Column field="name" header="الاسم" sortable style="min-width: 10rem; width: 15rem; text-align: right !important"></Column>
                <Column field="user_type" header="نوع المستخدم" sortable style="min-width: 10rem; width: 15rem; text-align: right !important"></Column>
                <Column field="warehouse_names" header="أسماء المخازن" style="min-width: 10rem">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.warehouse_names }}</span>
                    </template>
                </Column>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="إضافة مستخدم" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">اسم المستخدم</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus :invalid="submitted && !user.name" fluid />
                    <small v-if="submitted && !user.name" class="text-red-500">الاسم مطلوب.</small>
                </div>
                <div>
                    <label for="user_type" class="block font-bold mb-3">نوع المستخدم</label>
                    <Dropdown v-model="user.user_type" :options="userTypes" optionLabel="label" placeholder="اختر نوع المستخدم" />
                </div>
                <div>
                    <label for="warehouses" class="block font-bold mb-3">المخازن</label>
                    <MultiSelect v-model="user.warehouses" :options="warehousesOptions" optionLabel="warehouse_name" placeholder="اختر المخازن" />
                </div>
            </div>

            <template #footer>
                <Button label="إلغاء" icon="pi pi-times" text @click="hideDialog" />
                <Button label="حفظ" icon="pi pi-check" @click="saveUser" />
            </template>
        </Dialog>
    </div>
</template>
<style scoped>
.card {
    margin: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
}

.mb-6 {
    margin-bottom: 6px;
}

.mr-2 {
    margin-right: 2px;
}

.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.gap-6 {
    gap: 6px;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.text-red-500 {
    color: red;
}

.m-0 {
    margin: 0;
}

.p-button {
    margin-right: 8px;
}

.p-inputText {
    width: 100%;
}
</style>
