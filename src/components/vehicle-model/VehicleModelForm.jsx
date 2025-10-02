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
};

export default VehicleModelForm;