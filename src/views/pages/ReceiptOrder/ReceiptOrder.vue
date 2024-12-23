<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #end>
                    <Button label="أضف اصال استلام" icon="pi pi-plus" @click="openDialog" />
                </template>
            </Toolbar>
            <!-- Trigger Dialog -->
            <DataTable :value="receiptOrders" :lazy="true" :paginator="true" :rows="10" :totalRecords="totalRecords" @lazy-load="loadData">
                <Column field="order_number" header="رقم الطلبية"></Column>
                <Column field="supplier_name" header="اسم المورد"></Column>
                <Column field="warehouse_name" header="اسم المخزن"></Column>
                <Column field="receipt_date" header="تاريخ الفاتورة"></Column>
                <Column field="notes" header="ملاحظات"></Column>
                <Column header="العناصر">
                    <template #body="slotProps">
                        <ul>
                            <li v-for="item in slotProps.data.items" :key="item.id">{{ item.product.name }} ({{ item.quantity_received }})</li>
                        </ul>
                    </template>
                </Column>
                <Column header="طباعة">
                    <template #body="slotProps">
                        <button @click="printReceiptOrder(slotProps.data)">طباعة</button>
                    </template>
                </Column>
            </DataTable>

            <!-- Receipt Order Dialog -->
            <Dialog header="انشاء ايصال استلام" v-model:visible="isDialogVisible" :style="{ width: '70vw' }" modal>
                <form @submit.prevent="submitForm">
                    <!-- General Info Section -->
                    <h4>معلومات المورد</h4>
                    <div class="grid-container">
                        <div class="form-group">
                            <label>عنوان المورد</label>
                            <InputText v-model="form.supplier_address" class="p-inputtext p-component" required />
                        </div>
                        <div class="form-group">
                            <label>إسم المورد</label>
                            <InputText v-model="form.supplier_name" class="p-inputtext p-component" required />
                        </div>
                        <div class="form-group full-width">
                            <label>ملاحظات</label>
                            <Textarea v-model="form.notes" class="p-textarea p-component" />
                        </div>
                    </div>

                    <hr style="border: 3px solid green; margin-top: 10px" />
                    <!-- Dynamic Product Input Section -->
                    <h1 style="font-size: x-large; margin-top: 10px" class="text-center">العناصر التي تم توريدها</h1>

                    <hr style="border: 3px solid green; margin-top: 10px; margin-bottom: 10px" />
                    <div v-for="(item, index) in form.items" :key="item.id" class="product-grid">
                        <div class="form-group">
                            <label>نوع العنصر</label>
                            <Dropdown v-model="item.product_type" :options="productTypeOptions" class="p-component" />
                        </div>
                        <div class="form-group">
                            <label>الكمية المستلمة</label>
                            <InputNumber v-model="item.quantity_received" class="p-inputtext p-component" />
                        </div>
                        <div class="form-group">
                            <label>اسم العنصر</label>
                            <InputText v-model="item.product_name" class="p-inputtext p-component" />
                        </div>
                        <div class="form-group">
                            <label>سعر الجملة</label>
                            <InputNumber v-model="item.wholesale_price" class="p-inputtext p-component" />
                        </div>
                        <div class="form-group">
                            <label>سعر التجزئة</label>
                            <InputNumber v-model="item.retail_price" class="p-inputtext p-component" />
                        </div>
                        <div class="form-group">
                            <label>رقم الدفعة</label>
                            <InputText v-model="item.batch_number" class="p-inputtext p-component" />
                        </div>
                        <div class="form-group">
                            <label>تاريخ الانتهاء</label>
                            <InputText v-model="item.expiration_date" class="p-inputtext p-component" />
                        </div>
                        <!-- Here should be the category selector -->
                        <div class="form-group">
                            <label>التصنيف</label>
                            <Dropdown v-model="item.category_id" :options="categories" option-label="name" option-value="id" class="p-component" />
                        </div>
                        <div class="form-group button-group">
                            <Button icon="pi pi-trash" class="p-button-rounded" @click="removeItem(index)" v-if="form.items.length > 1" />
                        </div>
                    </div>
                    <Button label="أضف عنصر" icon="pi pi-plus" @click="addItem" class="add-product-btn" />

                    <!-- Submission -->
                    <div class="form-buttons">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDialog" />
                        <Button label="Submit" icon="pi pi-check" class="p-button-success" type="submit" />
                    </div>
                </form>
            </Dialog>
        </div>
    </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
    data() {
        return {
            isDialogVisible: false,
            form: {
                supplier_name: '',
                supplier_address: '',
                notes: '',
                items: []
            },
            categories: [], // Store fetched categories here
            productTypeOptions: ['Wholesale', 'Retail'],
            receiptOrders: [],
            totalRecords: 0,
            lazyParams: {
                first: 0,
                rows: 10,
                sortField: null,
                sortOrder: null
            }
        };
    },
    methods: {
        async loadData(event) {
            // Use default values if event is not provided
            this.lazyParams = event || this.lazyParams;

            const warehouse_id = localStorage.getItem('warehouse_id');
            if (!warehouse_id) {
                console.error('No warehouse_id found in local storage');
                return;
            }

            try {
                const response = await apiClient.get('/receipt-orders', {
                    params: {
                        warehouse_id: warehouse_id,
                        per_page: this.lazyParams.rows, // Use updated lazyParams
                        page: (this.lazyParams.first || 0) / this.lazyParams.rows + 1
                    }
                });

                this.receiptOrders = response.data.data;
                this.totalRecords = response.data.total;
            } catch (error) {
                console.error('Error loading receipt orders:', error);
            }
        },
        printReceiptOrder(order) {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');

            // Construct the HTML content with the new design
            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt Order</title>
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
                    width: 150px;
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
                <img src="/public/demo/images/logo.png" alt="Company Logo" />
                <h2>فاتورة الاستلام</h2>
                <p>تاريخ: ${new Date().toLocaleString()}</p>
            </header>

            <section class="order-details">
                <h3>تفاصيل الفاتورة</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>رقم الطلب</th>
                            <td>${order.order_number}</td>
                        </tr>
                        <tr>
                            <th>اسم المورد</th>
                            <td>${order.supplier_name}</td>
                        </tr>
                        <tr>
                            <th>اسم المخزن</th>
                            <td>${order.warehouse_name}</td>
                        </tr>
                        <tr>
                            <th>تاريخ الاستلام</th>
                            <td>${order.receipt_date}</td>
                        </tr>
                        <tr>
                            <th>ملاحظات</th>
                            <td>${order.notes || 'لا توجد'}</td>
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
                            <th>اسم المنتج</th>
                            <th>الكمية المستلمة</th>
                            <th>رقم الدفعة</th>
                            <th>تاريخ انتهاء الصلاحية</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items
                            .map(
                                (item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.product?.name || 'N/A'}</td>
                                    <td>${item.quantity_received}</td>
                                    <td>${item.batch_number || 'N/A'}</td>
                                    <td>${item.expiration_date || 'N/A'}</td>
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
        },

        async fetchCategories() {
            const warehouseId = localStorage.getItem('warehouse_id');
            if (!warehouseId) {
                console.error('Warehouse ID is missing.');
                return;
            }

            try {
                const response = await apiClient.get('/categories', { params: { warehouse_id: warehouseId } });
                this.categories = response.data.categories;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        openDialog() {
            this.isDialogVisible = true;
            this.fetchCategories(); // Fetch categories when the dialog opens
        },
        closeDialog() {
            this.isDialogVisible = false;
        },
        addItem() {
            this.form.items.push({
                id: Date.now(),
                product_name: '',
                product_type: 'Wholesale',
                quantity_received: 0,
                wholesale_price: 0,
                retail_price: 0,
                batch_number: '',
                expiration_date: ''
            });
        },
        removeItem(index) {
            this.form.items.splice(index, 1);
        },

        async submitForm() {
            try {
                // Retrieve necessary values from localStorage
                const warehouseId = localStorage.getItem('warehouse_id');
                const user_id = localStorage.getItem('user_id');
                const warehouseName = localStorage.getItem('warehouse_name');

                // Check if warehouseId is present
                if (!warehouseId) {
                    console.error('Error: Warehouse ID is missing in localStorage.');
                    alert('Warehouse ID is not set. Please ensure it is configured before proceeding.');
                    return;
                }

                // Log the retrieved values for debugging
                console.log('Retrieved Warehouse ID:', warehouseId);
                console.log('Retrieved User ID:', user_id);
                console.log('Retrieved Warehouse Name:', warehouseName);

                // Prepare the payload
                const payload = {
                    warehouse_id: warehouseId,
                    user_id,
                    warehouse_name: warehouseName,
                    order_number: `ORD-${Date.now()}`,
                    // receipt_date: new Date().toISOString(),
                    supplier_name: this.form.supplier_name,
                    supplier_address: this.form.supplier_address,
                    notes: this.form.notes,
                    items: this.form.items.map((item) => ({
                        product_name: item.product_name,
                        product_type: item.product_type,
                        quantity_received: item.quantity_received,
                        wholesale_price: item.wholesale_price,
                        retail_price: item.retail_price,
                        batch_number: item.batch_number,
                        expiration_date: item.expiration_date,
                        category_id: item.category_id // Include category_id
                    }))
                };

                // Log the payload for debugging
                console.log('Payload to be sent:', payload);

                // Make the API request
                const response = await apiClient.post('/receipt-orders', payload);

                // Handle the response
                if (response.status === 200) {
                    console.log('Receipt order submitted successfully');
                    alert('Receipt order submitted successfully!');
                    this.closeDialog();
                } else {
                    console.error('Failed to submit the receipt order');
                    alert('Failed to submit the receipt order. Please try again.');
                }
            } catch (error) {
                // Log and display any errors encountered
                console.error('Error submitting the receipt order:', error);
                alert('An error occurred while submitting the receipt order. Please check the console for details.');
            }
        }
    },
    mounted() {
        this.loadData({
            first: 0,
            rows: this.lazyParams.rows,
            sortField: this.lazyParams.sortField,
            sortOrder: this.lazyParams.sortOrder
        });
    }
};
</script>
<style scoped>
label {
    text-align: right;
}
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.full-width {
    grid-column: span 2;
}

.button-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.add-product-btn {
    margin-top: 1rem;
    position: relative;
    left: 900px;
}

.form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
}
</style>
