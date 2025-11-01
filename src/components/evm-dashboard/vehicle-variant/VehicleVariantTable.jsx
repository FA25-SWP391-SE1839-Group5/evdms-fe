const VehicleVariantTable = ({ variants, getModelName, formatPrice, handleView, handleEdit, handleDeleteClick, loading, showModal, page, pageSize, totalResults, totalPages, setPage }) => (
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
                  <th>Variant Name</th>
                  <th>Parent Model</th>
                  <th>Base Price</th>
                  <th>Specs</th>
                  <th>Features</th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bx bx-customize bx-lg mb-2" />
                      <p>No variants found</p>
                    </td>
                  </tr>
                ) : (
                  variants.map((variant) => {
                    const specsCount = variant.specs ? Object.keys(variant.specs).length : 0;
                    const featuresCount = variant.features ? Object.values(variant.features).reduce((sum, arr) => sum + arr.length, 0) : 0;
                    return (
                      <tr key={variant.id}>
                        <td>
                          <strong>{variant.name}</strong>
                        </td>
                        <td>{getModelName(variant.modelId)}</td>
                        <td className="text-primary fw-semibold">{formatPrice(variant.basePrice)}</td>
                        <td>
                          <span className="badge bg-label-info">{specsCount} specs</span>
                        </td>
                        <td>
                          <span className="badge bg-label-success">{featuresCount} features</span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-info" onClick={() => handleView(variant.id)} title="View">
                              <i className="bx bx-show" />
                            </button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(variant.id)} title="Edit">
                              <i className="bx bx-edit" />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(variant)} title="Delete">
                              <i className="bx bx-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNum = i + 1;
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

export default VehicleVariantTable;
