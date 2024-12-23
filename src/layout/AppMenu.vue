<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import AppMenuItem from './AppMenuItem.vue';
const store = useStore();
const userType = computed(() => store.getters['auth/userType']);

const model = ref([
    {
        label: 'الرئيسية',
        items: [{ label: 'لوحة التحكم', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'KEEP SPACE خدمات',
        items: [
            { label: 'إدارة المنتجات', icon: 'pi pi-tags pi-id-tags', to: '/pages/products' },
            { label: 'إدارة التصنيفات', icon: 'pi pi-bars pi-id-bars', to: '/category-manager' },
            { label: 'إدارة المخزون', icon: 'pi pi-box pi-id-bars', to: '/inventory-manager' },
            { label: 'إدارة الفواتير', icon: 'pi pi-heart-fill pi-id-clipboard', to: '/disbursement-order' },
            { label: 'إدارة إستلام البضائع', icon: 'pi pi-heart-fill pi-id-clipboard', to: '/receipt-order' },
            { label: 'إدارة الموظفين', icon: 'pi pi-box pi-id-bars', to: '/employee-manager' }
        ]
    }
]);

const modelNormal = ref([
    {
        label: 'الرئيسية',
        items: [{ label: 'لوحة التحكم', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'KEEP SPACE خدمات',
        items: [
            { label: 'إدارة المنتجات', icon: 'pi pi-tags pi-id-tags', to: '/pages/products' },
            { label: 'إدارة التصنيفات', icon: 'pi pi-bars pi-id-bars', to: '/category-manager' },
            { label: 'إدارة المخزون', icon: 'pi pi-box pi-id-bars', to: '/inventory-manager' }
        ]
    }
]);

const modelAdmin = ref([
    {
        label: 'الرئيسية',
        items: [{ label: 'لوحة التحكم', icon: 'pi pi-fw pi-home', to: '/admin' }]
    },
    {
        label: 'KEEP SPACE خدمات',
        items: [
            { label: 'المخازن', icon: 'pi pi-box pi-id-box', to: '/stocks' },
            { label: 'إدارة المستخدمين', icon: 'pi pi-users pi-id-users', to: '/category-manager' }
        ]
    }
]);
</script>

<template>
    <ul v-if="userType === 'trader' || userType === 'staff'" class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
    <ul v-if="userType === 'normal'" class="layout-menu">
        <template v-for="(item, i) in modelNormal" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
    <ul v-if="userType === 'admin'" class="layout-menu">
        <template v-for="(item, i) in modelAdmin" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
