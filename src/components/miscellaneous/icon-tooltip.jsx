
const IconTooltip = ({
  children,
  dataPosition = "top",
  dataTooltip = "Your text",
}) => {
  return (
    <i
      className="tooltipped"
      data-position={dataPosition}
      data-tooltip={dataTooltip}
    >
      {children}
    </i>
  );
};

export default IconTooltip;
