import React, { useEffect } from 'react'
import { AlertCircle } from 'lucide-react';
import {
    createVehicleModel,
    updateVehicleModel,
    uploadVehicleModelImage,
    deleteVehicleModelImage
} from '../../../../services/vehicleService';

export default function VehicleModelModal({ show, onClose, onSaveSuccess, modelToEdit }) {
    const isEditMode = Boolean(modelToEdit);
    const title = isEditMode ? 'Edit Vehicle Model' : 'Add New Vehicle Model';

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',      // URL ảnh hiện tại (nếu có)
        imagePublicId: '' // Public ID của ảnh hiện tại (nếu có)
    });
    const [selectedImageFile, setSelectedImageFile] = useState(null); // File ảnh mới chọn
    const [imagePreview, setImagePreview] = useState(''); // Xem trước ảnh mới
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null); // Ref cho input file

    useEffect(() => {
        if (show) {
            setError('');
            setSelectedImageFile(null); // Reset file chọn
            setImagePreview(''); // Reset xem trước
            if (isEditMode && modelToEdit) {
                setFormData({
                    name: modelToEdit.name || '',
                    description: modelToEdit.description || '',
                    imageUrl: modelToEdit.imageUrl || '',
                    imagePublicId: modelToEdit.imagePublicId || ''
                });
                setImagePreview(modelToEdit.imageUrl || ''); // Hiển thị ảnh cũ
            } else {
                setFormData({ name: '', description: '', imageUrl: '', imagePublicId: '' });
            }
        }
    }, [show, modelToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý khi chọn file ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            // Tạo URL xem trước
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(''); // Xóa lỗi cũ nếu có
        }
    };

    return (
        <div>

        </div>
    )
}
