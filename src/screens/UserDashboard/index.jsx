import { Route, Routes } from "react-router-dom";
import UserNotification from "./UserComponents/UserNotification.jsx";
import EditProfile from "./UserComponents/EditProfile.jsx";
import EditProfile2 from "./UserComponents/EditProfile2.jsx";
import UserInterview from "./UserComponents/UserInterviews/UserInterviews.jsx";
import L1Round from "../interview/l1-round/index.jsx";
import DeviceChecking from "../device-checking/index.jsx";
import UserHeader from "../../components/user/user-header.jsx";
import UserNav from "./userNav.jsx";
import UserDashboard from "./UserComponents/UserDashboard.jsx";
import UserProfile from "./UserComponents/UserProfile.jsx";
import { useGlobalContext } from "../../context/index.jsx";

const User = () => {

  const { userEditProfilePageYN } = useGlobalContext();

  return (
    <>
      <UserHeader />
      <div className="main-section">
        {!userEditProfilePageYN && <UserNav />}
        <div className="right-sidebar" style={{ paddingLeft: !userEditProfilePageYN ? "75px" : "0px" }}>
          <div className="right-sidebar-main">
            <Routes>

              {/* Will be un-commented afeter dashboard implemented*/}
              {/* <Route path="/*" element={<UserDashboard />} /> */}
              
              <Route path="/*" element={<UserProfile />} />
              <Route path="/notification" element={<UserNotification />} />
              <Route path="/l1round" element={<L1Round />} />
              <Route path="/interviews" element={<UserInterview />} />
              <Route path="/editProfile" element={<EditProfile />} />
              <Route path="/editWorkExperience" element={<EditProfile2 />} />
              <Route path="/device-checking" element={<DeviceChecking />} />
            </Routes>
          </div>

          {/* <AdminFooter /> */}
        </div>
      </div>
    </>

  );
};

export default User;
