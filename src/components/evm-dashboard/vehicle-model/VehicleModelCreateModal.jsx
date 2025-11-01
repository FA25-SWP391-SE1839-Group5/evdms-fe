const VehicleModelCreateModal = ({ show, onClose, formData, onInputChange, onFileSelect, imagePreview, uploading, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bx bx-plus me-2" />
              Create New Vehicle Model
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={uploading} />
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Model Name <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={onInputChange} required placeholder="e.g., Tesla Model Y" />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={onInputChange} required placeholder="Enter vehicle model description..." />
              </div>
              <div className="mb-3">
                <label className="form-label">Vehicle Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={onFileSelect} disabled={uploading} />
                <small className="text-muted">Accepted formats: JPG, JPEG, PNG, GIF, WEBP, BMP (Max: 5MB)</small>
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
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={uploading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bx bx-save me-1" />
                    Create
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleModelCreateModal;
