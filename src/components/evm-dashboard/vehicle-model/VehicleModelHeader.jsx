const VehicleModelHeader = ({ onCreate }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h4 className="fw-bold mb-1">Vehicle Model Management</h4>
      <p className="text-muted mb-0">Manage vehicle models, upload images, and track details</p>
    </div>
    <button className="btn btn-primary" onClick={onCreate}>
      <i className="bx bx-plus me-1" />
      Add New Model
    </button>
  </div>
);

export default VehicleModelHeader;
