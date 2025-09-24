const CodeSnippetTextInput = ({
  textareaIdAndName,
  value,
  onChange,
  disabled,
}) => {
  return (
    <textarea
      id={textareaIdAndName}
      name={textareaIdAndName}
      style={{
        height: "100px",
        maxHeight: "200px",
        maxWidth: "100%",
        minWidth: "100%",
        padding: "1px 4px",
        border: "1px solid #dedede",
        outline: "none",
      }}
      className="upload-code"
      value={value}
      onChange={onChange}
      disabled={disabled}
    ></textarea>
  );
};

export default CodeSnippetTextInput;
