import React, { useEffect, useState, useCallback } from "react";
import { icon } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../buttons/normal-button";
import NormalInputField from "../input-fields/normal-input-field";
import NewTypeaheadInputField from "../input-fields/NewTypeaheadInputField";
import { validateNames, validateEmailInput } from "../../utils/valdationRegex";
import { saveInterviewer } from "../../redux/actions/create-job-actions";
import SelectInputField from "../input-fields/select-input-field";
import WarningToast from "../toasts/warning-toast";
import MobileNumberInputField from "../input-fields/mobile-number-input-field";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";
import { fetchReportMetaData } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import CustomModal from "../modals/custom-modal";
import { optionMapper } from "../../utils/optionMapper";
import { useGlobalContext } from "../../context";
import SuccessToast from "../toasts/success-toast";
const initialState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  mobileNumber: "",
};

const InterviewerModalSummaryPage = ({
  onOpen,
  onClose,
  selectedInterviewersInJob,
  statusList,
  candidateList,
}) => {
  const [selectedCandidatesList, setSelectedCandidatesList] = useState([]);
  const [formDetails, setFormDetails] = useState(initialState);
  const dispatch = useDispatch();
  const [isAddingInterviewer, setIsAddingInterviewer] = useState(false);
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const { selectedJobId, selectedRoundId } = useSelector(
    (state) => state.interviewResponsesL1DashboardSliceReducer
  );

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
    if (candidateList?.length) {
      setSelectedCandidatesList(candidateList.map((item) => item.optionValue));
    }
  }, [candidateList]);

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
    // console.log("selectedInterviewers after setting: ", selectedInterviewers);
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
    if (!selectedInterviewers.length) {
      WarningToast("Please Select atleast one Interviewer");
      return;
    } else if (!selectedCandidatesList.length) {
      WarningToast("Please Select atleast one Candidate");
      return;
    }
    
    console.log("selected Candiddates", selectedCandidatesList);
    console.log("selected Interviewers", selectedInterviewers);
    
    const reportType = "shareInterview";
    const sortBy = "";

    const selectedCandidateList = selectedCandidatesList.map((val) => {
      const match = val.match(/\(([^)]+)\)/);
      return match ? Number(match[1]) : 0;
    });
    const selectedInterviewersList = selectedInterviewers.map((val) => {
      const match = val.match(/\(([^)]+)\)/);
      return match ? match[1] : "";
    });
    let selectedInterviewersEmailList = [];
    interviewrs.forEach((element) => {
      if (selectedInterviewersList.includes(String(element?.["id"]))) {
        selectedInterviewersEmailList.push(element?.["primaryEmailId"]);
      }
    });
    
    try {
      const result = await dispatch(
        fetchReportMetaData({
          selectedJobId,
          selectedRoundId,
          selectedCandidateList,
          selectedInterviewersEmailList,
          reportType,
          sortBy,
        })
      );
      
      // Check if the API call was successful
      if (result.meta.requestStatus === 'fulfilled') {
        // Show success toast with the message from API response
        const successMessage = result.payload?.message || "Report Link Created Successfully and Emails Sent!";
        SuccessToast(successMessage);
        
        // Auto-close the modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1000); // 1 second delay to show the toast
      }
    } catch (error) {
      console.error("Error sharing interview:", error);
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
            required={true}
            handleRemoveMultiValue={handleRemoveMultiValueRecruiter}
            multiple={true}
            // missing={error.recruiters}
          />
          <div
            className="interviewerModalRecruiter"
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
          >
            <span style={{ fontWeight: "500", color: rootColor.primary }}>
              Selected candidate to share
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
              <SelectInputField
                divTagCssClasses="col xl12 l12 m12 s12"
                options={[
                  { optionKey: "Choose Applicant", optionValue: "domain" },
                  ...candidateList,
                ]}
                firstOptionDisabled={true}
                value={candidateList}
                disabled={true}
              />

              <NormalButton
                buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit modal-close"
                onClick={() => handleShare()}
                style={{ marginTop: "1rem" }}
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

export default React.memo(InterviewerModalSummaryPage);
