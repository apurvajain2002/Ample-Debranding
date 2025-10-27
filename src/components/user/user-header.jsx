import { icon, image } from "../assets/assets";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../buttons/normal-button";
import { setAccessToken, setLogout } from "../../redux/slices/signin-slice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// import getUniqueId from "../../../utils/getUniqueId";
import { capitalize } from "lodash";
import { useGlobalContext } from "../../context";
import { useLogout } from "../../customHooks/use-logout";

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

const UserHeader = () => {
  const { rootColor } = useGlobalContext();
  const { currentUser, userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  // const handleLogout = async () => {
  //   try {
  //     await fetch('/exit', {
  //       method: 'GET',
  //       credentials: 'include'
  //     });
  //     dispatch(setLogout());
  //     navigate('/signin');
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     dispatch(setLogout());
  //     navigate('/signin');
  //   }
  // };

  return (
    <div className="top-bar">
      {/* <a href="#" className="dashboard-setting">
        <i>
          <EvuemeImageTag imgSrc={icon.categoryIcon} altText={"categoryIcon"} />
        </i>
      </a> */}
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
                    <EvuemeImageTag
                      className={"admin-header-profile-pic"}
                      src={image.userProfileImage}
                      altText={"profile-pic"}
                    />
                    <h6>
                      {currentUser}
                      <p>
                        <span>Role:</span>
                        {capitalize(userType)}
                      </p>
                    </h6>{" "}
                    <EvuemeImageTag
                      src={icon.moreOptionsVerticalIcon}
                      altText={"dropdown menu"}
                    />
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
                    <li className="flex-end logout-btn-li">
                      <NormalButton
                        leftIconSrc={icon.logoutButtonIcon}
                        buttonTagCssClasses={
                          "btn btn-clear btn-submit flex-center align-baseline"
                        }
                        buttonText={" Logout"}
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

export default UserHeader;
