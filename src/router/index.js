import AppLayout from '@/layout/AppLayout.vue';
import store from '@/store'; // Import the Vuex store
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/dashboard',
            component: AppLayout,

            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/admin',
                    name: 'AdminDashboard',
                    component: () => import('@/views/AdminDashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/stocks',
                    name: 'Stocks',
                    component: () => import('@/views/pages/Stocks/Stocks.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/employee-manager',
                    name: 'Employees',
                    component: () => import('@/views/pages/Employees/Employee.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/users-m',
                    name: 'Users',
                    component: () => import('@/views/pages/Users/Users.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/disbursement-order',
                    name: 'Disbursement',
                    component: () => import('@/views/pages/Disbursement/Disbursement.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/receipt-order',
                    name: 'ReceiptOrder',
                    component: () => import('@/views/pages/ReceiptOrder/ReceiptOrder.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/pages/products',
                    name: 'crud',
                    component: () => import('@/views/pages/Products/ProductManager.vue')
                },
                {
                    path: '/home-page',
                    name: 'HomePage',
                    component: () => import('@/views/pages/auth/LandingPage.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/category-manager',
                    name: 'category-manager',
                    component: () => import('@/views/pages/Category/CategoryManager.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/inventory-manager',
                    name: 'inventory-manager',
                    component: () => import('@/views/pages/Inventory/InventoryManagement.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/',
            redirect: '/landing' // Redirect to landing as the main page
        },
        {
            path: '/warehouse-info',
            name: 'warehouseInfo',
            component: () => import('@/views/pages/WarehouseInfo.vue'),
            meta: { requiresAuth: true }
        },

        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/join',
            name: 'Register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
    console.log('Navigating to:', to.name);
    console.log('Auth Status:', store.getters['auth/isAuthenticated']);
    console.log('Auth Token:', store.state.auth.authToken);

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!store.getters['auth/isAuthenticated']) {
            console.log('Not authenticated, redirecting to login');
            next({ name: 'login' });
        } else {
            const userType = store.getters['auth/userType']; // Use the userType getter

            // Redirect to AdminDashboard only on login redirect
            if (to.query.loginRedirect && userType === 'admin') {
                console.log('Redirecting admin to AdminDashboard on login');
                next({ name: 'AdminDashboard' });
            } else if (userType !== 'admin' && to.name === 'AdminDashboard') {
                console.log('Non-admin user trying to access AdminDashboard, redirecting to dashboard');
                next({ name: 'dashboard' });
            } else {
                console.log('Authenticated, proceeding to route');
                next();
            }
        }
    } else if ((to.name === 'login' || to.name === 'Register') && store.getters['auth/isAuthenticated']) {
        console.log('Already authenticated, redirecting to dashboard');
        const userType = store.getters['auth/userType'];
        next(userType === 'admin' ? { name: 'AdminDashboard' } : { name: 'dashboard' });
    } else {
        next();
    }
});

export default router;
