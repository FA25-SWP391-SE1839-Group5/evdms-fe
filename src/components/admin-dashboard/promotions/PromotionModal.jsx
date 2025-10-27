import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react';
import { createPromotion, updatePromotion } from '../../../services/promotionService';

// Helper format ngày giờ
const toDatetimeLocal = (isoDate) => {
    if (!isoDate) return '';
    try {
        const date = new Date(isoDate);
        // Check if date is valid before formatting
        if (isNaN(date.getTime())) return '';
        // Lấy YYYY-MM-DDTHH:mm
        const pad = (num) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch (e) {
        console.error("Error formatting date:", isoDate, e);
        return ''; // Trả về rỗng nếu lỗi
    }
};

export default function PromotionModal({ show, onClose, onSaveSuccess, promotionToEdit }) {
    const isEditMode = Boolean(promotionToEdit);
    const title = isEditMode ? 'Edit Promotion' : 'Add New Promotion';

    const [formData, setFormData] = useState({
        description: '',
        discountPercent: '', // Dùng chuỗi rỗng cho input number
        startDate: toDatetimeLocal(new Date().toISOString()), // Mặc định hiện tại
        endDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            setError('');
            if (isEditMode && promotionToEdit) {
                setFormData({
                    description: promotionToEdit.description || '',
                    // Hiển thị chuỗi rỗng nếu là null/undefined, ngược lại là số
                    discountPercent: promotionToEdit.discountPercent === null || promotionToEdit.discountPercent === undefined ? '' : String(promotionToEdit.discountPercent),
                    startDate: toDatetimeLocal(promotionToEdit.startDate),
                    endDate: toDatetimeLocal(promotionToEdit.endDate),
                });
            } else {
                setFormData({
                    description: '',
                    discountPercent: '',
                    startDate: toDatetimeLocal(new Date().toISOString()),
                    endDate: '',
                });
            }
        }
    }, [show, promotionToEdit, isEditMode]);

    return (
        <div>
            
        </div>
    )
}
