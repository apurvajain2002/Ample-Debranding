import React, { useEffect, useState, useCallback } from "react";
import { icon } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../../components/buttons/normal-button";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NewTypeaheadInputField from "../input-fields/NewTypeaheadInputField";
import EvuemeModal from "../../components/modals/evueme-modal";
import { validateNames, validateEmailInput } from "../../utils/valdationRegex";
import { saveInterviewer } from "../../redux/actions/create-job-actions";
import SelectInputField from "../input-fields/select-input-field";
import WarningToast from "../../components/toasts/warning-toast";
import MobileNumberInputField from "../../components/input-fields/mobile-number-input-field";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";
import CustomModal from "../modals/custom-modal";
import { optionMapper } from "../../utils/optionMapper";
import { fetchReportMetaData } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { useGlobalContext } from "../../context";
import SuccessToast from "../../components/toasts/success-toast";
const initialState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  mobileNumber: "",
};

const InterviewerModalRecruiter = ({
                                     onOpen,
                                     onClose,
                                     selectedInterviewersInJob,
                                     statusList,
                                     candidateList,
                                   }) => {
  const [interviewersList, setInterviewersList] = useState([]);
  const [selectedCandidatesList, setSelectedCandidatesList] = useState([]);
  const [formDetails, setFormDetails] = useState(initialState);
  const dispatch = useDispatch();
  const [applicantList, setApplicantList] = useState([]);
  const [isAddingInterviewer, setIsAddingInterviewer] = useState(false);
  const { currentJobDetails, interviewrs } = useSelector(
      (state) => state.createNewJobSliceReducer
  );
  const { selectedJobId, selectedRoundId } = useSelector(
      (state) => state.interviewResponsesRecruiterDashboardSliceReducer
  );
  const [availableOptionsInterviewr, setAvailableOptionsInterviewr] = useState(
      []
  );
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [sortBy,setSortBy] = useState("");

  useEffect(()=>{
    const list = candidateList?.map((row)=>{
      const val = row?.['firstName']+" "+row?.['lastName']+"("+row?.['id']+")";
      return {optionKey:val,
        optionValue:val
      };
    });
    setApplicantList(list);
  }, []);

  useEffect(() => {
    const newObjArr = interviewrs?.map((interviwr) => {
      const val = interviwr?.["firstName"] + " " + interviwr?.["lastName"]+"("+interviwr?.['id']+")";
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
      return interviwr?.["firstName"] + " " + interviwr?.["lastName"]+"("+interviwr?.['id']+")";
    });
    
    setSelectedInterviewers((prevArray) => [
      ...prevArray,
      ...interviewersInJob.filter((item) => !prevArray.includes(item)),
    ]);
  }, [selectedInterviewersInJob]);

  const handleChange = useCallback((e) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // const handleShare = () => {
  //   if (selectedInterviewers.length === 0) {
  //     WarningToast("Please select at least one interviewer");
  //     return;
  //   }
  //   console.log("Selected Interviewers:", selectedInterviewers);
  //   // Add logic to handle sharing with the selected interviewers
  // };

  // useEffect(() => {
  //   const modalElement = document.getElementById("interviewerModalRecruiter");
  //   if (modalElement) {
  //     const modalInstance = M.Modal.init(modalElement);
  //   }
  // }, []);

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
  // const availableOptions = interviewersList.map((interviewer) => ({
  //   optionKey: `${interviewer.firstName} ${interviewer.lastName}`,
  //   optionValue: `${interviewer.firstName} ${interviewer.lastName}`,
  // }));

  const handleOnChangeInterviewer = (selected) => {
    setSelectedInterviewers(selected);
  };

  const handleRemoveMultiValueRecruiter = (key, value) => {
    const updatedInterviewers = selectedInterviewers.filter(
        (rec) => rec !== value
    );

    setSelectedInterviewers(updatedInterviewers);
  };

  const handleOnChangeCandidate = (selected) => {
    setSelectedCandidatesList(selected);
  };

  const handleRemoveMultiValueCandidate = (key, value) => {
    const updatedCandidates = selectedCandidatesList.filter(
        (rec) => rec !== value
    );
    setSelectedCandidatesList(updatedCandidates);
  }
  const handleShare=async ()=>{
    if(!selectedInterviewers.length) {
      WarningToast("Please Select atleast one Interviewer");
      return;
    }
    else if(!selectedCandidatesList.length) {
      WarningToast("Please Select atleast one Candidate");
      return;
    }
    
    console.log("selected Candiddates",selectedCandidatesList);
    console.log("selected Interviewers",selectedInterviewers);
    
    const reportType='shareInterview';

    const selectedCandidateList = selectedCandidatesList.map((val)=>{
      const match = val.match(/\(([^)]+)\)/);
      return match ? Number(match[1]) : 0;
    });
    const selectedInterviewersList = selectedInterviewers.map((val)=>{
      const match = val.match(/\(([^)]+)\)/);
      return match ? match[1]: '';
    })
    let selectedInterviewersEmailList =[];
    interviewrs.forEach((element) => {
      if(selectedInterviewersList.includes(String(element?.['id']))){
        selectedInterviewersEmailList.push(element?.['primaryEmailId']);
      }
    });
    
    try {
      const result = await dispatch(fetchReportMetaData({
        selectedJobId,
        selectedRoundId,
        selectedCandidateList,
        selectedInterviewersEmailList,
        reportType,
        sortBy
      }));
      
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
  }

  const handleSortByUpdate = (e)=>{
    setSortBy(e.target.value);
  }
  const { rootColor } = useGlobalContext();
  return (
      <CustomModal isOpen={onOpen} onClose={onClose}>
        <div className="col s12 xl6 l6 m6 login-wrap" style={{ width: "100%" }}>
        <span
            style={{
              // display: "flex",
              // justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
        >
          <i>
            <img src={icon.shareIconShareIcon} alt="share" />
          </i>{" "}
          Share interview with
        </span>
          {/* <div className="login-wrap-box2"> */}
          <div
              className="input-field input-field-modal"
              style={{ marginTop: "2rem" }}
          >
            <NewTypeaheadInputField
                // divTagCssClasses="input-field col xl3 l3 m3 s12"
                // divTagCssClasses="input-field"
                labelText="Select Interviewers"
                selectTagIdAndName="recruiters"
                placeholder="Select interviewers..."
                options={optionMapper(
                    availableOptionsInterviewr,
                    "optionValue",
                    "optionKey",
                    "Select Interviewers"
                )}
                value={selectedInterviewers}
                onChange={handleOnChangeInterviewer}
                required={true}
                handleRemoveMultiValue={handleRemoveMultiValueRecruiter}
                multiple={true}
                // missing={error.recruiters}
            />
            <div className="interviewerModalRecruiter">
            <span style={{ fontWeight: "500", color: "rootColor.primary" }}>
              Choose candidate to share
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
                      // labelText={"Sort By"}
                      divTagCssClasses="col xl12 l12 m12 s12"
                      options={[
                        { optionKey: "Filter By", optionValue: "domain" },
                        { optionKey: "None", optionValue: "None" },
                        ,
                        ...statusList,
                      ]}
                      firstOptionDisabled={true}
                      value={"domain"}
                      onChange={() => {}}
                  />

                  <NewTypeaheadInputField
                      divTagCssClasses="col xl12 l12 m12 s12"
                      labelText="Select Candidates"
                      placeholder="Select Candidates..."
                      options={optionMapper(
                          applicantList,
                          "optionValue",
                          "optionKey",
                          "Select Candidates"
                      )}
                      // options={applicantList}
                      value={selectedCandidatesList}
                      onChange={handleOnChangeCandidate}
                      required={true}
                      handleRemoveMultiValue={handleRemoveMultiValueCandidate}
                      multiple={true}
                      // missing={error.recruiters}
                  />

                  <SelectInputField
                      divTagCssClasses="col xl12 l12 m12 s12"
                      options={[
                        {
                          optionKey: "Sort Shared candidates by",
                          optionValue: ""
                        },
                        { optionKey: "Domain Score", optionValue: "domain" },
                        { optionKey: "Soft skills score", optionValue: "soft" },
                        { optionKey: "Weighted score", optionValue: "weighted" },
                      ]}
                      firstOptionDisabled={true}
                      value={sortBy}
                      onChange={handleSortByUpdate}
                      labelText={"Sort Shared candidates by"}
                  />
                  <NormalButton
                      buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit modal-close"
                      onClick={() => handleShare()}
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

export default React.memo(InterviewerModalRecruiter);