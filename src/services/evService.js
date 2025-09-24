export const sampleVehicles = [
    {
        id: 1,
        name: "Tesla Model S Plaid",
        brand: "Tesla",
        model: "2024",
        price: 2200000000,
        originalPrice: 2350000000,
        startingPrice: 1950000000,
        images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=500&fit=crop",
        ],
        range: 405,
        chargingTime: "45 phút",
        acceleration: "3.1s",
        rating: 4.8,
        reviews: 324,
        availability: "in-stock",
        features: ["Autopilot", "Premium Audio", "Glass Roof"],
    },

    {
        id: 2,
        name: "BMW iX xDrive50",
        brand: "BMW",
        model: "2024",
        price: 2050000000,
        originalPrice: 2150000000,
        startingPrice: 1850000000,
        images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
        ],
        range: 324,
        chargingTime: "39 phút",
        acceleration: "4.6s",
        rating: 4.6,
        reviews: 156,
        availability: "in-stock",
        features: ["BMW Curved Display", "Air Suspension", "Harman Kardon"],
  },
];

export const getVehicles = async () => {
    // Simulate an API call delay
    return Promise.resolve(sampleVehicles);
};

export const getVehicleById = async (id) => {
    const vehicle = sampleVehicles.find((v) => v.id === parseInt(id));
    return Promise.resolve(vehicle);
};