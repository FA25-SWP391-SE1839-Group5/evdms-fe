import { useState } from 'react';
import useCharts from '../hooks/useCharts';
import { incomeChartConfig, expensesOfWeekChartConfig } from '../utils/chartConfigs';

const ExpenseOverview = () => {
  const [activeTab, setActiveTab] = useState('income');
  
  // Initialize charts
  useCharts('#incomeChart', incomeChartConfig);
  useCharts('#expensesOfWeek', expensesOfWeekChartConfig);

  return (
    <div className="col-md-6 col-lg-4 order-1 mb-4">
      <div className="card h-100">
        <div className="card-header">
          <ul className="nav nav-pills" role="tablist">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'income' ? 'active' : ''}`}
                role="tab"
                onClick={() => setActiveTab('income')}
              >
                Income
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
                role="tab"
                onClick={() => setActiveTab('expenses')}
              >
                Expenses
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'profit' ? 'active' : ''}`}
                role="tab"
                onClick={() => setActiveTab('profit')}
              >
                Profit
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body px-0">
          <div className="tab-content p-0">
            <div
              className={`tab-pane fade ${activeTab === 'income' ? 'show active' : ''}`}
              role="tabpanel"
            >
              <div className="d-flex p-4 pt-3">
                <div className="avatar flex-shrink-0 me-3">
                  <img
                    src="../assets/img/icons/unicons/wallet.png"
                    alt="User"
                  />
                </div>
                <div>
                  <small className="text-muted d-block">Total Balance</small>
                  <div className="d-flex align-items-center">
                    <h6 className="mb-0 me-1">$459.10</h6>
                    <small className="text-success fw-semibold">
                      <i className="bx bx-chevron-up" />
                      42.9%
                    </small>
                  </div>
                </div>
              </div>
              <div id="incomeChart">
                {/* Chart sẽ được render ở đây */}
              </div>
              <div className="d-flex justify-content-center pt-4 gap-2">
                <div className="flex-shrink-0">
                  <div id="expensesOfWeek" />
                </div>
                <div>
                  <p className="mb-n1 mt-1">Expenses This Week</p>
                  <small className="text-muted">$39 less than last week</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;