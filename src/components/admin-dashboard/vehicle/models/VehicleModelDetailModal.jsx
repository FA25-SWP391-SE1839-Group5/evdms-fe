import React from 'react'
import { getVehicleModelById } from '../../../../services/vehicleService';

export default function VehicleModelDetailModal({ show, onClose, modelId }) {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && modelId) {
            const fetchModelDetails = async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await getVehicleModelById(modelId);
                    setModel(response.data?.data || response.data);
                } catch (err) {
                    setError('Failed to load vehicle model details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchModelDetails();
        }

        if (!show) {
            setModel(null);
            setError('');
        }
    }, [show, modelId]);

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Vehicle Model Details</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
