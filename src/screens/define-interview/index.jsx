import { useEffect, useState } from "react";
import {
  DefineInterviewCardBig,
  DefineInterviewCardSmall,
} from "./DefineInterviewRoundCards.jsx";
import SelectInputField from "../../components/input-fields/select-input-field.jsx";
import NormalButton from "../../components/buttons/normal-button.jsx";
import EvuemeLoader from "../../components/loaders/evueme-loader.jsx";
import NewTypeaheadInputField from "../../components/input-fields/NewTypeaheadInputField.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getJob,
  getAllInterviewrs,
} from "../../redux/actions/create-job-actions/index.js";
import {
  getAllLanguages,
  getAllNotPublishedJobs,
  getRoundDetails,
  saveRoundDetails,
} from "../../redux/actions/define-interview-actions/define-interview-actions.js";
import { arrayToKeyValue } from "../../utils/arrayToKeyValue.js";
import {
  setMessagesEmpty,
  setL1Round,
  setRecruiterRound,
  setCurrentJob,
} from "../../redux/slices/define-interview-slice.js";
import { optionMapper, optionMapperFns } from "../../utils/optionMapper.js";
import {
  selectJobId,
  setRoundName,
} from "../../redux/slices/create-new-job-slice.js";
import BreadCrome from "../../components/admin/admin-breadcrome/admin-breadcrome.jsx";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";
import { makeCommaSeparated } from "../../utils/makeCommaSeparated.js";
import WarningToast from "../../components/toasts/warning-toast.jsx";
import SuccessToast from "../../components/toasts/success-toast.jsx";
import ErrorToast from "../../components/toasts/error-toast.jsx";
import { roundsData } from "../../resources/constant-data/roundsData.js";

