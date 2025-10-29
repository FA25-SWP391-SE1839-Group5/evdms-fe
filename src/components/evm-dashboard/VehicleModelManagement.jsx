import { useEffect, useState } from "react";
import { createVehicleModel, deleteVehicleModel, getAllVehicleModels, getVehicleModelById, updateVehicleModel, uploadVehicleImage, validateImageFile } from "../../services/vehicleModelService";

const VehicleModelManagement = () => {
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
  const [sortBy, setSortBy] = useState("");

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

  // Fetch models on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVehicleModels({
          page,
          pageSize,
          search: searchTerm,
          sortBy,
          sortOrder: "asc",
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
  }, [page, pageSize, searchTerm, sortBy]);

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
        sortOrder: "asc",
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
      }, 1500);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Vehicle Model Management</h4>
          <p className="text-muted mb-0">Manage vehicle models, upload images, and track details</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Model
        </button>
      </div>

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
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bx bx-search" />
                </span>
                <input type="text" className="form-control" placeholder="Search by model name..." value={searchTerm} onChange={handleSearchChange} />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort by...</option>
                <option value="name">Name</option>
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          {loading && !showModal ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th style={{ width: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="bx bx-car bx-lg mb-2" />
                          <p>No vehicle models found</p>
                        </td>
                      </tr>
                    ) : (
                      models.map((model) => (
                        <tr key={model.id}>
                          <td>
                            {model.imageUrl ? (
                              <img
                                src={model.imageUrl}
                                alt={model.name}
                                className="rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                                <i className="bx bx-image text-muted" />
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{model.name}</strong>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: "300px" }} title={model.description}>
                              {model.description || "No description"}
                            </div>
                          </td>
                          <td>{formatDate(model.createdAt)}</td>
                          <td>{formatDate(model.updatedAt)}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button className="btn btn-sm btn-outline-info" onClick={() => handleView(model.id)} title="View Details">
                                <i className="bx bx-show" />
                              </button>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(model.id)} title="Edit">
                                <i className="bx bx-edit" />
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(model)} title="Delete">
                                <i className="bx bx-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first, last, current, and adjacent pages
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <li key={pageNum} className={`page-item ${page === pageNum ? "active" : ""}`}>
                              <button className="page-link" onClick={() => setPage(pageNum)}>
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return (
                            <li key={pageNum} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "create" && (
                    <>
                      <i className="bx bx-plus me-2" />
                      Create New Vehicle Model
                    </>
                  )}
                  {modalMode === "edit" && (
                    <>
                      <i className="bx bx-edit me-2" />
                      Edit Vehicle Model
                    </>
                  )}
                  {modalMode === "view" && (
                    <>
                      <i className="bx bx-show me-2" />
                      View Vehicle Model
                    </>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={uploading} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Model Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required
                      placeholder="e.g., Tesla Model Y"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      placeholder="Enter vehicle model description..."
                    />
                  </div>

                  {/* Image Upload */}
                  {modalMode !== "view" && (
                    <div className="mb-3">
                      <label className="form-label">Vehicle Image</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
                      <small className="text-muted">Accepted formats: JPG, JPEG, PNG, GIF, WEBP, BMP (Max: 5MB)</small>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3">
                      <label className="form-label">Image Preview</label>
                      <div className="text-center">
                        <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: "300px", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  {/* View mode details */}
                  {modalMode === "view" && currentModel && (
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Created At:</strong>
                          <br />
                          {formatDate(currentModel.createdAt)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Updated At:</strong>
                          <br />
                          {formatDate(currentModel.updatedAt)}
                        </p>
                      </div>
                      <div className="col-12 mt-2">
                        <p className="mb-2">
                          <strong>ID:</strong>
                          <br />
                          <code className="text-muted">{currentModel.id}</code>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={uploading}>
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                  {modalMode !== "view" && (
                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                      {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          {selectedFile ? "Uploading..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <i className="bx bx-save me-1" />
                          {modalMode === "create" ? "Create" : "Update"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bx bx-trash me-2" />
                  Confirm Delete
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} disabled={loading} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this vehicle model?</p>
                {modelToDelete && (
                  <div className="alert alert-warning">
                    <strong>{modelToDelete.name}</strong>
                    <p className="mb-0 mt-2 text-muted small">This action cannot be undone.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-trash me-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModelManagement;
