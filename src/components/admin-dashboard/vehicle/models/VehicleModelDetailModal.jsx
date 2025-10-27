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
                        <div className="modal-body">
                            {loading && (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {model && !loading && (
                                <div>
                                    {model.imageUrl ? (
                                        <img 
                                            src={model.imageUrl} 
                                            alt={model.name} 
                                            className="img-fluid rounded mb-3"
                                            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="text-center p-5 bg-light rounded mb-3">
                                            <i className='bx bx-image' style={{ fontSize: '60px', color: '#ccc' }}></i>
                                        </div>
                                    )}
                                    <h3 className="mb-2">{model.name}</h3>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                        {model.description || 'No description provided.'}
                                    </p>
                                    <hr />
                                    <small className="text-muted">Model ID: {model.id}</small>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-label-secondary" 
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
