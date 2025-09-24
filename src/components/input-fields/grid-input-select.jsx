import SelectedIcon from "../../components/miscellaneous/selected-icon";
import getUniqueId from "../../utils/getUniqueId";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";
import EvuemeSelectTag from "../evueme-html-tags/evueme-select-tag";

const GridselectInputField = ({
  divTagCssClasses = "",
  selectTagCssClasses = "",
  optionTagClasses = "",
  selectTagIdAndName = "",
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  required = false,
  selectedValues = [],
  setSelectedValues = () => {},
  handleRemoveSelectedValue = () => {},
  labelText,
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  ...props
}) => {
  return (
    <>
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
        {...props}
      />
      <EvuemeLabelTag
        htmlFor={selectTagIdAndName}
        labelText={labelText}
        required={required}
        labelIconSrc={labelIconSrc}
        labelIconCss={labelIconCss}
        labelIconAltText={labelIconAltText}
      />

      {multiple &&
        selectedValues?.map((value, index) => (
          <SelectedIcon
            key={getUniqueId()}
            selectedIconText={value}
            id={selectTagIdAndName}
            name={selectTagIdAndName}
            onClickIcon={() =>
              handleRemoveSelectedValue(value, selectTagIdAndName)
            }
          />
        ))}
    </>
  );
};

export default GridselectInputField;
