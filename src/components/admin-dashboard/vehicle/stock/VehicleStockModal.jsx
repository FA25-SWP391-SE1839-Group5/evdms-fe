import React from 'react'
import { AlertCircle } from 'lucide-react';
import { createVehicle, updateVehicle, getAllVehicleVariants } from '../../../../services/vehicleService';
import { getAllDealers } from '../../../../services/dealerService';

export default function VehicleStockModal({ show, onClose, onSaveSuccess, vehicleToEdit, variants = [], dealers = [] }) {
    const isEditMode = Boolean(vehicleToEdit);
    const title = isEditMode ? 'Edit Vehicle Stock' : 'Add New Vehicle to Stock';

    const [formData, setFormData] = useState({
        variantId: '',
        dealerId: '', // ID của dealer đang giữ xe (có thể trống nếu chưa phân)
        color: '',
        vin: '',    // Số VIN (Vehicle Identification Number)
        type: 'New', // Loại xe: New, Used, Demo?
        status: 'Available' // Trạng thái: Available, Reserved, Sold, InTransit
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form data when editing or reset when adding
    useEffect(() => {
        if (show) {
            setError('');
            if (isEditMode && vehicleToEdit) {
                setFormData({
                    variantId: vehicleToEdit.variantId || '',
                    dealerId: vehicleToEdit.dealerId || '', // Có thể null
                    color: vehicleToEdit.color || '',
                    vin: vehicleToEdit.vin || '',
                    type: vehicleToEdit.type || 'New',
                    status: vehicleToEdit.status || 'Available',
                });
            } else {
                // Reset form for adding
                setFormData({
                    variantId: '',
                    dealerId: '',
                    color: '',
                    vin: '',
                    type: 'New',
                    status: 'Available',
                });
            }
        }
    }, [show, vehicleToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (!formData.variantId || !formData.color || !formData.vin || !formData.type || !formData.status) {
            setError('Please fill in Variant, Color, VIN, Type, and Status.');
            setLoading(false);
            return;
        }
        // Có thể thêm validation cho VIN (độ dài, ký tự...)

        // Chuẩn bị dữ liệu gửi đi (chuyển đổi nếu cần)
        const dataToSend = {
            ...formData,
            // Đảm bảo dealerId là null nếu giá trị là chuỗi rỗng
            dealerId: formData.dealerId || null,
        };

        try {
            let response;
            if (isEditMode) {
                response = await updateVehicle(vehicleToEdit.id, dataToSend);
            } else {
                response = await createVehicle(dataToSend);
            }

            // Check response from backend (assuming success flag or status code)
             if (response.data?.success === true || (response.status >= 200 && response.status < 300) ) {
                onSaveSuccess(isEditMode);
            } else {
                throw new Error(response.data?.message || 'Failed to save vehicle');
            }
        } catch (err) {
            console.error("Save Vehicle Error:", err);
            // Hiển thị lỗi cụ thể hơn, ví dụ lỗi trùng VIN
             let specificError = err.response?.data?.message || err.message || 'Operation failed';
             if (specificError.toLowerCase().includes('vin') && specificError.toLowerCase().includes('unique')) {
                 specificError = 'This VIN already exists in the inventory.';
             }
            setError(`Database operation failed: ${specificError}`);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={onClose} 
                                    aria-label="Close" 
                                    disabled={loading}
                                ></button>  
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <AlertCircle size={20} className="me-2" />
                                        <div>{error}</div>
                                    </div>
                                )}
                                <div className="row g-3">

                                    {/* Variant Select */}
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleVariantId" className="form-label">Vehicle Variant *</label>
                                        <select
                                            id="vehicleVariantId"
                                            name="variantId"
                                            className={`form-select ${!formData.variantId && error ? 'is-invalid' : ''}`}
                                            value={formData.variantId}
                                            onChange={handleChange}
                                            disabled={loading || isEditMode} // Không cho đổi variant khi edit?
                                            required
                                        >
                                            <option value="">-- Select Variant --</option>
                                            {variants.map(variant => (
                                                <option key={variant.id} value={variant.id}>{variant.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* VIN Input */}
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleVin" className="form-label">VIN *</label>
                                        <input
                                            type="text"
                                            id="vehicleVin"
                                            name="vin"
                                            className={`form-control ${!formData.vin && error ? 'is-invalid' : ''}`}
                                            value={formData.vin}
                                            onChange={handleChange}
                                            placeholder="Enter Vehicle Identification Number"
                                            disabled={loading || isEditMode} // Thường VIN không đổi
                                            required
                                        />
                                    </div>

                                    {/* Color Input */}
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleColor" className="form-label">Color *</label>
                                        <input
                                            type="text"
                                            id="vehicleColor"
                                            name="color"
                                            className={`form-control ${!formData.color && error ? 'is-invalid' : ''}`}
                                            value={formData.color}
                                            onChange={handleChange}
                                            placeholder="e.g., Red, Blue, White"
                                            disabled={loading}
                                            required
                                        />
                                        {/* Có thể đổi thành Select nếu màu cố định */}
                                    </div>

                                    {/* Type Select */}
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleType" className="form-label">Type *</label>
                                        <select
                                            id="vehicleType"
                                            name="type"
                                            className="form-select"
                                            value={formData.type}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        >
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                            <option value="Demo">Demo</option>
                                        </select>
                                    </div>

                                    {/* Status Select */}
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleStatus" className="form-label">Status *</label>
                                        <select
                                            id="vehicleStatus"
                                            name="status"
                                            className="form-select"
                                            value={formData.status}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Reserved">Reserved</option>
                                            <option value="Sold">Sold</option>
                                            <option value="InTransit">In Transit</option>
                                            {/* Thêm các trạng thái khác nếu cần */}
                                        </select>
                                    </div>

                                    {/* Assigned Dealer Select */}
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleDealerId" className="form-label">Assigned Dealer</label>
                                        <select
                                            id="vehicleDealerId"
                                            name="dealerId"
                                            className="form-select"
                                            value={formData.dealerId}
                                            onChange={handleChange}
                                            disabled={loading}
                                        >
                                            <option value="">-- Unassigned / In Stock --</option>
                                            {dealers.map(dealer => (
                                                <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                                            ))}
                                        </select>
                                        <div className="form-text">Assign this vehicle to a specific dealer (optional).</div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary" 
                                    onClick={onClose} 
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Add Vehicle')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}  
        </>
    )
}
