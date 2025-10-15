import { useState, useEffect } from "react";
import { getCurrentUser } from "../../../services/authService";

const WelcomeCard = () => {
  const [userData, setUserData] = useState({
    name: 'User',
    percentage: 72
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        setLoading(true);
        
        // Get user from localStorage (immediate display)
        const user = getCurrentUser();
        
        if (user && user.name) {
          setUserData({
            name: user.name,
            percentage: 72
          });
        } else {
          setUserData({
            name: 'User',
            percentage: 72
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserData({
          name: 'User',
          percentage: 72
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    const parts = fullName.trim().split(' ');
    return parts[0];
  };

  return (
    <div className="card">
      <div className="d-flex align-items-end row">
        <div className="col-sm-7">
          <div className="card-body">
            <h5 className="card-title text-primary">
              {loading ? (
                'Loading...'
              ) : (
                <>Congratulations {getFirstName(userData.name)}! 🎉</>
              )}
            </h5>
            <p className="mb-4">
              You have done <span className="fw-bold">{userData.percentage}%</span>{" "}
              more sales today. Check your new badge in your profile.
            </p>
            <a
              href="javascript:;"
              className="btn btn-sm btn-outline-primary"
            >
              View Badges
            </a>
          </div>
        </div>
        <div className="col-sm-5 text-center text-sm-left">
          <div className="card-body pb-0 px-0 px-md-4">
            <img
              src="../assets/img/illustrations/man-with-laptop-light.png"
              height={140}
              className="img-fluid ms-5"
              style={{ maxHeight: '140px', objectFit: 'contain' }}
              alt="Congratulations illustration"
              data-app-dark-img="illustrations/man-with-laptop-dark.png"
              data-app-light-img="illustrations/man-with-laptop-light.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;