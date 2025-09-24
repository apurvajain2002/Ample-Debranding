import { Menu, MenuItem, Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import getUniqueId from "../../utils/getUniqueId";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";
import { useState, useRef, useEffect } from "react";

const NewCityTypeaheadInputField = ({
  divTagCssClasses = "",
  selectTagCssClasses = "",
  inputTagIdAndName,
  labelCss = "",
  optionTagClasses = "",
  selectTagIdAndName = "",
  placeholder = "",
  options = [], // Full list of 1000 options
  value = [],
  onChange = () => {},
  handleRemoveMultiValue = () => {},
  multiple = false,
  disabled = false,
  required = false,
  labelText = "Choose an option...",
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  missing = false,
  viewMore = false,
  handleViewMore = () => {},
}) => {
           const [shownCount, setShownCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const selectedCount = value?.length || 0;
  const menuRef = useRef(null);

  // Filter out disabled options and get only the cities to display
  const availableOptions = options.filter(option => 
    !option.optionKey.toLowerCase().includes("select")
  );

  // Filter options based on search term
  const filteredOptions = availableOptions.filter(option =>
    option.optionKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the current page of options to display
  const displayedOptions = filteredOptions.slice(0, shownCount);

           // Reset shown count when search term changes
         useEffect(() => {
           setShownCount(10);
         }, [searchTerm]);

  const renderMenu = (results, menuProps) => {
    return (
      <Menu {...menuProps} ref={menuRef} style={{ top: "40px", position: "absolute", width: "100%" }}>
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
        {displayedOptions.map((result, index) => {
          return (
            <MenuItem
              option={result.optionValue}
              position={index}
              key={getUniqueId()}
              onClick={(e) => {
                // Handle option selection
              }}
            >
              {result.optionKey}
            </MenuItem>
          );
        })}
        {viewMore && shownCount < filteredOptions.length && (
          <div className="view-more-container">
            <button 
              className="view-more" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Store current scroll position
                const currentScrollTop = menuRef.current?.scrollTop || 0;
                
                // Add more cities
                setShownCount(prevCount => prevCount + 10);
                handleViewMore();
                
                // Maintain scroll position after state update
                setTimeout(() => {
                  if (menuRef.current) {
                    menuRef.current.scrollTop = currentScrollTop;
                  }
                }, 0);
              }}
            >
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
        options={availableOptions}
        placeholder={placeholder || "Choose an option..."}
        selected={value ?? []}
        onChange={(selected) => {
          // Reset the search term when selection is made
          onChange(selected);
        }}
        onInputChange={(input) => {
          setSearchTerm(input);
        }}
        multiple={multiple}
        disabled={disabled}
        renderMenu={renderMenu}
        labelKey="optionKey"
        renderInput={({ inputRef, ...inputProps }) => (
          <div className="typeahead-input-with-counter">
            <input
              {...inputProps}
              ref={inputRef}
              placeholder={`${selectedCount} selected`}
            />
          </div>
        )}
      />
      {labelText && (
        <EvuemeLabelTag
          htmlFor={inputTagIdAndName}
          className={`active ${labelCss}`}
          labelText={labelText}
          required={required}
          labelIconSrc={labelIconSrc}
          labelIconAltText={labelIconAltText}
          labelIconCss={labelIconCss}
        />
      )}
    </div>
  );
};

export default NewCityTypeaheadInputField;
