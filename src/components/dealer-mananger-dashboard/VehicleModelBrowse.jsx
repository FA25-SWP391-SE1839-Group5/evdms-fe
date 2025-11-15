import { useEffect, useState } from "react";
import { getAllVehicleModels, getVehicleModelById } from "../../services/vehicleModelService";
import VehicleModelDetailsModal from "./vehicle-models/VehicleModelDetailsModal";
import VehicleModelHeader from "./vehicle-models/VehicleModelHeader";
import VehicleModelSearchFilter from "./vehicle-models/VehicleModelSearchFilter";
import VehicleModelTable from "./vehicle-models/VehicleModelTable";

const VehicleModelBrowse = () => {
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

  const [imagePreview, setImagePreview] = useState(null);

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

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const model = await getVehicleModelById(id);
      setCurrentModel(model);
      setImagePreview(model.imageUrl || null);
      setModalMode("view");
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch model details: " + (err.message || "Unknown error"));
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
      <VehicleModelHeader onRefresh={fetchModels} totalResults={totalResults} />

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
        page={page}
        pageSize={pageSize}
        totalResults={totalResults}
        totalPages={totalPages}
        setPage={setPage}
        loading={loading}
        showModal={showModal}
      />

      <VehicleModelDetailsModal show={showModal && modalMode === "view"} onClose={() => setShowModal(false)} currentModel={currentModel} imagePreview={imagePreview} />
    </div>
  );
};

export default VehicleModelBrowse;
