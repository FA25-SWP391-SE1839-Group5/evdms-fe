const StatCard = ({ 
  title, 
  value, 
  percentage, 
  isPositive = true, 
  icon,
  colClass = "col-lg-6 col-md-12 col-6 mb-4"
}) => {
  return (
    <div className={colClass}>
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div className="avatar flex-shrink-0">
              <img
                src={icon}
                alt={title}
                className="rounded"
              />
            </div>
            <div className="dropdown">
              <button
                className="btn p-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded" />
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item" href="javascript:void(0);">
                  View More
                </a>
                <a className="dropdown-item" href="javascript:void(0);">
                  Delete
                </a>
              </div>
            </div>
          </div>
          <span className="fw-semibold d-block mb-1">{title}</span>
          <h3 className="card-title mb-2">{value}</h3>
          <small className={`fw-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
            <i className={`bx ${isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'}`} /> {percentage}
          </small>
        </div>
      </div>
    </div>
  );
};

export default StatCard;