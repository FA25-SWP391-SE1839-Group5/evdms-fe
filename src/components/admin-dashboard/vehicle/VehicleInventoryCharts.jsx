import React, { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement, // Cho Doughnut
    Tooltip,
    Legend,
    CategoryScale, // Cho Bar
    LinearScale,  // Cho Bar
    BarElement,   // Cho Bar
    Title         // Cho Bar (tùy chọn)
} from 'chart.js';

// Đăng ký các thành phần cần thiết với ChartJS
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

// --- Component ---
const VehicleInventoryCharts = ({ models = [], variants = [], vehicles = [] }) => {

    // --- Chuẩn bị dữ liệu cho biểu đồ ---
    const chartData = useMemo(() => {
        // 1. Data cho Doughnut Chart (Stock by Status)
        const statusCounts = vehicles.reduce((acc, vehicle) => {
            const status = vehicle.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const doughnutLabels = Object.keys(statusCounts);
        const doughnutDataValues = Object.values(statusCounts);
        // Định nghĩa màu sắc cho từng status (có thể tùy chỉnh)
        const statusColors = {
            Available: 'rgba(40, 208, 148, 0.8)', // Green
            Reserved: 'rgba(253, 172, 52, 0.8)', // Orange/Yellow
            Sold: 'rgba(255, 71, 87, 0.8)',      // Red
            InTransit: 'rgba(113, 102, 240, 0.8)', // Blue/Purple
            Unknown: 'rgba(134, 146, 166, 0.8)'  // Gray
        };
        const doughnutBackgroundColors = doughnutLabels.map(label => statusColors[label] || statusColors.Unknown);

        const doughnutChartData = {
            labels: doughnutLabels,
            datasets: [{
                data: doughnutDataValues,
                backgroundColor: doughnutBackgroundColors,
                borderColor: '#ffffff', // Màu viền trắng
                borderWidth: 2,
            }],
        };

        // 2. Data cho Bar Chart (Stock by Model)
        // Tạo map variantId -> modelId
        const variantToModelMap = variants.reduce((acc, variant) => {
            acc[variant.id] = variant.modelId;
            return acc;
        }, {});
        // Tạo map modelId -> modelName
        const modelIdToNameMap = models.reduce((acc, model) => {
            acc[model.id] = model.name;
            return acc;
        }, {});

        // Đếm số lượng xe theo modelId
        const modelCounts = vehicles.reduce((acc, vehicle) => {
            const modelId = variantToModelMap[vehicle.variantId];
            if (modelId) {
                acc[modelId] = (acc[modelId] || 0) + 1;
            }
            return acc;
        }, {});

        // Chuyển thành labels (tên model) và data (số lượng)
        const barLabels = Object.keys(modelCounts).map(modelId => modelIdToNameMap[modelId] || `Unknown (${modelId.slice(0,5)})`);
        const barDataValues = Object.values(modelCounts);

        const barChartData = {
            labels: barLabels,
            datasets: [{
                label: 'Stock Count',
                data: barDataValues,
                backgroundColor: 'rgba(102, 110, 232, 0.8)', // Màu primary của Sneat
                borderColor: 'rgba(102, 110, 232, 1)',
                borderWidth: 1,
                borderRadius: 4, // Bo góc cột
                maxBarThickness: 30, // Giới hạn độ rộng cột
            }],
        };

        return { doughnutChartData, barChartData };

    }, [models, variants, vehicles]); // Tính lại khi data thay đổi

    // --- Cấu hình cho biểu đồ ---
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false, // Cho phép đặt chiều cao tùy ý
        plugins: {
            legend: {
                position: 'bottom', // Hiển thị legend ở dưới
                labels: { boxWidth: 12, padding: 20 }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        let value = context.parsed || 0;
                        let total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        let percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            }
        },
        cutout: '70%', // Tạo lỗ ở giữa (doughnut)
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x', // Cột dọc
        scales: {
            y: {
                beginAtZero: true, // Bắt đầu trục Y từ 0
                 ticks: { stepSize: 50 } // Bước nhảy trục Y (tùy chỉnh)
            },
             x: {
                grid: { display: false } // Ẩn đường kẻ dọc
            }
        },
        plugins: {
            legend: { display: false }, // Ẩn legend cho bar chart đơn giản
            title: { display: false }, // Ẩn title mặc định
        },
    };

    // Kiểm tra nếu không có dữ liệu để vẽ chart
    const noVehicleData = vehicles.length === 0;

    return (
        <div className="row g-4 mb-4">
            {/* Doughnut Chart: Stock by Status */}
            <div className="col-lg-5 col-md-6 col-12">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                     <h5 className="card-title mb-0">Stock by Status</h5>
                     {/* Có thể thêm dropdown filter ở đây nếu cần */}
                  </div>
                    <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '350px' }}>
                        {noVehicleData ? (
                            <p className="text-muted">No vehicle data available for status chart.</p>
                        ) : (
                            // Đặt chiều cao cho canvas container
                            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                                <Doughnut data={chartData.doughnutChartData} options={doughnutOptions} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bar Chart: Stock by Model */}
            <div className="col-lg-7 col-md-6 col-12">
                 <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                         <h5 className="card-title mb-0">Stock Count by Model</h5>
                         {/* Có thể thêm dropdown filter ở đây nếu cần */}
                    </div>
                    <div className="card-body" style={{ minHeight: '350px' }}>
                         {noVehicleData ? (
                             <p className="text-muted">No vehicle data available for model chart.</p>
                         ) : (
                            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                                <Bar data={chartData.barChartData} options={barOptions} />
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleInventoryCharts;