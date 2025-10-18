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

    // --- Pagination ---
    const totalPages = Math.ceil(filteredDealers.length / pageSize);
    const paginatedDealers = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredDealers.slice(startIndex, startIndex + pageSize);
    }, [filteredDealers, currentPage, pageSize]);

    const startEntry = filteredDealers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredDealers.length);

    // --- Handlers ---
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset về trang 1
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang 1
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        }
    };

    // --- Placeholder Action Handlers ---
    const handleEdit = (dealerId) => {
        console.log("Edit dealer:", dealerId);
        // TODO: Implement edit logic (e.g., open modal)
    };

    const handleDelete = async (dealerId, dealerName) => {
        console.log("Delete dealer:", dealerId);
        // const confirmMessage = `Are you sure you want to delete the dealer "${dealerName}"?`;
        // if (window.confirm(confirmMessage)) {
        //   try {
        //     await deleteDealer(dealerId);
        //     // TODO: Add success message
        //     fetchDealers(); // Refresh list
        //   } catch (err) {
        //      console.error("❌ Delete Dealer Error:", err);
        //      setError(err.response?.data?.message || err.message || 'Failed to delete dealer');
        //   }
        // }
    };

    // --- Render Status Badge (Ví dụ) ---
    const renderStatusBadge = (status) => {
        // Giả sử API trả về 'active' hoặc 'inactive'
        const isActive = status === 'active'; // Điều chỉnh logic này theo API của bạn
        return (
            <span className={`badge bg-label-${isActive ? 'success' : 'secondary'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    // --- Loading State ---
    if (loading) {
        return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dealers...</span>
            </div>
        </div>
        );
    }
    return (
    <>
        {/* TODO: Thêm Breadcrumb nếu cần */}
        <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Management /</span> Dealers
        </h4>
    </>
  )
}
