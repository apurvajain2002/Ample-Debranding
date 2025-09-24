const Option = ({ text, option, setAnswer }) => {
  return (
    <a
      className="waves-effect waves-light btn-large left btn-mcw-robo"
      onClick={(e) => {
        e.preventDefault();
        setAnswer(option);
      }}
    >
      {text}
    </a>
  );
};

export default Option;
