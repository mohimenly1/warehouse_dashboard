<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
// Access the Vuex store
const store = useStore();

// Retrieve the user's name from the Vuex store
const userName = computed(() => store.getters['auth/userName']);
const userType = computed(() => store.getters['auth/userType']);

function logout() {
    console.log('Logging out...');

    // Clear user data from Vuex and local storage
    store.commit('auth/CLEAR_AUTH_DATA');

    // Redirect to login page
    router.push({ name: 'login' }); // Make sure the login route is correctly named
}
console.log(userType);
const nestedMenuitems = ref([
    {
        label: 'العملاء',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Customer',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicate',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'الطلبات',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'View',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'الشحنات',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Tracker',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Map',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Manage',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: userName.value || 'إسم المستخدم هنا', // Dynamically display user name
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'الإعدادات',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'معلومات مخزني',
                icon: 'pi pi-fw pi-file'
            }
        ]
    },
    {
        label: 'تسجيل الخروج',
        icon: 'pi pi-fw pi-sign-out',
        command: logout // Function for 'تسجيل الخروج'
    }
]);

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const nestedMenuitemsAdmin = ref([
    {
        label: userName.value || 'إسم المستخدم هنا', // Dynamically display user name
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'الإعدادات',
                icon: 'pi pi-fw pi-cog'
            }
        ]
    },
    {
        label: 'تسجيل الخروج',
        icon: 'pi pi-fw pi-sign-out',
        command: logout // Function for 'تسجيل الخروج'
    }
]);
</script>

<template>
    <div style="justify-content: space-around" class="layout-topbar">
        <Menubar v-if="userType === 'admin'" :model="nestedMenuitemsAdmin">
            <template #end>
                <p style="color: #00ff9c">KEEP SPACE</p>
            </template>
        </Menubar>
        <Menubar v-else :model="nestedMenuitems">
            <template #end>
                <p style="color: #00ff9c">KEEP SPACE</p>
            </template>
        </Menubar>
    </div>
</template>