const DefineInterview = () => {
  const { jobId, roundName, currentJobDetails } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const { userId } = useSelector(state => state.signinSliceReducer);
  const {
    allNotPublishedJobs,
    recruiterRound,
    l1Round,
    allLanguages,
    successMessage,
    failMessage,
    isLoading,
    allEntityJobs
  } = useSelector((state) => state.defineInterviewSliceReducer);
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { tableData: entities, currentEntity } = useSelector(
    (state) => state.entitySliceReducer
  );

  const { userType} = useSelector((state) => state.signinSliceReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [interviewTranslationLanguages, setInterviewTranslationLanguages] = useState([]);

  const [defineInterview, setdefineInterview] = useState("");
  

  const [defineInterviewRoundForm, setDefineInterviewRoundForm] = useState({
    interviewTeam: [],
    domainSkills: [],
    softSkills: [],
    defaultLanguage: "English Indian",
    translationLanguages: [],
  });
 

  const [interviewersName, setInterviewersName] = useState([]);

  
  useEffect(() => {
     if (defineInterview) {
      dispatch(setRoundName(defineInterview));

      // Prefill from the rounds defined
      let roundData = null;
      if (defineInterview === roundsData.firstRound.name) {
        roundData = recruiterRound;
      } else if (defineInterview === roundsData.secondRound.name) {
        roundData = l1Round;
      }

      setDefineInterviewRoundForm(() => ({
        isRoundPublished: roundData?.isRoundPublished,
        interviewTeam: roundData?.interviewTeam || [],
        domainSkills: roundData?.domainSkills || [],
        softSkills: roundData?.softSkills || [],
        defaultLanguage: roundData?.defaultLanguage || "English Indian",
        translationLanguages: roundData?.interviewTranslationLanguages?.length
          ? roundData?.interviewTranslationLanguages
          : [],
      }));
      
    }
  }, [defineInterview,recruiterRound,l1Round,roundsData]);

  useEffect(() => {
    if (defineInterviewRoundForm?.defaultLanguage) {
      /* display only other langauges that are not selected in default language */
      const filteredLanguages = allLanguages.filter(
        (lang) => lang.name !== defineInterviewRoundForm.defaultLanguage
      );
      setInterviewTranslationLanguages(filteredLanguages);
      /* if default language is selected and exist
      in selected translation language then remove it from the list as default language cannot be included in
      tanslation language */
      const filteredTranslationLanguages = defineInterviewRoundForm?.translationLanguages.filter(
        (lang) => lang !== defineInterviewRoundForm?.defaultLanguage
      );
      setDefineInterviewRoundForm({
        ...defineInterviewRoundForm,
        translationLanguages: filteredTranslationLanguages,
      });
    } else {
      // If defaultLanguage is null/undefined, then display all languages (edge case)
      setInterviewTranslationLanguages(allLanguages);
    }
  }, [allLanguages, defineInterviewRoundForm?.defaultLanguage]);

  // Save/Edit round details
  const handleOnChangeDefineInterviewRoundForm = (e) => {
    let targetName = e.target.name;
    if (targetName === "defaultLanguage") {
      setDefineInterviewRoundForm({
        ...defineInterviewRoundForm,
        [targetName]: e.target.value,
      });
    } else {
      if (e.target.selectedOptions?.length > 15) {
        return WarningToast("You cannot add more than 15 skills");
      }

      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );

      setDefineInterviewRoundForm({
        ...defineInterviewRoundForm,
        [targetName]: selectedOptions,
      });
    }
  };

  // Handle remove selected values
  const handleRemoveSelectedValues = (data, fieldName) => {
    const modifiedSelectedValues = defineInterviewRoundForm[fieldName].filter(
      (val) => val !== data
    );
    setDefineInterviewRoundForm((prev) => ({
      ...prev,
      [fieldName]: modifiedSelectedValues,
    }));
  };

  // Handle get job details
  const handleGetJobDetails = () => {
    dispatch(getJob({ jobId: jobId }));
  };

  // Handle get interview round details
  const handleGetRoundDetails = () => {
    dispatch(getRoundDetails({ jobId: jobId }));
  };

  const handleSaveRoundDetails = () => {
    // Check if jobId is selected
    if (!jobId) {
      return WarningToast("Select a Job Position");
    }

    // Check if a round is selected
    if (!defineInterview) {
      return WarningToast("Select a round");
    }

    // Validate required fields
    if (
      defineInterviewRoundForm?.interviewTeam?.length === 0 ||
      !defineInterviewRoundForm?.defaultLanguage
    ) {
      return WarningToast("Select required fields");
    }

    // Prepare round data to save
    const roundData = {
      jobId: jobId,
      roundName: defineInterview,
      roundData: defineInterviewRoundForm,
    };

    setIsSaving(true); // Set the saving flag
    dispatch(saveRoundDetails(roundData)).then(() => {
      SuccessToast("Round details saved successfully!");
      setIsSaving(false); // Reset the flag
    }).catch(() => {
      setIsSaving(false); // Reset the flag on error
    });
  };


  
  // Handle submit round details
  const handleSubmitRoundDetails = () => {
    if (!jobId) {
      return WarningToast("Select a Job Position");
    }
    if (!defineInterview) {
      return WarningToast("Select a round");
    }
    if (
      recruiterRound.interviewTeam === null &&
      l1Round.interviewTeam === null
    ) {
      return WarningToast("Select required fields");
    }

    if(defineInterviewRoundForm.isRoundPublished){
      
      navigate("/admin/add-questions/new-question");
    }
    else{
      
    if (recruiterRound.interviewTeam !== null) {
      dispatch(setRecruiterRound(defineInterviewRoundForm));
      dispatch(
        saveRoundDetails({
          jobId: jobId,
          roundName: defineInterview,
          roundData: defineInterviewRoundForm,
        })
      );
    } else if (recruiterRound.interviewTeam === null && l1Round.interviewTeam !== null ) {
      dispatch(setL1Round(defineInterviewRoundForm));
      dispatch(
        saveRoundDetails({
          jobId: jobId,
          roundName: defineInterview,
          roundData: defineInterviewRoundForm,
        })
      );
      }
    }
  };

  useEffect(() => {
    document.title = "Define Interview";
    dispatch(getAllNotPublishedJobs({ userId }));
    dispatch(getAllLanguages());
    dispatch(getAllInterviewrs());
  }, []);

  // Choose a job and based on that setting the inital round
  useEffect(() => {
    if (jobId) {
      handleGetJobDetails();
      handleGetRoundDetails();
    }

    return () => {
      setdefineInterview("");
      setDefineInterviewRoundForm((prev) => ({
        ...prev,
        interviewTeam: [],
        domainSkills: [],
        softSkills: [],
        defaultLanguage: "",
        translationLanguages: [],
      }));
      dispatch(
        setRecruiterRound({
          interviewTeam: [],
          domainSkills: [],
          softSkills: [],
          defaultLanguage: "",
          interviewTranslationLanguages: [],
        })
      );
      dispatch(
        setL1Round({
          interviewTeam: [],
          domainSkills: [],
          softSkills: [],
          defaultLanguage: "",
          interviewTranslationLanguages: [],
        })
      );
    };
  }, [jobId]);


  // useEffect(() => {
  //   if (successMessage === "Data Fetched Successfully") return;
  //   if (successMessage) {
  //     SuccessToast(successMessage);
  //     navigate("/admin/add-questions/new-question");
  //   } else if (failMessage) {
  //     ErrorToast(failMessage);
  //   }
  //   handleGetRoundDetails();
  //   dispatch(setMessagesEmpty());
  // }, [successMessage, failMessage]);
  useEffect(() => {
    if (successMessage && !isSaving) {
      SuccessToast(successMessage);
      navigate("/admin/add-questions/new-question");
    } else if (failMessage) {
      ErrorToast(failMessage);
    }
    handleGetRoundDetails();
    dispatch(setMessagesEmpty());
  }, [successMessage, failMessage, isSaving]);



  useEffect(() => {
    if (currentJobDetails && currentJobDetails?.interviewRounds?.length) {
      setdefineInterview(currentJobDetails?.interviewRounds[0]);
    }
  }, [currentJobDetails]);

  useEffect(() => {
    const ivNames = interviewrs?.filter((iv) =>
      currentJobDetails?.interviewers?.includes(String(iv.id))
    );
    setInterviewersName(ivNames);
  }, [currentJobDetails, interviewrs]);
  
  const entityMap = entities.reduce((acc, { id, businessName }) => {
    acc[id] = businessName;
    return acc;
  }, {});
  
  const businessName = entityMap[currentJobDetails?.orgId] || 'Unknown';


  return (
    <>
      {/* Section 1: Select Job to then define it's interviews */}
      <div className="container">
        <BreadCrome />

        <div className="row row-margin valign-wrapper height-50">
          <aside className="input-field bginput col xl3 l3 m6 s12 padding-0">
            <SelectInputField
            // labelText={"Job Position"}
              selectTagIdAndName={"selectJobPosition"}
              options={optionMapper(
                allNotPublishedJobs,
                "positionName",
                "jobId",
                "Select a Job"
              )}
              value={jobId}
              onChange={(e) => {
                dispatch(selectJobId(e.target.value));
              }}
            />
          </aside>

          {userType === "admin" && (
  <div
    style={{
      width: '200px',
      border: '1px solid #ccc',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
    }}
  >
    {businessName}
  </div>
)}

          <aside className="col xl9 l9 m6 s12 padding-0">
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit right"}
              buttonText={"Edit Position"}
              onClick={() => navigate("/admin/job-details/job-position-details")}
            />
          </aside>
        </div>

        {currentJobDetails && (
          <div className="row row-margin">
            <DefineInterviewCardBig
              cardTitle={"Interview Rounds"}
              radioButtonValue={defineInterview || roundName}
              radioBtnList={currentJobDetails?.interviewRounds}
              onChange={(e) => {
                setdefineInterview(() => e.target.value);
              }}
            />
            <DefineInterviewCardBig
              cardTitle={"Vacancy Details"}
              normalList={[
                {
                  optionKey: "Experience",
                  optionValue:`${currentJobDetails?.minimumExperience || ""} 
                              ${currentJobDetails?.minimumExperience && currentJobDetails?.maximumExperience ? "-" : ""} 
                              ${currentJobDetails?.maximumExperience || ""} 
                              ${currentJobDetails?.minimumExperience && currentJobDetails?.maximumExperience ? "Yrs" : ""}`,
                },
                {
                  optionKey: "CTC Range",
                  optionValue: `${currentJobDetails?.minCtc || ""} 
                                ${currentJobDetails?.minCtc && currentJobDetails?.maxCtc ? "-" : ""} 
                                ${currentJobDetails?.maxCtc || ""} 
                                ${currentJobDetails?.minCtc && currentJobDetails?.maxCtc ? "L.P.A." : ""}`,
                },
                {
                  optionKey: "Locations",
                  optionValue: makeCommaSeparated(currentJobDetails?.locations),
                },
                {
                  optionKey: "Vacancy Approval Date",
                  optionValue: `${formatDate(
                    currentJobDetails?.vacancyApprovalDate?.slice(0, 10)
                  )}`,
                },
                {
                  optionKey: "Vacancy Start Date",
                  optionValue: `${formatDate(
                    currentJobDetails?.vacancyStartDate?.slice(0, 10)
                  )}`,
                },
                {
                  optionKey: "Vacancy Closure Date",
                  optionValue: `${formatDate(
                    currentJobDetails?.vacancyClosureDate?.slice(0, 10)
                  )}`,
                },
              ]}
            />
            <DefineInterviewCardBig
              cardTitle={"Recruiters"}
              normalList={[
                {
                  optionKey: "Recruiter",
                  optionValue: currentJobDetails?.recruiterName
                    ? makeCommaSeparated([...currentJobDetails?.recruiterName])
                    : [],
                },
              ]}
            />
            <DefineInterviewCardBig
              cardTitle={"Interviewers"}
              normalList={[
                {
                  optionKey: "Interviewer",
                  optionValue:
                    makeCommaSeparated(
                      interviewersName?.map((iv) => iv.firstName +" "+ iv.lastName)
                    ) || [],
                },
              ]}
            />
            <DefineInterviewCardBig
              cardTitle={"Domain SKills"}
              selectedValuesList={
                currentJobDetails?.domainSkills
                  ? [...currentJobDetails?.domainSkills]
                  : []
              }
            />
            <DefineInterviewCardBig
              cardTitle={"Soft SKills"}
              selectedValuesList={
                currentJobDetails?.softSkills
                  ? [...currentJobDetails?.softSkills]
                  : []
              }
            />
          </div>
        )}
      </div>

      {!isLoading ? (
        <>
          {/* Section 2: Edit round details from here */}

          <div className="bodybox-bodywr">
            <div className="body-box-bodybg">
              <h3 className="main-h3">
                {
                  !jobId
                    ? "Select a Job" // if no job selected, show "Select a job"
                    : defineInterview // if job selected then we check if round is selected
                      ? defineInterview // if round is also selected, show round name
                      : "Choose a round" // if round not selected, show "Choose a round"
                }
              </h3>
              {
                <div className="row row-margin">
                <div className="row row-margin">
                    <SelectInputField
                      divTagCssClasses={"input-field col xl6 l6 m6 s12"}
                      selectTagIdAndName={"interviewTeam"}
                      options={optionMapperFns(
                        interviewersName,
                        (val) => `${val.firstName} ${val.lastName}`,
                        (val) => val.id,
                        "Select Interviewers"
                      )}
                      value={defineInterviewRoundForm?.interviewTeam || []}
                      onChange={handleOnChangeDefineInterviewRoundForm}
                      multiple={true}
                      selectedValues={
                        // defineInterviewRoundForm.interviewTeam
                        interviewersName
                          ?.filter((iv) =>
                            defineInterviewRoundForm?.interviewTeam?.includes(
                              String(iv.id)
                            )
                          )
                          ?.map((iv) => `${iv.firstName} ${iv.lastName}`) || []
                      }
                      required={true}
                      handleRemoveSelectedValue={
                        // handleRemoveSelectedValues
                        (fullname, name) => {
                          const ivId = interviewersName?.find(
                            (iv) => `${iv.firstName} ${iv.lastName}` === fullname
                          )?.id;
                          setDefineInterviewRoundForm((prev) => {
                            const newIvs = prev?.interviewTeam?.filter(
                              (iv) => String(ivId) !== iv
                            );

                            return {
                              ...prev,
                              interviewTeam: newIvs,
                            };
                          });
                        }
                      }
                      labelText={"Interview Team"}
                    />
                    <SelectInputField
                      divTagCssClasses={"input-field col xl6 l6 m6 s12"}
                      selectTagIdAndName={"domainSkills"}
                      options={
                        currentJobDetails?.domainSkills
                          ? arrayToKeyValue(
                            currentJobDetails?.domainSkills,
                            "Select Domain Skills"
                          )
                          : [
                            {
                              optionKey: "Select Domain Skills",
                              optionValue: "",
                            },
                          ]
                      }
                      value={
                        defineInterviewRoundForm.domainSkills
                          ? defineInterviewRoundForm.domainSkills
                          : []
                      }
                      onChange={handleOnChangeDefineInterviewRoundForm}
                      multiple={true}
                      selectedValues={
                        defineInterviewRoundForm.domainSkills
                          ? defineInterviewRoundForm.domainSkills
                          : []
                      }
                      handleRemoveSelectedValue={handleRemoveSelectedValues}
                      labelText={"Domain Skills"}
                    />
                  </div>
                 
                 <div className="row row-margin">

                  <SelectInputField
                    divTagCssClasses={"input-field col xl6 l6 m6 s12"}
                    selectTagIdAndName={"softSkills"}
                    options={
                      currentJobDetails?.softSkills
                        ? arrayToKeyValue(
                          currentJobDetails?.softSkills,
                          "Select Soft Skills"
                        )
                        : [
                          {
                            optionKey: "Select Soft Skills",
                            optionValue: "",
                          },
                        ]
                    }
                    value={defineInterviewRoundForm.softSkills}
                    onChange={handleOnChangeDefineInterviewRoundForm}
                    multiple={true}
                    selectedValues={defineInterviewRoundForm.softSkills}
                    handleRemoveSelectedValue={handleRemoveSelectedValues}
                    labelText={"Soft Skills"}
                  />
                  <SelectInputField
                    divTagCssClasses={"input-field col xl3 l3 m3 s12"}
                    selectTagIdAndName={"defaultLanguage"}
                    options={optionMapper(
                      allLanguages,
                      "name",
                      "name",
                      "Select Language"
                    )}
                    value={defineInterviewRoundForm.defaultLanguage}
                    onChange={handleOnChangeDefineInterviewRoundForm}
                    required={true}
                    labelText={"Default Language"}
                  />
                  <SelectInputField
                    divTagCssClasses={"input-field col xl3 l3 m3 s12"}
                    selectTagIdAndName={"translationLanguages"}
                    options={optionMapper(
                      interviewTranslationLanguages,
                      "name",
                      "name",
                      "Select Languages"
                    )}
                    value={defineInterviewRoundForm.translationLanguages}
                    onChange={handleOnChangeDefineInterviewRoundForm}
                    multiple={true}
                    selectedValues={
                      defineInterviewRoundForm.translationLanguages
                    }
                    handleRemoveSelectedValue={handleRemoveSelectedValues}
                    labelText={"Interview Translation Language"}
                  />
                  </div>
                    
                  <div className="col xl12 l12 m12 s12" style={{ textAlign: "end" }}>
                    <NormalButton
                      buttonTagCssClasses={"btn-clear btn-save"}
                      buttonText={"Save"}
                      onClick={handleSaveRoundDetails}
                      disabled={defineInterviewRoundForm?.isRoundPublished}
                    />
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Section 3: Show Interview Round Details */}
          <div className="bodybox-bodywr margin-top">
            <div className="body-box-bodybg">
              {currentJobDetails?.interviewRounds?.length &&
                currentJobDetails?.interviewRounds?.includes(roundsData.firstRound.name) &&
                recruiterRound?.interviewTeam?.length ? (
                <div>
                  <h3>{roundsData.firstRound.name}</h3>
                  <div className="rc-round-data-wr">
                    <ul style={{marginBottom: '2rem'}}>
                      <DefineInterviewCardSmall
                        title={"Interview Team"}
                        content={
                          // recruiterRound.interviewTeam
                          interviewrs
                            ?.filter((iv) =>
                              recruiterRound?.interviewTeam?.includes(
                                String(iv.id)
                              )
                            )
                            .map((iv) => iv.firstName+ " " + iv.lastName)
                        }
                      />
                      <DefineInterviewCardSmall
                        title={"Domain Skills"}
                        content={recruiterRound.domainSkills}
                      />
                      <DefineInterviewCardSmall
                        title={"Soft Skills"}
                        content={recruiterRound.softSkills}
                      />
                      <DefineInterviewCardSmall
                        title={"Default Interview Language"}
                        content={recruiterRound.defaultLanguage}
                      />
                      <DefineInterviewCardSmall
                        title={"Interview Translation Languages"}
                        content={recruiterRound.interviewTranslationLanguages}
                      />
                    </ul>
                  </div>
                </div>
              ) : null}
              {currentJobDetails?.interviewRounds?.length &&
                currentJobDetails?.interviewRounds?.includes(roundsData.secondRound.name) &&
                l1Round?.interviewTeam?.length ? (
                <div>
                  <h3 style={{ marginTop: "15px" }}>{roundsData.secondRound.name}</h3>
                  <div className="rc-round-data-wr">
                    <ul>
                      <DefineInterviewCardSmall
                        title={"Interview Team"}
                        // content={l1Round.interviewTeam}
                        content={interviewrs
                          ?.filter((iv) =>
                            l1Round?.interviewTeam?.includes(String(iv.id))
                          )
                          .map((iv) => iv.firstName+ " " +iv.lastName)}
                      />
                      <DefineInterviewCardSmall
                        title={"Domain Skills"}
                        content={l1Round.domainSkills}
                      />
                      <DefineInterviewCardSmall
                        title={"Soft Skills"}
                        content={l1Round.softSkills}
                      />
                      <DefineInterviewCardSmall
                        title={"Default Interview Language"}
                        content={l1Round.defaultLanguage}
                      />
                      <DefineInterviewCardSmall
                        title={"Interview Translation Languages"}
                        content={l1Round.interviewTranslationLanguages}
                      />
                    </ul>
                  </div>
                </div>
              ) : null}
              {currentJobDetails?.interviewRounds?.length &&(
                
                <div className="col xl12 l12 m12 s12" style={{ textAlign: "end" }}>
                  <NormalButton
                    buttonTagCssClasses={"btn-clear btn-submit"}
                    buttonText={"Submit"}
                    onClick={handleSubmitRoundDetails}
                    style={{ marginTop: '8px' }}
                  />
                </div> )}
            </div>
          </div>
        </>
      ) : (
        <EvuemeLoader />
      )}
    </>
  );
};

export default DefineInterview;
