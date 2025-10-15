import React from "react";

const CardTransactions = () => {
    return (
        <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            <img
                              src="../assets/img/icons/unicons/cc-primary.png"
                              alt="Credit Card"
                              className="rounded"
                            />
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn p-0"
                              type="button"
                              id="cardOpt1"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i className="bx bx-dots-vertical-rounded" />
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="cardOpt1"
                            >
                              <a
                                className="dropdown-item"
                                href="javascript:void(0);"
                              >
                                View More
                              </a>
                              <a
                                className="dropdown-item"
                                href="javascript:void(0);"
                              >
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">
                          Transactions
                        </span>
                        <h3 className="card-title mb-2">$14,857</h3>
                        <small className="text-success fw-semibold">
                          <i className="bx bx-up-arrow-alt" /> +28.14%
                        </small>
                      </div>
                    </div>
    );
};

export default CardTransactions;