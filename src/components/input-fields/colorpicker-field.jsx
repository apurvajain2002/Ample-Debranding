import EvuemeInputTag from "../evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";

const ColorPickerInputField = ({
  divTagCssClasses,
  inputTagIdAndName,
  placeholder,
  value,
  onChange,
  labelText,
  onBlur
}) => {
  return (
    <div className={divTagCssClasses}>
      <EvuemeInputTag
        className="validate height-input"
        type="text"
        id={inputTagIdAndName}
        name={inputTagIdAndName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <EvuemeLabelTag className="active" htmlFor={inputTagIdAndName} labelText={labelText} />
      <EvuemeInputTag
        className="colorcod"
        type="color"
        id={inputTagIdAndName}
        name={inputTagIdAndName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{backgroundColor:value}}
      />
    </div>
  );
};

export default ColorPickerInputField;