import React from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import { getAllDealers, getAllDealerContracts, deleteDealerContract } from '../../../../services/dealerService';

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
    const [dealerMap, setDealerMap] = useState({}); // Để lưu { dealerId: dealerName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // State phân trang (nếu bạn muốn, tạm thời tôi làm đơn giản)
    // const [pageSize, setPageSize] = useState(10);
    // const [currentPage, setCurrentPage] = useState(1);

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

                // 2. Tạo Map cho Dealers
                const dealers = dealersRes.data?.data?.items || [];
                const map = dealers.reduce((acc, dealer) => {
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
            const dealerName = dealerMap[contract.dealerId] || '';
            return dealerName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [contracts, dealerMap, searchTerm]);

    // 4. Handlers
    const handleAdd = () => {
        // Chuyển đến trang form tạo mới
        // Dùng logic giống Sidebar.jsx
        window.location.href = '/dealer-contracts/new';
    };

    const handleEdit = (contractId) => {
        // TODO: Xây dựng logic
        console.log("Edit contract:", contractId);
        alert("Chức năng Edit Contract chưa được xây dựng!");
        // (Bạn sẽ cần 1 route mới '/dealer-contracts/edit/:id' và 1 form tương tự)
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
            {/* Header */}
            <h4 className="fw-bold py-3 mb-4">
                <span className="text-muted fw-light">Dealers /</span> Dealer Contracts
            </h4>

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
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row pb-2 gap-3 gap-md-0">
                        <div className="col-md-4">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search by Dealer Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 ms-auto text-end">
                        <button
                            type="button"
                            className="btn btn-primary rounded-pill d-flex align-items-center ms-auto"
                            onClick={handleAdd}
                        >
                            <Plus size={18} className="me-2" />
                            <span className="fw-semibold">Add Contract</span>
                        </button>
                    </div>
                </div>
            </div>



        </>
    )
}
