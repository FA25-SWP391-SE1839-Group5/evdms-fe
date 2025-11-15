const VehicleModelSearchFilter = ({ searchTerm, onSearchChange, pageSize, setPageSize, setPage }) => (
  <div className="card mb-4">
    <div className="card-body">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bx bx-search" />
            </span>
            <input type="text" className="form-control" placeholder="Search by model name..." value={searchTerm} onChange={onSearchChange} />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default VehicleModelSearchFilter;
