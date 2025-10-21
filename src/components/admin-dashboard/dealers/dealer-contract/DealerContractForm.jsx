import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react';
import { getAllDealers, createDealerContract } from '../../../../services/dealerService';

// Hàm helper để format ngày cho input datetime-local
    const toDatetimeLocal = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        // Cắt bỏ phần milliseconds và 'Z'
        return date.toISOString().slice(0, 16);
    };

export default function DealerContractForm() {
    const [dealers, setDealers] = useState([]);
    const [formData, setFormData] = useState({
        dealerId: '',
        startDate: toDatetimeLocal(new Date().toISOString()), // Mặc định ngày giờ hiện tại
        endDate: '',
        salesTarget: 0,
        // outstandingDebt không cần khi tạo, backend sẽ tự gán
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 1. Tải danh sách dealers khi component mount
    useEffect(() => {
        const fetchDealers = async () => {
        try {
            const response = await getAllDealers();
            setDealers(response.data?.data?.items || []);
        } catch (err) {
            setError('Failed to load dealers list.');
        }
        };
        fetchDealers();
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

    // 3. Handler cho form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // 4. Handler submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate
        if (!formData.dealerId || !formData.startDate || !formData.endDate) {
            setError('Please select a dealer and set start/end dates.');
            setLoading(false);
            return;
        }

        // Chuyển đổi dữ liệu trước khi gửi
        const dataToSend = {
            ...formData,
            salesTarget: Number(formData.salesTarget) || 0,
            // Đảm bảo ngày gửi đi là định dạng ISO
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
        };

        try {
        const response = await createDealerContract(dataToSend);
        if (response.data?.success) {
            setSuccess('Dealer contract created successfully!');
            // Reset form
            setFormData({
                dealerId: '',
                startDate: toDatetimeLocal(new Date().toISOString()),
                endDate: '',
                salesTarget: 0,
            });
        } else {
            throw new Error(response.data?.message || 'Failed to create contract');
        }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
            setError(`Database operation failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">Dealers /</span> Create Contract
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

                {/* Card Form */}
                <div className="row">
                    <div className="col-xl">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">New Contract Details</h5>
                                <small className="text-muted float-end">Using icon inputs</small>
                            </div>
                            <div className="card-body">

                                {/* Bắt đầu Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Field 1: Dealer (Select) */}
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="dealerId">
                                            Dealer *
                                        </label>
                                        <div className="input-group input-group-merge">
                                            <span id="icon-dealer" className="input-group-text">
                                                <i className="bx bx-store" />
                                            </span>
                                            <select
                                                id="dealerId"
                                                name="dealerId"
                                                className="form-select"
                                                value={formData.dealerId}
                                                onChange={handleChange}
                                                aria-describedby="icon-dealer"
                                            >
                                                <option value="">-- Select a Dealer --</option>
                                                {dealers.map(dealer => (
                                                    <option key={dealer.id} value={dealer.id}>
                                                        {dealer.name} (ID: ...{dealer.id.slice(-6)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
