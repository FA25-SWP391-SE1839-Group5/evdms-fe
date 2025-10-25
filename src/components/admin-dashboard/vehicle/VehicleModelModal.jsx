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

    // Xử lý khi xóa ảnh (chỉ xóa ảnh hiện có, chưa upload)
    const handleRemoveImage = async (e) => {
        e.preventDefault(); // Ngăn submit form
        if (!formData.imagePublicId && !selectedImageFile) return; // Không có gì để xóa

        // Nếu có file đang chọn thì chỉ cần hủy chọn
        if (selectedImageFile) {
            setSelectedImageFile(null);
            setImagePreview(isEditMode ? modelToEdit?.imageUrl || '' : ''); // Quay lại ảnh cũ (nếu edit) hoặc trống (nếu add)
            if (fileInputRef.current) fileInputRef.current.value = null; // Reset input file
            return;
        }

        // Nếu đang edit và có ảnh cũ (có imagePublicId)
        if (isEditMode && modelToEdit?.id && formData.imagePublicId) {
            if (!window.confirm("Are you sure you want to remove the current image from this model? This will delete it from storage.")) return;
            setLoading(true);
            setError('');
            try {
                // Gọi API xóa ảnh dùng model ID
                await deleteVehicleModelImage(modelToEdit.id);
                // Cập nhật lại state formData và preview
                setFormData(prev => ({ ...prev, imageUrl: '', imagePublicId: '' }));
                setImagePreview('');
                setSuccess('Image removed successfully.'); // Cần thêm state success nếu muốn
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to remove image.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>

        </div>
    )
}
