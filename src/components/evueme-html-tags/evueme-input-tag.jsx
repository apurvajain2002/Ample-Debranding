const EvuemeInputTag = ({
  className = "",
  type,
  id,
  name,
  placeholder,
  value = "",
  onChange = () => { },
  required,
  disabled,
  readOnly = false,
  missing = false,
  ...props
}) => {
  return (
    <input
      className={`${missing ? "input-missing-value" : ""} ${className}`}
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      autoComplete={"new-password"}
      {...props}
      readOnly={readOnly}
    />
  );
};

export default EvuemeInputTag;
