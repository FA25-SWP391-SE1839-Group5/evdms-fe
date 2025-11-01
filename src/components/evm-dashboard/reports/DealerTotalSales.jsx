import { useEffect, useState } from "react";
import { exportDealerTotalSales, getDealerTotalSales } from "../../../services/reportService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

const DealerTotalSales = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("totalAmount");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDealerTotalSales({ page, pageSize, sortBy, sortOrder });
      setData(res.data.items || []);
      setTotalResults(res.data.totalResults || 0);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, pageSize, sortBy, sortOrder]);

  useEffect(() => {
    let filtered = data;
    if (search.trim()) {
      filtered = data.filter((item) => item.dealerName.toLowerCase().includes(search.trim().toLowerCase()));
    }
    setFilteredData(filtered);
  }, [data, search]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleExport = async () => {
    try {
      await exportDealerTotalSales("csv", { page, pageSize, sortBy, sortOrder });
    } catch {
      alert("Export failed");
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedData = filteredData;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dealer Total Sales</h4>
          <p className="text-muted mb-0">Shows total orders and sales amount for each dealer</p>
        </div>
        <div className="card mt-3 mb-2">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bx bx-search" />
                  </span>
                  <input type="text" className="form-control" placeholder="Search dealer name..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 text-end">
                <button className="btn btn-outline-primary" onClick={handleExport}>
                  <i className="bx bx-download me-1" /> Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("dealerName")} style={{ cursor: "pointer" }}>
                      Dealer Name {sortBy === "dealerName" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("region")} style={{ cursor: "pointer" }}>
                      Region {sortBy === "region" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("totalOrders")} style={{ cursor: "pointer" }}>
                      Total Orders {sortBy === "totalOrders" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("totalAmount")} style={{ cursor: "pointer" }}>
                      Total Amount {sortBy === "totalAmount" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, idx) => (
                      <tr key={item.dealerId}>
                        <td>{(page - 1) * pageSize + idx + 1}</td>
                        <td className="fw-semibold">{item.dealerName}</td>
                        <td className="fw-semibold">{item.region}</td>
                        <td className="fw-semibold">{item.totalOrders}</td>
                        <td className="fw-semibold text-primary">{formatCurrency(item.totalAmount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default DealerTotalSales;
