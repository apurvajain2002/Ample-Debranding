import EvuemeImageTag from "./Evueme-image-tag";

const EvuemeLabelTag = ({
  children,
  className = "",
  htmlFor,
  labelText,
  required = false,
  labelIconSrc,
  labelIconAltText = "",
  labelIconCss = "",
  isTooltip = false,
  cutomizedCssForLabel = false,
  placementAgencyLabel =false,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`label-font-weight ${className} labelCss`}
      style={{
        color: 'black',
        fontWeight: '500',
        lineHeight: `${cutomizedCssForLabel && '4px'}`,
        zIndex: `${cutomizedCssForLabel && '9'}`,
        zIndex: `${cutomizedCssForLabel && '9'}`,
        background: `${cutomizedCssForLabel && 'white'}`,
        left: `${(cutomizedCssForLabel || placementAgencyLabel) && '7px'}`,
        top: `${cutomizedCssForLabel && '-15px'}`,
      }}
      {...props}
    >
      {labelText}

      {required ? <span className="required">*</span> : <></>}
      {labelIconSrc ? (
        <span style={{ marginLeft: "0.2rem" }}>
          <i>
            <EvuemeImageTag
              imgSrc={labelIconSrc}
              alt={labelIconAltText}
              className={labelIconCss}
            />
          </i>
        </span>
      ) : (
        <></>
      )}

      {children}
    </label>
  );
};

export default EvuemeLabelTag;
