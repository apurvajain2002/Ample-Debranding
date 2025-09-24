import { useState, useRef, useEffect } from "react";
import RadioButtonInputField from "../../components/input-fields/radio-button-input-field";
import SelectedIcon from "../../components/miscellaneous/selected-icon";
import getUniqueId from "../../utils/getUniqueId";

export const DefineInterviewCardBig = ({
  cssClasses = "col xl2 l4 m4 s12",
  cardTitle,
  radioButtonValue = "",
  radioBtnList = [],
  normalList = [],
  selectedValuesList = [],
  onChange = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const cardContentRef = useRef(null);

  useEffect(() => {
    if (cardContentRef?.current?.scrollHeight > cardContentRef?.current?.offsetHeight) {
      setShowMoreButton(true);
    }
  }, []);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div className={`${cssClasses} defineInterviewCardBig`}>
      <div className="card">
        <div
          ref={cardContentRef}
          className="card-content custom-card"
          style={{ height: isExpanded ? "auto" : "200px", overflow: "hidden" }}
        >
          <span className="card-title">{cardTitle}</span>

          {radioBtnList
            ? radioBtnList?.map((item) => (
                <RadioButtonInputField
                  key={item}
                  inputTagCssClasses={"with-gap"}
                  groupName={"defineInterview"}
                  labelText={item}
                  radioButtonValue={radioButtonValue}
                  value={item}
                  onChange={onChange}
                />
              ))
            : null}

          {normalList ? (
            <>
              {normalList.map(
                (curPair, index) =>
                  curPair.optionValue && (
                    <p key={getUniqueId()}>
                      {curPair.optionKey} <span> - {curPair.optionValue}</span>
                    </p>
                  )
              )}
            </>
          ) : null}

          {selectedValuesList ? (
            <>
              {selectedValuesList.map((curValue, index) => (
                <SelectedIcon
                  key={getUniqueId()}
                  selectedIconText={curValue}
                  showCrossIcon={false}
                />
              ))}
            </>
          ) : null}
        </div>
        {showMoreButton && (
          <div className="centered more-btn">
            <span onClick={toggleExpanded} style={{ cursor: "pointer" }}>
              {isExpanded ? "less" : "..more"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const DefineInterviewCardSmall = ({ title, content }) => {
  return (
    <li>
      <h5>{title}</h5>
      <p>{Array.isArray(content) ? content.toString() : content}</p>
    </li>
  );
};
