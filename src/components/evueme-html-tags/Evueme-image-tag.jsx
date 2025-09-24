
const EvuemeImageTag = ({ className, imgSrc, altText, onClick, ...props }) => {
  return (
    <img
      className={className}
      src={imgSrc}
      alt={altText}
      onClick={onClick}
      {...props}
    />
  );
};

export default EvuemeImageTag;
