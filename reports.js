const orders = [
    { id: 1, date: "2024-06-01", payment: "مدى", total: 200 },
    { id: 2, date: "2024-06-02", payment: "كاش", total: 150 },
    { id: 3, date: "2024-06-03", payment: "مدى", total: 300 },
    { id: 4, date: "2024-06-04", payment: "كاش", total: 100 }
];

let chart;

// عرض البيانات الأولية عند تحميل الصفحة
window.onload = function () {
    populateTable(orders);
    renderChart(orders);
};

// تطبيق الفلاتر
function applyFilters() {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const paymentMethod = document.getElementById("payment-filter").value;

    let filteredOrders = orders;

    // فلتر حسب التاريخ
    if (startDate) {
        filteredOrders = filteredOrders.filter(order => order.date >= startDate);
    }

    if (endDate) {
        filteredOrders = filteredOrders.filter(order => order.date <= endDate);
    }

    // فلتر حسب طريقة الدفع
    if (paymentMethod !== "all") {
        filteredOrders = filteredOrders.filter(order => order.payment === paymentMethod);
    }

    populateTable(filteredOrders);
    renderChart(filteredOrders);
}

// تعبئة الجدول
function populateTable(data) {
    const tableBody = document.getElementById("report-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // مسح البيانات السابقة

    data.forEach(order => {
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.payment}</td>
                <td>${order.total} ريال</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// رسم الرسم البياني
function renderChart(data) {
    const totals = {
        مدى: data.filter(order => order.payment === "مدى").reduce((sum, order) => sum + order.total, 0),
        كاش: data.filter(order => order.payment === "كاش").reduce((sum, order) => sum + order.total, 0)
    };

    const ctx = document.getElementById("ordersChart").getContext("2d");

    if (chart) {
        chart.destroy(); // حذف الرسم البياني السابق
    }

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["مدى", "كاش"],
            datasets: [{
                label: "إجمالي المبيعات",
                data: [totals["مدى"], totals["كاش"]],
                backgroundColor: ["#007BFF", "#28A745"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}