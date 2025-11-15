// DeleteConfirmationModal.jsx
// Modal for confirming inventory deletion

const DeleteConfirmationModal = ({ show, loading, inventoryToDelete, getVariantName, onClose, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="bx bx-trash me-2" />
              Confirm Delete
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading} />
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this inventory record?</p>
            {inventoryToDelete && (
              <div className="alert alert-warning">
                <p className="mb-2">
                  <strong>Variant:</strong> {getVariantName(inventoryToDelete.variantId)}
                </p>
                <p className="mb-2">
                  <strong>Current Quantity:</strong> {inventoryToDelete.quantity}
                </p>
                <p className="mb-0 mt-2 text-danger small">This action cannot be undone. All inventory data will be lost.</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
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

export default DeleteConfirmationModal;
