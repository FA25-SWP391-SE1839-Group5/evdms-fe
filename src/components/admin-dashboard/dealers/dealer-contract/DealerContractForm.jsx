import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react';
import { getAllDealers, createDealerContract } from '../../../../services/dealerService';

export default function DealerContractForm() {
    // Hàm helper để format ngày cho input datetime-local
    const toDatetimeLocal = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        // Cắt bỏ phần milliseconds và 'Z'
        return date.toISOString().slice(0, 16);
    };
    return (
        <>
            
        </>
    )
}
