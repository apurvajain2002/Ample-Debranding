import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const NormalButton = ({
  buttonTagCssClasses,
  buttonText,
  onClick = null,
  leftIconSrc = null,
  leftIconAltText = "",
  leftIconCss = "",
  rightIconSrc = null,
  rightIconAltText = "",
  rightIconCSS = "",
  disabled=false,
  ...props
}) => {
  return (
    <button
      className={`btn ${buttonTagCssClasses}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIconSrc && (
        <i>
        <EvuemeImageTag
          imgSrc={leftIconSrc}
          altText={leftIconAltText}
          className={leftIconCss}
        />
        </i>
      )}
      {buttonText}
      {rightIconSrc ? (
        <EvuemeImageTag
          src={rightIconSrc}
          alt={rightIconAltText}
          className={rightIconCSS}
        />
      ) : (
        <></>
      )}
    </button>
  );
};

export default NormalButton;
