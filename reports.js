const orders = [
    { id: 1, date: "2024-06-01", payment: "مدى", total: 200 },
    { id: 2, date: "2024-06-02", payment: "كاش", total: 150 },
    { id: 3, date: "2024-06-03", payment: "مدى", total: 300 },
    { id: 4, date: "2024-06-04", payment: "كاش", total: 100 }
];

let chart;

// عند تحميل الصفحة، اقرأ البيانات
window.onload = function () {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    populateTable(reports);
    renderChart(reports);
};

// تطبيق الفلاتر
function applyFilters() {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const paymentMethod = document.getElementById("payment-filter").value;

    let reports = JSON.parse(localStorage.getItem('reports')) || [];

    // فلترة البيانات
    if (startDate) {
        reports = reports.filter(report => report.date >= startDate);
    }

    if (endDate) {
        reports = reports.filter(report => report.date <= endDate);
    }

    if (paymentMethod !== "all") {
        reports = reports.filter(report => report.payment === paymentMethod);
    }

    populateTable(reports);
    renderChart(reports);
}

// تعبئة الجدول بالبيانات
function populateTable(data) {
    const tableBody = document.getElementById("report-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    data.forEach(report => {
        const row = `
            <tr>
                <td>${report.id}</td>
                <td>${report.date}</td>
                <td>${report.payment}</td>
                <td>${report.total} ريال</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// رسم الرسم البياني
function renderChart(data) {
    const totals = {
        مدى: data.filter(report => report.payment === "مدى").reduce((sum, report) => sum + report.total, 0),
        كاش: data.filter(report => report.payment === "كاش").reduce((sum, report) => sum + report.total, 0)
    };

    const ctx = document.getElementById("ordersChart").getContext("2d");

    if (chart) {
        chart.destroy();
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