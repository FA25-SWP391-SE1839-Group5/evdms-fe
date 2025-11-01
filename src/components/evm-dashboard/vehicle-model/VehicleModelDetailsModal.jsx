const VehicleModelDetailsModal = ({ show, onClose, currentModel, imagePreview, uploading }) => {
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
            <button type="button" className="btn-close" onClick={onClose} disabled={uploading} />
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
            <div className="row">
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Created At:</strong>
                  <br />
                  {currentModel.createdAt}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Updated At:</strong>
                  <br />
                  {currentModel.updatedAt}
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={uploading}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModelDetailsModal;
