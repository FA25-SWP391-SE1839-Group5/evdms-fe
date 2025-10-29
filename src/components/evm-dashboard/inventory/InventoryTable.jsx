// InventoryTable.jsx
// Table for displaying inventory list and actions

const InventoryTable = ({ inventories, loading, getStockStatus, formatDate, handleAdjust, handleView, handleDeleteClick }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Vehicle Variant</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventories.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                <i className="bx bx-package bx-lg mb-2" />
                <p>No inventory records found</p>
              </td>
            </tr>
          ) : (
            inventories.map((inventory) => {
              const status = getStockStatus(inventory.quantity);
              return (
                <tr key={inventory.id}>
                  <td>
                    <strong>{inventory.variantName}</strong>
                  </td>
                  <td>
                    <h5 className={`mb-0 ${inventory.quantity === 0 ? "text-danger" : "text-primary"}`}>{inventory.quantity}</h5>
                  </td>
                  <td>
                    <span className={`badge bg-label-${status.color}`}>{status.label}</span>
                  </td>
                  <td>{formatDate(inventory.createdAt)}</td>
                  <td>{formatDate(inventory.updatedAt)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button className="btn btn-sm btn-success" onClick={() => handleAdjust(inventory.id)} title="Adjust Quantity">
                        <i className="bx bx-adjust" />
                      </button>
                      <button className="btn btn-sm btn-outline-info" onClick={() => handleView(inventory.id)} title="View Details">
                        <i className="bx bx-show" />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(inventory)} title="Delete">
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
  );
};

export default InventoryTable;
