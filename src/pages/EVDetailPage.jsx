import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  GitCompare, 
  Star, 
  Battery, 
  Zap, 
  Gauge, 
  TrendingUp,
  Palette,
  Car,
  ShoppingCart,
  Calendar,
  Play,
  Shield,
  Award,
  MapPin,
  Phone,
  MessageCircle,
  Users,
  Wind,
  Settings,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';

const EVDetailPage = () => {
  const [selectedColor, setSelectedColor] = useState('Pearl White Multi-Coat');
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [activeTab, setActiveTab] = useState('specs');
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  // Mock vehicle data
  const vehicle = {
    id: 1,
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    model: '2024',
    price: 2200000000,
    originalPrice: 2350000000,
    startingPrice: 1950000000,
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=800&fit=crop'
    ],
    colors: [
      { name: 'Pearl White Multi-Coat', code: '#f7f7f7', price: 0 },
      { name: 'Solid Black', code: '#000000', price: 0 },
      { name: 'Midnight Silver Metallic', code: '#5c5c5c', price: 25000000 },
      { name: 'Deep Blue Metallic', code: '#14213d', price: 25000000 },
      { name: 'Red Multi-Coat', code: '#8b0000', price: 60000000 }
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
    dealers: [
      { name: 'Tesla Saigon', address: '123 Nguyễn Huệ, Q1, TP.HCM', phone: '0901234567', distance: '2.5 km' },
      { name: 'Tesla Hanoi', address: '456 Ba Trieu, Hai Ba Trung, Ha Noi', phone: '0907654321', distance: '5.2 km' }
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const currentVariant = vehicle.variants.find(v => v.name === selectedVariant) || vehicle.variants[0];
  const currentColor = vehicle.colors.find(c => c.name === selectedColor) || vehicle.colors[0];
  const totalPrice = currentVariant.price + (currentColor?.price || 0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);

    // Sticky header effect
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setIsSticky(window.scrollY > headerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (vehicleId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vehicleId)) {
        newFavorites.delete(vehicleId);
      } else {
        newFavorites.add(vehicleId);
      }
      return newFavorites;
    });
  };

  const toggleCompare = (vehicleId) => {
    setCompareList(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else if (prev.length < 3) {
        return [...prev, vehicleId];
      } else {
        alert('Chỉ có thể so sánh tối đa 3 xe');
        return prev;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <Car className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tải thông tin xe...</h2>
          <p className="text-gray-600">Chúng tôi đang chuẩn bị những thông tin chi tiết nhất</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sticky Header */}
      <div 
        ref={headerRef}
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 transition-all duration-300 ${
          isSticky ? 'shadow-2xl' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => console.log('Go back')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Quay lại danh mục
            </button>
            
            <div className="text-center flex-1 mx-8">
              <h1 className={`font-bold text-gray-900 transition-all duration-300 ${
                isSticky ? 'text-xl' : 'text-2xl'
              }`}>
                {vehicle.name}
              </h1>
              <p className="text-gray-600">{vehicle.brand} • {vehicle.model}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => toggleFavorite(vehicle.id)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  favorites.has(vehicle.id)
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className="w-5 h-5" fill={favorites.has(vehicle.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => toggleCompare(vehicle.id)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  compareList.includes(vehicle.id)
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden group">
              <img
                src={vehicle.images[currentImageIndex]}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentImageIndex(Math.min(vehicle.images.length - 1, currentImageIndex + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={currentImageIndex === vehicle.images.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {vehicle.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentImageIndex 
                        ? 'bg-white w-8 h-2' 
                        : 'bg-white/60 w-2 h-2 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>

              {/* Floating Info */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900">{vehicle.rating}</span>
                  <span className="text-gray-600 text-sm">({vehicle.reviews} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentImageIndex 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${vehicle.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* 360° View & Video */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-6 h-6 text-white animate-spin-slow" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Xem 360°</h3>
                  <p className="text-gray-600 text-sm">Khám phá mọi góc độ</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Video giới thiệu</h3>
                  <p className="text-gray-600 text-sm">Trải nghiệm chi tiết</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Price & Description */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                    Có sẵn
                  </span>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {vehicle.description}
                </p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Battery className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-blue-900 font-semibold">Phạm vi</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{currentVariant.range} km</div>
                  <div className="text-blue-600 text-sm">Một lần sạc đầy</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-900 font-semibold">Sạc nhanh</span>
                  </div>
                  <div className="text-3xl font-bold text-green-900">{vehicle.chargingTime}</div>
                  <div className="text-green-600 text-sm">10% → 80%</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-purple-900 font-semibold">Gia tốc</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-900">{currentVariant.acceleration}</div>
                  <div className="text-purple-600 text-sm">0-100 km/h</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-orange-900 font-semibold">Tốc độ tối đa</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-900">{currentVariant.topSpeed} km/h</div>
                  <div className="text-orange-600 text-sm">Hiệu suất cao</div>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Chọn màu sắc
              </h3>
              <div className="space-y-4">
                {vehicle.colors.map((color) => (
                  <label
                    key={color.name}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                      selectedColor === color.name 
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="color"
                        value={color.name}
                        checked={selectedColor === color.name}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="sr-only"
                      />
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: color.code }}
                        />
                        {selectedColor === color.name && (
                          <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-blue-500 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">{color.name}</span>
                        <span className="text-gray-600 text-sm">
                          {color.price > 0 ? `+${formatPrice(color.price)}` : 'Miễn phí'}
                        </span>
                      </div>
                    </div>
                    {selectedColor === color.name && (
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Variant Selection */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Car className="w-6 h-6" />
                Chọn phiên bản
              </h3>
              <div className="space-y-4">
                {vehicle.variants.map((variant) => (
                  <label
                    key={variant.name}
                    className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedVariant === variant.name 
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={variant.name}
                      checked={selectedVariant === variant.name}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-gray-900">{variant.name}</span>
                        {selectedVariant === variant.name && (
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(variant.price)}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <div className="text-lg font-bold text-blue-900">{variant.range}km</div>
                        <div className="text-xs text-blue-600">Phạm vi</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-xl">
                        <div className="text-lg font-bold text-purple-900">{variant.acceleration}</div>
                        <div className="text-xs text-purple-600">0-100km/h</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <div className="text-lg font-bold text-green-900">{variant.topSpeed}km/h</div>
                        <div className="text-xs text-green-600">Tối đa</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {variant.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tổng kết giá</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phiên bản {currentVariant.name}</span>
                  <span className="font-semibold text-lg">{formatPrice(currentVariant.price)}</span>
                </div>
                {currentColor && currentColor.price > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Màu {currentColor.name}</span>
                    <span className="font-semibold text-lg">+{formatPrice(currentColor.price)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-3xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Đã bao gồm VAT</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                <div className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {vehicle.availability === 'in-stock' ? 'Mua ngay' : 'Đặt trước'}
                </div>
              </button>
              
              <button className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold text-lg">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Đặt lịch lái thử
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'specs', label: 'Thông số kỹ thuật', icon: Shield },
                  { id: 'features', label: 'Tính năng', icon: Award },
                  { id: 'safety', label: 'An toàn', icon: CheckCircle },
                  { id: 'dealers', label: 'Đại lý', icon: MapPin }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 px-8 py-4 font-semibold transition-all duration-300 border-b-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'specs' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Thông số kỹ thuật chi tiết
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-blue-600">Động cơ & Pin</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Dung lượng pin', value: vehicle.batteryCapacity },
                          { label: 'Công suất', value: vehicle.power },
                          { label: 'Loại pin', value: vehicle.batteryType },
                          { label: 'Phạm vi hoạt động', value: `${vehicle.range} km` },
                          { label: 'Thời gian sạc', value: vehicle.chargingTime }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors rounded px-2">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-green-600">Kích thước & Trọng lượng</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Kích thước', value: vehicle.dimensions },
                          { label: 'Trọng lượng', value: vehicle.weight },
                          { label: 'Số chỗ ngồi', value: `${vehicle.seatingCapacity} chỗ` },
                          { label: 'Kiểu dáng', value: vehicle.bodyType },
                          { label: 'Bảo hành', value: vehicle.warranty }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between py-3 border-b border-gray-100 hover:bg-green-50 transition-colors rounded px-2">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Tính năng nổi bật
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-purple-600">Công nghệ thông minh</h3>
                      <div className="space-y-4">
                        {vehicle.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                            <CheckCircle className="w-5 h-5 text-purple-500" />
                            <span className="font-medium text-gray-900">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-blue-600">Cổng sạc hỗ trợ</h3>
                      <div className="space-y-4">
                        {vehicle.chargingPorts.map((port, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-gray-900">{port}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Sạc siêu nhanh</h4>
                        <p className="text-blue-700 text-sm">
                          Công nghệ sạc tiên tiến cho phép sạc từ 10% lên 80% chỉ trong {vehicle.chargingTime}, 
                          giúp bạn tiết kiệm thời gian tối đa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'safety' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Tính năng an toàn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-4">Tiêu chuẩn an toàn</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                          </div>
                          <span className="font-semibold text-green-900">5-Star Euro NCAP</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          Đạt điểm số an toàn cao nhất theo tiêu chuẩn quốc tế Euro NCAP
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {vehicle.safety.map((safety, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <Shield className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-gray-900">{safety}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">Công nghệ hỗ trợ lái xe</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Hệ thống phanh khẩn cấp tự động</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Cảnh báo điểm mù</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Hỗ trợ duy trì làn đường</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Cruise Control thích ứng</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                        <h3 className="text-lg font-semibold text-amber-900 mb-3">Bảo vệ pin & xe</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Battery className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-800 text-sm">Hệ thống quản lý nhiệt độ pin</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-800 text-sm">Chế độ Sentry Mode</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-800 text-sm">Bảo vệ quá sạc/quá phát</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dealers' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Đại lý gần bạn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {vehicle.dealers.map((dealer, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {dealer.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{dealer.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">{dealer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                              <Car className="w-4 h-4" />
                              <span className="text-sm font-medium">Cách {dealer.distance}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex text-yellow-500 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">4.8/5 đánh giá</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold group">
                            <Phone className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                            Gọi ngay
                          </button>
                          <button className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 group">
                            <MessageCircle className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          </button>
                          <button className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 group">
                            <MapPin className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={vehicle.images[0]} alt={vehicle.name} className="w-16 h-12 object-cover rounded-xl" />
              <div>
                <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{selectedVariant} • {selectedColor}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Tổng cộng</div>
                <div className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold">
                  <Download className="w-4 h-4 inline mr-2" />
                  Tải brochure
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl">
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  {vehicle.availability === 'in-stock' ? 'Mua ngay' : 'Đặt trước'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing for fixed bar */}
        <div className="h-20"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EVDetailPage;