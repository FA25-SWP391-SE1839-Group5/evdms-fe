export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

export const getAvailabilityBadge = (availability) => {
    const badge = {
        'in-stock': 'bg-green-100 text-green-800 border-green-200',
        'pre-order': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'out-of-stock': 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
        'in-stock': 'Có sẵn',
        'pre-order': 'Đặt trước ',
        'out-of-stock': 'Hết hàng'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badge[availability]}`}>
            {labels[availability]}
        </span>
    );
}