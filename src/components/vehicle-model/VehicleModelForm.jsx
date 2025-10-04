import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { uploadVehicleImage, validateImageFile } from "../../services/vehicleModelService";
const VehicleModelForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        modelName: "",
        descriptions: "",
        imageUrl: null,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
        setFormData({
            modelName: initialData.modelName || "",
            descriptions: initialData.descriptions || "",
            imageUrl: initialData.imageUrl || "",
        });
        if (initialData.imageUrl) {
                setImagePreview(initialData.imageUrl);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error khi user type
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
            setErrors(prev => ({ ...prev, image: validationError }));
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, image: null }));
    };

    const handleUploadImage = async () => {
        if (!imageFile) return;

        setUploading(true);
        setErrors(prev => ({ ...prev, image: null }));

        try {
            const result = await uploadVehicleImage(imageFile);
            if (result.success) {
                setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
                alert('Image uploaded successfully!');
            }
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                image: error.response?.data?.message || 'Failed to upload image' 
            }));
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: "" }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.modelName.trim()) {
            newErrors.modelName = 'Model name is required';
        }

        if (!formData.descriptions.trim()) {
            newErrors.descriptions = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        // 3 fields theo Swagger API
        const payload = {
            modelName: formData.modelName.trim(),
            descriptions: formData.descriptions.trim(),
            imageUrl: formData.imageUrl || null
        };

        onSubmit(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-2xl p-6 max-w-lg mx-auto space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {initialData ? "Edit Vehicle Model" : "Add Vehicle Model"}
            </h2>

            {/* Model Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Model Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleChange}
                    placeholder="e.g. Tesla Model S"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        errors.modelName ? 'border-red-500' : ''
                    }`}
                />
                {errors.modelName && (
                    <p className="text-red-500 text-xs mt-1">{errors.modelName}</p>
                )}
            </div>

            {/* Descriptions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="descriptions"
                    value={formData.descriptions}
                    onChange={handleChange}
                    placeholder="Enter detailed description..."
                    rows="4"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none ${
                        errors.descriptions ? 'border-red-500' : ''
                    }`}
                />
                {errors.descriptions && (
                    <p className="text-red-500 text-xs mt-1">{errors.descriptions}</p>
                )}
            </div>    
            
            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                </label>
                <div className="mt-2 space-y-3">
                    {imagePreview ? (
                        <div className="relative w-full h-48 border rounded-xl overflow-hidden">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Click to upload image</span>
                            <span className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}

                    {/* Upload Button (nếu có file chưa upload) */}
                    {imageFile && !formData.imageUrl && (
                        <button
                            type="button"
                            onClick={handleUploadImage}
                            disabled={uploading}
                            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    )}

                    {formData.imageUrl && (
                        <p className="text-xs text-green-600">✓ Image uploaded successfully</p>
                    )}

                    {errors.image && (
                        <p className="text-red-500 text-xs">{errors.image}</p>
                    )}
                </div>
            </div>

            {/* Image URL (hidden field, read-only) */}
            {formData.imageUrl && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                    </label>
                    <input
                        type="text"
                        value={formData.imageUrl}
                        readOnly
                        className="w-full border rounded-xl px-3 py-2 bg-gray-50 text-gray-600 text-sm"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-xl border bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    {initialData ? "Update" : "Save"}
                </button>
            </div>
        </form>
    );
};

export default VehicleModelForm;