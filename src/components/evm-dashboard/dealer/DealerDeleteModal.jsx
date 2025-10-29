const DealerDeleteModal = ({ showDeleteModal, dealerToDelete, loading, setShowDeleteModal, confirmDelete }) => {
  if (!showDeleteModal) return null;
  return (
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
            <p>Are you sure you want to delete this dealer?</p>
            {dealerToDelete && (
              <div className="alert alert-warning">
                <strong>{dealerToDelete.name}</strong>
                <p className="mb-0 mt-2">
                  <small className="text-muted">
                    Region: {dealerToDelete.region}
                    <br />
                    Address: {dealerToDelete.address}
                  </small>
                </p>
                <p className="mb-0 mt-2 text-danger small">This action cannot be undone.</p>
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
  );
};

export default DealerDeleteModal;
