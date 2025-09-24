import { useEffect } from "react";
import SelectedIcon from "../../components/miscellaneous/selected-icon";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";
import EvuemeSelectTag from "../evueme-html-tags/evueme-select-tag";
import M from "materialize-css";
import getUniqueId from "../../utils/getUniqueId";

const SelectInputField = ({
  divTagCssClasses = "",
  selectTagCssClasses = "",
  optionTagClasses = "",
  selectTagIdAndName = "",
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  firstOptionDisabled = true,
  required = false,
  selectedValues = [],
  setSelectedValues = () => { },
  handleRemoveSelectedValue = () => { },
  labelText,
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  missing = false,
  cutomizedCssForLabel = false,
                            customLabelNode,
  ...props
}) => {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <div className={`input-field ${missing ? "select-missing-value" : ""} ${divTagCssClasses}`}>
      <EvuemeSelectTag
        className={selectTagCssClasses}
        optionTagClassName={optionTagClasses}
        id={selectTagIdAndName}
        name={selectTagIdAndName}
        options={options}
        value={value}
        onChange={onChange}
        multiple={multiple}
        disabled={disabled}
        firstOptionDisabled={firstOptionDisabled}
        labelText={labelText}
        {...props}
      />
      {customLabelNode ?<EvuemeLabelTag
        htmlFor={selectTagIdAndName}
        labelText={customLabelNode}
        required={required}
        labelIconSrc={labelIconSrc}
        labelIconCss={labelIconCss}
        labelIconAltText={labelIconAltText}
        cutomizedCssForLabel={cutomizedCssForLabel}
      /> : <EvuemeLabelTag
          htmlFor={selectTagIdAndName}
          labelText={labelText}
          required={required}
          labelIconSrc={labelIconSrc}
          labelIconCss={labelIconCss}
          labelIconAltText={labelIconAltText}
          cutomizedCssForLabel={cutomizedCssForLabel}
      />}
      {multiple &&
        selectedValues?.map((value, index) => (
          <SelectedIcon
            key={getUniqueId()}
            selectedIconText={value}
            disabled={disabled}
            onClickIcon={() =>
              handleRemoveSelectedValue(value, selectTagIdAndName)
            }
          />
        ))}
    </div>
  );
};

export default SelectInputField;
