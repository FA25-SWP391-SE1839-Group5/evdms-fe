import React from 'react';
import { getAllDealers /*, addDealer, updateDealer, deleteDealer */ } from '../../../services/dealerService';
import { AlertCircle, Search } from 'lucide-react';

export default function DealerManagement() {
    const [dealers, setDealers] = useState([]); // State cho danh sách dealers
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10); 
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- Fetch Data ---
    useEffect(() => {
        fetchDealers();
    }, []);

    const fetchDealers = async () => {
        try {
            setLoading(true);
            setError(''); // Reset lỗi trước khi fetch
            const response = await getAllDealers();
            // Kiểm tra cấu trúc response API của bạn và điều chỉnh nếu cần
            setDealers(response.data || []); 
            console.log("📥 Raw Dealer Response:", response.data); // Log dữ liệu nhận được
        } catch (err) {
            console.error("❌ Fetch Dealers Error:", err);
            setError(err.response?.data?.message || err.message || 'Failed to load dealers');
            setDealers([]); // Đảm bảo dealers là mảng rỗng khi có lỗi
        } finally {
            setLoading(false);
        }
    };

    // --- Filtering ---
    const filteredDealers = useMemo(() => {
        if (!Array.isArray(dealers)) return []; // Đảm bảo dealers là mảng
        
        return dealers.filter(dealer => 
        (dealer.name && dealer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dealer.email && dealer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dealer.region && dealer.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dealer.address && dealer.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [dealers, searchTerm]);

    return (
    <div>

    </div>
  )
}
