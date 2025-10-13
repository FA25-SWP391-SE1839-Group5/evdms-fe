const WelcomeCard = ({ userName = "John", percentage = 72 }) => {
  return (
    <div className="col-lg-8 mb-4 order-0">
      <div className="card">
        <div className="d-flex align-items-end row">
          <div className="col-sm-7">
            <div className="card-body">
              <h5 className="card-title text-primary">
                Congratulations {userName}! 🎉
              </h5>
              <p className="mb-4">
                You have done <span className="fw-bold">{percentage}%</span> more
                sales today. Check your new badge in your profile.
              </p>
              <a href="javascript:;" className="btn btn-sm btn-outline-primary">
                View Badges
              </a>
            </div>
          </div>
          <div className="col-sm-5 text-center text-sm-left">
            <div className="card-body pb-0 px-0 px-md-4">
              <img
                src="../assets/img/illustrations/man-with-laptop-light.png"
                height={140}
                alt="View Badge User"
                data-app-dark-img="illustrations/man-with-laptop-dark.png"
                data-app-light-img="illustrations/man-with-laptop-light.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;