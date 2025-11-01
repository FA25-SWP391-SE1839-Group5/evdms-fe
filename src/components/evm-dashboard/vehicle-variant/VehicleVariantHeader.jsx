const VehicleVariantHeader = ({ onCreate }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h4 className="fw-bold mb-1">Vehicle Variant Management</h4>
      <p className="text-muted mb-0">Manage vehicle variants with specs and features</p>
    </div>
    <button className="btn btn-primary" onClick={onCreate}>
      <i className="bx bx-plus me-1" />
      Add New Variant
    </button>
  </div>
);

export default VehicleVariantHeader;
