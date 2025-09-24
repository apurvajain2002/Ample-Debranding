import NormalButton from "../buttons/normal-button";
import NormalInputField from "../input-fields/normal-input-field";

const InputSubmitComponent = ({
  inputType = "text",
  submitValue = () => {},
  state = "",
  setState = () => {},
  minValueLength = 0,
  placeholder = "Enter something",
  ...props
}) => {
  return (
    <div className="overlay-content">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: "8px",
          alignItems: "center",
          wdith: "25rem",
        }}
      >
        <div className="interview-otp-field">
          <NormalInputField
            divTagCssClasses="input-field-otp"
            inputTagIdAndName="otp-input"
            value={state}
            onChange={(e) => setState(e.target.value)}
            type={inputType}
            placeholder={placeholder}
            style={{ background: "#fff", border: "none" }}
            autoComplete={"off"}
            {...props}
          />
        </div>
        <NormalButton
          buttonTagCssClasses={"btn-large otp-btn"}
          buttonText={"Submit"}
          onClick={submitValue}
          disabled={String(state).length < minValueLength}
        />
      </div>
    </div>
  );
};

export default InputSubmitComponent;
