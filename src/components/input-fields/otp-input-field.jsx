import { forwardRef } from "react";

const OtpInputField = forwardRef(
  ({ index, otpBoxReference, value, onChange, onKeyDown }, ref) => {
    return (
      <input
        type="text"
        maxLength="1"
        value={value}
        onChange={onChange}
        ref={ref}
        onKeyDown={onKeyDown}
      />
    );
  }
);

export default OtpInputField;
