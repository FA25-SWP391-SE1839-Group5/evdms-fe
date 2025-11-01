import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";

const DealerPaymentReviewModal = ({ open, payment, onClose, onPaid, onFailed, loading }) => {
  if (!payment) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
      case "Paid":
        return <span className="badge bg-label-success">Paid</span>;
      case "Failed":
        return <span className="badge bg-label-danger">Failed</span>;
      default:
        return <span className="badge bg-label-secondary">{status}</span>;
    }
  };

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Dealer Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <strong>Dealer Order ID:</strong> {payment.dealerOrderId}
        </div>
        <div className="mb-3">
          <strong>Amount:</strong> {payment.amount?.toLocaleString()} USD
        </div>
        <div className="mb-3">
          <strong>Status:</strong> {getStatusBadge(payment.status)}
        </div>
        <div className="mb-3">
          <strong>Created At:</strong> {formatDate(payment.createdAt)}
        </div>
        <div className="mb-3">
          <strong>Updated At:</strong> {formatDate(payment.updatedAt)}
        </div>
        {payment.documentUrl && (
          <div className="mb-3">
            <strong>Document:</strong>{" "}
            <a href={payment.documentUrl} target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onPaid} disabled={loading}>
          Mark as Paid
        </Button>
        <Button variant="danger" onClick={onFailed} disabled={loading}>
          Mark as Failed
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DealerPaymentReviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  payment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onPaid: PropTypes.func.isRequired,
  onFailed: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default DealerPaymentReviewModal;
