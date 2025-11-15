// src/components/Common/DeleteConfirmationModal.js (Hoặc một thư mục chung)
import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";

const DeleteConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  body,
  error, // Thêm prop để nhận lỗi
  isDeleting, // Thêm prop để xử lý trạng thái loading
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Xác nhận"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {body || "Bạn có chắc chắn muốn thực hiện hành động này?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isDeleting}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              {" "}Đang xóa...
            </>
          ) : (
            "Xác nhận Xóa"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;