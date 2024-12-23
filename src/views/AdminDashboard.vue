<script setup>
import { useLayout } from '@/layout/composables/layout';
import { AdminService } from '@/service/AdminService';
import { onMounted, ref, watch } from 'vue';
const { getPrimary, getSurface, isDarkTheme } = useLayout();

const statistics = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);

onMounted(() => {
    AdminService.getStatistics().then((data) => (statistics.value = data));
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                type: 'bar',
                label: 'Subscriptions',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: [4000, 10000, 15000, 4000],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Advertising',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                data: [2100, 8400, 2400, 7500],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Affiliate',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                data: [4100, 5200, 3400, 7400],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                borderSkipped: true,
                barThickness: 32
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="grid grid-cols-2 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 bg-hover-container">
            <div class="card mb-0">
                <router-link to="/stocks">
                    <div class="flex justify-between mb-4">
                        <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-box text-cyan-500 !text-xl"></i>
                        </div>
                        <div>
                            <h1 class="mb-4">المخازن</h1>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl text-center">{{ statistics?.warehouses_count }}</div>
                        </div>
                        <span class="text-muted-color">العدد الإجمالي</span>
                    </div>
                </router-link>
                <!-- <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span> -->
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 bg-hover-container">
            <div class="card mb-0">
                <router-link to="/users-m">
                    <div class="flex justify-between mb-4">
                        <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-users text-cyan-500 !text-xl"></i>
                        </div>
                        <div>
                            <h1 class="mb-4">المستخدمين</h1>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl text-center">{{ statistics?.users_count }}</div>
                        </div>
                        <span class="text-muted-color">العدد الإجمالي</span>
                    </div>
                </router-link>
                <!-- <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span> -->
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 bg-hover-container">
            <div class="card mb-0">
                <router-link to="/stocks">
                    <div class="flex justify-between mb-4">
                        <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-shopping-bag text-cyan-500 !text-xl"></i>
                        </div>
                        <div>
                            <h1 class="mb-4">المنتجات</h1>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl text-center">{{ statistics?.product_count }}</div>
                        </div>
                        <span class="text-muted-color">العدد الإجمالي</span>
                    </div>
                </router-link>
                <!-- <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.card:hover {
    background-color: #c2ffc7;
}
.card {
    transition: 0.4s;
}

h1 {
    font-size: 2.5rem !important;
}
</style>
