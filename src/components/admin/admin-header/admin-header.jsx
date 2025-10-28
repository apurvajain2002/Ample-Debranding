import { icon, image } from "../../assets/assets";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../../buttons/normal-button";
import { setAccessToken, setLogout } from "../../../redux/slices/signin-slice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import getUniqueId from "../../../utils/getUniqueId";
import { capitalize } from "lodash";
import { useGlobalContext } from "../../../context";
import { capitalizeEachWord } from "../../../utils/functions";

const headerDropdownList = [
  {
    icon: icon.defineInterview,
    iconCss: "secondaryColorFilter header-profile-icon",
    iconContainerCss: "header-profile-icon-div",
    label: "Profile",
  },
  {
    icon: icon.settingsIcon,
    iconCss: "secondaryColorFilter header-settings-icon",
    iconContainerCss: "header-settings-icon-div",
    label: "Settings",
  },
  {
    icon: icon.phoneIcon,
    iconCss: "secondaryColorFilter header-settings-icon",
    iconContainerCss: "header-settings-icon-div",
    label: "Contact",
  },
];

const AdminHeader = ({ onToggleSidebar }) => {
  const { rootColor } = useGlobalContext();
  const { currentUser, userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  // const handleLogout = async () => {
  //   try {
  //     // Call the logout API endpoint
  //     await fetch('/exit', {
  //       method: 'GET',
  //       credentials: 'include'
  //     });
  //   } catch (error) {
  //     console.error('Logout API call failed:', error);
  //   } finally {
  //     Object.keys(Cookies.get()).forEach(cookieName => {
  //       Cookies.remove(cookieName);
  //     });
  //     localStorage.clear();
  //     dispatch(setLogout());
  //     navigate('/signin', { replace: true });
  //   }
  // };

  return (
    <div className="top-bar">
      <a
        href="javascript:void(0);"
        className="dashboard-setting"
        onClick={onToggleSidebar}
      >
        <i>
          <EvuemeImageTag imgSrc={icon.categoryIcon} altText={"categoryIcon"} />
        </i>
      </a>
      <nav className="top-nav">
        <div className="container" style={{ backgroundColor: "white" }}>
          <div className="row">
            <div className="col xl6 l6 m6 s6">
              <a href="#" className="logo-main">
                <EvuemeImageTag
                  className={"admin-header-logo"}
                  src={rootColor.logoUrl}
                  altText={"brand-logo"}
                />
              </a>
            </div>
            <div className="col xl6 l6 m6 s6">
              <ul className="right-profilesetting right">
                <li>
                  <a
                    className="dropdown-trigger flex-center"
                    href="#!"
                    data-target="headerDropdown"
                  >
                    {/* <EvuemeImageTag
                      className={"admin-header-profile-pic"}
                      src={image.userProfileImage}
                      altText={"profile-pic"}
                    /> */}
                    <i class="material-icons dp48 userProfile">person</i>
                    <h6>
                      {currentUser}
                      <p>
                        <span>Role:</span>
                        {capitalizeEachWord(userType)}
                      </p>
                    </h6>{" "}
                    {/*  <EvuemeImageTag
                      src={icon.moreOptionsVerticalIcon}
                      altText={"dropdown menu"}
                    /> */}
                    <i class="material-icons right">arrow_drop_down</i>
                  </a>
                  <ul id="headerDropdown" className="dropdown-content">
                    {headerDropdownList.map((headerDropdown) => (
                      <li key={headerDropdown.label}>
                        <a href="#!" className="flex-center">
                          <div className={headerDropdown.iconContainerCss}>
                            <EvuemeImageTag
                              className={headerDropdown.iconCss}
                              imgSrc={headerDropdown.icon}
                              altText={`Edit ${headerDropdown.label}`}
                            />
                          </div>

                          {headerDropdown.label}
                        </a>
                      </li>
                    ))}
                    <li className="logout-btn-li">
                      <NormalButton
                        leftIconSrc={icon.logoutButtonIcon}
                        buttonTagCssClasses={"btn btn-clear btn-submit"}
                        buttonText={"Logout"}
                        onClick={handleLogout}
                      />
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminHeader;
