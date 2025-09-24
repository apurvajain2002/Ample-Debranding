import { image } from "./../../components/assets/assets.jsx";
import { Link } from "react-router-dom";

const UserNav = () => {
  return (
    <div className="leftsidebar leftside-cand">
      <ul className="left-nav left-nav-candidate">
        <li className="job-position-icon">
          <Link to="/user/dashboard">
            <i>
              <img src={image.dashboard} alt="" />
            </i>{" "}
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/user/profile">
            <i>
              <img src={image.profile} alt="" />
            </i>{" "}
            Profile
          </Link>
        </li>
        <li className="job-position-icon">
          <Link to="/user/interviews">
            <i>
              <img src={image.interviewer} alt="" />
            </i>{" "}
            Interviews
          </Link>
        </li>
        <li className="job-position-icon">
          <Link to="/user/notification">
            <i>
              <img src={image.notification} alt="" />
            </i>{" "}
            Notifications
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserNav;
