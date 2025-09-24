import EvuemeInputTag from "../evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";

const CheckboxInputField = ({
  inputTagCssClasses = "filled-in",
  inputTagIdAndName = "",
  checked = false,
  onChange = () => {},
  labelText = "",
  labelCss = "",
  ...props
}) => {
  return (
    <EvuemeLabelTag className={labelCss} htmlFor={inputTagIdAndName}>
      <EvuemeInputTag
        className={`filledin ${inputTagCssClasses}`}
        id={inputTagIdAndName}
        name={inputTagIdAndName}
        type={"checkbox"}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span className="text-color-black">{labelText}</span>
    </EvuemeLabelTag>
  );
};

export default CheckboxInputField;
