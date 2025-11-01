const DealerOrderReviewModal = ({ open, order, onClose, onAccept, onDecline, onDeliver, loading }) => {
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
                  <strong>{prettyField(key)}:</strong> {key === "createdAt" || key === "updatedAt" ? formatDate(value) : String(value)}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onDecline} disabled={loading || order.status !== "Pending"}>
              {loading ? "Declining..." : "Decline"}
            </button>
            <button type="button" className="btn btn-success" onClick={onAccept} disabled={loading || order.status !== "Pending"}>
              {loading ? "Accepting..." : "Accept"}
            </button>
            <button type="button" className="btn btn-primary" onClick={onDeliver} disabled={loading || order.status !== "Confirmed"}>
              {loading ? "Delivering..." : "Deliver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerOrderReviewModal;
