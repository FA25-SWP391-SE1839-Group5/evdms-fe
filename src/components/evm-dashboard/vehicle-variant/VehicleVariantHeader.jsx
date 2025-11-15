const VehicleVariantHeader = ({ onCreate, onRefresh, totalResults }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h4 className="fw-bold mb-1">Vehicle Variant Management</h4>
      <p className="text-muted mb-0">Manage vehicle variants with specs and features</p>
    </div>
    <div>
      {typeof totalResults === "number" && (
        <span className="badge bg-label-primary me-3">{totalResults} Total</span>
      )}
      <button className="btn btn-outline-primary me-2" onClick={onCreate}>
        <i className="bx bx-plus me-1" />
        Add New Variant
      </button>
      {onRefresh && (
        <button className="btn btn-primary" onClick={onRefresh}>
          <i className="bx bx-refresh me-1" />
          Refresh
        </button>
      )}
    </div>
  </div>
);

export default VehicleVariantHeader;
