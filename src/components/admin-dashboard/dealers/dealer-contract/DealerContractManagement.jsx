import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import { getAllDealers, getAllDealerContracts, deleteDealerContract } from '../../../../services/dealerService';
import DealerContractForm from './DealerContractForm';
import DealerContractDetailsModal from './DealerContractDetailsModal';

// Hàm helper để render status badge
const RenderContractStatus = ({ startDate, endDate }) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) {
        return <span className="badge bg-label-secondary">Expired</span>;
    }
    if (now < start) {
        return <span className="badge bg-label-info">Pending</span>;
    }
    return <span className="badge bg-label-success">Active</span>;
};

const renderDealerStatusBadge = (status) => {
    const isActive = typeof status === 'boolean' ? status : true;
    return (
        <span className={`badge bg-label-${isActive ? 'success' : 'secondary'}`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
 };

// Hàm helper để format tiền
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        return 'N/A';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm helper để format ngày
const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('vi-VN');
};

export default function DealerContractManagement() {
    const [contracts, setContracts] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [dealerMap, setDealerMap] = useState({}); // Để lưu { dealerId: dealerName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showFormModal, setShowFormModal] = useState(false);
    const [contractToEdit, setContractToEdit] = useState(null);
    const [showDealerDetailsModal, setShowDealerDetailsModal] = useState(false);
    const [viewingDealer, setViewingDealer] = useState(null);

    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterDealerName, setFilterDealerName] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterSalesTarget, setFilterSalesTarget] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // 1. Fetch dữ liệu khi component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Tải song song cả 2 API
                const [contractsRes, dealersRes] = await Promise.all([
                    getAllDealerContracts(),
                    getAllDealers()
                ]);

                // 1. Set Contracts
                setContracts(contractsRes.data?.data?.items || []);

                const dealerList = dealersRes.data?.data?.items || [];
                setDealers(dealerList);

                // 2. Tạo Map cho Dealers
                const map = dealerList.reduce((acc, dealer) => {
                    acc[dealer.id] = dealer.name;
                    return acc;
                }, {});
                setDealerMap(map);

            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Tự động ẩn thông báo
    useEffect(() => {
        if (error || success) {
          const timer = setTimeout(() => {
            setError('');
            setSuccess('');
          }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error, success]);

    // 3. Logic Filter 
    const filteredContracts = useMemo(() => {
        return contracts.filter(contract => {
            const dealerName = (dealerMap[contract.dealerId] || '').toLowerCase();
            const startDate = formatDate(contract.startDate).toLowerCase();
            const endDate = formatDate(contract.endDate).toLowerCase();
            const salesTarget = String(contract.salesTarget).toLowerCase();

            // Lấy text của status
            const now = new Date();
            const start = new Date(contract.startDate);
            const end = new Date(contract.endDate);
            let status = '';
            if (now > end) {
                status = 'expired';
            } else if (now < start) {
                status = 'pending';
            } else {
                status = 'active';
            }

            // So sánh với từng filter
            const matchesDealer = dealerName.includes(filterDealerName.toLowerCase());
            const matchesStart = startDate.includes(filterStartDate.toLowerCase());
            const matchesEnd = endDate.includes(filterEndDate.toLowerCase());
            const matchesTarget = salesTarget.includes(filterSalesTarget.toLowerCase());
            const matchesStatus = filterStatus === '' || status === filterStatus;

            return matchesDealer && matchesStart && matchesEnd && matchesTarget && matchesStatus;
        });
    }, [
        contracts, 
        dealerMap, 
        filterDealerName, 
        filterStartDate, 
        filterEndDate, 
        filterSalesTarget, 
        filterStatus
    ]);

    // Logic phân trang
    const totalPages = Math.ceil(filteredContracts.length / pageSize);
    const paginatedContracts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredContracts.slice(startIndex, startIndex + pageSize);
    }, [filteredContracts, currentPage, pageSize]);

    const startEntry = filteredContracts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredContracts.length);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setCurrentPage(1); // Reset về trang 1 khi filter
        switch (name) {
            case 'filterDealerName':
                setFilterDealerName(value);
                break;
            case 'filterStartDate':
                setFilterStartDate(value);
                break;
            case 'filterEndDate':
                setFilterEndDate(value);
                break;
            case 'filterSalesTarget':
                setFilterSalesTarget(value);
                break;
            case 'filterStatus':
                setFilterStatus(value);
                break;
            default:
                break;
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // 4. Handlers
    const handleAdd = () => {
        setContractToEdit(null); // Không có contract nào đang edit
        setShowFormModal(true);
    };

    // 3. Cập nhật hàm xử lý khi LƯU thành công
    const handleSaveSuccess = async (isEdit) => {
        setShowFormModal(false); // Đóng modal
        setContractToEdit(null); // Reset contract
        setSuccess(isEdit ? 'Contract updated successfully!' : 'Contract added successfully!');
    };

    const handleEdit = (contractId) => {
        const contract = contracts.find(c => c.id === contractId);
        if (contract) {
            setContractToEdit(contract);
            setShowFormModal(true);
        }
    };

    const handleDelete = async (contractId, dealerName) => {
        const confirmMessage = `Are you sure you want to delete the contract for "${dealerName}"?`;
        if (!window.confirm(confirmMessage)) return;

        try {
            await deleteDealerContract(contractId);
            setSuccess('Contract deleted successfully.');
            // Tải lại danh sách
            const contractsRes = await getAllDealerContracts();
            setContracts(contractsRes.data?.data?.items || []);
        } catch (err) {
            setError(err.message || 'Failed to delete contract');
        }
    };

    const handleShowDealerDetails = (dealerId) => {
        const dealer = dealers.find(d => d.id === dealerId);
        if (dealer) {
            setViewingDealer(dealer);
            setShowDealerDetailsModal(true);
        }
    };

    if (loading) {
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading contracts...</span>
            </div>
          </div>
        );
    }

   return (
        <>
            {/* Alert Message */}
            {error && (
              <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                <AlertCircle size={20} className="me-2" />
                <div className="flex-grow-1">{error}</div>
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            {success && (
              <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                <CheckCircle size={20} className="me-2" />
                <div className="flex-grow-1">{success}</div>
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            {/* Card Table */}
            <div className="card">
                <h5 className="card-header pb-0">Dealer Contracts</h5>
                {/* HEADER */}
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row pb-2 gap-3 gap-md-0">
                        {/* "Show X entries" */}
                        <div className="col-md-auto">
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

                        {/* Add Contract */}
                        <div className="col-md-auto ms-auto">
                            <button
                              type="button"
                              className="btn btn-primary rounded-pill d-flex align-items-center"
                              onClick={handleAdd}
                            >
                              <Plus size={18} className="me-2" />
                              <span className="fw-semibold">Add Contract</span>
                            </button>
                        </div>
                    </div>
                </div>              
                <div className="card-datatable table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Dealer</th>
                                <th className="border-start">Start Date</th>
                                <th className="border-start">End Date</th>
                                <th className="border-start">Sales Target</th>
                                <th className="border-start">Status</th>
                                <th className="border-start">Actions</th>
                            </tr>
                            {/* FILTER */}
                            <tr className="filters">
                                <th>
                                    <input
                                        type="text"
                                        name="filterDealerName"
                                        className="form-control"
                                        placeholder="Search Dealer"
                                        value={filterDealerName}
                                        onChange={handleFilterChange}
                                    />
                                </th>
                                <th className="border-start">
                                    <input
                                        type="text"
                                        name="filterStartDate"
                                        className="form-control"
                                        placeholder="Search Date"
                                        value={filterStartDate}
                                        onChange={handleFilterChange}
                                    />
                                </th>
                                <th className="border-start">
                                    <input
                                        type="text"
                                        name="filterEndDate"
                                        className="form-control"
                                        placeholder="Search Date"
                                        value={filterEndDate}
                                        onChange={handleFilterChange}
                                    />
                                </th>
                                <th className="border-start">
                                    <input
                                        type="text"
                                        name="filterSalesTarget"
                                        className="form-control"
                                        placeholder="Search Target"
                                        value={filterSalesTarget}
                                        onChange={handleFilterChange}
                                    />
                                </th>
                                <th className="border-start">
                                    <select
                                        name="filterStatus"
                                        className="form-select"
                                        value={filterStatus}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All</option>
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </th>
                                <th className="border-start">{/* Actions column has no filter */}</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedContracts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    {/* Cập nhật thông báo rỗng */}
                                    {filteredContracts.length === 0 && !filterDealerName && !filterStartDate && !filterEndDate && !filterSalesTarget && !filterStatus
                                        ? 'No contracts found'
                                        : 'No contracts match your filters'}
                                </td>
                            </tr>
                            ) : (
                            paginatedContracts.map(contract => (
                                <tr key={contract.id}>
                                    <td>
                                        <span className="fw-semibold">
                                            {dealerMap[contract.dealerId] || 'Loading...'}
                                        </span>
                                    </td>
                                    <td>{formatDate(contract.startDate)}</td>
                                    <td>{formatDate(contract.endDate)}</td>
                                    <td>{formatCurrency(contract.salesTarget)}</td>
                                    <td>
                                        <RenderContractStatus 
                                            startDate={contract.startDate} 
                                            endDate={contract.endDate} 
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <button 
                                                type="button" 
                                                className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                                title="Edit"
                                                onClick={() => handleEdit(contract.id)}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                                title="Delete"
                                                onClick={() => handleDelete(contract.id, dealerMap[contract.dealerId])}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGING */}
                <div className="d-flex justify-content-between align-items-center p-3">
                  <small className="text-muted">
                    Showing {startEntry} to {endEntry} of {filteredContracts.length} entries
                  </small>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(p => p - 1)}
                          disabled={currentPage === 1}
                        >
                          &laquo; Previous
                        </button>
                      </li>
                      {/* Thêm logic render số trang ở đây nếu muốn */}
                      <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(p => p + 1)}
                          disabled={currentPage === totalPages || totalPages === 0}
                        >
                          Next &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
            </div>
            
            {/* FORM */}
           <DealerContractForm
                show={showFormModal}
                onClose={() => {
                    setShowFormModal(false);
                    setContractToEdit(null); 
                }}
                onSaveSuccess={handleSaveSuccess}
                dealers={dealers} 
                contractToEdit={contractToEdit}
            />
        </>
    )
}