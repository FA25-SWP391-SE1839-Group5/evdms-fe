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

  // SORTING
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Vehicle Variants</h1>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome, {user.name || user.email} ({user.role})
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {onNavigateToModels && (
              <button
                onClick={onNavigateToModels}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                <Settings size={18} />
                Vehicle Models
              </button>
            )}
            {!(showForm && editVariant === null) && (
              <button
                onClick={() => {
                  setEditVariant(null);
                  setShowForm(true);
                  setError(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                <Plus size={18} />
                Add Variant
              </button>
            )}
            <button 
              onClick={onLogout} 
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filters (only if not showing form) */}
        {!showForm && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <VehicleVariantSearch 
                value={search} 
                onChange={setSearch}
                onSearch={() => fetchVariants()}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="basePrice">Price</option>
                    <option value="createdAt">Created Date</option>
                  </select>
                  <button
                    onClick={() => handleSort(sortBy)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Per page:</label>
                  <select 
                    value={pagination.pageSize} 
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500">
                  {pagination.totalItems} variant(s) found
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form or List */}
        {showForm ? (
          <VehicleVariantForm
            initialData={
              editVariant
                ? {
                    modelId: editVariant.modelId,
                    name: editVariant.name,
                    basePrice: editVariant.basePrice,
                    specs: editVariant.specs || {},
                    features: editVariant.features || {}
                  }
                : null
            }
            models={models}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditVariant(null);
              setError(null);
            }}
          />
        ) : (
          <VehicleVariantList 
            variants={filteredVariants} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleVariantPage;
