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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name) {
            setError('Model Name is required.');
            setLoading(false);
            return;
        }

        let finalImageUrl = formData.imageUrl;
        let finalImagePublicId = formData.imagePublicId;
        let modelIdForUpload = isEditMode ? modelToEdit.id : null;

        try {
            // Bước 1: Tạo hoặc Cập nhật Model (chưa có ảnh mới)
            let modelResponse;
            const modelDataToSend = {
                name: formData.name,
                description: formData.description,
                // Giữ lại ảnh cũ nếu không có ảnh mới được chọn VÀ không xóa ảnh cũ
                imageUrl: !selectedImageFile ? formData.imageUrl : '',
                imagePublicId: !selectedImageFile ? formData.imagePublicId : ''
            };

            if (isEditMode) {
                modelResponse = await updateVehicleModel(modelToEdit.id, modelDataToSend);
            } else {
                modelResponse = await createVehicleModel(modelDataToSend);
                // Lấy ID model mới tạo để upload ảnh
                modelIdForUpload = modelResponse.data?.data?.id || modelResponse.data?.id; // Điều chỉnh theo response thực tế
                 if (!modelIdForUpload) {
                    throw new Error("Failed to get new model ID after creation.");
                }
            }

             // Kiểm tra lỗi sau khi tạo/sửa model
            if (!modelResponse.data?.success && !isEditMode) { // Check lỗi khi tạo mới
                 throw new Error(modelResponse.data?.message || "Failed to create model");
            }
            if (!modelResponse.data?.success && isEditMode) { // Check lỗi khi cập nhật
                 throw new Error(modelResponse.data?.message || "Failed to update model");
            }

            // Bước 2: Upload ảnh mới (nếu có)
            if (selectedImageFile && modelIdForUpload) {
                try {
                    const imageResponse = await uploadVehicleModelImage(modelIdForUpload, selectedImageFile);
                    // Lấy URL và publicId từ response upload
                    finalImageUrl = imageResponse.data?.data?.imageUrl || imageResponse.data?.imageUrl;
                    finalImagePublicId = imageResponse.data?.data?.imagePublicId || imageResponse.data?.imagePublicId;

                    if (!finalImageUrl || !finalImagePublicId) {
                        console.warn("Image uploaded, but API did not return expected imageUrl/imagePublicId:", imageResponse.data);
                        // Có thể hiển thị warning nhưng vẫn tiếp tục
                    }

                    // Bước 3: Cập nhật lại Model với thông tin ảnh mới (nếu cần thiết và API hỗ trợ)
                    // Nếu bước 1 chưa lưu ảnh, hoặc bạn muốn đảm bảo thông tin ảnh được lưu sau khi upload thành công
                     try {
                         await updateVehicleModel(modelIdForUpload, {
                             ...modelDataToSend, // Dữ liệu cũ
                             imageUrl: finalImageUrl, // Ảnh mới
                             imagePublicId: finalImagePublicId // ID ảnh mới
                         });
                     } catch (updateAfterUploadError) {
                          console.error("Failed to update model with new image info:", updateAfterUploadError);
                          setError("Model saved, but failed to link new image. Please edit again.");
                          // Không throw lỗi ở đây để coi như model vẫn được lưu
                     }

                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    // Dù upload lỗi, model có thể đã được tạo/sửa ở bước 1
                    setError(`Model ${isEditMode ? 'updated' : 'created'}, but image upload failed: ${uploadError.response?.data?.message || uploadError.message}. You can edit the model to try uploading again.`);
                    // Không throw lỗi ở đây, gọi onSaveSuccess để reload list
                }
            }

            // Gọi callback báo thành công (dù ảnh có lỗi hay không, model đã được xử lý)
            onSaveSuccess(isEditMode);

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
            setError(`Database operation failed: ${errorMsg}`);
            setLoading(false); // Dừng loading nếu có lỗi ở bước 1
        } finally {
            setLoading(false); // Chuyển vào onSaveSuccess hoặc catch
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
                <div className="modal-dialog modal-dialog-centered" role="document">
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
