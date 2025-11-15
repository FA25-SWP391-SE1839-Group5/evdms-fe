const AdjustQuantityModal = ({
  show,
  loading,
  adjustData,
  onClose,
  onChange,
  onSubmit,
  forecast,
  forecastLoading,
  forecastError,
  forecastHorizon,
  onForecastHorizonChange,
  onRetrainForecast,
  retrainLoading,
}) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="bx bx-adjust me-2" />
              Adjust Inventory Quantity
            </h5>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {/* Forecast Demand Section */}
              <div className="mb-3">
                <label className="form-label">Forecasted Demand (next {forecastHorizon} days since last order)</label>
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={forecastHorizon}
                    onChange={onForecastHorizonChange}
                    className="form-control me-2"
                    style={{ width: 100 }}
                    disabled={forecastLoading || retrainLoading}
                  />
                  <button type="button" className="btn btn-outline-primary btn-sm me-2" onClick={onRetrainForecast} disabled={retrainLoading || forecastLoading}>
                    {retrainLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="bx bx-refresh me-1" />}
                    Retrain Model
                  </button>
                  {forecastLoading && <span className="spinner-border spinner-border-sm text-primary" />}
                </div>
                {forecastError && (
                  <div className="alert alert-danger py-2 mb-2">
                    {typeof forecastError === "string"
                      ? forecastError.includes("404")
                        ? "This variant doesn't have enough data to generate a forecast."
                        : forecastError.includes("400")
                        ? "This variant doesn't have enough data to retrain the model."
                        : forecastError
                      : forecastError}
                  </div>
                )}
                {forecast && forecast.forecasts && forecast.forecasts.length > 0 && (
                  <div style={{ maxHeight: 150, overflowY: "auto" }}>
                    <table className="table table-sm table-bordered mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Predicted Demand</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecast.forecasts.map((f) => (
                          <tr key={f.step}>
                            <td>{f.timestamp}</td>
                            <td>{f.predictedDemand}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {forecast && forecast.modelInfo && (
                  <div className="text-muted small mt-1">
                    <span>
                      Model: {forecast.modelInfo.algorithm} (v{forecast.modelInfo.version})
                    </span>
                    {forecast.modelInfo.trainedOn && <span className="ms-3">Last trained: {new Date(forecast.modelInfo.trainedOn).toLocaleString()}</span>}
                  </div>
                )}
              </div>
              <div className="alert alert-info">
                <strong>Current Stock:</strong> {adjustData.currentQuantity} units
              </div>
              <div className="mb-3">
                <label className="form-label">Action</label>
                <div className="btn-group w-100" role="group">
                  <input type="radio" className="btn-check" name="action" id="action-add" value="add" checked={adjustData.action === "add"} onChange={onChange} />
                  <label className="btn btn-outline-success" htmlFor="action-add">
                    <i className="bx bx-plus me-1" />
                    Add Stock
                  </label>
                  <input type="radio" className="btn-check" name="action" id="action-remove" value="remove" checked={adjustData.action === "remove"} onChange={onChange} />
                  <label className="btn btn-outline-danger" htmlFor="action-remove">
                    <i className="bx bx-minus me-1" />
                    Remove Stock
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity to {adjustData.action === "add" ? "Add" : "Remove"}</label>
                <input
                  type="number"
                  className="form-control"
                  name="adjustment"
                  value={adjustData.adjustment}
                  onChange={onChange}
                  min="1"
                  max={adjustData.action === "remove" ? adjustData.currentQuantity : ""}
                  step="1"
                  required
                  placeholder="Enter quantity"
                  disabled={adjustData.action === "remove" && adjustData.currentQuantity === 0}
                />
              </div>
              {adjustData.adjustment > 0 && (
                <div className={`alert ${adjustData.action === "add" ? "alert-success" : "alert-warning"}`}>
                  <strong>New Stock Level:</strong> {adjustData.currentQuantity + (adjustData.action === "add" ? Number(adjustData.adjustment) : -Number(adjustData.adjustment))} units
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className={`btn ${adjustData.action === "add" ? "btn-success" : "btn-warning"}`} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adjusting...
                  </>
                ) : (
                  <>
                    <i className={`bx ${adjustData.action === "add" ? "bx-plus" : "bx-minus"} me-1`} />
                    {adjustData.action === "add" ? "Add" : "Remove"} Stock
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdjustQuantityModal;
