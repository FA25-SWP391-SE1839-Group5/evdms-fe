import useCharts from '../hooks/useCharts';
import { orderStatisticsChartConfig } from '../utils/chartConfigs';

const OrderStatistics = () => {
  // Initialize chart
  useCharts('#orderStatisticsChart', orderStatisticsChartConfig);

  const categories = [
    {
      name: 'Electronic',
      description: 'Mobile, Earbuds, TV',
      sales: '82.5k',
      icon: 'bx-mobile-alt',
      bgColor: 'bg-label-primary'
    },
    {
      name: 'Fashion',
      description: 'T-shirt, Jeans, Shoes',
      sales: '23.8k',
      icon: 'bx-closet',
      bgColor: 'bg-label-success'
    },
    {
      name: 'Decor',
      description: 'Fine Art, Dining',
      sales: '849k',
      icon: 'bx-home-alt',
      bgColor: 'bg-label-info'
    },
    {
      name: 'Sports',
      description: 'Football, Cricket Kit',
      sales: '99',
      icon: 'bx-football',
      bgColor: 'bg-label-secondary'
    }
  ];

  return (
    <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
      <div className="card h-100">
        <div className="card-header d-flex align-items-center justify-content-between pb-0">
          <div className="card-title mb-0">
            <h5 className="m-0 me-2">Order Statistics</h5>
            <small className="text-muted">42.82k Total Sales</small>
          </div>
          <div className="dropdown">
            <button
              className="btn p-0"
              type="button"
              id="orederStatistics"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bx bx-dots-vertical-rounded" />
            </button>
            <div
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="orederStatistics"
            >
              <a className="dropdown-item" href="#">
                Select All
              </a>
              <a className="dropdown-item" href="#">
                Refresh
              </a>
              <a className="dropdown-item" href="#">
                Share
              </a>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex flex-column align-items-center gap-1">
              <h2 className="mb-2">8,258</h2>
              <span>Total Orders</span>
            </div>
            <div id="orderStatisticsChart">
              {/* Chart sẽ được render ở đây */}
            </div>
          </div>
          <ul className="p-0 m-0">
            {categories.map((category, index) => (
              <li key={index} className={`d-flex ${index < categories.length - 1 ? 'mb-4 pb-1' : ''}`}>
                <div className="avatar flex-shrink-0 me-3">
                  <span className={`avatar-initial rounded ${category.bgColor}`}>
                    <i className={`bx ${category.icon}`} />
                  </span>
                </div>
                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div className="me-2">
                    <h6 className="mb-0">{category.name}</h6>
                    <small className="text-muted">{category.description}</small>
                  </div>
                  <div className="user-progress">
                    <small className="fw-semibold">{category.sales}</small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;