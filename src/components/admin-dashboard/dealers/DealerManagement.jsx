import React, { useState, useEffect, useMemo } from 'react';
// Giả định bạn có service cho dealers
import { getAllDealers /*, deleteDealer */ } from '../../../services/dealerService';
import { AlertCircle, Search } from 'lucide-react'; // Thêm icon Search nếu cần

const DealerManagement = () => {
  const [dealers, setDealers] = useState([]); // State cho danh sách dealers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingDealer, setViewingDealer] = useState(null);

  // --- Fetch Data ---
  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllDealers();
      // Lấy dữ liệu từ response.data.data.items
      setDealers(response.data?.data?.items || []);
      console.log("📥 Raw Dealer Response:", response.data);
    } catch (err) {
      console.error("❌ Fetch Dealers Error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to load dealers');
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering ---
  const filteredDealers = useMemo(() => {
    if (!Array.isArray(dealers)) return [];

    return dealers.filter(dealer => {
      
      // SỬA LỖI LOGIC STATUS
      const isDealerConsideredActive = typeof dealer.isActive === 'boolean' 
        ? dealer.isActive 
        : true; 
      const matchesStatus = filterStatus === '' || 
        (filterStatus === 'true' && isDealerConsideredActive) ||
        (filterStatus === 'false' && !isDealerConsideredActive);

      // CÁC FILTER CÒN LẠI
      const matchesName = filterName === '' || 
        (dealer.name && dealer.name.toLowerCase().includes(filterName.toLowerCase()));
      
      const matchesRegion = filterRegion === '' ||
        (dealer.region && dealer.region.toLowerCase().includes(filterRegion.toLowerCase()));

      // THÊM LOGIC FILTER ADDRESS
      const matchesAddress = filterAddress === '' ||
        (dealer.address && dealer.address.toLowerCase().includes(filterAddress.toLowerCase()));
        
      // Trả về true CHỈ KHI tất cả điều kiện đều match
      return matchesName && matchesRegion && matchesStatus && matchesAddress; // <-- Thêm matchesAddress
    });
  }, [
    dealers, 
    filterName, 
    filterRegion, 
    filterStatus, 
    filterAddress // <-- Thêm filterAddress vào dependencies
  ]);

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
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'filterName':
        setFilterName(value);
        break;
      case 'filterRegion':
        setFilterRegion(value);
        break;
      case 'filterStatus':
        setFilterStatus(value);
        break;
      case 'filterAddress':
        setFilterAddress(value);
        break;
      default:
        break;
    }
    
    setCurrentPage(1); // Reset về trang 1 khi filter
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewDetails = (dealer) => {
    setViewingDealer(dealer);
    setShowDetailsModal(true);
  }

  const handleCloseDetailsModal = () => {
   setShowDetailsModal(false);
   setViewingDealer(null);
};

  // --- Placeholder Action Handlers ---
  const handleEdit = (dealerId) => {
    console.log("Edit dealer:", dealerId);
    // TODO: Implement edit logic
  };

  const handleDelete = async (dealerId, dealerName) => {
     console.log("Delete dealer:", dealerId);
    // const confirmMessage = `Are you sure you want to delete the dealer "${dealerName}"?`;
    // if (window.confirm(confirmMessage)) {
    //   try {
    //     await deleteDealer(dealerId);
    //     fetchDealers();
    //   } catch (err) {
    //      setError(err.response?.data?.message || err.message || 'Failed to delete dealer');
    //   }
    // }
  };

  // --- Render Status Badge ---
  const renderStatusBadge = (status) => {
      // Tạm thời giả định status là boolean isActive nếu API chưa có status riêng
      const isActive = typeof status === 'boolean' ? status : true; // Cần điều chỉnh theo API thực tế
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

  // --- Main Render ---
  return (
    <>
      {/* Alert messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
          <AlertCircle size={20} className="me-2" />
          <div className="flex-grow-1">{error}</div>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Responsive Datatable Card */}
      <div className="card">
        <h5 className="card-header pb-0">Dealer List</h5>
        {/*  ADVANCED SEARCH */}
        <div className="card-header border-bottom">
          <h6 className="card-title mb-3">Advanced Search</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="filterName" className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                id="filterName"
                name="filterName"
                placeholder="E.g., Alaric Beslier"
                value={filterName}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="col-md-3">
              <label htmlFor="filterRegion" className="form-label">Region:</label>
              <input
                type="text"
                className="form-control"
                id="filterRegion"
                name="filterRegion"
                placeholder="E.g., North, South"
                value={filterRegion}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="filterAddress" className="form-label">Address:</label>
              <input
                type="text"
                className="form-control"
                id="filterAddress"
                name="filterAddress"
                placeholder="E.g., 100 Nguyen Van Cu"
                value={filterAddress}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="filterStatus" className="form-label">Status:</label>
              <select
                id="filterStatus"
                name="filterStatus"
                className="form-select"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="card-datatable table-responsive">
            {/* Top Row: Entries + Search */}
            <div className="row m-2 justify-content-between align-items-center border-bottom pb-2">
                <div className="col-md-2">
                    <label className="d-flex align-items-center">
                        Show&nbsp;
                        <select
                          className="form-select"
                          value={pageSize}
                          onChange={handlePageSizeChange}
                          style={{ width: 'auto' }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        &nbsp;entries
                    </label>
                </div>
            </div>

            {/* Table: Removed extra whitespace */}
            <table className="dt-responsive table">
              <thead>
                <tr>
                  <th style={{ width: "1rem" }}></th>
                  <th>Name</th>
                  <th>Region</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDealers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      {filteredDealers.length === 0 && !filterName && !filterRegion && !filterStatus 
                        ? 'No dealers found' 
                        : 'No dealers match your filters'}
                    </td>
                  </tr>
                ) : (
                  paginatedDealers.map(dealer => (
                    <tr key={dealer.id}>
                      <td>
                      <button
                          type="button"
                          className="btn btn-icon btn-sm btn-text-primary rounded-pill"
                          onClick={() => handleViewDetails(dealer)}
                          title="View Details"
                        >
                          <i className="bx bx-plus-circle"></i> 
                        </button>
                      </td>
                      <td>{dealer.name || 'N/A'}</td>
                      <td>{dealer.region || 'N/A'}</td>
                      <td>{dealer.address || 'N/A'}</td>
                      <td>{renderStatusBadge(dealer.isActive)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-icon btn-text-secondary rounded-pill me-1"
                          onClick={() => handleEdit(dealer.id)}
                          title="Edit"
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-icon btn-text-secondary rounded-pill"
                          onClick={() => handleDelete(dealer.id, dealer.name)}
                          title="Delete"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

             {/* Bottom Row: Info + Pagination */}
            <div className="row m-2 justify-content-between align-items-center">
                <div className="col-md-6">
                    <small className="text-muted">
                        Showing {startEntry} to {endEntry} of {filteredDealers.length} entries
                    </small>
                </div>
                <div className="col-md-6">
                    <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm justify-content-end mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                    &laquo;
                                </button>
                            </li>
                             <li className="page-item active" aria-current="page">
                                <span className="page-link">{currentPage}</span>
                             </li>
                            <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                     &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
      </div>

      {/* START: MODAL CHI TIẾT DEALER (MỚI) */}
      <DealerDetailsModal
        show={showDetailsModal}
        onClose={handleCloseDetailsModal}
        dealer={viewingDealer}
        renderStatusBadge={renderStatusBadge}
      />
    </>
  );
};

export default DealerManagement;


