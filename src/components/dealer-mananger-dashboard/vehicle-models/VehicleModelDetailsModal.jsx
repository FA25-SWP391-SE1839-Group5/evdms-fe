const VehicleModelDetailsModal = ({ show, onClose, currentModel, imagePreview }) => {
  if (!show || !currentModel) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bx bx-show me-2" />
              View Vehicle Model
            </h5>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Model Name</label>
              <input type="text" className="form-control" value={currentModel.name} disabled readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={currentModel.description} rows="4" disabled readOnly />
            </div>
            {imagePreview && (
              <div className="mb-3">
                <label className="form-label">Image Preview</label>
                <div className="text-center">
                  <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: "300px", objectFit: "contain" }} />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModelDetailsModal;
