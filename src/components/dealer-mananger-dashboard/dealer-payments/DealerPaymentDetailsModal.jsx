import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

import PropTypes from "prop-types";

const DealerPaymentDetailsModal = ({ show, onClose, payment, uploading = false, error = null, onFileSelect, onUpload, documentUrl }) => {
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
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Dealer Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <strong>Amount:</strong> ${payment.amount?.toLocaleString()}
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
        {documentUrl && (
          <div className="mb-3">
            <strong>Document:</strong>{" "}
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </div>
        )}
        <Form onSubmit={onUpload}>
          <Form.Group controlId="paymentFile">
            <Form.Label>Upload/Replace PDF Document</Form.Label>
            <Form.Control type="file" accept=".pdf" onChange={onFileSelect} disabled={uploading || payment.status?.toLowerCase() !== "pending"} />
          </Form.Group>
          <div className="mt-3 d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2" disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={uploading || payment.status?.toLowerCase() !== "pending"}>
              {uploading ? <Spinner as="span" size="sm" /> : "Upload PDF"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

DealerPaymentDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  payment: PropTypes.object,
  uploading: PropTypes.bool,
  error: PropTypes.any,
  onFileSelect: PropTypes.func,
  onUpload: PropTypes.func,
  documentUrl: PropTypes.string,
};

export default DealerPaymentDetailsModal;
