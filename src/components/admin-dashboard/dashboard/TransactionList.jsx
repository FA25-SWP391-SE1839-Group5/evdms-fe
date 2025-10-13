const TransactionsList = () => {
  const transactions = [
    {
      icon: '../assets/img/icons/unicons/paypal.png',
      type: 'Paypal',
      description: 'Send money',
      amount: '+82.6',
      currency: 'USD'
    },
    {
      icon: '../assets/img/icons/unicons/wallet.png',
      type: 'Wallet',
      description: "Mac'D",
      amount: '+270.69',
      currency: 'USD'
    },
    {
      icon: '../assets/img/icons/unicons/chart.png',
      type: 'Transfer',
      description: 'Refund',
      amount: '+637.91',
      currency: 'USD'
    },
    {
      icon: '../assets/img/icons/unicons/cc-success.png',
      type: 'Credit Card',
      description: 'Ordered Food',
      amount: '-838.71',
      currency: 'USD'
    },
    {
      icon: '../assets/img/icons/unicons/wallet.png',
      type: 'Wallet',
      description: 'Starbucks',
      amount: '+203.33',
      currency: 'USD'
    },
    {
      icon: '../assets/img/icons/unicons/cc-warning.png',
      type: 'Mastercard',
      description: 'Ordered Food',
      amount: '-92.45',
      currency: 'USD'
    }
  ];

  return (
    <div className="col-md-6 col-lg-4 order-2 mb-4">
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
              <a className="dropdown-item" href="javascript:void(0);">
                Last 28 Days
              </a>
              <a className="dropdown-item" href="javascript:void(0);">
                Last Month
              </a>
              <a className="dropdown-item" href="javascript:void(0);">
                Last Year
              </a>
            </div>
          </div>
        </div>
        <div className="card-body">
          <ul className="p-0 m-0">
            {transactions.map((transaction, index) => (
              <li key={index} className={`d-flex ${index < transactions.length - 1 ? 'mb-4 pb-1' : ''}`}>
                <div className="avatar flex-shrink-0 me-3">
                  <img
                    src={transaction.icon}
                    alt="User"
                    className="rounded"
                  />
                </div>
                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div className="me-2">
                    <small className="text-muted d-block mb-1">
                      {transaction.type}
                    </small>
                    <h6 className="mb-0">{transaction.description}</h6>
                  </div>
                  <div className="user-progress d-flex align-items-center gap-1">
                    <h6 className="mb-0">{transaction.amount}</h6>
                    <span className="text-muted">{transaction.currency}</span>
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

export default TransactionsList;