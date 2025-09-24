import { useState } from "react";
import { useDispatch } from "react-redux";
import { icon } from "../../assets/assets";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import SwitchInputField from "../../input-fields/switch-input-field";
import NormalInputField from "../../input-fields/normal-input-field";

const QuestionOption = ({
  index,
  optionKey,
  type = "text",
  optionValue,
  checked = false,
  newQuestion,
  setNewQuestion,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedValue, setEditedValue] = useState(optionValue); // Local state for editing

  // Handle toggling correct options
  const handleSetCorrectOptions = (optionIndex) => {
    const updatedOptions = newQuestion.questionOptions?.map((option, idx) => ({
      ...option,
      correct: idx === optionIndex ? !option.correct : option.correct,
    }));

    dispatch(
      setNewQuestion({
        ...newQuestion,
        questionOptions: updatedOptions,
      })
    );
  };

  // Handle option removal
  const handleRemoveOption = (optionIndex) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      const updatedOptions = newQuestion.questionOptions.filter(
        (_, idx) => idx !== optionIndex
      );

      dispatch(
        setNewQuestion({
          ...newQuestion,
          questionOptions: updatedOptions.map((option, idx) => ({
            ...option,
            optionKey: String.fromCharCode(97 + idx), // Recalculate keys
          })),
        })
      );
    }
  };

  // Handle saving the edited option
  const handleSaveEdit = () => {
    if (editedValue.trim() === "") {
      alert("Option value cannot be empty.");
      return;
    }

    const updatedOptions = newQuestion.questionOptions?.map((option, idx) =>
      idx === index ? { ...option, optionValue: editedValue } : option
    );

    dispatch(
      setNewQuestion({
        ...newQuestion,
        questionOptions: updatedOptions,
      })
    );
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="row valign-wrapper">
      <div className="col xl1 l1 m1 s1 qn-text">
        <EvuemeImageTag imgSrc={icon.groupIcon} altText="Option serial number" />
        {optionKey}
      </div>
      <div className="col xl11 l11 m11 s11">
        {type === "text" && (
          <div
          className="qn-text-bg"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Ensures spacing between elements
            width: "100%", // Ensures full width utilization
          }}
        >
          {isEditing ? (
            <NormalInputField
              divTagCssClasses="col xl11 l11 m10 s10"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              autoFocus
              style={{ flex: 1 }} // Flex grow to occupy remaining space
            />
          ) : (
            <p
              className="editable-text"
              style={{
                flex: 1, // Adjust text to take remaining space
                margin: 0, // Ensure no extra spacing
                width:"50%"
              }}
            >
              {optionValue}
            </p>
          )}
        
          <ul
            className="right right-q-action"
            style={{
              display: "flex",
              alignItems: "center",
              listStyleType: "none",
              padding: 0,
              margin: 0,
              justifyContent: "flex-end", // Ensure alignment to the end
            }}
          >
            <li>
              <SwitchInputField
                checked={checked}
                onChange={() => handleSetCorrectOptions(index)}
                aria-label={`Set option ${optionKey} as correct`}
              />
            </li>
            <li>
              <EvuemeImageTag
                className={
                  isEditing ? "cursor-pointer" : "grayColorFilter cursor-pointer"
                }
                imgSrc={icon.editBoxIcon}
                alt="Edit option"
                onClick={() => {
                  if (isEditing) {
                    handleSaveEdit();
                  } else {
                    setIsEditing(true); // Enter edit mode
                  }
                }}
                style={{ margin: "5px" }}
              />
            </li>
            <li>
              <EvuemeImageTag
                className="cursor-pointer"
                imgSrc={icon.closeLineIcon}
                alt="Delete option"
                onClick={() => handleRemoveOption(index)}
                style={{ margin: "5px" }}
              />
            </li>
          </ul>
        </div>
        
        
        )}

        {type === "image" && (
          <div className="qn-image-bg">
            <EvuemeImageTag
              className="option-image-preview"
              imgSrc={optionValue}
              altText="Option"
            />
            <ul className="right right-q-action">
              <li>
                <SwitchInputField
                  checked={checked}
                  onChange={() => handleSetCorrectOptions(index)}
                  aria-label={`Set image option ${optionKey} as correct`}
                />
              </li>
              <li>
                <EvuemeImageTag
                  className="cursor-pointer"
                  imgSrc={icon.closeLineIcon}
                  alt="Delete option"
                  onClick={() => handleRemoveOption(index)}
                />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionOption;
