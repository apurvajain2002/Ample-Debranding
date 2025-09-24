import React, { useEffect, useState, useCallback } from "react";
import { icon } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../../components/buttons/normal-button";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NewTypeaheadInputField from "../input-fields/NewTypeaheadInputField";
import { validateNames, validateEmailInput } from "../../utils/valdationRegex";
import { saveInterviewer } from "../../redux/actions/create-job-actions";
import SelectInputField from "../input-fields/select-input-field";
import { baseUrl } from "../../config/config";
import SuccessToast from "../toasts/success-toast";
import WarningToast from "../../components/toasts/warning-toast";
import MobileNumberInputField from "../../components/input-fields/mobile-number-input-field";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";
import { fetchReportMetaData } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import CustomModal from "../modals/custom-modal";
import { optionMapper } from "../../utils/optionMapper";
import axiosInstance from "../../interceptors";
import { useGlobalContext } from "../../context";
const initialState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  mobileNumber: "",
};

const InterviewerModalPositionReport = ({
  onOpen,
  onClose,
  attachmentFile,
  selectedInterviewersInJob,
  candidateList,
}) => {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [formDetails, setFormDetails] = useState(initialState);
  const dispatch = useDispatch();
  const [isAddingInterviewer, setIsAddingInterviewer] = useState(false);
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  // console.log("attachmentFile", attachmentFile);
  

  const [availableOptionsInterviewr, setAvailableOptionsInterviewr] = useState(
    []
  );
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);

  const handleChange = useCallback((e) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     return WarningToast("No file selected!");
  //   }
  //   if (file.type !== "application/pdf") {
  //     return WarningToast("Only PDF files are allowed!");
  //   }
  //   setSelectedFile(file);

  //   setIsFileUploading(true);
  //   try {
  //     // Simulate API call for file upload
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     setIsFileUploading(false);
  //     SuccessToast("File uploaded successfully!");
  //   } catch (error) {
  //     setIsFileUploading(false);
  //     WarningToast("File upload failed!");
  //   }
  // };

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
    } else {
      let formData = {
        ...formDetails,
        countryCode: `+${getCountryCode(formDetails.mobileNumber)}`,
        mobileNumber: getPhoneNumber(formDetails.mobileNumber),
      };
      dispatch(saveInterviewer(formData));
      setFormDetails(initialState);
      setIsAddingInterviewer(false);
    }
  }, [formDetails]);

  useEffect(() => {
    const newObjArr = interviewrs?.map((interviwr) => {
      const val =
        interviwr?.["firstName"] +
        " " +
        interviwr?.["lastName"] +
        "(" +
        interviwr?.["id"] +
        ")";
      return {
        optionKey: val,
        optionValue: val,
      };
    });
    setAvailableOptionsInterviewr(newObjArr);
  }, [interviewrs]);

  useEffect(() => {
    // Filter out undefined/null values and only process valid interviewer objects
    const validInterviewers = selectedInterviewersInJob?.filter(interviwr => 
      interviwr && 
      interviwr.firstName && 
      interviwr.lastName && 
      interviwr.id
    ) || [];
    
    const interviewersInJob = validInterviewers.map((interviwr) => {
      return (
        interviwr?.["firstName"] +
        " " +
        interviwr?.["lastName"] +
        "(" +
        interviwr?.["id"] +
        ")"
      );
    });
    setSelectedInterviewers((prevArray) => [
      ...prevArray,
      ...interviewersInJob?.filter((item) => !prevArray.includes(item)),
    ]);
  }, [selectedInterviewersInJob]);

  useEffect(() => {
    // console.log("selectedInterviewers", selectedInterviewers);
  }, [selectedInterviewers]);

  const handleOnChangeInterviewer = (selected) => {
    setSelectedInterviewers(selected);
  };
  
  const handleRemoveMultiValueRecruiter = (key, value) => {
    const updatedInterviewers = selectedInterviewers.filter(
      (rec) => rec !== value
    );

    setSelectedInterviewers(updatedInterviewers);
  };

  const handleShare = async () => {
    console.log("selectedInterviewers in handleShare", selectedInterviewers);

    const interviewersWithEmail = selectedInterviewers.map((interviewer) => {
      const interviewerId = interviewer.split("(")[1].split(")")[0]; // Extract ID
      const interviewerData = interviewrs.find(
        (interviewer) => interviewer.id === parseInt(interviewerId)
      );
      return interviewerData ? interviewerData.primaryEmailId : null;
    });

    // console.log("Selected Interviewers' Emails:", interviewersWithEmail);

    // if (!selectedFile) {
    //   return WarningToast("Please select a file before sharing.");
    // }

    const formData = new FormData();    
      // formData.append("attachments", "");
      if (attachmentFile) {
        const file = new File([attachmentFile], "", {
          type: "application/pdf",
        });
        formData.append("attachments", file);
      } else {
        formData.append("attachments", "");
      }
    

    const queryParams = {
      to: interviewersWithEmail.join(","),
      subject: "Testing subject new mail",
      body: "testing body",
    };

    try {
      setIsFileUploading(true);
      await axiosInstance.post(
        `${baseUrl}/common/otp/send-email-with-attachments`,
        formData,
        { params: queryParams }
      );
      SuccessToast("Email sent successfully!");
      
      // Auto-close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1000); // 1 second delay to show the toast
    } catch (error) {
      WarningToast("Failed to send email!");
      console.error(error);
    } finally {
      setIsFileUploading(false);
    }
  };

  const { rootColor } = useGlobalContext();
  
  return (
    <CustomModal isOpen={onOpen} onClose={onClose}>
      <div className="col s12 xl6 l6 m6 login-wrap" style={{ width: "100%" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <i>
            <img src={icon.shareIconShareIcon} alt="share" />
          </i>{" "}
          Share interview with
        </span>
        <div
          className="input-field input-field-modal"
          style={{ marginTop: "2rem" }}
        >
          <NewTypeaheadInputField
            labelText="Select Interviewers"
            selectTagIdAndName="recruiters"
            placeholder="Select interviewers..."
            options={optionMapper(
              availableOptionsInterviewr,
              "optionValue",
              "optionValue",
              "Select Interviewers"
            )}
            value={selectedInterviewers}
            onChange={handleOnChangeInterviewer}
            handleRemoveMultiValue={handleRemoveMultiValueRecruiter}
            required={true}
            multiple={true}
          />
          <div className="interviewerModalRecruiter" style={{marginBottom: "1rem", marginTop: "1rem"}}>
          <span style={{ fontWeight: "500", color: rootColor.primary }}>

            </span>
            <span>
              <button
                class="waves-effect waves-light btn-large btn-reject btn-display"
                style={{ lineHeight: 1 }}
                onClick={() => setIsAddingInterviewer(true)}
              >
                Add Interviewer
              </button>
            </span>
          </div>
          {!isAddingInterviewer && (
            <>
              <NormalButton
                buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit modal-close"
                onClick={() => handleShare()}
                style={{ position: "absolute", top: "51px" }}
                buttonText={"Share"}
              />
            </>
          )}
          {isAddingInterviewer && (
            <>
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
                placeholder={"Enter Email Id"}
                value={formDetails.emailAddress}
                onChange={handleChange}
                labelText={"Email Address"}
              />
              <MobileNumberInputField
                labelText={"Contact Number"}
                value={formDetails.mobileNumber}
                onChange={(number) => {
                  setFormDetails((prev) => ({
                    ...prev,
                    mobileNumber: number,
                  }));
                }}
                divTagCssClasses="input-field password-relative-modals"
                inputTagCssClasses="validate"
                inputTagIdAndName={"mobileNumber"}
                required
              />
              <div className="modal-close-and-save-button">
                <NormalButton
                  buttonTagCssClasses={"btn-clear btn-submit primaryColorHex"}
                  buttonText={"Close"}
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    setIsAddingInterviewer(false); 
                    setFormDetails(initialState); 
                  }}
                />
                <NormalButton
                  buttonTagCssClasses={"btn-clear btn-submit primaryColorHex"}
                  buttonText={"Save"}
                  style={{ marginTop: "1rem" }}
                  onClick={handleSave}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default React.memo(InterviewerModalPositionReport);
