import ImageOption from "./image-option";
import Option from "./option";

function jsxForEnhancedMedia(question) {
  let { enhancedQuestionFormatType: type, enhancedMediaText, s3url, enhancedMediaUrl } = question;
  const enhancedMediaSrc = s3url || enhancedMediaUrl;
  let enhancedMediaJSX = null;
  switch (type) {
    case "codeSnippet": {
      enhancedMediaJSX = (
        <pre
          style={{
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {enhancedMediaText}
        </pre>
      );
      break;
    }
    case "text": {
      enhancedMediaJSX = enhancedMediaText;
      break;
    }
    case "image": {
      // Handling different image sizes?
      enhancedMediaJSX = (
        <img src={enhancedMediaSrc} width="100%" height="100%" alt="enhanced media" />
      );
      break;
    }
    case "video": {
      enhancedMediaJSX = (
        <video src={enhancedMediaSrc} width="100%" alt="enhanced media" controls />
      );
      break;
    }
    case "audio": {
      enhancedMediaJSX = (
        <audio
          src={enhancedMediaSrc}
          alt="enhanced media"
          controls
          style={{
            '--webkit-media-controls-download-button': 'none',
            '--webkit-media-controls-playback-rate-button': 'none'
          }}
        />
      );
      break;
    }
    case "document": {
      const documentUrl = enhancedMediaSrc.includes('.pdf')
        ? `${enhancedMediaSrc}#toolbar=0&navpanes=0&scrollbar=0&download=0&print=0`
        : enhancedMediaSrc;
      enhancedMediaJSX = (
        <iframe
          src={documentUrl}
          width={"100%"}
          height={"300px"}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none'
          }}
        />
      );
      break;
    }
    default:
  }
  return enhancedMediaJSX;
}

const Question = ({ question, setAnswer, options, type }) => {
  let isEnhanced = question.isEnhanced;

  let enhancedMediaJSX = jsxForEnhancedMedia(question);

  return (
    <div className="robochart">
      <div className="chatt-round roboavi"></div>
      <div className="rochat-wrap">
        <div className="chatt-text">{question.questionText}</div>
        {isEnhanced ? (
          <div className="chatt-text chatt-notext">{enhancedMediaJSX}</div>
        ) : null}
        <div className="btn-wr">
          {options.map((option) =>
            option?.type === "image" ? (
              <ImageOption
                key={option.optionKey}
                option={option.optionKey}
                setAnswer={setAnswer}
                preview={option.optionPreview}
              />
            ) : (
              <Option
                key={option.optionKey}
                option={option.optionKey}
                setAnswer={setAnswer}
                text={option.optionValue}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
