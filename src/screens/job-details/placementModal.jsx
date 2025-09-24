import React, { useEffect, useState, useCallback } from "react";
import NormalButton from "../../components/buttons/normal-button";
import NormalInputField from "../../components/input-fields/normal-input-field";
import EvuemeModal from "../../components/modals/evueme-modal";
import { validateNames, validateEmailInput } from "../../utils/valdationRegex";
import { useDispatch } from "react-redux";
import M from "materialize-css";
import { savePlacementAgencies } from "../../redux/actions/create-job-actions";
import { validateNumbers } from "../../utils/valdationRegex";
import WarningToast from "../../components/toasts/warning-toast";
import MobileNumberInputField from "../../components/input-fields/mobile-number-input-field";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";

const initialState = {
  name: "",
  contactName: "",
  emailId: "",
  contactNumber: "",
};

const PlacemetModal = () => {
  const [formDetails, setFormDetails] = useState(initialState);
  const dispatch = useDispatch();

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
      return WarningToast("Please Enter All fields");
    }
    if (!emailRegex.test(formDetails.emailId)) {
      return WarningToast("Invalid email address !");
    }
    if (!phoneNumberRegex.test(formDetails.contactNumber)) {
      return WarningToast("Invalid mobile number !");
    }
    else {
      let formData = {
        ...formDetails,
        countryCode: `+${getCountryCode(formDetails.contactNumber)}`,
        contactNumber: getPhoneNumber(formDetails.contactNumber)
      }
      dispatch(savePlacementAgencies(formData));
      setFormDetails(initialState);
    }
  }, [formDetails, setFormDetails]);

  return (
    <EvuemeModal divTagClasses="evuemeModal" modalId={"placementModal"}>
      <div className="col s12 xl6 l6 m6 login-wrap">
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "22px",
          }}
        >
          Add Placement Agency
        </span>
        <div className="login-wrap-box2">
          <NormalInputField
            divTagCssClasses="input-field"
            inputTagCssClasses="validate"
            inputTagIdAndName={"name"}
            required
            placeholder={"Placement Agency Name"}
            // onKeyPress={validateNames}
            value={formDetails.name}
            onChange={handleChange}
            labelText={"Placement agency Name"}
            maxLength={48}
          />
          <NormalInputField
            divTagCssClasses="input-field password-relative-modals"
            inputTagCssClasses="validate"
            inputTagIdAndName={"contactName"}
            required
            onKeyPress={validateNames}
            placeholder={"Contact Person Name"}
            value={formDetails.contactName}
            onChange={handleChange}
            labelText={"Contact Person Name"}
            maxLength={48}
          />
          <NormalInputField
            divTagCssClasses="input-field password-relative-modals"
            inputTagCssClasses="validate"
            inputTagIdAndName={"emailId"}
            required
            type="email"
            // onBlur={(e) => validateEmailInput(e, WarningToast)}
            placeholder={"Enter Email Id"}
            value={formDetails.emailId}
            onChange={handleChange}
            labelText={"Email Id"}
          />
          {/* <NormalInputField
            divTagCssClasses="input-field password-relative"
            inputTagCssClasses="validate"
            inputTagIdAndName={"contactNumber"}
            onKeyPress={validateNumbers}
            placeholder={"Contact number"}
            value={formDetails.contactNumber}
            onChange={handleChange}
            labelText={"Contact number"}
          /> */}
          <MobileNumberInputField
            labelText={"Contact Number"}
            value={formDetails.contactNumber}
            onChange={(number) => {
              setFormDetails(prev => ({
                ...prev,
                contactNumber: number
              }))
            }}
            divTagCssClasses="input-field password-relative-modals"
            inputTagCssClasses="validate"
            inputTagIdAndName={"contactNumber"}
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

export default React.memo(PlacemetModal);
