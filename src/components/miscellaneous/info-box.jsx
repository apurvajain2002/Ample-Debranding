import Tooltip from "./tooltip";

const InfoBox = ({ children }) => {
  return (
    <i className="show-details infermation-ico-black ">
      i<Tooltip divTagCssClasses={"infbox-click"}>{children}</Tooltip>
    </i>
  );
};

export default InfoBox;
