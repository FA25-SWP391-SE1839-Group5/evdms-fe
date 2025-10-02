import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

const VehicleModelForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        year: "",
        price: "",
        image: null,
    });

    useEffect(() => {
        if (initialData) {
        setFormData({
            name: initialData.name || "",
            brand: initialData.brand || "",
            year: initialData.year || "",
            price: initialData.price || "",
            image: initialData.image || null,
        });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setFormData((prev) => ({
            ...prev,
            image: URL.createObjectURL(file),
        }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-2xl p-6 max-w-lg mx-auto space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {initialData ? "Edit Vehicle Model" : "Add Vehicle Model"}
            </h2>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Model Name</label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
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

                    )}
                </div>
            </div>


        </form>
    );
};

export default VehicleModelForm;