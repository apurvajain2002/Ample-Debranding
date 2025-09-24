import { useEffect } from "react";
import NormalInputField from "./normal-input-field";
import getUniqueId from "../../utils/getUniqueId";

const TypeaheadInputField = ({
  divTagCssClasses = "input-field",
  inputTagCssClasses = "",
  type = "text",
  inputTagIdAndName,
  placeholder,
  value,
  setValue,
  options = [],
  onChange,
  typeaheadValueSuggestions = [],
  setTypeaheadSuggestions = () => {},
  seletedSuggestions = [],
  required = false,
  disabled = false,
  labelText,
  labelCss = "",
}) => {
  const handleClearSuggestions = () => {
    setTypeaheadSuggestions([]);
  };

  const handleSelectTypeaheadValue = (val) => {
    setValue(val);
    handleClearSuggestions();
  };

  const handleGetSuggestions = (typeaheadVal) => {
    if (typeaheadVal.length) {
      const resArray = options.filter((cityName) =>
        cityName.toLowerCase().startsWith(typeaheadVal.toLowerCase())
      );
      setTypeaheadSuggestions(() => resArray);
    }
  };

  useEffect(() => {
    if (value) handleGetSuggestions(value);
    else handleClearSuggestions();
  }, [value]);

  useEffect(() => {
    if (
      typeaheadValueSuggestions.length === 1 &&
      value === typeaheadValueSuggestions[0]
    ) {
      handleClearSuggestions();
    }
  }, [typeaheadValueSuggestions]);

  return (
    <div className="typeahead-container">
      <NormalInputField
        divTagCssClasses={divTagCssClasses}
        inputTagCssClasses={inputTagCssClasses}
        inputTagIdAndName={inputTagIdAndName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        labelText={labelText}
        labelCss={labelCss}
      />
      {typeaheadValueSuggestions.length > 0 && (
        <div className="suggestions-wrapper">
          <ul>
            {typeaheadValueSuggestions.map((suggestion, index) => {
              return (
                <li
                  key={getUniqueId()}
                  className="suggestion-item"
                  onClick={() => handleSelectTypeaheadValue(suggestion)}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TypeaheadInputField;
