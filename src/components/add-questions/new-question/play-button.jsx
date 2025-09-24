import { icon } from "../../assets/assets";
import NormalButton from "../../buttons/normal-button";

const PlayButton = ({ altText = "", onClick = () => {} }) => {
  return (
    <NormalButton
      buttonTagCssClasses={"btn-clear btn-submit btn-small left play-button-wrapper"}
      buttonText={"Play"}
      onClick={onClick}
      leftIconSrc={icon.playButtonRoundIcon}
      leftIconAltText={altText}
    />
  );
};

export default PlayButton;
