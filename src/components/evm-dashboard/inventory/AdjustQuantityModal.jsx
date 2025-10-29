// AdjustQuantityModal.jsx
// Modal for adjusting inventory quantity

const AdjustQuantityModal = ({ show, loading, adjustData, onClose, onChange, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="bx bx-adjust me-2" />
              Adjust Inventory Quantity
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="alert alert-info">
                <strong>Current Stock:</strong> {adjustData.currentQuantity} units
              </div>
              <div className="mb-3">
                <label className="form-label">Action</label>
                <div className="btn-group w-100" role="group">
                  <input type="radio" className="btn-check" name="action" id="action-add" value="add" checked={adjustData.action === "add"} onChange={onChange} />
                  <label className="btn btn-outline-success" htmlFor="action-add">
                    <i className="bx bx-plus me-1" />
                    Add Stock
                  </label>
                  <input type="radio" className="btn-check" name="action" id="action-remove" value="remove" checked={adjustData.action === "remove"} onChange={onChange} />
                  <label className="btn btn-outline-danger" htmlFor="action-remove">
                    <i className="bx bx-minus me-1" />
                    Remove Stock
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity to {adjustData.action === "add" ? "Add" : "Remove"}</label>
                <input
                  type="number"
                  className="form-control"
                  name="adjustment"
                  value={adjustData.adjustment}
                  onChange={onChange}
                  min="1"
                  max={adjustData.action === "remove" ? adjustData.currentQuantity : undefined}
                  step="1"
                  required
                  placeholder="Enter quantity"
                />
              </div>
              {adjustData.adjustment > 0 && (
                <div className={`alert ${adjustData.action === "add" ? "alert-success" : "alert-warning"}`}>
                  <strong>New Stock Level:</strong> {adjustData.currentQuantity + (adjustData.action === "add" ? Number(adjustData.adjustment) : -Number(adjustData.adjustment))} units
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className={`btn ${adjustData.action === "add" ? "btn-success" : "btn-warning"}`} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adjusting...
                  </>
                ) : (
                  <>
                    <i className={`bx ${adjustData.action === "add" ? "bx-plus" : "bx-minus"} me-1`} />
                    {adjustData.action === "add" ? "Add" : "Remove"} Stock
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

export default AdjustQuantityModal;
