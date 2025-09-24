const ImageOption = ({ preview, setAnswer, option }) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setAnswer(option);
      }}
      className="left"
      style={{margin: "5px", display: "flex", gap: 5, alignItems: "center", cursor: "pointer"}}
    >
      <span className="left">{option.toUpperCase()}</span>
      <img src={preview} alt={`option ${option}`} />
    </div>
  );
};

export default ImageOption;
