import { useEffect, useRef, useState } from "react";
import { icon } from "../../components/assets/assets";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { Link } from "react-router-dom";
import NextButton from "../../components/buttons/next-button";
import * as XLSX from "xlsx";
import MappingFields from "./mapping-fields";
import MappingStatus from "./mapping-status";
import WarningToast from "../../components/toasts/warning-toast";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import SelectInputField from "../../components/input-fields/select-input-field";
import { optionMapper } from "../../utils/optionMapper";
import { selectJobId, selectOrganizationId, setRoundName } from "../../redux/slices/create-new-job-slice";
import { arrayToKeyValue } from "../../utils/arrayToKeyValue";
import CustomSelectField from "../../components/input-fields/custom-select-field";
import { createKeyValueArray } from "../../utils/functions";
import { clearIsInterviewRoundTemplate, clearIsInterviewRoundTemplateWA, clearIsTemplate, clearIsTemplateWA, setInterviewLinkInviteDetailsApiCalled, setInviteCandidateButtonDisable, setMessagesEmpty } from "../../redux/slices/invite-candidates-slice";
import { getEntity } from "../../redux/actions/sign-up-actions";
import { readFile, getJob, getAllEntities } from "../../redux/actions/create-job-actions";
import { useLocation } from "react-router-dom";
import {
  fetchTemplate,
  fetchTemplateNames,
  fetchWATemplate,
  fetchWATemplateNames,
  interviewLinkInviteDetails,
  sendInvite,
} from "../../redux/actions/invite-candidates";

import { useGlobalContext } from "../../context";

const bulkInviteInitialStatus = {
  isFile: false,
  isMapping: false,
  fileInfo: null,
  isMappingStatus: false,
  dataToMap: [],
  mapping: "",
  rowData:[]
};

const mappingIndexInitialState = {
  index: "",
  firstName: "",
  lastName: "",
  primaryMailId: "",
  secondaryMailId: "",
  whatsappNumber: "",
  primaryPhoneNumber: "",
  secondaryPhoneNumber: "",
};



