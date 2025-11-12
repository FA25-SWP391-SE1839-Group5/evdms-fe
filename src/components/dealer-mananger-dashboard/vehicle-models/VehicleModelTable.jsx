const VehicleModelTable = ({ models, sortBy, sortOrder, setSortBy, setSortOrder, handleView, page, pageSize, totalResults, totalPages, setPage, loading, showModal }) => (
  <div className="card">
    <div className="card-body">
      {loading && !showModal ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Image</th>
                  <th
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => {
                      if (sortBy === "name") {
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortBy("name");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Name
                    {sortBy === "name" && <span style={{ marginLeft: 4 }}>{sortOrder === "asc" ? "▲" : "▼"}</span>}
                  </th>
                  <th
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => {
                      if (sortBy === "description") {
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortBy("description");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Description
                    {sortBy === "description" && <span style={{ marginLeft: 4 }}>{sortOrder === "asc" ? "▲" : "▼"}</span>}
                  </th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bx bx-car bx-lg mb-2" />
                      <p>No vehicle models found</p>
                    </td>
                  </tr>
                ) : (
                  models.map((model) => (
                    <tr key={model.id}>
                      <td>
                        {model.imageUrl ? (
                          <div style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={model.imageUrl} alt={model.name} className="rounded" style={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "1 / 1" }} />
                          </div>
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                            <i className="bx bx-image text-muted" />
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{model.name}</strong>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: "300px" }} title={model.description}>
                          {model.description || "No description"}
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-info" onClick={() => handleView(model.id)} title="View Details">
                            <i className="bx bx-show" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                      return (
                        <li key={pageNum} className={`page-item ${page === pageNum ? "active" : ""}`}>
                          <button className="page-link" onClick={() => setPage(pageNum)}>
                            {pageNum}
                          </button>
                        </li>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <li key={pageNum} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

export default VehicleModelTable;
