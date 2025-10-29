import { useState } from "react";
import AdjustQuantityModal from "./inventory/AdjustQuantityModal";
import DeleteConfirmationModal from "./inventory/DeleteConfirmationModal";
import InventoryModal from "./inventory/InventoryModal";
import InventoryTable from "./inventory/InventoryTable";
import { formatDate, getStockStatus } from "./inventory/inventoryUtils";
import useInventory from "./inventory/useInventory";
import useVariants from "./inventory/useVariants";

const InventoryManagement = () => {
  // Pagination & filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view', 'adjust'
  const [currentInventory, setCurrentInventory] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    variantId: "",
    quantity: 0,
  });

  // Adjust quantity modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustData, setAdjustData] = useState({
    inventoryId: "",
    variantId: "",
    currentQuantity: 0,
    adjustment: 0,
    action: "add", // 'add' or 'remove'
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  // Inventory and variants hooks
  const { inventories, totalResults, loading, error, fetchInventories, getInventoryById, createInventory, updateInventory, deleteInventory, adjustInventoryQuantity } = useInventory(
    page,
    pageSize,
    searchTerm,
    sortBy
  );
  const { variants } = useVariants();
  const [success, setSuccess] = useState(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      variantId: variants[0]?.id || "",
      quantity: 0,
    });
    setCurrentInventory(null);
    setShowModal(true);
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      const inventory = await getInventoryById(id);
      setCurrentInventory(inventory);
      setFormData({
        variantId: inventory.variantId,
        quantity: inventory.quantity,
      });
      setModalMode("view");
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Open adjust quantity modal
  const handleAdjust = async (id) => {
    try {
      const inventory = await getInventoryById(id);
      setAdjustData({
        inventoryId: id,
        variantId: inventory.variantId,
        currentQuantity: inventory.quantity,
        adjustment: 0,
        action: "add",
      });
      setShowAdjustModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adjust data change
  const handleAdjustChange = (e) => {
    const { name, value } = e.target;
    setAdjustData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  // Remove duplicate error state, use error from useInventory
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    // Validation
    if (!formData.variantId) {
      // Use local error for validation
      alert("Please select a vehicle variant");
      return;
    }

    try {
      const payload = {
        variantId: formData.variantId,
        quantity: Number(formData.quantity) || 0,
      };

      if (modalMode === "create") {
        await createInventory(payload);
        setSuccess("Inventory created successfully!");
      } else if (modalMode === "edit") {
        await updateInventory(currentInventory.id, payload);
        setSuccess("Inventory updated successfully!");
      }

      // Refresh list and close modal
      await fetchInventories();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      alert("Failed to save inventory: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  // Handle adjust quantity submit
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    const adjustmentValue = Number(adjustData.adjustment);
    if (adjustmentValue === 0) {
      alert("Adjustment value must be greater than 0");
      return;
    }

    // Calculate new quantity based on action
    const quantityChange = adjustData.action === "add" ? adjustmentValue : -adjustmentValue;
    const newQuantity = adjustData.currentQuantity + quantityChange;

    if (newQuantity < 0) {
      alert(`Cannot remove ${Math.abs(quantityChange)} units. Only ${adjustData.currentQuantity} available.`);
      return;
    }

    try {
      await adjustInventoryQuantity(adjustData.inventoryId, adjustData.variantId, newQuantity);
      setSuccess(`Successfully ${adjustData.action === "add" ? "added" : "removed"} ${Math.abs(quantityChange)} units!`);

      // Refresh list and close modal
      await fetchInventories();
      setTimeout(() => {
        setShowAdjustModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      alert("Failed to adjust inventory: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  // Handle delete
  const handleDeleteClick = (inventory) => {
    setInventoryToDelete(inventory);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!inventoryToDelete) return;

    try {
      await deleteInventory(inventoryToDelete.id);
      setSuccess("Inventory deleted successfully!");
      setShowDeleteModal(false);
      setInventoryToDelete(null);
      await fetchInventories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      alert("Failed to delete inventory: " + (err.message || "Unknown error"));
    }
  };

  // Get variant name by ID
  const getVariantName = (variantId) => {
    const variant = variants.find((v) => v.id === variantId);
    return variant ? `${variant.modelName || variant.name || "Unknown"} - ${variant.variantName || variant.trim || ""}` : variantId;
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">OEM Inventory Management</h4>
          <p className="text-muted mb-0">Manage vehicle inventory, stock levels, and adjustments</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Inventory
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
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
                <input type="text" className="form-control" placeholder="Search by variant..." value={searchTerm} onChange={handleSearchChange} />
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
                <option value="quantity">Quantity</option>
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
          {loading && !showModal && !showAdjustModal ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <InventoryTable
                inventories={inventories}
                getStockStatus={getStockStatus}
                formatDate={formatDate}
                handleAdjust={handleAdjust}
                handleView={handleView}
                handleDeleteClick={handleDeleteClick}
              />

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
                      {Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
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
      <InventoryModal
        show={showModal}
        loading={loading}
        modalMode={modalMode}
        formData={formData}
        variants={variants}
        currentInventory={currentInventory}
        onClose={() => setShowModal(false)}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {/* Adjust Quantity Modal */}
      <AdjustQuantityModal show={showAdjustModal} loading={loading} adjustData={adjustData} onClose={() => setShowAdjustModal(false)} onChange={handleAdjustChange} onSubmit={handleAdjustSubmit} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        loading={loading}
        inventoryToDelete={inventoryToDelete}
        getVariantName={getVariantName}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default InventoryManagement;
