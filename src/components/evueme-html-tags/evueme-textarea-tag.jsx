const EvuemeTextareaTag = ({ inputFieldId, value, onChange }) => {
  return (
    <textarea id={inputFieldId} value={value} onChange={onChange}>
      {" "}
    </textarea>
  );
};

export default EvuemeTextareaTag;
