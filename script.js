let orderNumber = 1; // رقم الطلب
let totalPrice = 0; // الإجمالي

function addToTable(productName, unitPrice) {
    const tableBody = document.getElementById('product-table-body');
    const totalPriceElement = document.getElementById('total-price');

    // التحقق مما إذا كان المنتج موجودًا بالفعل
    let existingRow = Array.from(tableBody.rows).find(row => row.cells[1].textContent === productName);

    if (existingRow) {
        // إذا كان المنتج موجودًا، قم بزيادة العدد وتحديث السعر الإجمالي
        const countCell = existingRow.cells[0];
        const priceCell = existingRow.cells[2];

        let count = parseInt(countCell.textContent) + 1; // زيادة العدد
        countCell.textContent = count;

        let totalProductPrice = count * unitPrice; // حساب السعر الإجمالي للمنتج
        priceCell.textContent = `${totalProductPrice} ريال`;

        // تحديث الإجمالي الكلي
        totalPrice += unitPrice;
        totalPriceElement.textContent = `${totalPrice} ريال`;
        return;
    }

    // إنشاء صف جديد إذا كان المنتج غير موجود
    const newRow = document.createElement('tr');

    // إضافة العدد (ابدأ من 1)
    const countCell = document.createElement('td');
    countCell.textContent = 1;

    // إضافة المنتج
    const productCell = document.createElement('td');
    productCell.textContent = productName;

    // إضافة السعر (ابدأ بالسعر الفردي)
    const priceCell = document.createElement('td');
    priceCell.textContent = `${unitPrice} ريال`;

    // إضافة زر الحذف
    const deleteCell = document.createElement('td');
    deleteCell.classList.add('no-print');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'حذف';
    deleteButton.classList.add('delete-btn');
    deleteButton.onclick = () => {
        const count = parseInt(countCell.textContent);
        totalPrice -= count * unitPrice; // خصم الإجمالي بناءً على العدد
        totalPriceElement.textContent = `${totalPrice} ريال`;
        tableBody.removeChild(newRow); // حذف الصف
    };
    deleteCell.appendChild(deleteButton);

    // إضافة الأعمدة إلى الصف
    newRow.appendChild(countCell);
    newRow.appendChild(productCell);
    newRow.appendChild(priceCell);
    newRow.appendChild(deleteCell);

    // إضافة الصف إلى الجدول
    tableBody.appendChild(newRow);

    // تحديث الإجمالي الكلي
    totalPrice += unitPrice;
    totalPriceElement.textContent = `${totalPrice} ريال`;
}


function saveOrdersToLocalStorage() {
    const tableBody = document.getElementById('product-table-body');
    const rows = Array.from(tableBody.rows);

    const orders = rows.map(row => {
        return {
            product: row.cells[1].textContent, // اسم المنتج
            price: row.cells[2].textContent, // السعر
            count: row.cells[0].textContent // العدد
        };
    });

    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];
    previousOrders.push({
        orderNumber: orderNumber,
        orders: orders,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString() // إضافة الطابع الزمني
    });

    localStorage.setItem('orders', JSON.stringify(previousOrders));
}

function clearTable() {
    saveOrdersToLocalStorage();

    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';
    totalPrice = 0;
    document.getElementById('total-price').textContent = `${totalPrice} ريال`;
}

