import React from "react";

const CardSales = () => {
    const handleViewMore = () => {
        alert("Viewing more details about Sales.");
    }

  return (
    <div className="card">
        <div className="card-body">
            <div className="card-title d-flex align-items-start justify-content-between">
                <div className="avatar flex-shrink-0">
                    <img
                        src="../assets/img/icons/unicons/wallet-info.png"
                        alt="Credit Card"
                        className="rounded"
                    />
                </div>
                <div className="dropdown">
                    <button
                        className="btn p-0"
                        type="button"
                        id="cardOpt6"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="bx bx-dots-vertical-rounded" />
                    </button>
                    <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="cardOpt6"
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
            <span>Sales</span>
                <h3 className="card-title text-nowrap mb-1">$4,679</h3>
                <small className="text-success fw-semibold">
                    <i className="bx bx-up-arrow-alt" /> +28.42%
                </small>
            </div>
        </div>
    );
};

export default CardSales;