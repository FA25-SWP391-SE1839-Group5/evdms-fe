import { useMemo, useState } from "react";

const SORTABLE_COLUMNS = [
  { key: "name", label: "Variant Name" },
  { key: "model", label: "Parent Model" },
  { key: "basePrice", label: "Base Price" },
  { key: "specs", label: "Specs" },
  { key: "features", label: "Features" },
];

const VehicleVariantTable = ({ variants, getModelName, formatPrice, handleView, loading, showModal, page, pageSize, totalResults, totalPages, setPage }) => {
  const [sort, setSort] = useState({ key: "name", direction: "asc" });

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedVariants = useMemo(() => {
    const sorted = [...variants];
    sorted.sort((a, b) => {
      let aValue, bValue;
      switch (sort.key) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "model":
          aValue = getModelName(a.modelId)?.toLowerCase() || "";
          bValue = getModelName(b.modelId)?.toLowerCase() || "";
          break;
        case "basePrice":
          aValue = a.basePrice || 0;
          bValue = b.basePrice || 0;
          break;
        case "specs":
          aValue = a.specs ? Object.keys(a.specs).length : 0;
          bValue = b.specs ? Object.keys(b.specs).length : 0;
          break;
        case "features":
          aValue = a.features ? Object.values(a.features).reduce((sum, arr) => sum + arr.length, 0) : 0;
          bValue = b.features ? Object.values(b.features).reduce((sum, arr) => sum + arr.length, 0) : 0;
          break;
        default:
          aValue = "";
          bValue = "";
      }
      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [variants, sort, getModelName]);

  return (
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
                    {SORTABLE_COLUMNS.map((col) => (
                      <th key={col.key} style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort(col.key)}>
                        {col.label}
                        {sort.key === col.key && <span style={{ marginLeft: 4 }}>{sort.direction === "asc" ? "▲" : "▼"}</span>}
                      </th>
                    ))}
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVariants.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="bx bx-customize bx-lg mb-2" />
                        <p>No variants found</p>
                      </td>
                    </tr>
                  ) : (
                    sortedVariants.map((variant) => {
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
};
export default VehicleVariantTable;
