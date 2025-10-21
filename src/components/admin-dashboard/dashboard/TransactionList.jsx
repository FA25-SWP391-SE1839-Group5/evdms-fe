import React from "react";

const TransactionsList = () => {
  const handleViewMore = () => {
    alert("Viewing more details about Transactions.");
  }

  return (
    <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title m-0 me-2">Transactions</h5>
                    <div className="dropdown">
                      <button
                        className="btn p-0"
                        type="button"
                        id="transactionID"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="bx bx-dots-vertical-rounded" />
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="transactionID"
                      >
                        <a className="dropdown-item" onClick={handleViewMore} style={{cursor: 'pointer'}}>
                          Last 28 Days
                        </a>
                        <a className="dropdown-item" onClick={handleViewMore} style={{cursor: 'pointer'}}>
                          Last Month
                        </a>
                        <a className="dropdown-item" onClick={handleViewMore} style={{cursor: 'pointer'}}>
                          Last Year
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="p-0 m-0">
                      <li className="d-flex mb-4 pb-1">
                        <div className="avatar flex-shrink-0 me-3">
                          <img
                            src="../assets/img/icons/unicons/paypal.png"
                            alt="User"
                            className="rounded"
                          />
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <small className="text-muted d-block mb-1">
                              Paypal
                            </small>
                            <h6 className="mb-0">Send money</h6>
                          </div>
                          <div className="user-progress d-flex align-items-center gap-1">
                            <h6 className="mb-0">+82.6</h6>
                            <span className="text-muted">USD</span>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex mb-4 pb-1">
                        <div className="avatar flex-shrink-0 me-3">
                          <img
                            src="../assets/img/icons/unicons/wallet.png"
                            alt="User"
                            className="rounded"
                          />
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <small className="text-muted d-block mb-1">
                              Wallet
                            </small>
                            <h6 className="mb-0">Mac'D</h6>
                          </div>
                          <div className="user-progress d-flex align-items-center gap-1">
                            <h6 className="mb-0">+270.69</h6>
                            <span className="text-muted">USD</span>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex mb-4 pb-1">
                        <div className="avatar flex-shrink-0 me-3">
                          <img
                            src="../assets/img/icons/unicons/chart.png"
                            alt="User"
                            className="rounded"
                          />
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <small className="text-muted d-block mb-1">
                              Transfer
                            </small>
                            <h6 className="mb-0">Refund</h6>
                          </div>
                          <div className="user-progress d-flex align-items-center gap-1">
                            <h6 className="mb-0">+637.91</h6>
                            <span className="text-muted">USD</span>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex mb-4 pb-1">
                        <div className="avatar flex-shrink-0 me-3">
                          <img
                            src="../assets/img/icons/unicons/cc-success.png"
                            alt="User"
                            className="rounded"
                          />
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <small className="text-muted d-block mb-1">
                              Credit Card
                            </small>
                            <h6 className="mb-0">Ordered Food</h6>
                          </div>
                          <div className="user-progress d-flex align-items-center gap-1">
                            <h6 className="mb-0">-838.71</h6>
                            <span className="text-muted">USD</span>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex mb-4 pb-1">
                        <div className="avatar flex-shrink-0 me-3">
                          <img
                            src="../assets/img/icons/unicons/wallet.png"
                            alt="User"
                            className="rounded"
                          />
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <small className="text-muted d-block mb-1">
                              Wallet
                            </small>
                            <h6 className="mb-0">Starbucks</h6>
                          </div>
                          <div className="user-progress d-flex align-items-center gap-1">
                            <h6 className="mb-0">+203.33</h6>
                            <span className="text-muted">USD</span>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex">
                        <div className="avatar flex-shrink-0 me-3">
                          <img
                            src="../assets/img/icons/unicons/cc-warning.png"
                            alt="User"
                            className="rounded"
                          />
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <small className="text-muted d-block mb-1">
                              Mastercard
                            </small>
                            <h6 className="mb-0">Ordered Food</h6>
                          </div>
                          <div className="user-progress d-flex align-items-center gap-1">
                            <h6 className="mb-0">-92.45</h6>
                            <span className="text-muted">USD</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
  );
};

export default TransactionsList;