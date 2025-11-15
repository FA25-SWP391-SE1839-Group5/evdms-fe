const DealerOrderReviewModal = ({
  open,
  order,
  onClose,
  onAccept,
  onDecline,
  onDeliver,
  loading,
  errorMessage,
  showInventoryAdjust,
  inventoryAdjustLoading,
  inventoryAdjustError,
  inventoryAdjustSuccess,
  inventoryAdjustAmount,
  setInventoryAdjustAmount,
  handleInventoryAdjust,
  currentInventory,
}) => {
  if (!open || !order) return null;

  // Helper for pretty field names
  const prettyField = (key) => {
    switch (key) {
      case "id":
        return "Order ID";
      case "dealerId":
        return "Dealer ID";
      case "dealerName":
        return "Dealer Name";
      case "variantId":
        return "Variant ID";
      case "variantName":
        return "Variant Name";
      case "quantity":
        return "Quantity";
      case "color":
        return "Color";
      case "status":
        return "Status";
      case "createdAt":
        return "Created At";
      case "updatedAt":
        return "Updated At";
      default:
        return key;
    }
  };

  // Helper for formatting date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge coloring like table
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-label-warning">Pending</span>;
      case "Confirmed":
        return <span className="badge bg-label-info">Confirmed</span>;
      case "Delivered":
        return <span className="badge bg-label-success">Delivered</span>;
      case "Canceled":
        return <span className="badge bg-label-danger">Canceled</span>;
      default:
        return <span className="badge bg-label-secondary">{status}</span>;
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.0)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bx bx-show me-2" />
              Order Details
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <div className="modal-body">
            <div className="row">
              {Object.entries(order).map(([key, value]) => (
                <div className="col-12 mb-2" key={key}>
                  <strong>{prettyField(key)}:</strong> {key === "createdAt" || key === "updatedAt" ? formatDate(value) : key === "status" ? getStatusBadge(value) : String(value)}
                </div>
              ))}
            </div>
            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
            {showInventoryAdjust && (
              <div className="card shadow-sm border-0 mb-3" style={{ background: "#fffbe6", borderRadius: "1rem" }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2" style={{ fontSize: "1.5rem", color: "#ffc107" }}>
                      <i className="bx bx-error-circle" />
                    </span>
                    <span style={{ fontWeight: 600, color: "#b8860b" }}>Not enough inventory for this variant</span>
                  </div>
                  <div className="mb-2 ms-1" style={{ fontSize: "0.98rem" }}>
                    {currentInventory ? (
                      <>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                          <span>
                            Current stock for <strong>{order.variantName}</strong>:
                          </span>
                          <span className="badge bg-primary" style={{ fontSize: "1rem", padding: "0.5em 1em" }}>
                            {currentInventory.quantity}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <span>Requested:</span>
                          <span className="badge bg-warning text-dark" style={{ fontSize: "1rem", padding: "0.5em 1em" }}>
                            {order.quantity}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-muted">Unable to fetch current inventory.</span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2 ms-1">
                    <label htmlFor="inventoryAdjustAmount" className="form-label mb-0" style={{ fontWeight: 500 }}>
                      Increase stock by:
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      style={{ maxWidth: "120px" }}
                      id="inventoryAdjustAmount"
                      value={inventoryAdjustAmount}
                      onChange={(e) => setInventoryAdjustAmount(e.target.value)}
                      disabled={inventoryAdjustLoading}
                      placeholder="Amount"
                    />
                    <button className="btn btn-warning ms-2" style={{ minWidth: "140px" }} onClick={handleInventoryAdjust} disabled={inventoryAdjustLoading || !inventoryAdjustAmount}>
                      {inventoryAdjustLoading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-1" />
                          Updating...
                        </span>
                      ) : (
                        <span>
                          <i className="bx bx-plus me-1" />
                          Increase Inventory
                        </span>
                      )}
                    </button>
                  </div>
                  {inventoryAdjustError && (
                    <div className="alert alert-danger mt-2 py-2 px-3" role="alert" style={{ borderRadius: "0.5rem" }}>
                      <i className="bx bx-error-circle me-1" />
                      {inventoryAdjustError}
                    </div>
                  )}
                  {inventoryAdjustSuccess && (
                    <div className="alert alert-success mt-2 py-2 px-3" role="alert" style={{ borderRadius: "0.5rem" }}>
                      <i className="bx bx-check-circle me-1" />
                      {inventoryAdjustSuccess}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onDecline} disabled={loading || order.status !== "Pending"}>
              {loading ? "Declining..." : "Decline"}
            </button>
            <button type="button" className="btn btn-success" onClick={onAccept} disabled={loading || order.status !== "Pending"}>
              {loading ? "Accepting..." : "Accept"}
            </button>
            <button type="button" className="btn btn-primary" onClick={onDeliver} disabled={loading || (order.status !== "Confirmed" && order.status !== "Paid")}>
              {loading ? "Delivering..." : "Deliver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerOrderReviewModal;
