import { Link } from "react-router-dom";
import EvuemeInputTag from "../evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";

const RadioButtonInputField = ({
  inputTagCssClasses = "with-gap",
  groupName,
  radioButtonValue,
  value,
  onChange,
  to = "",
  labelText,
  isTooltip,
  tooltipLabel = "",
  toolTipPosition = "top",
  ...props
}) => {
  return (
    <EvuemeLabelTag isTooltip={isTooltip}>
      <EvuemeInputTag
        className={inputTagCssClasses}
        name={groupName}
        type={"radio"}
        checked={radioButtonValue === value}
        value={value}
        onChange={onChange}
        {...props}
      />
      {to ? (
        <span>
          <Link className="label-link" to={to}>
            {labelText}
          </Link>
        </span>
      ) : (
        <span>
          {labelText + " "}
          {isTooltip && (
            <i
              className="material-icons dp48 tooltipped"
              data-position={toolTipPosition}
              data-tooltip={tooltipLabel}
            >
              info
            </i>
          )}
        </span>
      )}
    </EvuemeLabelTag>
  );
};

export default RadioButtonInputField;
