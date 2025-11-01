const VehicleVariantSearchFilter = ({ searchTerm, onSearchChange, pageSize, onPageSizeChange, sortBy, onSortByChange }) => (
  <div className="card mb-4">
    <div className="card-body">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bx bx-search" />
            </span>
            <input type="text" className="form-control" placeholder="Search variants..." value={searchTerm} onChange={onSearchChange} />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={pageSize} onChange={onPageSizeChange}>
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={sortBy} onChange={onSortByChange}>
            <option value="">Sort by...</option>
            <option value="name">Name</option>
            <option value="basePrice">Base Price</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default VehicleVariantSearchFilter;
