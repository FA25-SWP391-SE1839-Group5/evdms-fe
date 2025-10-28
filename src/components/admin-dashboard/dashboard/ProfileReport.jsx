import React from "react";

const ProfileReport = () => {
  return (
    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between flex-sm-row flex-column gap-3">
                          <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                            <div className="card-title">
                              <h5 className="text-nowrap mb-2">
                                Profile Report
                              </h5>
                              <span className="badge bg-label-warning rounded-pill">
                                Year 2021
                              </span>
                            </div>
                            <div className="mt-sm-auto">
                              <small className="text-success text-nowrap fw-semibold">
                                <i className="bx bx-chevron-up" /> 68.2%
                              </small>
                              <h3 className="mb-0">$84,686k</h3>
                            </div>
                          </div>
                          <div id="profileReportChart" />
                        </div>
                      </div>
                    </div>
                  
  );
};

export default ProfileReport;