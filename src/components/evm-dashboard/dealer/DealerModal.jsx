const DealerModal = ({ showModal, modalMode, loading, formData, REGIONS, handleInputChange, handleSubmit, setShowModal, currentDealer }) => {
  if (!showModal) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === "create" && (
                <>
                  <i className="bx bx-plus me-2" />
                  Create New Dealer
                </>
              )}
              {modalMode === "edit" && (
                <>
                  <i className="bx bx-edit me-2" />
                  Edit Dealer
                </>
              )}
              {modalMode === "view" && (
                <>
                  <i className="bx bx-show me-2" />
                  View Dealer
                </>
              )}
            </h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">
                  Dealer Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  required
                  placeholder="e.g., EV Motors Saigon"
                />
              </div>
              {/* Region */}
              <div className="mb-3">
                <label className="form-label">
                  Region <span className="text-danger">*</span>
                </label>
                <select className="form-select" name="region" value={formData.region} onChange={handleInputChange} disabled={modalMode === "view"} required>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              {/* Address */}
              <div className="mb-3">
                <label className="form-label">
                  Address <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  required
                  placeholder="Enter full address..."
                />
              </div>
              {/* View mode details */}
              {modalMode === "view" && currentDealer && (
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Created At:</strong>
                      <br />
                      {currentDealer.createdAt}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Updated At:</strong>
                      <br />
                      {currentDealer.updatedAt}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>
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

export default DealerModal;
