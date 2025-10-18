import React, { useState, useEffect, useMemo } from 'react';
// Giả định bạn có service cho dealers
import { getAllDealers /*, deleteDealer */ } from '../../../services/dealerService';
import { AlertCircle, Search } from 'lucide-react'; // Thêm icon Search nếu cần

const DealerManagement = () => {
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
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
        <div className="card-datatable table-responsive">
            {/* Top Row: Entries + Search */}
            <div className="row m-2 justify-content-between align-items-center border-bottom pb-2">
                <div className="col-md-auto">
                    <label className="d-flex align-items-center">
                        Show&nbsp;
                        <select
                          className="form-select form-select-sm mx-1"
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
                <div className="col-md-auto">
                    <label className="d-flex align-items-center">
                        Search:&nbsp;
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search dealers..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </label>
                </div>
            </div>

            {/* Table: Removed extra whitespace */}
            <table className="dt-responsive table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Region</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDealers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">{filteredDealers.length === 0 && !searchTerm ? 'No dealers found' : 'No dealers match your search'}</td></tr>
                ) : (
                  paginatedDealers.map(dealer => (
                    <tr key={dealer.id}>
                      <td>{dealer.name || 'N/A'}</td>
                      <td>{dealer.email || 'N/A'}</td>
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
    </>
  );
};

export default DealerManagement;