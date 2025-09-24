import React, { useEffect } from "react";
import M from "materialize-css"
import { Link } from "react-router-dom";
import EvuemeModalTrigger from "../../modals/evueme-modal-trigger";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";

const JobPositionIcon = ({
  dataTooltipContent,
  iconSrc,
  iconAltText,
  active,
  spanTag,
  modal,
  path,
  setLeftNavigationPathname,
  ...props
}) => {
  useEffect(() => {
    // Initialize tooltips when the component mounts
    const tooltippedElements = document.querySelectorAll(".tooltipped");
    const instances = M.Tooltip.init(tooltippedElements);

    // Cleanup tooltips when the component unmounts
    return () => {
      instances.forEach((instance) => instance.destroy());
    };
  }, []);
  return (
    <li
      className={`job-position-icon ${active}`}
      onClick={() => {
        setLeftNavigationPathname(() => window.location.pathname);
      }}
    >
      {modal ? (
        <EvuemeModalTrigger
          modalId={"leftNavigationMenuSearchModal"}
          className="tooltipped"
          data-position={"right"}
          data-tooltip={dataTooltipContent}
        >
          <i>
            <EvuemeImageTag
              className={active ? "whiteColorFilter" : ""}
              imgSrc={iconSrc}
              altText={iconAltText}
            />
          </i>
        </EvuemeModalTrigger>
      ) : (
        <Link
          to={path}
          className={`tooltipped ${spanTag}`}
          data-position={spanTag ? "top" : "right"}
          data-tooltip={dataTooltipContent}
        >
          <i>
            <EvuemeImageTag
              className={active ? "whiteColorFilter" : ""}
              imgSrc={iconSrc}
              altText={iconAltText}
            />
          </i>
        </Link>
      )}
    </li>
  );
};

export default JobPositionIcon;
