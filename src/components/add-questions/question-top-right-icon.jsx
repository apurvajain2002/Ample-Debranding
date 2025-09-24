import { Link } from "react-router-dom";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";


const QuestionTopRightIcon = ({
  imgSrc,
  altText,
  imgClassName,
  linkText,
  spanText,
}) => {
  return (
    <li>
      <Link href="">
        <i>
          <EvuemeImageTag
            className={imgClassName}
            imgSrc={imgSrc}
            altText={altText}
          />
        </i>
        {linkText}
        <span>{spanText}</span>
      </Link>
    </li>
  );
};

export default QuestionTopRightIcon;
