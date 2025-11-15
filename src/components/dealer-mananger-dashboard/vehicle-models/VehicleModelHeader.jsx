const VehicleModelHeader = ({ onRefresh, totalResults }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h4 className="fw-bold mb-1">Vehicle Model Browsing</h4>
      <p className="text-muted mb-0">Browse vehicle models</p>
    </div>
    <div>
      {typeof totalResults === "number" && <span className="badge bg-label-primary me-3">{totalResults} Total</span>}
      {onRefresh && (
        <button className="btn btn-primary" onClick={onRefresh}>
          <i className="bx bx-refresh me-1" />
          Refresh
        </button>
      )}
    </div>
  </div>
);

export default VehicleModelHeader;
