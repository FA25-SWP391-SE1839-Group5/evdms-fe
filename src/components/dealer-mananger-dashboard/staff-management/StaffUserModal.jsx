import { Button, Form, Modal, Spinner } from "react-bootstrap";

const StaffUserModal = ({ show, onClose, onSubmit, user, formData, onFormChange, errors = {}, submitting = false }) => {
  const isEdit = !!user;
  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={onSubmit} autoComplete="off">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Staff" : "Add New Staff"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={onFormChange} isInvalid={!!errors.fullName} placeholder="Enter full name" autoFocus required />
            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email *</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={onFormChange} isInvalid={!!errors.email} placeholder="user@example.com" required />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role *</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={onFormChange} required>
              <option value="DealerStaff">Dealer Staff</option>
              <option value="DealerManager">Dealer Manager</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="isActive">
            <Form.Check type="switch" name="isActive" label="Active" checked={formData.isActive} onChange={onFormChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StaffUserModal;
