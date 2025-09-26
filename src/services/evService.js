export const sampleVehicles = [
  {
    id: 1,
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    model: '2024',
    price: 2200000000,
    originalPrice: 2350000000,
    startingPrice: 1950000000,
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=500&fit=crop'
    ],
    colors: [
      { name: 'Pearl White Multi-Coat', code: '#f7f7f7', price: 0 },
      { name: 'Solid Black', code: '#000000', price: 0 },
      { name: 'Midnight Silver Metallic', code: '#5c5c5c', price: 25000000 },
      { name: 'Deep Blue Metallic', code: '#14213d', price: 25000000 },
      { name: 'Pearl White Multi-Coat', code: '#8b0000', price: 60000000 }
    ],
    variants: [
      {
        name: 'Standard',
        price: 1950000000,
        range: 405,
        acceleration: '3.7s',
        topSpeed: 200,
        features: ['Autopilot', 'Premium Audio', '19" Wheels']
      },
      {
        name: 'Long Range',
        price: 2200000000,
        range: 516,
        acceleration: '3.1s',
        topSpeed: 200,
        features: ['Autopilot', 'Premium Audio', 'Glass Roof', '21" Wheels']
      },
      {
        name: 'Plaid',
        price: 2800000000,
        range: 396,
        acceleration: '1.99s',
        topSpeed: 322,
        features: ['Full Self-Driving', 'Premium Audio', 'Carbon Fiber Spoiler', '21" Wheels', 'Track Mode']
      }
    ],
    range: 405,
    chargingTime: '45 phút',
    batteryCapacity: '100 kWh',
    bodyType: 'Sedan',
    seatingCapacity: 5,
    topSpeed: 200,
    acceleration: '3.1s',
    power: '670 HP',
    weight: '2,162 kg',
    dimensions: '4,979 x 1,964 x 1,445 mm',
    rating: 4.8,
    reviews: 324,
    availability: 'in-stock',
    features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Over-the-air Updates', 'Sentry Mode'],
    batteryType: 'Lithium-ion',
    warranty: '4 năm / 80,000 km',
    chargingPorts: ['Type 2', 'CCS2', 'Tesla Supercharger'],
    safety: ['5-Star Euro NCAP', 'ABS', 'ESP', '8 Airbags', 'ISOFIX', 'Forward Collision Warning'],
    description: 'Tesla Model S Plaid là chiếc sedan điện hiệu suất cao với khả năng tăng tốc nhanh nhất thế giới. Thiết kế tương lai, công nghệ tiên tiến và trải nghiệm lái xe đỉnh cao.',
    video: 'https://www.youtube.com/embed/example',
    dealers: [
      { name: 'Tesla Saigon', address: '123 Nguyễn Huệ, Q1, TP.HCM', phone: '0901234567', distance: '2.5 km' },
      { name: 'Tesla Hanoi', address: '456 Ba Trieu, Hai Ba Trung, Ha Noi', phone: '0907654321', distance: '5.2 km' }
    ]
  },
  {
    id: 2,
    name: 'BMW iX xDrive50',
    brand: 'BMW',
    model: '2024',
    price: 2050000000,
    originalPrice: 2150000000,
    startingPrice: 1850000000,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop'
    ],
    colors: [
      { name: 'Alpine White', code: '#ffffff', price: 0 },
      { name: 'Jet Black', code: '#1c1c1c', price: 0 },
      { name: 'Storm Bay', code: '#4a6fa5', price: 20000000 },
      { name: 'Mineral Grey', code: '#6b7280', price: 20000000 }
    ],
    variants: [
      {
        name: 'sDrive40',
        price: 1850000000,
        range: 425,
        acceleration: '6.1s',
        topSpeed: 180,
        features: ['BMW Live Cockpit Professional', 'Comfort Access', '20" Wheels']
      },
      {
        name: 'xDrive50',
        price: 2050000000,
        range: 380,
        acceleration: '4.6s',
        topSpeed: 200,
        features: ['BMW Live Cockpit Professional', 'Air Suspension', 'Harman Kardon', '21" Wheels']
      }
    ],
    range: 324,
    chargingTime: '39 phút',
    batteryCapacity: '76.6 kWh',
    bodyType: 'SUV',
    seatingCapacity: 5,
    topSpeed: 180,
    acceleration: '4.6s',
    power: '523 HP',
    weight: '2,510 kg',
    dimensions: '4,953 x 1,967 x 1,695 mm',
    rating: 4.6,
    reviews: 156,
    availability: 'in-stock',
    features: ['BMW Curved Display', 'Air Suspension', 'Harman Kardon Audio', 'Gesture Control'],
    batteryType: 'Lithium-ion',
    warranty: '3 năm / 100,000 km',
    chargingPorts: ['Type 2', 'CCS2'],
    safety: ['5-Star Euro NCAP', 'ABS', 'ESP', 'Airbags', 'ISOFIX', 'Lane Assist', 'Active Cruise Control'],
    description: 'BMW iX là SUV điện cao cấp với thiết kế tương lai, công nghệ BMW iDrive 8 và khả năng vận hành mạnh mẽ trên mọi địa hình.',
    dealers: [
      { name: 'BMW Vietnam', address: '789 Le Duan, Q1, TP.HCM', phone: '0908765432', distance: '3.1 km' }
    ]
  },
  {
    id: 3,
    name: 'Audi e-tron GT quattro',
    brand: 'Audi',
    model: '2024',
    price: 2520000000,
    originalPrice: 2620000000,
    startingPrice: 2320000000,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop'
    ],
    colors: [
      { name: 'Glacier White', code: '#f8f9fa', price: 0 },
      { name: 'Mythos Black', code: '#000000', price: 0 },
      { name: 'Kemora Grey', code: '#4f4f4f', price: 25000000 },
      { name: 'Tango Red', code: '#d50000', price: 50000000 }
    ],
    variants: [
      {
        name: 'e-tron GT quattro',
        price: 2320000000,
        range: 488,
        acceleration: '3.9s',
        topSpeed: 245,
        features: ['Virtual Cockpit Plus', 'Matrix LED', 'Sport Suspension']
      },
      {
        name: 'RS e-tron GT',
        price: 2950000000,
        range: 472,
        acceleration: '3.3s',
        topSpeed: 250,
        features: ['Virtual Cockpit Plus', 'Matrix LED', 'Sport Suspension Plus', 'Carbon Fiber Package']
      }
    ],
    range: 238,
    chargingTime: '23 phút',
    batteryCapacity: '93.4 kWh',
    bodyType: 'Coupe',
    seatingCapacity: 4,
    topSpeed: 245,
    acceleration: '3.3s',
    power: '590 HP',
    weight: '2,347 kg',
    dimensions: '4,989 x 1,964 x 1,414 mm',
    rating: 4.7,
    reviews: 89,
    availability: 'pre-order',
    features: ['Virtual Cockpit Plus', 'Matrix LED Headlights', 'Sport Suspension', 'Bang & Olufsen Audio'],
    batteryType: 'Lithium-ion',
    warranty: '3 năm / 100,000 km',
    chargingPorts: ['Type 2', 'CCS2'],
    safety: ['5-Star Euro NCAP', 'ABS', 'ESP', 'Airbags', 'ISOFIX', 'Adaptive Cruise Control'],
    description: 'Audi e-tron GT là gran turismo điện với thiết kế thể thao, hiệu suất mạnh mẽ và trải nghiệm lái xe sang trọng đặc trưng của Audi.',
    dealers: [
      { name: 'Audi Vietnam', address: '321 Dong Khoi, Q1, TP.HCM', phone: '0909876543', distance: '1.8 km' }
    ]
  }
];

export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

export const getAvailabilityBadge = (availability) => {
    const badges = {
        'in-stock': 'bg-green-100 text-green-800 border-green-200',
        'pre-order': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'out-of-stock': 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
        'in-stock': 'Có sẵn',
        'pre-order': 'Đặt trước',
        'out-of-stock': 'Hết hàng',
    };

    return {badges, labels};
};

export const filterVehicles = (vehicles, searchTerm, filters) => {
    return vehicles.filter(vehicle => {
        const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPrice = vehicle.price >= filters.priceRange[0] && vehicle.price <= filters.priceRange[1];
        const matchesRange = vehicle.range >= filters.range[0] && vehicle.range <= filters.range[1];
        const matchesBrand = !filters.brand || vehicle.brand === filters.brand;
        const matchesBodyType = !filters.bodyType || vehicle.bodyType === filters.bodyType;
        const matchesAvailability = filters.availability === 'all' || vehicle.availability === filters.availability;

        return matchesSearch && matchesPrice && matchesRange && matchesBrand && matchesBodyType && matchesAvailability;
    });
};