import { useEffect, useState } from "react";
import NormalButton from "../../buttons/normal-button";
import CodeSnippetTextInput from "./code-snippet-text-input";
import { useDispatch } from "react-redux";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";

const supportedMediaTypes = {
  image: "image/*",
  video: "video/*",
    document: "application/doc, application/docx, application/pdf, .csv, .doc, .docx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xls, .xlsx", // Adjust the supported document formats
  audio: "audio/*",
  codeSnippet: "text/*",
  text: "text/*",
};

const ENHANCED_MEDIA_DESCRIPTION_TEXT = {
  video: "This can be a video clip you want candidate to play after the interviewer has asked the question",
  audio: "This can be an audio clip you want candidate to play after the interviewer has asked the question",
  document: "This can be a document you want candidate to view after the interviewer has asked the question",
  image: "This can be an image you want candidate to view after the interviewer has asked the question",
  codeSnippet: "This can be a code snippet you want candidate to see after the interviewer has asked the question",
  text: "This can be some text you want candidate to see after the interviewer has asked the question"
}

const RenderMediaPreview = ({ mediaType, mediaPreview, textareaInput }) => {
  if (supportedMediaTypes[mediaType].startsWith("image")) {
    return (
      <EvuemeImageTag
        className={"media-file-preview"}
        imgSrc={mediaPreview}
        altText={"Media preview"}
      />
    );
  } else if (supportedMediaTypes[mediaType].startsWith("video")) {
    return (
      <video className={"media-file-preview"} controls>
        <source src={mediaPreview} type="video/mp4" />
      </video>
    );
  } else if (supportedMediaTypes[mediaType].startsWith("audio")) {
    return (
      <audio className={"media-file-preview"} controls>
        <source src={mediaPreview} type="audio/mp3" />
      </audio>
    );
  } else if (supportedMediaTypes[mediaType].startsWith("application")) {
    return (
      <div className={"media-file-preview"}>
        <iframe
          title="upload-media-document"
          src={mediaPreview}
          width="100%"
          height="300px"
        ></iframe>
      </div>
    );
  } else if (supportedMediaTypes[mediaType].startsWith("text")) {
    return <CodeSnippetTextInput value={textareaInput} onChange={() => {}} />;
  }
};

const UploadMedia = ({
  newQuestion,
  setNewQuestion,
  mediaType = "",
  setAttachQuestionMediaType = () => {},
  mediaSizeLimitText,
  mediaFile = "",
  setMediaFile = () => {},
  mediaPreview = "",
  setMediaPreview = () => {},
  setIsUploading = () => {}
}) => {
  const [textareaInput, setTextareaInput] = useState("");
  const dispatch = useDispatch();

  const invokeFileUpload = () => {
    const inputField = document.getElementById("fileId");
    inputField.click();
  };

  const handleOnChange = (e) => {
    setIsUploading(true);

    try {
      const file = e.target.files[0];
      const reader = new FileReader();

      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setMediaFile(file);
          setMediaPreview(reader.result);
          dispatch(
            setNewQuestion({
              ...newQuestion,
              ["enhancedMedia"]: reader.result,
            })
          );
        };
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleOnSubmitTextareaInput = () => {
    dispatch(
      setNewQuestion({
        ...newQuestion,
        ["enhancedMediaText"]: textareaInput,
      })
    );
  };

  useEffect(() => {
    if (mediaType === "text" || mediaType === "codeSnippet") {
      setTextareaInput(mediaPreview);
    }
  }, [mediaType, mediaPreview]);

  if (
    mediaPreview ||
    newQuestion.enhancedMedia ||
    newQuestion.enhancedMediaText ||
    newQuestion.s3Url
  ) {
    return (
      <>
        <div className="flex-center margin-bottom-10">
          <RenderMediaPreview
            mediaType={mediaType}
            mediaPreview={mediaPreview}
            textareaInput={textareaInput}
          />
        </div>
        <div className="center">
          <NormalButton
            buttonTagCssClasses={"btn-clear btn-submit"}
            buttonText={"Remove Media"}
            onClick={() => {
              setMediaPreview(() => "");
              setMediaFile(() => "");
              setTextareaInput(() => "");
              setAttachQuestionMediaType(() => "");
              dispatch(
                setNewQuestion({
                  ...newQuestion,
                  ["isEnhanced"]: false,
                  ["enhancedMediaType"]: "",
                  ["enhancedMedia"]: "",
                  ["enhancedMediaText"]: "",
                  ["s3Url"]: "",
                })
              );
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {mediaType === "codeSnippet" || mediaType === "text" ? (
        <>
          <CodeSnippetTextInput
            textareaIdAndName={"textareaInput"}
            value={textareaInput}
            onChange={(e) => setTextareaInput(() => e.target.value)}
          />
          <div className="add-question-upload-pTag">
            {ENHANCED_MEDIA_DESCRIPTION_TEXT[mediaType]}
            <br />
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit primaryColorHex "}
              buttonText={"Submit"}
              onClick={() => handleOnSubmitTextareaInput()}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className={
              mediaPreview
                ? "add-question-upload-media-preview-after"
                : "add-question-upload-media-preview-before"
            }
            onClick={invokeFileUpload}
          >
            {mediaPreview ? (
              <RenderMediaPreview />
            ) : (
              <>
                <header>
                  <h5>Select File here</h5>
                </header>
                <p>Files Supported: {supportedMediaTypes[mediaType]}</p>
              </>
            )}
          </div>
          <div className="add-question-upload-media-file-limit">
            <p>Max {mediaType} upload file size permitted is 1MB</p>
            <input
              type="file"
              hidden
              accept={supportedMediaTypes[mediaType]}
              id="fileId"
              onChange={(e) => handleOnChange(e)}
              style={{ display: "none" }}
            />
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit primaryColorHex "}
              buttonText={`Upload ${mediaType}`}
              onClick={() => invokeFileUpload()}
            />
          </div>
          <hr className={"add-question-upload-hrTag"} />
          <div className="add-question-upload-pTag">
            {ENHANCED_MEDIA_DESCRIPTION_TEXT[mediaType]}
            <br />
          </div>
        </>
      )}
    </>
  );
};

export default UploadMedia;
