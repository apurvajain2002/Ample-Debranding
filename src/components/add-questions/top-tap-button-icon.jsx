import { Link } from "react-router-dom";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const TopTapButtonIcon = ({
  iconSrc = "",
  altText = "",
  iconClassName = "",
  onClick = () => {},
  linkText = "",
  active = false,
}) => {
  return (
    <li className={active ? "active" : ""} onClick={onClick}>
      <Link to="">
        <i>
          <EvuemeImageTag
            className={
              active
                ? `${iconClassName} whiteColorFilter`
                : `${iconClassName} blackColorFilter`
            }
            imgSrc={iconSrc}
            altText={altText}
          />
        </i>
        {linkText}
      </Link>
    </li>
  );
};

export default TopTapButtonIcon;
