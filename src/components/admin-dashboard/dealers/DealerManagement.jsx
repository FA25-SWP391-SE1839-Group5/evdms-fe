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

    return (
    <div>

    </div>
  )
}
