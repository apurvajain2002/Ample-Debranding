import { nanoid } from "@reduxjs/toolkit";

const EvuemeSelectTag = ({
  id,
  name,
  className,
  optionTagClassName,
  options,
  value,
  onChange,
  multiple,
  disabled,
  firstOptionDisabled,
  required,
  labelText,
  ...props
}) => {
  if (value === null) {
    if (multiple) {
      value = [];
    } else {
      value = "";
    }
  }

  return (
    <select
      className={className}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      multiple={multiple}
      disabled={disabled}
      required={required}
      {...props}
    >
      <option value="" disabled>
        Select {labelText}
      </option>
      {options?.map(
        (curOption, index) =>
          curOption?.optionKey && (
            <option
              key={nanoid(5)}
              // key={curOption?.optionValue}
              value={curOption?.optionValue}
              disabled={index === 0 && firstOptionDisabled }
            >
              {curOption.optionKey}
            </option>
          )
      )}
    </select>
  );
};

export default EvuemeSelectTag;
