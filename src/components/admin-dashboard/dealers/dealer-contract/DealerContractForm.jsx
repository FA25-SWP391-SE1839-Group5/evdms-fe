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

    return (
        <>
            
        </>
    )
}
