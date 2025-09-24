import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { Link } from "react-router-dom";

const EnhanceSectionIcon = ({
  iconSrc = "",
  altText = "",
  iconClassName = "",
  pText = "",
  onClick = () => {},
  active = false,
}) => {
  return (
    <li className={active ? "active" : ""} onClick={onClick}>
      <Link to="">
        <i>
          <EvuemeImageTag
            className={iconClassName}
            src={iconSrc}
            alt={altText}
          />
        </i>
        <p>{pText}</p>
      </Link>
    </li>
  );
};

export default EnhanceSectionIcon;
