import { useEffect, useState } from "react";
import { createVehicleModel, deleteVehicleModel, getAllVehicleModels, getVehicleModelById, updateVehicleModel, uploadVehicleImage, validateImageFile } from "../../services/vehicleModelService";
import VehicleModelCreateModal from "./vehicle-model/VehicleModelCreateModal";
import VehicleModelDeleteModal from "./vehicle-model/VehicleModelDeleteModal";
import VehicleModelDetailsModal from "./vehicle-model/VehicleModelDetailsModal";
import VehicleModelEditModal from "./vehicle-model/VehicleModelEditModal";
import VehicleModelHeader from "./vehicle-model/VehicleModelHeader";
import VehicleModelSearchFilter from "./vehicle-model/VehicleModelSearchFilter";
import VehicleModelTable from "./vehicle-model/VehicleModelTable";

const VehicleModelManagement = () => {
  // Open create modal if ?create=1 is in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("create") === "1") {
      setModalMode("create");
      setFormData({ name: "", description: "", imageUrl: "" });
      setSelectedFile(null);
      setImagePreview(null);
      setCurrentModel(null);
      setShowModal(true);
      // Remove the query param from the URL (optional, for cleaner UX)
      params.delete("create");
      const newUrl = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);
  // State management
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [currentModel, setCurrentModel] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch models on mount and when filters change (use debouncedSearchTerm)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVehicleModels({
          page,
          pageSize,
          search: debouncedSearchTerm,
          sortBy,
          sortOrder,
        });
        setModels(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError("Failed to fetch vehicle models: " + (err.message || "Unknown error"));
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, debouncedSearchTerm, sortBy, sortOrder]);

  // Fetch models with pagination
  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicleModels({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      setModels(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError("Failed to fetch vehicle models: " + (err.message || "Unknown error"));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({ name: "", description: "", imageUrl: "" });
    setSelectedFile(null);
    setImagePreview(null);
    setCurrentModel(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const model = await getVehicleModelById(id);
      setCurrentModel(model);
      setFormData({
        name: model.name,
        description: model.description,
        imageUrl: model.imageUrl || "",
      });
      setImagePreview(model.imageUrl || null);
      setSelectedFile(null);
      setModalMode("edit");
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch model details: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const model = await getVehicleModelById(id);
      setCurrentModel(model);
      setFormData({
        name: model.name,
        description: model.description,
        imageUrl: model.imageUrl || "",
      });
      setImagePreview(model.imageUrl || null);
      setModalMode("view");
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch model details: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Vehicle model name is required");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = formData.imageUrl;

      // Upload image if a new file is selected
      if (selectedFile) {
        console.log("Uploading image...");
        const uploadResult = await uploadVehicleImage(selectedFile);
        imageUrl = uploadResult.imageUrl;
        console.log("Image uploaded:", imageUrl);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        imageUrl,
      };

      if (modalMode === "create") {
        await createVehicleModel(payload);
        setSuccess("Vehicle model created successfully!");
      } else if (modalMode === "edit") {
        await updateVehicleModel(currentModel.id, payload);
        setSuccess("Vehicle model updated successfully!");
      }

      // Refresh list and close modal
      await fetchModels();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      });
    } catch (err) {
      setError("Failed to save vehicle model: " + (err.response?.data?.message || err.message || "Unknown error"));
      console.error("Save error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (model) => {
    setModelToDelete(model);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!modelToDelete) return;

    try {
      setLoading(true);
      await deleteVehicleModel(modelToDelete.id);
      setSuccess("Vehicle model deleted successfully!");
      setShowDeleteModal(false);
      setModelToDelete(null);
      await fetchModels();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete vehicle model: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
  {/* Header */}
  <VehicleModelHeader onCreate={handleCreate} onRefresh={fetchModels} totalResults={totalResults} />

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bx bx-check-circle me-2" />
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
        </div>
      )}

      {/* Search and Filter Card */}
      <VehicleModelSearchFilter searchTerm={searchTerm} onSearchChange={handleSearchChange} pageSize={pageSize} setPageSize={setPageSize} setPage={setPage} />

      {/* Table Card */}
      <VehicleModelTable
        models={models}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        formatDate={formatDate}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
        page={page}
        pageSize={pageSize}
        totalResults={totalResults}
        totalPages={totalPages}
        setPage={setPage}
        loading={loading}
        showModal={showModal}
      />

      {/* Create/Edit Modal */}
      <VehicleModelCreateModal
        show={showModal && modalMode === "create"}
        onClose={() => setShowModal(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onFileSelect={handleFileSelect}
        imagePreview={imagePreview}
        uploading={uploading}
        onSubmit={handleSubmit}
      />

      <VehicleModelEditModal
        show={showModal && modalMode === "edit"}
        onClose={() => setShowModal(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onFileSelect={handleFileSelect}
        imagePreview={imagePreview}
        uploading={uploading}
        onSubmit={handleSubmit}
      />

      <VehicleModelDetailsModal show={showModal && modalMode === "view"} onClose={() => setShowModal(false)} currentModel={currentModel} imagePreview={imagePreview} uploading={uploading} />

      <VehicleModelDeleteModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} loading={loading} modelToDelete={modelToDelete} />
    </div>
  );
};

export default VehicleModelManagement;
