// InventoryModal.jsx
// Modal for create, edit, and view inventory

const InventoryModal = ({ show, loading, modalMode, formData, variants, currentInventory, onClose, onChange, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === "create" && (
                <>
                  <i className="bx bx-plus me-2" />
                  Create New Inventory
                </>
              )}
              {modalMode === "edit" && (
                <>
                  <i className="bx bx-edit me-2" />
                  Edit Inventory
                </>
              )}
              {modalMode === "view" && (
                <>
                  <i className="bx bx-show me-2" />
                  View Inventory
                </>
              )}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {/* Variant Selection */}
              <div className="mb-3">
                <label className="form-label">
                  Vehicle Variant <span className="text-danger">*</span>
                </label>
                {modalMode === "view" ? (
                  <input type="text" className="form-control" value={currentInventory?.variantName || ""} readOnly />
                ) : (
                  <select className="form-select" name="variantId" value={formData.variantId} onChange={onChange} required>
                    <option value="">Select a variant...</option>
                    {variants.map((variant) => {
                      const model = variant.modelName || variant.name || "Unknown";
                      const sub = variant.variantName || variant.trim || "";
                      return (
                        <option key={variant.id} value={variant.id}>
                          {model}
                          {sub ? ` - ${sub}` : ""}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
              {/* Quantity */}
              <div className="mb-3">
                <label className="form-label">
                  Quantity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={formData.quantity}
                  onChange={onChange}
                  disabled={modalMode === "view"}
                  min="0"
                  step="1"
                  required
                  placeholder="Enter initial quantity"
                />
                <small className="text-muted">{modalMode === "create" ? "Enter initial stock quantity" : "Update total quantity"}</small>
              </div>
              {/* View mode details */}
              {modalMode === "view" && currentInventory && (
                <div className="mt-3">
                  <hr />
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <p className="mb-2">
                        <strong>Created At:</strong>
                        <br />
                        {currentInventory.createdAt}
                      </p>
                    </div>
                    <div className="col-md-6 mt-2">
                      <p className="mb-2">
                        <strong>Updated At:</strong>
                        <br />
                        {currentInventory.updatedAt}
                      </p>
                    </div>
                    <div className="col-md-12 mt-2">
                      <p className="mb-2">
                        <strong>Status:</strong>
                        <br />
                        <span className="badge bg-label-info">{currentInventory.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              {modalMode !== "view" && (
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
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
  );
};

export default InventoryModal;
