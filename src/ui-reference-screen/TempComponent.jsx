import { useState } from "react";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { cities } from "./index";
import { arrayToKeyValue } from "../utils/arrayToKeyValue";
import getUniqueId from "../utils/getUniqueId";

const MultiSelectTypeahead = ({
  options,
  selected,
  onChange,
  handleRemoveMultiValue,
}) => {
  const renderMenu = (results, menuProps) => {
    return (
      <Menu {...menuProps}>
        {selected.length > 0 && (
          <div className="selected-chips">
            {selected.map((value, index) => (
              <div
                key={getUniqueId()}
                className="chip"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMultiValue(value);
                }}
              >
                {value}
                <i className="close material-icons">close</i>
              </div>
            ))}
          </div>
        )}
        {results.map((result, index) => (
          <MenuItem option={result.optionValue} position={index} key={getUniqueId()}>
            {result.optionKey}
          </MenuItem>
        ))}
      </Menu>
    );
  };

  return (
    <div className="typeahead-container">
      <Typeahead
        id="multi-selection-typeahead"
        className="typeahead-input"
        multiple
        options={options}
        labelKey="optionKey"
        placeholder="Choose several options..."
        selected={selected}
        onChange={onChange}
        renderMenu={renderMenu}
      />
    </div>
  );
};

const SingleSelectTypeahead = ({ options, selected, onChange }) => {
  return (
    <div className="typeahead-container">
      <Typeahead
        id="single-selection-typeahead"
        className="typeahead-input"
        options={options}
        labelKey="optionKey"
        placeholder="Choose an option..."
        selected={selected}
        onChange={onChange}
        minLength={1}
      />
    </div>
  );
};

const TempComp = () => {
  const [multiSelected, setMultiSelected] = useState([]);
  const [singleSelected, setSingleSelected] = useState([]);

  const handleMultiChange = (selected) => {
    setMultiSelected(selected);
  };

  const handleSingleChange = (selected) => {
    setSingleSelected(selected);
  };

  const handleRemoveMultiValue = (value) => {
    setMultiSelected(
      multiSelected.filter((item) => item.optionKey !== value.optionKey)
    );
  };

  return (
    <div className="App">
      <h2>Multi-Select Typeahead</h2>
      <MultiSelectTypeahead
        options={arrayToKeyValue(cities)}
        selected={multiSelected}
        onChange={handleMultiChange}
        handleRemoveMultiValue={handleRemoveMultiValue}
      />

      <h2>Single-Select Typeahead</h2>
      <SingleSelectTypeahead
        options={cities}
        selected={singleSelected}
        onChange={handleSingleChange}
      />
    </div>
  );
};

export default TempComp;
