import { Link } from "react-router-dom";

const BackButton = ({
  buttonTagCssClasses,
  buttonText,
  onClick = () => {},
  to = "",
}) => {
  return (
    <Link to={to}>
      <button
        className={`waves-effect waves-light btn btn-clear ${buttonTagCssClasses}`}
        onClick={onClick}
      >
        <i className="material-icons">arrow_back</i>
        {buttonText}
      </button>
    </Link>
  );
};

export default BackButton;
