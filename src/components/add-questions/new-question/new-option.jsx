import { useEffect, useState } from "react";
import { icon } from "../../assets/assets";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import NormalInputField from "../../input-fields/normal-input-field";
import EvuemeInputTag from "../../evueme-html-tags/evueme-input-tag";
import { useDispatch } from "react-redux";
import WarningToast from "../../toasts/warning-toast";

const NewOption = ({
  setShowAddNewOption = () => {},
  newQuestion,
  setNewQuestion,
}) => {
  const [option, setOption] = useState("");
  const [optionImageFile, setOptionImageFile] = useState("");
  const [optionImageFilePreview, setOptionImageFilePreview] = useState("");
  const dispatch = useDispatch();

  // Handle create option
  const handeCreateOption = () => {
    if (!option) {
      return WarningToast("Enter some value");
    }
    const newQuestionOptions = [
      ...(newQuestion?.questionOptions ?? []),
      {
        id: newQuestion.questionOptions.length,
        optionKey: String.fromCharCode(97 + newQuestion.questionOptions.length),
        type: "text",
        optionValue: option,
        correct: false,
      },
    ];
    dispatch(
      setNewQuestion({
        ...newQuestion,
        ["questionOptions"]: newQuestionOptions,
      })
    );
    setOption("");
    setShowAddNewOption((prev) => !prev);
  };

  const handleImageUploadAsAnOption = () => {
    const targetInputField = document.getElementById("imageAsAnOption");
    targetInputField.click();
  };

  const handleImageUpload = (e) => {
    const tempFile = e.target.files[0];
    const reader = new FileReader();

    if (tempFile) {
      reader.readAsDataURL(tempFile);
      reader.onloadend = () => {
        setOptionImageFile(() => reader.result);
        setOptionImageFilePreview(() => reader.result);
      };
    }
  };

  useEffect(() => {
    if (optionImageFile && optionImageFilePreview) {
      const newQuestionOptions = [
        ...newQuestion.questionOptions,
        {
          id: newQuestion.questionOptions.length,
          type: "image",
          optionKey: String.fromCharCode(
            97 + newQuestion.questionOptions.length
          ),
          optionValue: optionImageFile,
          optionPreview: optionImageFilePreview,
          correct: false,
        },
      ];

      dispatch(
        setNewQuestion({
          ...newQuestion,
          ["questionOptions"]: newQuestionOptions,
        })
      );
      setOption("");
      setShowAddNewOption((prev) => !prev);
    }
  }, [optionImageFile, optionImageFilePreview]);

  return (
    <div className="row valign-wrapper">
      <div className="col xl1 l1 m1 s1 qn-text">
        <i>
          <EvuemeImageTag
            imgSrc={icon.groupIcon}
            altText={"Option serial number"}
          />
        </i>{" "}
      </div>
      <div className="col xl11 l11 m11 s11">
        <div className="qn-text-bg valign-wrapper">
          <NormalInputField
            divTagCssClasses="col xl11 l11 m10 s10"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          />
          or
          <EvuemeInputTag
            id={"imageAsAnOption"}
            type={"file"}
            accept="image/*"
            hidden
            onChange={(e) => handleImageUpload(e)}
          />
          <EvuemeImageTag
            className={"option-image-upload cursor-pointer"}
            imgSrc={icon.uploadImageIcon}
            altText={"Upload image as an answer for a question."}
            onClick={() => handleImageUploadAsAnOption()}
          />
          <EvuemeImageTag
            className={"create-option col xl1 l2 m2 s2"}
            imgSrc={icon.checkMarkicon}
            altText={"Create option"}
            onClick={handeCreateOption}
          />
        </div>
      </div>
    </div>
  );
};

export default NewOption;
