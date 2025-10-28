import React from "react";

const CardProfit = () => {
    const handleViewMore = () => {
        alert("Viewing more details about Profit.");
    }

  return (
    <div className="card">
        <div className="card-body">
            <div className="card-title d-flex align-items-start justify-content-between">
                <div className="avatar flex-shrink-0">
                    <img
                        src="../assets/img/icons/unicons/chart-success.png"
                        alt="chart success"
                        className="rounded"
                    />
                </div>
                <div className="dropdown">
                    <button
                        className="btn p-0"
                        type="button"
                        id="cardOpt3"
                        data-bs-toggle="dropdown"
                        data-bs-offset="0,8"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="bx bx-dots-vertical-rounded" />
                    </button>
                    <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="cardOpt3"
                    >
                    <a
                        className="dropdown-item"
                        onClick={handleViewMore} style={{cursor: 'pointer'}}
                    >
                        View More
                    </a>
                    <a
                        className="dropdown-item"
                        onClick={handleViewMore} style={{cursor: 'pointer'}}
                    >
                        Delete
                    </a>
                </div>
            </div>
        </div>
        <span className="fw-semibold d-block mb-1">Profit</span>
        <h3 className="card-title mb-2">$12,628</h3>
        <small className="text-success fw-semibold">
            <i className="bx bx-up-arrow-alt" /> +72.80%
        </small>
        </div>
    </div>
  );
};

export default CardProfit;