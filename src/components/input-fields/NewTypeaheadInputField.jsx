import { Menu, MenuItem, Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import getUniqueId from "../../utils/getUniqueId";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";
import { useState } from "react";

const NewTypeaheadInputField = ({
  divTagCssClasses = "",
  selectTagCssClasses = "",
  inputTagIdAndName,
  labelCss = "",
  optionTagClasses = "",
  selectTagIdAndName = "",
  placeholder = "",
  options = [],
  value = [],
  onChange = () => { },
  handleRemoveMultiValue = () => { },
  multiple = false,
  disabled = false,
  required = false,
  labelText = "Choose an option...",
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  missing = false,
  // maxResults = {},
  viewMore = false,
  handleViewMore = () => { },
  placementAgencyLabel = false,
}) => {
  const selectedCount = value?.length || 0;


  const renderMenu = (results, menuProps) => {
    return (
      <Menu {...menuProps} style={{top: "40px",position: "absolute", width:"100%"}}>
        {value?.length > 0 && (
          <div className="selected-chips">
            {value.map((selectedValue, index) => (
              <div
                key={getUniqueId()}
                className="chip"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMultiValue(selectTagIdAndName, selectedValue);
                }}
              >
                {selectedValue}
                <i className="close material-icons">close</i>
              </div>
            ))}
          </div>
        )}
        {results.map((result, index) => {
        const isDisabled = result.optionKey.toLowerCase().includes("select");
        return (
          <MenuItem
            option={result.optionValue}
            position={index}
            key={getUniqueId()}
            className={isDisabled ? "disabled" : ""}
            onClick={(e) => {
              if (isDisabled) {
                e.preventDefault(); // Prevent selection if the option is disabled
                e.stopPropagation();
              }
            }}
            style={isDisabled ? { pointerEvents: "none", opacity: 0.5 } : {}}
          >
            {result.optionKey}
          </MenuItem>
        );
       })}
        {viewMore && (
          <div className="view-more-container">
            <button className="view-more" onClick={handleViewMore}>
              View More
            </button>
          </div>
        )}
      </Menu>
    );
  };

  return (
    <div className={`input-field ${divTagCssClasses}`}>
      <Typeahead
        id={selectTagIdAndName}
        className={`typeahead-input ${missing ? "input-missing-value" : ""} ${selectTagCssClasses}`}
        options={options}
        placeholder={placeholder || "Choose an option..."}
        selected={value ?? []}
        onChange={onChange}
        // minLength={value?.length ? 0 : 1}
        multiple={multiple}
        disabled={disabled}
        renderMenu={renderMenu}
        renderInput={({ inputRef, ...inputProps }) => (
          <div className="typeahead-input-with-counter">
            <input
              {...inputProps}
              ref={inputRef}
              placeholder={`${selectedCount} selected`} // Show the counter in the placeholder
            />
          </div>
        )}
        labelKey="optionKey" // Ensure the Typeahead component knows which key to use for labels
      />
      {/* <EvuemeLabelTag
        htmlFor={selectTagIdAndName}
        labelText={labelText}
        required={required}
        labelIconSrc={labelIconSrc}
        labelIconCss={labelIconCss}
        labelIconAltText={labelIconAltText}
      /> */}
      {labelText ? (
        <EvuemeLabelTag
          htmlFor={inputTagIdAndName}
          className={`active ${labelCss}`}
          labelText={labelText}
          required={required}
          labelIconSrc={labelIconSrc}
          labelIconAltText={labelIconAltText}
          labelIconCss={labelIconCss}
          placementAgencyLabel={placementAgencyLabel}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default NewTypeaheadInputField;
