import React, { useEffect, useState, useCallback } from "react";
import NormalButton from "../../components/buttons/normal-button";
import NormalInputField from "../../components/input-fields/normal-input-field";
import EvuemeModal from "../../components/modals/evueme-modal";
import { useDispatch } from "react-redux";
import { validateNames, validateEmailInput } from "../../utils/valdationRegex";
import { saveInterviewer } from "../../redux/actions/create-job-actions";
import M from "materialize-css";
import WarningToast from "../../components/toasts/warning-toast";
import MobileNumberInputField from "../../components/input-fields/mobile-number-input-field";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";

const initialState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  mobileNumber: "",
};

const InterviewerModal = () => {
  const dispatch = useDispatch();
  const [formDetails, setFormDetails] = useState(initialState);

  const handleChange = useCallback((e) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    setFormDetails(initialState);
    M.AutoInit();
    return () => {
      setFormDetails(initialState);
    };
  }, []);

  const handleSave = useCallback(() => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberRegex =
      /^\+?\d{1,4}?[-.\s]?(\(?\d{1,3}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (Object.values(formDetails).includes("")) {
      return WarningToast("Please enter all fields");
    }
    if (!emailRegex.test(formDetails.emailAddress)) {
      return WarningToast("Invalid email address!");
    }
    if (!phoneNumberRegex.test(formDetails.mobileNumber)) {
      return WarningToast("Invalid mobile number!");
    }
    else {
      let formData = {
        ...formDetails,
        countryCode: `+${getCountryCode(formDetails.mobileNumber)}`,
        mobileNumber: getPhoneNumber(formDetails.mobileNumber)
      }
      dispatch(saveInterviewer(formData));
      setFormDetails(initialState);
    }
  }, [formDetails]);

  return (
    <EvuemeModal divTagClasses="evuemeModal" modalId={"interviewerModal"}>
      <div className="col s12 xl6 l6 m6 login-wrap">
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "22px",
          }}
        >
          Add interviewer
        </span>
        <div className="login-wrap-box2">
          <NormalInputField
            divTagCssClasses="input-field"
            inputTagCssClasses="validate"
            inputTagIdAndName={"firstName"}
            required
            placeholder={"Interviewer first name"}
            onKeyPress={validateNames}
            value={formDetails.firstName}
            onChange={handleChange}
            labelText={"Interviewer first name"}
            maxLength={48}
          />
          <NormalInputField
            divTagCssClasses="input-field password-relative-modals"
            inputTagCssClasses="validate"
            inputTagIdAndName={"lastName"}
            required
            onKeyPress={validateNames}
            placeholder={"Interviewer last name"}
            value={formDetails.lastName}
            onChange={handleChange}
            labelText={"Interviewer last name"}
            maxLength={48}
          />

          <NormalInputField
            divTagCssClasses="input-field password-relative-modals"
            inputTagCssClasses="validate"
            inputTagIdAndName={"emailAddress"}
            required
            type="email"
            // onBlur={(e) => validateEmailInput(e, WarningToast)}
            placeholder={"Enter Email Id"}
            value={formDetails.emailAddress}
            onChange={handleChange}
            labelText={"Email Address"}
          />
          <MobileNumberInputField
            labelText={"Contact Number"}
            value={formDetails.mobileNumber}
            onChange={(number) => {
              setFormDetails(prev => ({
                ...prev,
                mobileNumber: number
              }))
            }}
            divTagCssClasses="input-field password-relative-modals"
            inputTagCssClasses="validate"
            inputTagIdAndName={"mobileNumber"}
            required
          />
          <NormalButton
            buttonTagCssClasses={"btn-clear btn-submit primaryColorHex"}
            buttonText={"Save"}
            onClick={handleSave}
          />
        </div>
      </div>
    </EvuemeModal>
  );
};

export default React.memo(InterviewerModal);
