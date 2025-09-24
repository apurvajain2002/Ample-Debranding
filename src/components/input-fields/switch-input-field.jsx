import { icon } from "../assets/assets";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";
import EvuemeInputTag from "../evueme-html-tags/evueme-input-tag";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const SwitchInputField = ({
  switchInputFieldIdAndName = "",
  checked = false,
  onChange = () => {},
  labelText,
}) => {
  return (
    <div className="switch">
      <EvuemeLabelTag labelText={labelText}>
        <EvuemeInputTag
          id={switchInputFieldIdAndName}
          name={switchInputFieldIdAndName}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="lever">
          <i>
            <EvuemeImageTag
              imgSrc={icon.checkMarkicon}
              alt={icon.checkMarkicon}
            />
          </i>
        </span>
      </EvuemeLabelTag>
    </div>
  );
};

export default SwitchInputField;
