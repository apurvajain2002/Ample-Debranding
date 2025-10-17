import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { icon } from "../../components/assets/assets";
import NextButton from "../../components/buttons/next-button";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import NormalInputField from "../../components/input-fields/normal-input-field";
import PasswordInputField from "../../components/input-fields/password-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import {
  getCity,
  getCountries,
  getState,
} from "../../redux/actions/location-actions/location-actions";
import { saveCandidate, saveEntity } from "../../redux/actions/sign-up-actions";
import {
  validateEmailInput,
  validateNames,
  validateNumbers,
  validateLinkedinUrlInput,
  isValidLinkedinUrl
} from "../../utils/valdationRegex";
import WarningToast from "../../components/toasts/warning-toast";
import { optionMapper } from "../../utils/optionMapper";
import { isValidURL, checkPasswordStrength } from "../../utils/valdationRegex";
import MobileNumberInputField from "../../components/input-fields/mobile-number-input-field";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";
import { getCountryCallingCode } from "react-phone-number-input";
import { setEntity } from "../../redux/slices/sign-up-slice";

const EntitySignupStep1 = ({
  newEntity,
  setNewEntity,
  handleOnChangeEntityData,
  checkUniqueBusinessName,
  checkUniqueWebsiteUrl,
  checkValidPinCode,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("newEntity----------->",newEntity);
  
  // const [candidateDetails, setCandidateDetails] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   candidateWhatsappNumber: "",
  //   mobileNumber: "",
  //   candidatePassword: "",
  // });

  const [missingClasses, setMissingClasses] = useState({
    mobileNumber: false,
    whatsappNumber: false,
  });
  const handleWebsiteChange = (e) => {
    setNewEntity({
      ...newEntity,
      webSite: e.target.value,
    });
  };

  const INITIAL_ERROR_STATE = {
    businessName: false,
    webSite: false,
    firstName: false,
    lastName: false,
    whatsappNumber: false,
    email: false,
    mobileNumber: false,
    password: false,
    confirmPassword: false
  }

  const [error, setError] = useState(INITIAL_ERROR_STATE)


  // Handle onClick on Next Button on reg-page-1
  const handleOnClickNextButton = async () => {
    const { businessName, webSite } = newEntity;


    setError(INITIAL_ERROR_STATE);

    const isWebsiteEmpty = webSite === "https://";

    let updateClasses = {
      mobileNumber: false,
      whatsappNumber: false,
    };

    if (
      !newEntity.businessName ||
      // !newEntity.webSite ||
      isWebsiteEmpty || // Check for the modified website condition
      // !newEntity.firstName ||
      // !newEntity.lastName
      // !newEntity.whatsappNumber ||
      // !newEntity.email ||
      // !newEntity.mobileNumber ||
      // !newEntity.password ||
      // !newEntity.confirmPassword
      newEntity.contactPersonDetails.some(contact =>
        !contact.firstName ||
        !contact.lastName ||
        !contact.whatsappNumber ||
        !contact.email ||
        !contact.mobileNumber ||
        !contact.password ||
        !contact.confirmPassword
      )
    ) {
      let update = {}
      if (!newEntity.businessName) update["businessName"] = true;
      // if (!newEntity.webSite) update["webSite"] = true;
      if (isWebsiteEmpty) update["webSite"] = true; // Update the error state for website
      // if (!newEntity.firstName) update["firstName"] = true;
      // if (!newEntity.lastName) update["lastName"] = true;
      // if (!newEntity.whatsappNumber) update["whatsappNumber"] = true;
      // if (!newEntity.whatsappNumber) {
      //   update["whatsappNumber"] = true;
      //   updateClasses.whatsappNumber = true; // Set to true for highlighting
      // }
      // if (!newEntity.mobileNumber) {
      //   update["mobileNumber"] = true;
      //   updateClasses.mobileNumber = true; // Set to true for highlighting
      // }
      // if (!newEntity.email) update["email"] = true;
      // if (!newEntity.mobileNumber) update["mobileNumber"] = true;
      // if (!newEntity.password) update["password"] = true;
      // if (!newEntity.confirmPassword) update["confirmPassword"] = true;
      newEntity.contactPersonDetails.forEach((contact, index) => {
        if (!contact.firstName) update[`contactFirstName_${index}`] = true;
        if (!contact.lastName) update[`contactLastName_${index}`] = true;
        // if (!contact.whatsappNumber) update[`contactWhatsappNumber_${index}`] = true;
        if (!contact.whatsappNumber) {
          update[`contactWhatsappNumber_${index}`] = true;
          updateClasses.whatsappNumber = true; // Set to true for highlighting
        }
        if (!contact.email) update[`contactEmail_${index}`] = true;
        // if (!contact.mobileNumber) update[`contactMobileNumber_${index}`] = true;
        if (!contact.mobileNumber) {
          update[`contactMobileNumber_${index}`] = true;
          updateClasses.mobileNumber = true; // Set to true for highlighting
        }
        if (!contact.password) update[`contactPassword_${index}`] = true;
        if (!contact.confirmPassword) update[`contactConfirmPassword_${index}`] = true;
      });
      setError(prev => ({ ...prev, ...update }));
      WarningToast("Please fill required fields");
      setMissingClasses(updateClasses);
      return

    }
    // setMissingClasses({ mobileNumber: false, whatsappNumber: false });

    // if (!isValidURL(webSite)) {
    //   // return WarningToast("Please enter a valid Website URL.");
    //   return WarningToast("Fill all the required fields")
    // }

    // if(!isValidLinkedinUrl){
    //   return WarningToast("Please enter a valid Linkedin URL.");
    // }
    const isPasswordsMatch = (newEntity) => {
      return newEntity.contactPersonDetails.every((contactPerson) => {
        const passwordError = checkPasswordStrength(contactPerson.password);
        return (
          !passwordError &&
          contactPerson.password === contactPerson.confirmPassword
        );
      });
    };

    const passwordsMatch = isPasswordsMatch(newEntity);
    if (!passwordsMatch) {
      return WarningToast(
        "Passwords do not match for all contact persons or are weak."
      );
    }

    const isContactPersonDetailsValid = newEntity?.contactPersonDetails?.every(
      (val) => {
        const { firstName, lastName, whatsappNumber, email, mobileNumber } =
          val;
        return firstName && lastName && whatsappNumber && email && mobileNumber;
      }
    );

    if (!businessName || !webSite || !isContactPersonDetailsValid) {
      return WarningToast("Fill all the required fields!");
    } else {
      // Filter payload to match desired format
      const filteredPayload = {
        entityType: newEntity.entityType,
        businessName: newEntity.businessName,
        businessShortName: newEntity.businessShortName,
        hqstate: newEntity.hqstate,
        hqcity: newEntity.hqcity,
        pincode: newEntity.pincode,
        country: newEntity.country,
        webSite: newEntity.webSite,
        noOfEmployees: newEntity.noOfEmployees,
        contactPersonDetails: newEntity.contactPersonDetails
      };

      const res = await dispatch(
        saveEntity(filteredPayload)
      );
      if (
        res.type === "saveEntity/fulfilled" &&
        res?.payload?.message === "Request processed successfully!"
      ) {
        navigate("/entity-signup/step-2");
      }

      // Proceed with further logic
    }
  };

  const listOfEntity = [
    { optionValue: "Employer/Corporate", optionKey: "Employer/Corporate" },
    { optionValue: "Placement Agency", optionKey: "Placement Agency" },
    { optionValue: "College/University", optionKey: "College/University" },
    { optionValue: "Training Institute", optionKey: "Training Institute" },
    { optionValue: "Others", optionKey: "Others" },
  ];

  const { countries, states, cities } = useSelector(
    (state) => state.manageLocationsSliceReducer
  );

  useEffect(() => {
    document.title = "New Entity Registration";
    if (localStorage.getItem("organizationDTO")) {
      setNewEntity(JSON.parse(localStorage.getItem("organizationDTO")));
    }
    setEntity(prev => {
      return {
        ...prev,
        webSite: prev.webSite || "https://"
      }
    }
    )
  }, []);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getState({ country_id: newEntity.country }));
    dispatch(getCity(newEntity.hqstate));
  }, [newEntity.country, newEntity.hqstate]);

  useEffect(() => {
    // set India as default
    dispatch(getState({ country_id: "105" }));
  }, []);

  // const handleAdd = () => {
  //   const addPerson = [...newEntity.contactPersonDetails];
  //   addPerson.push({
  //     firstName: "",
  //     lastName: "",
  //     whatsappNumberCountryCode: "",
  //     whatsappNumber: "",
  //     whatsappNumberVerified: false,
  //     email: "",
  //     designation: "",
  //     linkdinUrl: "",
  //     mobileNumberCountryCode: "",
  //     mobileNumber: "",
  //     mobileNumberVerified: false,
  //     password: "",
  //     confirmPassword: "",
  //   });

  //   setNewEntity({
  //     ...newEntity,
  //     contactPersonDetails: addPerson,
  //   });
  // };
  const handleAdd = () => {
    const newContactPerson = {
      firstName: "",
      lastName: "",
      whatsappNumber: "",
      whatsappNumberCountryCode: "",
      whatsappNumberVerified: false,
      email: "",
      designation: "",
      linkdinUrl: "",
      mobileNumberCountryCode: "",
      mobileNumberVerified: false,
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    };
    setNewEntity((prevState) => ({
      ...prevState,
      contactPersonDetails: [...prevState.contactPersonDetails, newContactPerson],
    }));
    // setError({});
  };

  // Validation function for WhatsApp field (onBlur)
  const validateWhatsappNumberInput = (index) => {
    const contactPerson = newEntity.contactPersonDetails[index];
    const isWhatsAppEmpty = !contactPerson.whatsappNumber;

    setError((prevError) => ({
      ...prevError,
      [`contactWhatsappNumber_${index}`]: isWhatsAppEmpty,
    }));
  };
  const validateMobileNumberInput = (index) => {
    const contactPerson = newEntity.contactPersonDetails[index];
    const isMobileEmpty = !contactPerson.mobileNumber;

    setError((prevError) => ({
      ...prevError,
      [`contactMobileNumber_${index}`]: isMobileEmpty,
    }));
  };

  // const handleFormChange = (e, index) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setNewEntity((prevEntity) => {
  //     if (name === "whatsappNumber") {
  //       prevEntity.contactPersonDetails[index]["whatsappNumberCountryCode"] =
  //         "+" + getCountryCode(value);
  //       prevEntity.contactPersonDetails[index][name] = getPhoneNumber(value);
  //       return { ...prevEntity };
  //     }
  //     if (name === "mobileNumber") {
  //       prevEntity.contactPersonDetails[index]["mobileNumberCountryCode"] =
  //         "+" + getCountryCode(value);
  //       prevEntity.contactPersonDetails[index][name] = getPhoneNumber(value);
  //       return { ...prevEntity };
  //     }
  //     prevEntity.contactPersonDetails[index][name] = value;
  //     return { ...prevEntity };
  //   });
  // };
  // const handleFormChange = (e, index) => {
  //   const { name, value } = e.target;

  //   // Update the specific contact person details by index
  //   setNewEntity((prevEntity) => {
  //     const updatedContactPersonDetails = [...prevEntity.contactPersonDetails];
  //     updatedContactPersonDetails[index] = {
  //       ...updatedContactPersonDetails[index],
  //       [name]: value, // Dynamically update the field
  //     };
  //     return { ...prevEntity, contactPersonDetails: updatedContactPersonDetails };
  //   });
  // };
  const handleFormChange = (e, index) => {
    const { name, value } = e.target;

    // Update the specific field for the contact person
    const updatedContactPersons = [...newEntity.contactPersonDetails];
    updatedContactPersons[index] = {
      ...updatedContactPersons[index],
      [name]: value,
    };

    setNewEntity({
      ...newEntity,
      contactPersonDetails: updatedContactPersons,
    });
  };
  // const handleFormChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedContactPersons = [...newEntity.contactPersonDetails];
  //   updatedContactPersons[index][name] = value;

  //   // Clear error for current field if input is provided
  //   setError((prevError) => ({
  //     ...prevError,
  //     [`contact${name.charAt(0).toUpperCase() + name.slice(1)}_${index}`]: !value,
  //   }));

  //   setNewEntity((prevState) => ({
  //     ...prevState,
  //     contactPersonDetails: updatedContactPersons,
  //   }));
  // };

  const setWhatsappVerified = (verified, index) => {
    setNewEntity((prevEntity) => {
      prevEntity.contactPersonDetails[index]["whatsappNumberVerified"] =
        verified;
      return { ...prevEntity };
    });
  };
  const setMobileNumberVerified = (verified, index) => {
    setNewEntity((prevEntity) => {
      prevEntity.contactPersonDetails[index]["mobileNumberVerified"] =
        verified;
      return { ...prevEntity };
    });
  };

  // const handleRemove = (index) => {
  //   const currentPersonDetails = [...newEntity.contactPersonDetails];
  //   currentPersonDetails.splice(index, 1);

  //   setNewEntity({ ...newEntity, contactPersonDetails: currentPersonDetails });
  // };
  const handleRemove = (index) => {
    // Create a new copy of contact person details and remove the person at the specified index
    const updatedContactPersons = [...newEntity.contactPersonDetails];
    updatedContactPersons.splice(index, 1);
    // console.log(updatedContactPersons);
    // console.log(index);
    
    

    // Update the state with the new contact person list
    setNewEntity({
      ...newEntity,
      contactPersonDetails: updatedContactPersons,
    });

    // Also, clear errors for the removed contact person's fields
    setError((prevError) => {
      const newError = { ...prevError };
      delete newError[`contactFirstName_${index}`];
      delete newError[`contactLastName_${index}`];
      delete newError[`contactWhatsappNumber_${index}`];
      delete newError[`contactEmail_${index}`];
      delete newError[`contactMobileNumber_${index}`];
      delete newError[`contactPassword_${index}`];
      delete newError[`contactConfirmPassword_${index}`];
      return newError;
    });
  };

  // const handleCandidateChange = (e) => {
  //   setCandidateDetails({
  //     ...candidateDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleDone = async () => {
  //   if (Object.values(candidateDetails).some((val) => val === "")) {
  //     return WarningToast("Please Enter All Details.");
  //   }
  //   const res = await dispatch(
  //     saveCandidate({
  //       firstName: candidateDetails.firstName,
  //       lastName: candidateDetails.lastName,
  //       password: candidateDetails.candidatePassword,
  //       mobileNumberCountryCode:getCountryCode(candidateDetails.mobileNumber),
  //       mobileNumber: getPhoneNumber(candidateDetails.mobileNumber),
  //       whatsappNumberCountryCode: getCountryCode(candidateDetails.candidateWhatsappNumber),
  //       whatsappNumber: getPhoneNumber(candidateDetails.candidateWhatsappNumber),
  //       whatsappNumberVerified:false,
  //       emailAddress: candidateDetails.email,
  //     })
  //   );
  //   if (res.type === "saveCandidate/fulfilled") {
  //     navigate("/");
  //   }
  // };

  return (
    <>
      <div className="rgs-wrap">
        <h2>Register Now</h2>
        <div className="start-wrap">
          <div className="row">
            <SelectInputField
              divTagCssClasses={"input-field col xl8 l8 m8 s12"}
              selectTagIdAndName={"entityType"}
              options={optionMapper(
                listOfEntity,
                "optionKey",
                "optionValue",
                "Select account type"
              )}
              value={newEntity.entityType}
              onChange={handleOnChangeEntityData}
              labelText="Account Type"
            />

            {/* TODO: Why this start button is there */}
            {/* <div className="input-field col xl4 l4 m4 s12 rgsstart-btn">
              <a className="waves-effect waves-light btn btn-clear btn-submit right">
                Start
              </a>
            </div> */}
          </div>
        </div>
        <div className="steps-right">
          Steps <span>1</span> - 3
        </div>
      </div>

      <section className="signup-steps-wr">
        <ul className="progress-bar">
          <li className="ent-step-1 ent-success">
            <EvuemeImageTag
              className={"whiteColorFilter"}
              imgSrc={icon.accountIcon}
              altText={"Entity signup step 1"}
            />
          </li>
          <li className="ent-step-2">
            <EvuemeImageTag
              imgSrc={icon.idCardIcon}
              altText={"Entity signup step 2"}
            />
          </li>
          <li className="ent-step-3">
            <EvuemeImageTag
              imgSrc={icon.penToolIcon}
              altText={"Entity signup step 3"}
            />
          </li>
        </ul>
      </section>
      {newEntity.entityType === "Job Seeker/Candidate" ? null : (
        // <>
        //   <div className="row">
        //     <NormalInputField
        //       divTagCssClasses="input-field col xl4 l4 m6 s12"
        //       inputTagCssClasses="validate"
        //       inputTagIdAndName={"firstName"}
        //       placeholder={"First Name"}
        //       value={candidateDetails.firstName}
        //       onChange={handleCandidateChange}
        //       required={true}
        //       labelText={"First Name"}
        //     />
        //     <NormalInputField
        //       divTagCssClasses="input-field col xl4 l4 m6 s12"
        //       inputTagCssClasses="validate"
        //       inputTagIdAndName={"lastName"}
        //       placeholder={"Last Name"}
        //       value={candidateDetails.lastName}
        //       onChange={handleCandidateChange}
        //       labelText={"Last Name"}
        //       required={true}
        //     />
        //     <NormalInputField
        //       divTagCssClasses="input-field col xl4 l4 m6 s12"
        //       inputTagCssClasses="validate"
        //       type="number"
        //       inputTagIdAndName={"candidateWhatsappNumber"}
        //       placeholder={"whatsApp Number"}
        //       value={candidateDetails.candidateWhatsappNumber}
        //       onChange={handleCandidateChange}
        //       labelText={"WhatsApp Number"}
        //       required={true}
        //     />

        //     <NormalInputField
        //       divTagCssClasses="input-field col xl4 l4 m6 s12"
        //       inputTagCssClasses="validate"
        //       type="number"
        //       inputTagIdAndName={"mobileNumber"}
        //       placeholder={"Mobile Number"}
        //       value={candidateDetails.mobileNumber}
        //       onChange={handleCandidateChange}
        //       labelText={"Mobile Number"}
        //       required={true}
        //     />

        //     <NormalInputField
        //       divTagCssClasses="input-field col xl4 l4 m6 s12"
        //       inputTagCssClasses="validate"
        //       inputTagIdAndName={"email"}
        //       placeholder={"Email"}
        //       value={candidateDetails.email}
        //       onChange={handleCandidateChange}
        //       required={true}
        //       labelText={"Email"}
        //     />
        //     <PasswordInputField
        //       divTagCssClasses="input-field col xl4 l4 m6 s12"
        //       inputTagCssClasses="password validate"
        //       inputTagIdAndName={"candidatePassword"}
        //       placeholder={"Enter Your Password"}
        //       value={candidateDetails.candidatePassword}
        //       onChange={handleCandidateChange}
        //       labelText={"Password"}
        //       required={true}
        //     />
        //   </div>
        //   <div className="col xl12 l12 m12 s12 center-align">
        //     <NextButton
        //       buttonTagCssClasses={"btn-submit"}
        //       buttonText={"Done"}
        //       onClick={handleDone}
        //     />
        //   </div>
        // </>
        <>
          <div className="row">
            <NormalInputField
              divTagCssClasses="input-field col xl4 l4 m6 s12"
              inputTagCssClasses="validate"
              inputTagIdAndName={"businessName"}
              placeholder={
                newEntity.entityType === "College/University"
                  ? "College/University Name"
                  : "Business Name"
              }
              value={newEntity.businessName}
              onChange={handleOnChangeEntityData}
              onBlur={checkUniqueBusinessName}
              missing={error.businessName}
              required={true}
              labelText={
                newEntity.entityType === "College/University"
                  ? "Campus Name"
                  : "Business Name"
              }
            />
            <NormalInputField
              divTagCssClasses="input-field col xl4 l4 m6 s12"
              inputTagCssClasses="validate"
              inputTagIdAndName={"businessShortName"}
              placeholder={"Popularly known as"}
              value={newEntity.businessShortName}
              onChange={handleOnChangeEntityData}
              labelText={
                newEntity.entityType === "College/University"
                  ? "Campus Short Name"
                  : "Business Short Name"
              }
            />
            <SelectInputField
              divTagCssClasses={"input-field col xl4 l4 m6 s12"}
              selectTagIdAndName={"country"}
              options={countries}
              value={newEntity.country || "105"}
              onChange={handleOnChangeEntityData}
              labelText={"Country"}
              firstOptionDisabled={false}
            />
            <SelectInputField
              divTagCssClasses={"input-field col xl4 l4 m6 s12"}
              selectTagIdAndName={"hqstate"}
              options={states}
              value={newEntity.hqstate || ""}
              onChange={handleOnChangeEntityData}
              labelText={
                newEntity.entityType === "College/University"
                  ? "Campus State"
                  : "HQ State"
              }
              firstOptionDisabled={false}
            />
            { }
            <SelectInputField
              divTagCssClasses={"input-field col xl4 l4 m6 s12"}
              selectTagIdAndName={"hqcity"}
              value={newEntity.hqcity}
              onChange={handleOnChangeEntityData}
              options={cities}
              labelText={
                newEntity.entityType === "College/University"
                  ? "Campus City"
                  : "HQ City"
              }
              firstOptionDisabled={false}
            />
            <NormalInputField
              divTagCssClasses="input-field col xl4 l4 m6 s12"
              inputTagCssClasses="validate"
              type="number"
              inputTagIdAndName={"pincode"}
              placeholder={"PIN Code"}
              onBlur={checkValidPinCode}
              value={newEntity.pincode}
              onChange={handleOnChangeEntityData}
              labelText={"PIN Code"}
            />
            <SelectInputField
              divTagCssClasses={"input-field col xl4 l4 m6 s12"}
              selectTagIdAndName={"noOfEmployees"}
              options={[
                { optionKey: "1-10", optionValue: "1-10" },
                { optionKey: "11-25", optionValue: "11-25" },
                { optionKey: "26-50", optionValue: "26-50" },
                { optionKey: "51-200", optionValue: "51-200" },
                { optionKey: "201-500", optionValue: "201-500" },
                { optionKey: "501-1000", optionValue: "501-1000" },
                { optionKey: "1001-5000", optionValue: "1001-5000" },
                { optionKey: "5001-10000", optionValue: "5001-10000" },
                { optionKey: "10001-25000", optionValue: "10001-25000" },
                { optionKey: ">25000", optionValue: ">25000" },
              ]}
              value={newEntity.noOfEmployees}
              onChange={handleOnChangeEntityData}
              firstOptionDisabled={false}
              labelText={
                newEntity.entityType === "College/University"
                  ? "No of Students"
                  : "No Of Employees"
              }
            />
            <NormalInputField
              divTagCssClasses="input-field col xl4 l4 m6 s12"
              inputTagCssClasses="validate"
              inputTagIdAndName={"webSite"}
              placeholder={"Website URL"}
              value={newEntity.webSite}
              onChange={handleWebsiteChange}
              required={true}
              labelText={"Website URL"}
              onBlur={() => {
                if (newEntity.webSite && !isValidURL(newEntity.webSite)) {
                  return WarningToast("Invalid Url");
                }
                checkUniqueWebsiteUrl(newEntity.webSite);
              }}
              // onBlur={() => {
              //   const isWebsiteEmpty = newEntity.webSite === "https://"; // Check if website is just the default prefix
              //   if (isWebsiteEmpty) {
              //     setError(prev => ({ ...prev, webSite: true })); // Update error state
              //     return WarningToast("Please enter a valid Website URL.");
              //   }
              //   if (newEntity.webSite && !isValidURL(newEntity.webSite)) {
              //     return WarningToast("Invalid URL");
              //   }
              //   checkUniqueWebsiteUrl(newEntity.webSite);
              // }}
              missing={error.webSite}
            />
          </div>
          <hr />
          <div className="row valign-wrapper row-padding">
            <div className="col xl6 l6 m6 s12" style={{ margin: "8px" }}>
              <h3 className="h3-title contact-person-details-icon-wrapper">
                <i>
                  <EvuemeImageTag
                    className={
                      "secondaryColorFilter contact-person-details-icon"
                    }
                    imgSrc={icon.accountIcon}
                    altText={"Enter contact person details below"}
                  />
                </i>
                Contact Person Details
              </h3>
            </div>
          </div>
          <div className="row optionBox">
            {newEntity?.contactPersonDetails?.map((inputs, index) => {
              return (
                <div className="addmore-container" key={`contactPerson_${inputs.id || index}`}>
                  <NormalInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="validate"
                    // inputTagIdAndName={"firstName"}
                    inputTagIdAndName={`firstName_${index}`}
                    name={`firstName`}  // Ensure name matches with the field key
                    placeholder={"Contact Person First Name"}
                    value={inputs.firstName}
                    // missing={error.firstName}
                    missing={error[`contactFirstName_${index}`]} // Dynamic error key
                    onKeyPress={validateNames}
                    onChange={(e) => handleFormChange(e, index)}
                    required={true}
                    labelText={"Contact Person First Name"}
                  />
                  <NormalInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="validate"
                    // inputTagIdAndName={"lastName"}
                    inputTagIdAndName={`lastName_${index}`}
                    name={`lastName`}
                    placeholder={"Contact Person Last Name"}
                    value={inputs.lastName}
                    // missing={error.lastName}
                    missing={error[`contactLastName_${index}`]}
                    onKeyPress={validateNames}
                    onChange={(e) => handleFormChange(e, index)}
                    required={true}
                    labelText={"Contact Person Last Name"}
                  />
                  <MobileNumberInputField
                    // divTagCssClasses="input-field col xl4 l4 m6 s12"
                    divTagCssClasses={`input-field col xl4 l4 m6 s12 ${error[`contactWhatsappNumber_${index}`] ? 'input-missing-value' : ''}`}
                    inputTagCssClasses="validate"
                    type="number"
                    onKeyPress={validateNumbers}
                    // inputTagIdAndName={"whatsappNumber"}
                    inputTagIdAndName={`whatsappNumber_${index}`}
                    name="whatsappNumber"
                    placeholder={"Contact Person Whatsapp No"}
                    value={inputs.whatsappNumberCountryCode + inputs.whatsappNumber}
                    onChange={(e) => {
                      const x = {
                        target: { name: "whatsappNumber", value: e },
                      };
                      handleFormChange(x, index);
                    }}
                    required={true}
                    labelText={"Whatsapp No"}
                    isVerified={inputs.whatsappNumberVerified}
                    setIsVerified={(verified) => {
                      setWhatsappVerified(verified, index)
                    }}
                    showVerification={true}
                    // missing={error.whatsappNumber}
                    missing={error[`contactWhatsappNumber_${index}`]}
                  />
                  {/* <NormalInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="validate"
                    type="email"
                    inputTagIdAndName={"email"}
                    placeholder={"Contact Person Email Id"}
                    onBlur={validateEmailInput}
                    value={inputs.email}
                    onChange={(e) => handleFormChange(e, index)}
                    required={true}
                    labelText={"Email"}
                  /> */}
                  <NormalInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="validate"
                    type="email"
                    // inputTagIdAndName={"email"}
                    inputTagIdAndName={`email_${index}`}
                    name="email"
                    placeholder={"Contact Person Email Id"}
                    onBlur={(e) => validateEmailInput(e, WarningToast)}
                    value={inputs.email}
                    onChange={(e) => handleFormChange(e, index)}
                    required={true}
                    // missing={error.email}
                    missing={error[`contactEmail_${index}`]}
                    labelText={"Email"}
                  />

                  <NormalInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="validate"
                    inputTagIdAndName={`designation_${index}`}
                    name="designation"
                    placeholder={"Designation"}
                    value={inputs.designation}
                    onChange={(e) => handleFormChange(e, index)}
                    labelText={"Designation"}
                  />
                  <NormalInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="validate"
                    inputTagIdAndName={`linkdinUrl_${index}`}
                    name="linkdinUrl"
                    placeholder={"Linkedin URL"}
                    value={inputs.linkdinUrl}
                    onChange={(e) => handleFormChange(e, index)}
                    labelText={"Linkedin URL"}
                    // onBlur={() => {
                    //   if (
                    //     newEntity.linkdinUrl &&
                    //     !isValidURL(newEntity.linkdinUrl)
                    //   ) {
                    //     return WarningToast("Invalid Url");
                    //   }
                    // }}
                    onBlur={(e) => validateLinkedinUrlInput(e, WarningToast)}

                  />
                  <MobileNumberInputField
                    // divTagCssClasses="input-field col xl4 l4 m6 s12"
                    divTagCssClasses={`input-field col xl4 l4 m6 s12 ${error[`contactMobileNumber_${index}`] ? 'input-missing-value' : ''}`}
                    inputTagCssClasses="validate"
                    // inputTagIdAndName={"mobileNumber"}
                    inputTagIdAndName={`mobileNumber_${index}`}
                    name="mobileNumber"
                    onKeyPress={validateNumbers}
                    placeholder={"Contact Person Mobile No"}
                    type="number"
                    value={inputs.mobileNumberCountryCode + inputs.mobileNumber}
                    onChange={(e) => {
                      const x = { target: { name: "mobileNumber", value: e } };
                      handleFormChange(x, index);
                    }}
                    required={true}
                    labelText={"Mobile No"}
                    isVerified={inputs.mobileNumberVerified}
                    setIsVerified={(verified) => {
                      setMobileNumberVerified(verified, index)
                    }}
                    showVerification={true}
                    // missing={error.mobileNumber}
                    missing={error[`contactMobileNumber_${index}`]}
                  />

                  <PasswordInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    inputTagCssClasses="password validate"
                    // inputTagIdAndName={"password"}
                    inputTagIdAndName={`password_${index}`}
                    name="password"
                    placeholder={"Enter Your Password"}
                    onChange={(e) => handleFormChange(e, index)}
                    value={inputs.password}
                    onBlur={(e) => {
                      const pw = e.target.value;
                      if (checkPasswordStrength(pw) !== null) {
                        return WarningToast("Password strength weak!");
                      }
                    }}
                    labelText={"Password"}
                    // missing={error.password}
                    missing={error[`contactPassword_${index}`]}
                  />

                  <PasswordInputField
                    divTagCssClasses="input-field col xl4 l4 m6 s12"
                    // inputTagIdAndName={"confirmPassword"}
                    inputTagIdAndName={`confirmPassword_${index}`}
                    name="confirmPassword"
                    placeholder={"Enter Your Password"}
                    onChange={(e) => handleFormChange(e, index)}
                    value={inputs.confirmPassword}
                    labelText={"Confirm Password"}
                    onBlur={(e) => {
                      const pw = e.target.value;
                      if (pw !== inputs.password) {
                        return WarningToast("Password did not match!");
                      }
                    }}
                    // missing={error.confirmPassword}
                    missing={error[`contactConfirmPassword_${index}`]}
                  />

                  <div className="valign-wrapper input-field col xl3 l3 m3 s12">
                    {newEntity?.contactPersonDetails.length - 1 !== 0 && (
                      <NormalButton
                        className="btn btn-clear btn-submit right btn-small add"
                        buttonText={"Remove"}
                        onClick={() => handleRemove(index)}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <div className="col xl12 l12 m12 s12 right-align">
              <div style={{ position: "relative" }}>
                <NormalButton
                  className="btn btn-clear btn-submit right btn-small add add-contact-person-btn"
                  leftIconSrc={icon.mathPlusIcon}
                  leftIconAltText={"Add more contact person"}
                  buttonText={"Add Contact Person"}
                  onClick={handleAdd}
                />
                <NextButton
                  buttonTagCssClasses={"btn-submit"}
                  buttonText={"Next"}
                  onClick={handleOnClickNextButton}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EntitySignupStep1;
