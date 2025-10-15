import React from "react";

const CardPayments = () => {   
    return (
        <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            <img
                              src="../assets/img/icons/unicons/paypal.png"
                              alt="Credit Card"
                              className="rounded"
                            />
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn p-0"
                              type="button"
                              id="cardOpt4"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i className="bx bx-dots-vertical-rounded" />
                            </button>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="cardOpt4"
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
                        <span className="d-block mb-1">Payments</span>
                        <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                        <small className="text-danger fw-semibold">
                          <i className="bx bx-down-arrow-alt" /> -14.82%
                        </small>
                      </div>
                    </div>
    );
};

export default CardPayments;