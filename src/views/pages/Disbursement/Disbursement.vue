<template>
    <div>
        <!-- Add Order Button -->
        <div class="card">
            <Toolbar class="mb-6">
                <template #end>
                    <Button label="اضف اصال صرف" icon="pi pi-plus" @click="showDialog = true" class="p-mb-3" />
                </template>
            </Toolbar>

            <DataTable :value="orders" responsiveLayout="scroll" class="p-datatable-sm">
                <Column field="id" header="رقم الفاتورة" />
                <Column field="recipient_name" header="اسم المستلم" />
                <Column field="warehouse_name" header="المخزن" />
                <Column field="total_cost" header="اجمالي التكلفة" />
                <Column header="العناصر">
                    <template #body="slotProps">
                        <DataTable :value="slotProps.data.items" responsiveLayout="scroll" class="p-datatable-sm">
                            <Column field="product.name" header="اسم المنتج" />
                            <Column field="quantity_disbursed" header="الكمية" />
                            <Column field="product_cost" header="السعر" />
                        </DataTable>
                    </template>
                </Column>
                <Column header="الاجراء">
                    <template #body="slotProps">
                        <Button label="طباعة" icon="pi pi-print" class="p-button-text" @click="printOrder(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Add Disbursement Order Dialog -->
        <Dialog header="اضافة اصال صرف" :visible.sync="showDialog" :modal="true" :closable="true" class="p-fluid">
            <div class="p-mb-3">
                <label for="recipient_name">Recipient Name:</label>
                <InputText id="recipient_name" v-model="order.recipient_name" placeholder="Enter recipient name" />
            </div>
            <div class="p-mb-3">
                <label for="department">Department:</label>
                <InputText id="department" v-model="order.department" placeholder="Enter department name" />
            </div>
            <div class="p-mb-3">
                <label for="reason">Reason:</label>
                <InputText id="reason" v-model="order.disbursement_reason" placeholder="Enter reason for disbursement" />
            </div>
            <div class="p-mb-3">
                <label for="warehouse_name">Warehouse:</label>
                <InputText id="warehouse_name" v-model="warehouseName" disabled />
            </div>
            <div class="p-mb-3">
                <label for="priceType">Price Type:</label>
                <Dropdown id="priceType" v-model="priceType" :options="priceOptions" optionLabel="label" optionValue="value" placeholder="Select price type" />
            </div>

            <!-- Product Selection Table -->
            <h4 class="p-mb-3">Select Products</h4>
            <DataTable :value="filteredProducts" :paginator="true" :rows="5" class="p-datatable-sm p-datatable-gridlines">
                <Column field="name" header="Product Name" style="min-width: 200px" />
                <Column field="code" header="Product Code" style="min-width: 150px" />
                <Column field="available_quantity" header="Available Quantity" style="min-width: 150px" />
                <Column header="Select">
                    <template #body="slotProps">
                        <Checkbox v-model="selectedProducts" :value="slotProps.data" />
                    </template>
                </Column>
                <Column header="Quantity">
                    <template #body="slotProps">
                        <InputNumber v-model="slotProps.data.disburse_quantity" :max="slotProps.data.quantity" min="0" class="p-inputtext-sm" />
                    </template>
                </Column>
            </DataTable>

            <!-- Dialog Actions -->
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="resetFormAndClose" />
                <Button label="Submit" icon="pi pi-check" :disabled="!isFormValid" @click="submitDisbursement" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import apiClient from '@/plugins/axios';
