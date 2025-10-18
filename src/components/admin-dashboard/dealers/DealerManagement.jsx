import React, { useState, useEffect, useMemo } from 'react';
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
        
        {/* Alert messages */}
        {error && (
            <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
            <AlertCircle size={20} className="me-2" />
            <div className="flex-grow-1">{error}</div>
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
        )}
        {/* TODO: Add Success Alert if needed */}

       {/* Responsive Datatable Card */}
      <div className="card">
        <h5 className="card-header pb-0">Dealer List</h5>
        <div className="card-datatable table-responsive">
            {/* Top Row: Entries + Search */}
            <div className="row m-2 justify-content-between align-items-center">
                <div className="col-md-2">
                    <label className="d-flex align-items-center">
                        Show&nbsp;
                        <select 
                            className="form-select"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            style={{ width: '140px' }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        &nbsp;entries
                    </label>
                </div>
                <div className="col-md-10 d-flex align-items-center justify-content-end gap-2">
                    <label className="d-flex align-items-center">
                        Search:&nbsp;
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search dealers..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </label>
                </div>
            </div>
        </div>
    </div>
                    


    </>
  )
}
