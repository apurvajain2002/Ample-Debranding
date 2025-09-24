const Tooltip = ({children, divTagCssClasses, ...props}) => {
  
  return (
    <div className={`information-box ${divTagCssClasses}`}>
      {children}
    </div>
  );
};

export default Tooltip;
