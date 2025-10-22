import React from 'react';
import { AlertCircle } from 'lucide-react';
import { createDealerPayment, updateDealerPayment } from '../../../../services/dealerService';

export default function DealerPaymentModal({ show, onClose, onSaveSuccess, dealers, paymentToEdit }) {
    const isEditMode = Boolean(paymentToEdit);
    const title = isEditMode ? 'Edit Dealer Payment' : 'Add New Payment';


    const [formData, setFormData] = useState({
        dealerId: '',
        amount: '',
        paymentMethod: '',
        // Status is usually handled by separate API calls (mark-paid/failed)
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fill form on edit or reset on add
    useEffect(() => {
        if (show) {
        setError('');
        if (isEditMode && paymentToEdit) {
            setFormData({
            dealerId: paymentToEdit.dealerId || '',
            amount: paymentToEdit.amount || '',
            paymentMethod: paymentToEdit.paymentMethod || '',
            });
        } else {
            setFormData({
            dealerId: '',
            amount: '',
            paymentMethod: '',
            });
        }
        }
    }, [show, paymentToEdit, isEditMode]);


    return (
        <div>

        </div>
    )
}