const BulkInvite = ({ 
  setInviteCandidate, 
  setIsBulkInvited, 
  selectedPlacementAgency, 
  setSelectedPlacementAgency, 
  selectedLocation, 
  setSelectedLocation 
}) => {
  const { jobId, roundName, currentJobDetails, organizationId } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const {
    allCombinedTemplates, setAllCombinedTemplates,
    candidatesToInvite, setCandidatesToInvite, hostname
  } = useGlobalContext();
  
const location = useLocation();
const urlParams = new URLSearchParams(location.search);
const type = urlParams.get("type");
const section =
    type === "invited-candidates" ? "invited candidates" : "invite candidates";
  const [mappingIndex, setMappingIndex] = useState(mappingIndexInitialState);
  const [bulkInvite, setBulkInvite] = useState(bulkInviteInitialStatus);
  const fileInputRef = useRef(null);
  const [templateTypesValue, setTemplateTypesValue] = useState('');
  const [hiringTypedd, setHiringTypedd] = useState(false);

  const { successMessage, failMessage, template, isTemplate,
    templateWA, isTemplateWA, templateNames, templateWANames,
    interviewRoundTemplate, interviewRoundTemplateWA, isLoading, inviteDetailsDTO,
    isInterviewLinkInviteDetails, isInviteCandidateButtonDisable
  } = useSelector((state) => state.inviteCandidatesSliceReducer);
  const dispatch = useDispatch();
  const isSubmitDisabled = userType === 'manpower' && isInviteCandidateButtonDisable;
  useEffect(() => {
    document.title = "Invite Candidates";
    dispatch(getEntity());
    dispatch(getAllEntities({ url: hostname }));
    const inviteType = currentJobDetails?.hiringType == "Lateral Hiring" ? "invite round 1" : "process invite";

    if (roundName) {
      dispatch(
        fetchTemplateNames({
          type: "email",
          hiringType: currentJobDetails?.hiringType,
          interviewRounds: roundName,
          inviteType
        })
      );
      dispatch(
        fetchWATemplateNames({
          type: "whatsapp",
          hiringType: currentJobDetails?.hiringType,
          interviewRounds: roundName,
          inviteType
        })
      );
    }

    // Cleanup function to clear template flags when component unmounts
    return () => {
      dispatch(clearIsTemplate());
      dispatch(clearIsTemplateWA());
    };
  }, []);
  

  const { allNotPublishedJobs } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { organizationsList } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const onSave = (data, mapping) => {
    setBulkInvite({ ...bulkInvite, isMappingStatus: data, mapping: mapping });
  };

  const mappingFieldsCancelHandler = ()=>{
    setBulkInvite({...bulkInvite, isMapping : false});
  }

  const labelTexts =
      currentJobDetails?.hiringType === "Campus Hiring" ? "Campus Name" : "Placement Agency";

  const handlePlacementAgencyChange = (e) =>
      setSelectedPlacementAgency(e.target.value);

  const handleLocationChange = (e) =>
      setSelectedLocation(e.target.value);

  const handleClick = () => {
    if (!jobId || !roundName) {
      return WarningToast(`Please select 'Position Name' and 'Round Name'`);
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
        const rowData = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setBulkInvite({
          ...bulkInvite,
          isFile: true,
          fileInfo: file,
          dataToMap: data,
          rowData: rowData,
        });
      };
      reader.readAsBinaryString(file);
    } else {
      WarningToast("No file selected.");
    }
  };

  const handleInterviewLinkInviteDetails = () => {
    dispatch(interviewLinkInviteDetails({
      "jobId": jobId,
      "interviewRoundName": roundName,
      "agencyName": selectedPlacementAgency,
      "vacancyLocations": selectedLocation
    }));
  }

  const mappingStatusCancelHandler = () =>{
    setBulkInvite(bulkInviteInitialStatus);
    setMappingIndex(mappingIndexInitialState);
  }

  const mappingStatusEditHandler = () => {
    setBulkInvite({...bulkInvite, isMapping : true, isMappingStatus : false});
  }
 

  return (
    <>
      {!bulkInvite.isFile ? (
        <>
           <div className="row row-margin horizontal-cards">
              <div className="body-box-body">
                <div class="row valign-wrapper">
                {userType === 'manpower' &&
                  <SelectInputField
                    selectTagIdAndName={"selectOrganization"}
                    divTagCssClasses="col xl3 l3 m4 s12"
                    labelText={"Organization Name"}
                    customLabelNode={<>Organization Name <span style={{ color: 'red' }}>*</span></>}
                    options={optionMapper(
                      organizationsList,
                      "businessName",
                      "id",
                      "Select Organization Name"
                    )}
                    value={organizationId}
                    onChange={(e) => {
                      dispatch(selectOrganizationId(e.target.value));
                    }}
                  />
                }
                  <SelectInputField
                    selectTagIdAndName={"selectJobPosition"}
                    divTagCssClasses="col xl3 l3 m4 s12"
                    labelText="Position Name"
                    options={optionMapper(
                      allNotPublishedJobs,
                      "positionName",
                      "jobId",
                      "Position Name"
                    )}
                    value={jobId}
                    onChange={(e) => {
                      dispatch(selectJobId(e.target.value))
                      setHiringTypedd(true)
                    }}
                  />
                  {(userType !== 'manpower' && currentJobDetails && currentJobDetails?.hiringType !== "Lateral Hiring" && hiringTypedd ) && (
                  <CustomSelectField
                    id='placementAgency'
                    label={labelTexts}
                    options={createKeyValueArray(currentJobDetails?.placementAgencies)}
                    value={selectedPlacementAgency}
                    onChange={handlePlacementAgencyChange}
                    defaultOption={{ show: true }}
                  />
                  )}
                  <SelectInputField
                    selectTagIdAndName={"selectJobPosition"}
                    divTagCssClasses="col xl3 l3 m4 s12"
                    labelText={'Interview Round'} // plain text only
                    customLabelNode={<>{'Interview Round'} <span style={{ color: 'red' }}>*</span></>}
                    options={arrayToKeyValue(
                      currentJobDetails?.interviewRounds?.toString().split(","),
                      "Select Interview Round"
                    )}
                    value={roundName}
                    onChange={(e) => {
                      const selectedRound = e.target.value;
                      dispatch(setRoundName(selectedRound));
                      // Clear templates when round changes
                      setTemplateTypesValue('');
                      setInviteCandidate(prev => ({
                        ...prev,
                        emailTemplate: '',
                        whatsappTemplate: ''
                      }));
                      // Clear the template flags
                      dispatch(clearIsTemplate());
                      dispatch(clearIsTemplateWA());
                      // dispatch(
                      //   fetchTemplateNames({
                      //     type: "email",
                      //     hiringType: currentJobDetails?.hiringType,
                      //     interviewRounds: selectedRound,
                      //     inviteType: section,
                      //   })
                      // );
                      // dispatch(
                      //   fetchWATemplateNames({
                      //     type: "whatsapp",
                      //     hiringType: currentJobDetails?.hiringType,
                      //     interviewRounds: selectedRound,
                      //     inviteType: section,
                      //   })
                      // );
                    }}
                  />
                  <SelectInputField
                    selectTagIdAndName={"selectJobPosition"}
                    divTagCssClasses="col xl3 l3 m4 s12"
                    labelText="Vacancy Location"
                    options={arrayToKeyValue(
                        currentJobDetails?.locations?.toString().split(","),
                        "Locations"
                    )}
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  />

                  <aside class="col xl2 l2 m4 s12 right-align">
                    <a href="#" class={`waves-effect waves-light btn btn-clear btn-submit`}
                     onClick={() => {
                      if (isSubmitDisabled) return;
                      handleInterviewLinkInviteDetails()
                    }}
                    >Submit</a>
                  </aside>
                </div>
              </div>
            </div>
          <div className="fileupload-container">
            <h3 className="upload-h3">Choose File to Upload</h3>
            <div className="upload-file">
              <i>
                <EvuemeImageTag src={icon.fileUploadIcon} alt="" />
              </i>
              <p>
                Import your Candidate List from Computer <br />
                or other Service.
              </p>
            </div>
            <div className="footerbtn">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".csv, .xlsx"
                onChange={handleFileChange}
              />
              <NormalButton
                buttonTagCssClasses="waves-effect waves-light btn btn-upload"
                buttonText={"Upload Here"}
                onClick={handleClick}
              />
            </div>
          </div>
        </>
      ) : bulkInvite.isFile && !bulkInvite.isMapping ? (
        <div className="centered">
          <div className="choosefileupload-container">
            <div className="row">
              <aside className="col xl12 l12 m12 s12">
                <label htmlFor="">File</label>
                <div className="upload-box fileupload-final">
                  <div className="final-file-wr">
                    <i>
                      <img src={icon.fileUploadIcon} alt="" />
                    </i>
                    <div className="file-name">
                      <p>{bulkInvite.fileInfo.name}</p>
                      <span className="file-reco">Computer</span>
                    </div>
                  </div>
                  <Link
                    onClick={() =>{
                      setBulkInvite({
                        ...bulkInvite,
                        isFile: false,
                        fileInfo: null,
                      })
                      setMappingIndex(mappingIndexInitialState);}
                    }
                    className="change-btn right"
                  >
                    Change
                  </Link>
                </div>
              </aside>
              <div
                className="centered"
                style={{
                  padding: "0 0.5rem",
                }}
              >
                <NextButton
                  buttonText={"Next"}
                  onClick={() =>
                    setBulkInvite({ ...bulkInvite, isMapping: true })
                  }
                  buttonTagCssClasses={"flex-center btn-submit margin-top-15"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : bulkInvite.isFile &&
        bulkInvite.isMapping &&
        !bulkInvite.isMappingStatus ? (
        <MappingFields
          onSave={onSave}
          dataToMap={bulkInvite.dataToMap}
          fileInfo={bulkInvite.fileInfo}
          onCancel={mappingFieldsCancelHandler}
          mappingIndex={mappingIndex}
          setMappingIndex={setMappingIndex}
        />
      ) : (
        <MappingStatus
          dataToMap={bulkInvite.dataToMap}
          rowData={bulkInvite.rowData}
          mapping={bulkInvite.mapping}
          setInviteCandidate={setInviteCandidate}
          onCancel={mappingStatusCancelHandler}
          onEdit={mappingStatusEditHandler}
          mappingIndex={mappingIndex}
          setIsBulkInvited={setIsBulkInvited}
        />
      )}
    </>
  );
};

export default BulkInvite;
