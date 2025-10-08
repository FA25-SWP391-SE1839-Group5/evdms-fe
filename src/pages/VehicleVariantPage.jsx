import { LogOut, Plus, Search, Filter, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import VehicleVariantForm from "../components/vehicle-variant/VehicleVariantForm";
import VehicleVariantList from "../components/vehicle-variant/VehicleVariantList";
import VehicleVariantSearch from "../components/vehicle-variant/VehicleVariantSearch";
import { 
  getAllVehicleVariants, 
  deleteVehicleVariant,
  createVehicleVariant,
  updateVehicleVariant,
  patchVehicleVariant
} from "../services/vehicleVariantService";
import { getAllVehicleModels } from "../services/vehicleModelService";

const VehicleVariantPage = ({ user, onLogout, onNavigateToModels }) => {
  const [variants, setVariants] = useState([]);
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch variants and models when component mounts
  useEffect(() => {
    fetchVariants();
    fetchModels();
  }, [pagination.page, pagination.pageSize, sortBy, sortOrder, search]);

  const fetchVariants = async () => {
  setLoading(true);
  setError(null);
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
      search: search || null
    };

    const response = await getAllVehicleVariants(params);
    console.log("Vehicle variants response:", response);

    // ✅ An toàn cho mọi trường hợp (có thể response.data hoặc response.data.data)
    const data = response.data?.data || response.data || {};
    const items = data.items || [];
    const totalItems = data.totalResults || data.totalItems || items.length;
    const totalPages = data.totalPages || Math.ceil(totalItems / pagination.pageSize);

    if (items.length > 0) {
      setVariants(items);
      setPagination(prev => ({
        ...prev,
        totalItems,
        totalPages
      }));
    } else {
      setVariants([]);
    }
  } catch (err) {
    console.error("Error fetching variants:", err);
    console.log("Error message:", err.message);
console.log("Error response data:", err.response?.data);
console.log("Error status:", err.response?.status);

    setError(err.response?.data?.message || "Failed to load vehicle variants");
  } finally {
    setLoading(false);
  }
};



  const fetchModels = async () => {
    try {
      const response = await getAllVehicleModels();
      const data = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : [];
      setModels(data);
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

   // Filter variants by search
  const filteredVariants = variants.filter((v) => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.modelName && v.modelName.toLowerCase().includes(search.toLowerCase()))
  );

  // CREATE or UPDATE
  const handleSubmit = async (data) => {
    setError(null);

    try {
      if (editVariant) {
        // UPDATE
        const response = await updateVehicleVariant(editVariant.id, data);
        if (response.success && response.data) {
          setVariants((prev) => prev.map((v) => (v.id === editVariant.id ? response.data : v)));
          alert("Vehicle variant updated successfully!");
        }
      } else {
        // CREATE
        const response = await createVehicleVariant(data);
        if (response.success) {
          setVariants((prev) => [...prev, response.data]);
          alert("Vehicle variant created successfully!");
        }
      }
      setShowForm(false);
      setEditVariant(null);
      fetchVariants(); // Refresh the list
    } catch (err) {
      console.error("Error submitting variant:", err);
      setError(err.response?.data?.message || "Failed to save vehicle variant");
    }
  };

  // EDIT
  const handleEdit = (variant) => {
    setEditVariant(variant);
    setShowForm(true);
    setError(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    setError(null);
    try {
      const response = await deleteVehicleVariant(id);
      if (response.success) {
        setVariants((prev) => prev.filter((v) => v.id !== id));
        alert("Vehicle variant deleted successfully!");
        fetchVariants(); // Refresh the list
      }
    } catch (err) {
      console.error("Error deleting variant:", err);
      setError(err.response?.data?.message || "Failed to delete vehicle variant");
    }
  };

  // PAGINATION
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

 