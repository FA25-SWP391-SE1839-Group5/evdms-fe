const SortableHeader = ({ field, label, sortBy, sortOrder, onSort }) => (
  <th role="button" tabIndex={0} onClick={() => onSort(field)} style={{ userSelect: "none" }}>
    {label}
    {sortBy === field && <span className="ms-1">{sortOrder === "asc" ? <i className="bx bx-up-arrow-alt" /> : <i className="bx bx-down-arrow-alt" />}</span>}
  </th>
);

const DealerTable = ({ dealers, getRegionColor, formatDate, handleView, handleEdit, handleDeleteClick, sortBy, sortOrder, handleSort }) => (
  <div className="table-responsive">
    <table className="table table-hover">
      <thead>
        <tr>
          <SortableHeader field="name" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
          <SortableHeader field="region" label="Region" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
          <SortableHeader field="address" label="Address" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
          <th>Created At</th>
          <th>Updated At</th>
          <th style={{ width: "150px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {dealers.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center py-5 text-muted">
              <i className="bx bx-store bx-lg mb-2" />
              <p>No dealers found</p>
            </td>
          </tr>
        ) : (
          dealers.map((dealer) => (
            <tr key={dealer.id}>
              <td>
                <strong>{dealer.name}</strong>
              </td>
              <td>
                <span className={`badge bg-label-${getRegionColor(dealer.region)}`}>{dealer.region}</span>
              </td>
              <td>
                <div className="text-truncate" style={{ maxWidth: "250px" }} title={dealer.address}>
                  {dealer.address}
                </div>
              </td>
              <td>{formatDate(dealer.createdAt)}</td>
              <td>{formatDate(dealer.updatedAt)}</td>
              <td>
                <div className="btn-group" role="group">
                  <button className="btn btn-sm btn-outline-info" onClick={() => handleView(dealer.id)} title="View Details">
                    <i className="bx bx-show" />
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(dealer.id)} title="Edit">
                    <i className="bx bx-edit" />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(dealer)} title="Delete">
                    <i className="bx bx-trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DealerTable;