export default {
    data() {
        return {
            priceType: 'price', // Default to 'price'
            priceOptions: [
                { label: 'Retail Price', value: 'price' },
                { label: 'Wholesale Price', value: 'wholesale_price' }
            ],
            showDialog: false,
            warehouseId: localStorage.getItem('warehouse_id') || null,
            warehouseName: localStorage.getItem('warehouse_name') || '',
            products: [],
            orders: [],
            searchTerm: '',
            selectedProducts: [],
            order: {
                recipient_name: '',
                department: '',
                disbursement_reason: '',
                items: []
            }
        };
    },
    computed: {
        // Filter products based on search
        filteredProducts() {
            return this.products.filter((product) => product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || product.code.toLowerCase().includes(this.searchTerm.toLowerCase()));
        },
        isFormValid() {
            return this.order.recipient_name && this.selectedProducts.length > 0 && this.selectedProducts.some((product) => product.disburse_quantity > 0);
        }
    },
    methods: {
        async fetchProducts() {
            if (this.warehouseId) {
                try {
                    const response = await apiClient.get(`/products-warehouse?id=${this.warehouseId}`);
                    this.products = response.data.map((product) => ({ ...product, disburse_quantity: 0 }));
                } catch (error) {
                    console.error('Failed to fetch products', error);
                }
            }
        },
        async fetchOrders() {
            try {
                const warehouseId = localStorage.getItem('warehouse_id'); // Get warehouse_id from local storage
                const response = await apiClient.get('/disbursement-orders', {
                    params: { warehouse_id: warehouseId } // Pass warehouse_id as a query parameter
                });
                this.orders = response.data;
            } catch (error) {
                console.error('Failed to fetch orders', error);
            }
        },

        async submitDisbursement() {
            const disbursedItems = this.selectedProducts
                .filter((product) => product.disburse_quantity > 0)
                .map((product) => ({
                    product_id: product.id,
                    quantity_disbursed: product.disburse_quantity
                }));

            const payload = {
                ...this.order,
                warehouse_id: this.warehouseId,
                warehouse_name: this.warehouseName,
                price_type: this.priceType, // Include price type
                items: disbursedItems
            };

            try {
                const response = await apiClient.post('/disbursement', payload);
                console.log('Disbursement created:', response.data);
                this.resetFormAndClose();
                this.fetchOrders();
            } catch (error) {
                console.error('Error creating disbursement', error);
            }
        },
        resetFormAndClose() {
            this.showDialog = false;
            this.resetForm();
        },
        resetForm() {
            this.order = { recipient_name: '', department: '', disbursement_reason: '', items: [] };
            this.products.forEach((product) => (product.disburse_quantity = 0));
            this.selectedProducts = [];
        },
        printOrder(order) {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');

            // Create the HTML content
            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>فاتورة صرف</title>
            <style>
                @font-face {
                    font-family: 'TajawalBold';
                    src: url('/public/TajawalBold.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                body {
                    font-family: 'TajawalBold', Arial, sans-serif;
                    margin: 20px;
                    direction: rtl;
                    text-align: right;
                }
                header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                header img {
                    width: 100px;
                    height: auto;
                }
                header h2 {
                    margin: 0;
                }
                .order-details {
                    margin-bottom: 20px;
                }
                .order-details table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .order-details th, .order-details td {
                    padding: 8px;
                    text-align: right;
                    border: 1px solid #ccc;
                }
                .order-details th {
                    background-color: #f5f5f5;
                }
                .product-table table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .product-table th, .product-table td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: right;
                }
                .product-table th {
                    background-color: #f5f5f5;
                }
            </style>
        </head>
        <body>
            <header>
                <img style="width:250px;height:250px;" src="/public/demo/images/logo.png" alt="Company Logo" />
                <h2>فاتورة صرف</h2>
                <p>تاريخ: ${new Date().toLocaleString()}</p>
            </header>

            <section class="order-details">
                <h3>تفاصيل الفاتورة</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>رقم الطلب</th>
                            <td>${order.id}</td>
                        </tr>
                        <tr>
                            <th>اسم المستلم</th>
                            <td>${order.recipient_name}</td>
                        </tr>
                        <tr>
                            <th>اسم المخزن</th>
                            <td>${order.warehouse_name}</td>
                        </tr>
                        <tr>
                            <th>اجمالي التكلفة</th>
                            <td>$${Number(order.total_cost || 0).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="product-table">
                <h3>العناصر</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>اسم العنصر</th>
                            <th>الكمية</th>
                            <th>التكلفة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items
                            .map(
                                (item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.product.name}</td>
                                    <td>${item.quantity_disbursed}</td>
                                    <td>$${Number(item.product_cost || 0).toFixed(2)}</td>
                                </tr>
                            `
                            )
                            .join('')}
                    </tbody>
                </table>
            </section>
        </body>
        </html>
    `;

            // Write the content and print
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Trigger the print function
            printWindow.print();

            // Optional: Close the print window after printing
            printWindow.onafterprint = () => {
                printWindow.close();
            };
        }
    },
    mounted() {
        this.fetchProducts();
        this.fetchOrders();
    }
};
</script>

<style>
.p-datatable-sm {
    font-size: 0.875rem;
}
</style>
