import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { uploadVehicleImage, validateImageFile } from "lucide-react";
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

            {/* Brand */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            {/* Year */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-2 flex items-center gap-4">
                    {formData.image ? (
                        <div className="relative w-24 h-24">
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-xl border"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                            </button>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

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