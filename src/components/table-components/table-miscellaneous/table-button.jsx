import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";

const TableButton = ({
  buttonText,
  buttonIconSrc,
  buttonIconAltText,
  buttonIconCss,
  onClick = () => {},
}) => {
  return (
    <li className="cursor-pointer" onClick={onClick}>
      <a className="flex-center">
        <i>
          <EvuemeImageTag
            imgSrc={buttonIconSrc}
            altText={buttonIconAltText}
            className={buttonIconCss}
          />
        </i>
        {buttonText}
      </a>
    </li>
  );
};

export default TableButton;
