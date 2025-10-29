import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import getUniqueId from "../../../utils/getUniqueId";
import { CampusStudentCoordinatorMenu, EvuemeSupportMenu, JobPositionIconData, JobPositionIconDataCampus, JobPositionIconDataManpower, L1InterViewerMenu, L3InterViewerMenu, OrganizationAdminMenu, OrganizationRecruiterMenu, PlacementAgencyAdminMenu, PlacementAgencyRecruiterMenu } from "./admin-navigation-routes";
import JobPositionIcon from "./job-position-icon";

const AdminLeftNavigationMenu = ({
  setLeftNavigationPathname,
  leftBarToggle
}) => {

  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );

  // get menu based on roles
  const getRolesBasedSideMenus = (userType) => {
    switch (userType) {
      case 'manpower': return JobPositionIconDataManpower
      case 'campus': return JobPositionIconDataCampus
      case 'organization recruiter': return OrganizationRecruiterMenu
      case 'l1 interviewer':
      case 'l2 interviewer':
        return L1InterViewerMenu
      case 'l3 interviewer': return L3InterViewerMenu
      case 'organization admin': return OrganizationAdminMenu
      case 'placement agency admin': return PlacementAgencyAdminMenu
      case 'placement agency recruiter': return PlacementAgencyRecruiterMenu
      case 'evueMe support': return EvuemeSupportMenu
      case 'campus student coordinator':
      case 'campus tpo':
      case 'campus admin':
        return CampusStudentCoordinatorMenu
      default: return JobPositionIconData
    }
  }

  const finalSideBarList = getRolesBasedSideMenus(userType)

  return (
    <div className={`leftsidebar ${leftBarToggle ? "slide-left" : ""}`}>
      <ul className="left-nav">
        {finalSideBarList.map((JobPosition) => (
          <NavLink to={JobPosition.path} key={getUniqueId()}>
            {({ isActive }) => (
              <JobPositionIcon
                key={getUniqueId()}
                dataTooltipContent={JobPosition.dataTooltipContent}
                iconSrc={JobPosition.svgIcon}
                iconAltText={JobPosition.svgIconAltText}
                spanTag={JobPosition.spanTag ? JobPosition.spanTag : null}
                modal={JobPosition.modal}
                path={JobPosition.path}
                setLeftNavigationPathname={setLeftNavigationPathname}
                active={
                  !!JobPosition.path && isActive ? "active" : ""
                }
              />
            )}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default AdminLeftNavigationMenu;
