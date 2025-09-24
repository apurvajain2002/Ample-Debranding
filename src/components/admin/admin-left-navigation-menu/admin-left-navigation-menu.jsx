import JobPositionIcon from "./job-position-icon";
import { JobPositionIconData, JobPositionIconDataCampus, JobPositionIconDataManpower } from "./admin-navigation-routes";
import getUniqueId from "../../../utils/getUniqueId";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLeftNavigationMenu = ({
  setLeftNavigationPathname,
  leftBarToggle
}) => {

  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );

  const finalSideBarList = userType === 'manpower'
    ? JobPositionIconDataManpower : userType === 'campus'
    ? JobPositionIconDataCampus : JobPositionIconData

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
