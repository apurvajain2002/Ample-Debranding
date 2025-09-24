import { Link } from "react-router-dom";

const NextButton = ({
  buttonTagCssClasses,
  buttonText,
  onClick = null,
  to = "",
}) => {
  return (
    <>
      {to ? (
        <Link to={to}>
          <button
            className={`waves-effect waves-light btn btn-clear ${buttonTagCssClasses}`}
            onClick={onClick}
          >
            {buttonText}
            <i className="material-icons dp48">arrow_forward</i>
          </button>
        </Link>
      ) : (
        <button
          className={`waves-effect waves-light btn btn-clear ${buttonTagCssClasses}`}
          onClick={onClick}
        >
          {buttonText}
          <i className="material-icons dp48">arrow_forward</i>
        </button>
      )}
    </>
  );
};

export default NextButton;
