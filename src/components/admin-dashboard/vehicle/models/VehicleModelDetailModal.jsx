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
        <div>
            
        </div>
    )
}