function printAndClear() {
    if (!selectedPaymentMethod) {
        alert("يرجى اختيار طريقة الدفع قبل الطباعة.");
        return;
    }

    const table = document.getElementById('order-table');
    const totalPriceElement = document.getElementById('total-price');
    const totalAmount = parseFloat(totalPriceElement.textContent.split(" ")[0]); // الإجمالي الكلي
    let madaAmount = 0; // المبلغ المدفوع عبر مدى
    let cashAmount = 0; // المتبقي كاش

    // التحقق من طريقة الدفع
    if (selectedPaymentMethod === "مدى") {
        const madaInput = document.getElementById('mada-amount');
        madaAmount = parseFloat(madaInput.value);

        if (isNaN(madaAmount) || madaAmount <= 0) {
            alert("يرجى إدخال مبلغ صالح لمدى.");
            return;
        }

        if (madaAmount > totalAmount) {
            alert("المبلغ المدفوع عبر مدى لا يمكن أن يكون أكبر من الإجمالي.");
            return;
        }

        // حساب المتبقي كاش إذا كان المبلغ المدفوع عبر مدى أقل من الإجمالي
        cashAmount = totalAmount - madaAmount;
    } else {
        // إذا كانت طريقة الدفع "كاش"، يتم دفع كامل المبلغ نقدًا
        cashAmount = totalAmount;
    }

    // جلب التاريخ والوقت الحالي
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('ar-SA');
    const formattedTime = currentDate.toLocaleTimeString('ar-SA');

    // الشعار
    const logoHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="logo.png" alt="شعار الشركة" style="max-width: 100px;">
        </div>
    `;

    // النص الخاص بالتاريخ والوقت
    const dateAndTimeHTML = `
        <div style="text-align: center; margin-bottom: 20px; font-size: 14px;">
            <strong>تاريخ الطلب:</strong> ${formattedDate} &nbsp;&nbsp; 
            <strong>وقت الطلب:</strong> ${formattedTime}
        </div>
    `;

    // النص الخاص بطريقة الدفع
    const paymentMethodHTML = `
        <div style="text-align: center; margin-top: 20px; font-size: 14px;">
            <strong>طريقة الدفع:</strong> ${selectedPaymentMethod} <br>
            ${selectedPaymentMethod === "مدى" ? `<strong>مدى:</strong> ${madaAmount.toFixed(2)} ريال<br>` : ""}
            ${cashAmount > 0 ? `<strong>كاش:</strong> ${cashAmount.toFixed(2)} ريال<br>` : ""}
        </div>
    `;

    // النص التعبيري
    const footerHTML = `
        <div style="text-align: center; margin-top: 20px; font-size: 14px; font-weight: bold;">
            شكراً لتعاملكم معنا! نأمل أن تكون تجربتكم رائعة.
        </div>
    `;

    // إزالة عمود الحذف مؤقتاً
    const deleteCells = Array.from(table.querySelectorAll('thead tr:nth-child(2) th:nth-child(4), tbody tr td:nth-child(4), tfoot tr td:nth-child(4)'));
    deleteCells.forEach(cell => cell.style.display = 'none');

    // فتح نافذة للطباعة
    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(`
        <html>
        <head>
            <title>طباعة جدول الطلبات</title>
            <style>
                table {
                    width: 90%;
                    margin: auto;
                    border-collapse: collapse;
                    border: 1px solid #000;
                }
                th, td {
                    padding: 10px;
                    border: 1px solid #000;
                    text-align: center;
                }
                th {
                    background-color: #f0f0f0;
                }
                tfoot td {
                    font-weight: bold;
                }
                body {
                    font-family: Arial, sans-serif;
                    direction: rtl;
                    text-align: center;
                    margin: 20px;
                }
            </style>
        </head>
        <body>
            ${logoHTML}
            ${dateAndTimeHTML}
            ${table.outerHTML}
            ${paymentMethodHTML} <!-- إضافة طريقة الدفع -->
            ${footerHTML}
        </body>
        </html>
    `);
    newWindow.document.close();
    newWindow.print();

    // إعادة عمود الحذف
    deleteCells.forEach(cell => cell.style.display = '');

    // مسح الجدول وإعادة تعيين طريقة الدفع
    clearTable();
    selectedPaymentMethod = ""; // إعادة تعيين طريقة الدفع
    orderNumber++;
    document.getElementById('order-number').textContent = orderNumber;
}

function addCustomPriceProduct() {
    // اسم المنتج الافتراضي
    const productName = "مخصص";

    // طلب السعر من المستخدم
    const productPrice = parseFloat(prompt("أدخل سعر المنتج (ريال):"));
    if (isNaN(productPrice) || productPrice <= 0) {
        alert("يجب إدخال سعر صالح!");
        return;
    }

    // إضافة المنتج إلى الجدول
    addToTable(productName, productPrice);
}
