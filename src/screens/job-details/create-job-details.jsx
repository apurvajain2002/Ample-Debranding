import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import Tooltip from "../../components/miscellaneous/tooltip";
import TextEditor from "../../components/input-fields/RichTextEditor/TextEditor";
import DateInputField from "../../components/input-fields/date-input-field";
import NormalInputField from "../../components/input-fields/normal-input-field";
import RadioButtonInputField from "../../components/input-fields/radio-button-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import handleDate from "../../utils/handleDate";
import NewTypeaheadInputField from "../../components/input-fields/NewTypeaheadInputField";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import {
  getAllJob,
  getJob,
  readFile,
  saveJobPosition2,
} from "../../redux/actions/create-job-actions";
import { setJobDescription as setJobDescriptionRedux } from "../../redux/slices/create-new-job-slice";
import { optionMapper, optionMapperFns } from "../../utils/optionMapper";
import {
  interviewerRounds,
  recOps,
} from "../location/create-location-mock-data";
import CampusModal from "./campusModal";
import PlacemetModal from "./placementModal";
import { dateFormatterForTimeZone } from "../../utils/dateFormatter";
import { useNavigate } from "react-router-dom";
// import EvuemeLoader from "../../components/loaders/evueme-loader";
import CustomClockLoader from "../../components/loaders/clock-loader";
import InterviewerModal from "./interviewerModal";
import { selectJobId } from "../../redux/slices/create-new-job-slice";
import WarningToast from "../../components/toasts/warning-toast";
// import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
// import { icon } from "../../components/assets/assets";
import { FileUploadInput } from "../../components/input-fields/file-upload";
import { FOCUSABLE_SELECTOR } from "@testing-library/user-event/dist/utils";

const DEFAULT_HIRING_TYPE = "Lateral Hiring";

const INITIAL_ERROR_STATE = {
  positionName: false,
  recruiters: false,
  locations: false,
  minimumExperience: false,
  maximumExperience: false,
  vacancyApprovalDate: false,
  domainSkills: false,
  softSkills: false,
  interviewRoundsSelect: false,
  interviewersSelect: false,
  orgId: false,
};

const multiselectArray = [
  "softSkills",
  "domainSkills",
  "interviewRounds",
  "locations",
  "positionCity",
  "interviewers",
  "placementAgencies",
  "orgId",
];

const getDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const CreatejobPosition = ({ currentJobDetails }) => {
  const navigate = useNavigate();
  const initalState = {
    positionName: "",
    jobDescription: "",
    jobId: "",
    isFile: false,
    maxCtc: "",
    minCtc: "",
    vacancyApprovalDate: "",
    vacancyClosureDate: "",
    maximumExperience: "",
    minimumExperience: "",
    interviewers: [],
    positionCity: [],
    openPosition: "",
    hiringOperations: "",
    softSkills: [],
    domainSkills: [],
    interviewRounds: [],
    locations: [],
    orgId: [],
    placementAgencies: [],
    recruiters: [],
    hiringType: "Lateral Hiring",
    positionCounts: 0,
    vacancyStartDate: "",
    jobDescriptionMedia: null,
    interviewersSelect: [],
    interviewRoundsSelect: [],
  };
  const [positionSelected, setPositionsSelected] = useState({});
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [showFileUploadStatus, setShowFileUploadStatus] = useState({
    status: "",
    message: "",
  });
  const dispatch = useDispatch();
  const {
    jobId,
    jobDescrptionFromFile,
    placementAgencies,
    campuses,
    tableData,
    interviewrs,
  } = useSelector((state) => state.createNewJobSliceReducer);

  const { tableData: entities, currentEntity } = useSelector(
    (state) => state.entitySliceReducer
  );
  const { userType, userId } = useSelector((state) => state.signinSliceReducer);

  const { tableData: domainSkillsData = [] } = useSelector(
    (state) => state.domainSkillSliceReducer
  );

  const { tableData: softkillsData = [] } = useSelector(
    (state) => state.softSkillSliceReducer
  );

  const [jobPosition, setJobPosition] = useState(initalState);
  const [count, setCount] = useState(0);
  const [loadingReadFile, setLoadingReadFile] = useState(false);
  const [error, setError] = useState(INITIAL_ERROR_STATE);
  
  // Pagination state for domain skills
  const [domainSkillsPage, setDomainSkillsPage] = useState(1);
  const DOMAIN_SKILLS_PER_PAGE = 99;
  

  const handleClick = (ref) => {
    ref.current.click();
    // Reset value of file input
    // so change event is fired consistently
    ref.current.value = null;
    setShowFileUploadStatus({
      message: "",
      status: "",
    });
  };

  const handleFileChange = async (event) => {
    const updatedFile = event.target.files[0];
    setLoadingReadFile(true);

    try {
      setFile(updatedFile);
      const response = await dispatch(readFile(updatedFile));
      if (response?.type === "readFile/fulfilled") {
        setShowFileUploadStatus((prev) => ({
          status: true,
          message: "File uploaded succesfully!",
        }));
      } else {
        setShowFileUploadStatus((prev) => ({
          status: false,
          message: "File upload failed!",
        }));
      }

      setJobPosition({
        ...jobPosition,
        isFile: true,
        jobDescription: jobDescrptionFromFile,
        jobDescriptionMedia: updatedFile,
      });
    } finally {
      setLoadingReadFile(false);
    }
  };

  // TODO: Test the new Typeahead comp for Domain Skills
  const handleOnChangeDomainSkills = (selected) => {
    setJobPosition({ ...jobPosition, domainSkills: selected });
  };
  const handleRemoveMultiValueDomainSkills = (key, value) => {
    const updatedDomainSkills = jobPosition.domainSkills.filter(
      (domainSkills) => domainSkills !== value
    );

    setJobPosition({
      ...jobPosition,
      domainSkills: updatedDomainSkills && updatedDomainSkills.length > 0 ? updatedDomainSkills : null,
    });
  };

  // Handle "View More" for domain skills pagination
  const handleViewMoreDomainSkills = () => {
    setDomainSkillsPage(prevPage => prevPage + 1);
  };
  // Get all available domain skills (excluding already selected ones)
  const allAvailableDomainSkills = (domainSkillsData || []).filter(
    (skill) => !jobPosition.domainSkills?.includes(skill.name)
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(allAvailableDomainSkills.length / DOMAIN_SKILLS_PER_PAGE);
  const startIndex = (domainSkillsPage - 1) * DOMAIN_SKILLS_PER_PAGE;
  const endIndex = startIndex + DOMAIN_SKILLS_PER_PAGE;
  
  // Get paginated options
  const availableOptionsDomainSkills = allAvailableDomainSkills.slice(startIndex, endIndex);
  
  // Check if there are more pages to show
  const hasMorePages = domainSkillsPage < totalPages;
  
  // console.log("jobPosition---------->",jobPosition.domainSkills,availableOptionsDomainSkills);


  // TODO: Test the new Typeahead comp for Soft Skills
  const handleOnChangeSoftSkills = (selected) => {
    setJobPosition({ ...jobPosition, softSkills: selected });
  };

  const handleRemoveMultiValueSoftSkills = (key, value) => {
    const updatedSoftSkills = jobPosition.softSkills.filter(
      (softSkills) => softSkills !== value
    );

    setJobPosition({
      ...jobPosition,
      softSkills: updatedSoftSkills && updatedSoftSkills.length > 0 ? updatedSoftSkills : null,
    });
  };
  const availableOptionsSoftSkills = (softkillsData || []).filter(
    (skill) => !jobPosition.softSkills?.includes(skill.name)
  );

  // TODO: Test the new Typeahead comp for interview
  const handleOnChangeInterviewRound = (selected) => {
    setJobPosition({ ...jobPosition, interviewRoundsSelect: selected });
    setJobPosition((prevState) => ({
      ...prevState,
      interviewRounds: prevState.interviewRoundsSelect,
    }));
  };

  // Update available options to exclude currently selected interview rounds

  const availableOptionsInterviewRound = (interviewerRounds || []).filter(
    (option) => !jobPosition.interviewRoundsSelect?.includes(option.optionKey)
  );

  const handleRemoveMultiValueInterviewRound = (key, value) => {
    const updatedInterviewRounds = jobPosition.interviewRoundsSelect.filter(
      (interviewRound) => interviewRound !== value
    );

    setJobPosition({
      ...jobPosition,
      interviewRounds: updatedInterviewRounds,
    });
  };

  // TODO: Test the new Typeahead comp for placement agencies
  const handleOnChangePlacement = (selected) => {
    setJobPosition({ ...jobPosition, placementAgencies: selected });
  };
  const handleRemoveMultiValuePlacement = (key, value) => {
    const updatedPlacementAgencies = jobPosition.placementAgencies.filter(
      (placementAgencies) => placementAgencies !== value
    );

    setJobPosition({
      ...jobPosition,
      placementAgencies: updatedPlacementAgencies,
    });
  };
  const availableOptionsPlacement = (placementAgencies || []).filter(
    (skill) => !jobPosition.placementAgencies?.includes(skill.name)
  );

  // TODO: Test the new Typeahead comp for campuses
  const handleRemoveMultiValueCampuses = (key, value) => {
    const updatedCampuses = jobPosition.campuses.filter(
      (campus) => campus !== value
    );

    setJobPosition({
      ...jobPosition,
      campuses: updatedCampuses,
    });
  };
  const availableOptionsCampuses = (campuses || []).filter(
    (skill) => !jobPosition.placementAgencies?.includes(skill.name)
  );

  const handleFileReset = () => {
    setFile(null);
    setShowFileUploadStatus({
      status: "",
      message: "",
    });
    setJobDescription("");
    dispatch(setJobDescriptionRedux(""));
    setJobPosition({
      ...jobPosition,
      isFile: false,
      jobDescription: "",
      jobDescriptionMedia: null,
    });
  };

  const [experienceRange, setExperienceRange] = useState({
    min: 0,
    max: 35,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "hiringType") {
      // Handle the hiring type change
      setJobPosition((prevState) => ({
        ...prevState,
        hiringType: value,
        placementAgencies: [],
        minimumExperience: prevState.minimumExperience || 0,
        maximumExperience: prevState.maximumExperience || 35,
      }));
      setExperienceRange({
        min: 0,
        max: 35,
      });
    } else if (multiselectArray.includes(name)) {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      const selectedText = Array.from(
        e.target.selectedOptions,
        (option) => option.textContent
      );

      setJobPosition((prevState) => ({
        ...prevState,
        [name]: selectedOptions,
        ...(name === "interviewers" && { interviewersSelect: selectedText }),
        ...(name === "interviewRounds" && {
          interviewRoundsSelect: selectedText,
        }),
      }));
    } else if (name === "minCtc" || name === "maxCtc") {
      // Allow empty input or valid decimal
      if (value === "" || !isNaN(value)) {
        setJobPosition((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setJobPosition((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const generateExperienceOptions = (min, max) => {
    const options = [];

    for (let i = min; i <= max; i++) {
      options.push(
        <option key={i} value={i}>
          {i} Years
        </option>
      );
    }
    return options;
  };

  // const handlDateInput = (name) => {
  //   function convertToDate(dateString) {
  //     const [day, month, year] = dateString.split("/");
  //     // Month in JavaScript Date object is zero-indexed (0 = January, 1 = February, etc.)
  //     return new Date(year, month - 1, day);
  //   }
  //   const onCloseCallback = (result) => {
  //     const selectedDate = result.date;

  //     // Check if `vacancyApprovalDate` is selected after `vacancyClosureDate` and reset if necessary
  //     if (name === "vacancyApprovalDate") {
  //       setJobPosition((prevDetails) => ({
  //         ...prevDetails,
  //         vacancyApprovalDate: selectedDate,
  //         vacancyClosureDate:
  //           prevDetails.vacancyClosureDate &&
  //             convertToDate(selectedDate) > convertToDate(prevDetails.vacancyClosureDate)
  //             ? "" // Reset `vacancyClosureDate` if it's before the new `vacancyApprovalDate`
  //             : prevDetails.vacancyClosureDate,
  //       }));
  //     } else {
  //       setJobPosition((prevDetails) => ({
  //         ...prevDetails,
  //         [name]: selectedDate,
  //       }));
  //     }
  //   };

  //   const selectedDate = convertToDate(jobPosition[name]);
  //   // Disable past closure dates if selecting `vacancyClosureDate`
  //   if (name === "vacancyClosureDate" && jobPosition.vacancyApprovalDate) {
  //     const startDate = convertToDate(jobPosition.vacancyApprovalDate)
  //     handleDate(name, onCloseCallback, selectedDate, {
  //       minDate: startDate, // Prevent selecting a closure date before start date
  //     });
  //   } else {
  //     handleDate(name, onCloseCallback, selectedDate);
  //   }
  // };

  // DISABLE ALL THE PREVIOUS DATES EARLIER THAN THE PREVIOUSLY SELECTED DATES=========================================
  const handlDateInput = (name) => {
    function convertToDate(dateString) {
      const [day, month, year] = dateString.split("/");
      return new Date(year, month - 1, day);
    }

    const onCloseCallback = (result) => {
      const selectedDate = result.date;

      if (name === "vacancyApprovalDate") {
        setJobPosition((prevDetails) => ({
          ...prevDetails,
          vacancyApprovalDate: selectedDate,
          vacancyClosureDate:
            prevDetails.vacancyClosureDate &&
            convertToDate(selectedDate) >
              convertToDate(prevDetails.vacancyClosureDate)
              ? "" // Reset `vacancyClosureDate` if it's before the new `vacancyApprovalDate`
              : prevDetails.vacancyClosureDate,
        }));
      } else {
        setJobPosition((prevDetails) => ({
          ...prevDetails,
          [name]: selectedDate,
        }));
      }
    };

    const selectedDate = convertToDate(jobPosition[name]);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    if (name === "vacancyApprovalDate") {
      // Minimum date is the earlier of today or any previously selected approval date
      const minDate = jobPosition.vacancyApprovalDate
        ? new Date(
            Math.min(today, convertToDate(jobPosition.vacancyApprovalDate))
          )
        : today;

      handleDate(name, onCloseCallback, selectedDate, { minDate });
    } else if (
      name === "vacancyClosureDate" &&
      jobPosition.vacancyApprovalDate
    ) {
      const startDate = convertToDate(jobPosition.vacancyApprovalDate);
      handleDate(name, onCloseCallback, selectedDate, {
        minDate: startDate, // Prevent selecting a closure date before start date
      });
    } else {
      handleDate(name, onCloseCallback, selectedDate, { minDate: today });
    }
  };

  const handleRemoveOption = (value, name) => {
    if (name === "interviewers") {
      // interviewers are stored both in string by name and Number by id
      const ivId = interviewrs.find(
        (obj) => `${obj.firstName} ${obj.lastName}` === value
      )?.id;
      if (!ivId) return;

      const newIvIds = jobPosition["interviewers"].filter(
        (val) => Number(val) !== Number(ivId) // ivId is a string while val is a number
      );
      const newSelectedIvs = jobPosition["interviewersSelect"].filter(
        (val) => val !== value
      );
      setJobPosition({
        ...jobPosition,
        interviewers: newIvIds,
        interviewersSelect: newSelectedIvs,
      });
    } else {
      let newValue = jobPosition[name].filter((val) => val !== value);
      setJobPosition({ ...jobPosition, [name]: newValue });
    }
  };
  const handleRemoveSelectedInterviewRound = (value, name) => {
    if (name === "interviewRounds") {
      // interviewers are stored both in string by name and Number by id
      const ivId = interviewerRounds.find(
        (obj) => `${obj.optionKey}` === value
      );

      if (!ivId) return;

      const newIvIds = jobPosition["interviewRounds"].filter(
        (val) => val !== ivId.optionKey // ivId is a string while val is a number
      );
      const newSelectedIvs = jobPosition["interviewRoundsSelect"].filter(
        (val) => val !== value
      );
      setJobPosition({
        ...jobPosition,
        interviewRounds: newIvIds,
        interviewRoundsSelect: newSelectedIvs,
      });
    }
  };
  const handlePositions = (position, open) => {
    if (!position || !open) return;
    if (positionSelected[position]) {
      positionSelected[position] = open;
      setPositionsSelected({ ...positionSelected });
    } else {
      setPositionsSelected({ ...positionSelected, [position]: open });
    }
    setCount(0);
  };

  const handleRemovePosition = (val) => {
    delete positionSelected[val];
    setPositionsSelected({ ...positionSelected });
  };

  const handleJobChange = (e) => {
    setError(INITIAL_ERROR_STATE);
    dispatch(getJob({ jobId: e.target.value }));
    dispatch(selectJobId(e.target.value));
  };

  const handleSubmit = async () => {
    // Reset Error fields
    setError(INITIAL_ERROR_STATE);
    if (
      !jobPosition.positionName ||
      !jobPosition.recruiters ||
      !jobPosition.locations ||
      !jobPosition.interviewersSelect.length ||
      !jobPosition.minimumExperience ||
      !jobPosition.maximumExperience ||
      !jobPosition.vacancyApprovalDate ||
      !jobPosition.vacancyClosureDate ||
      !jobPosition.interviewRoundsSelect.length
    ) {
      let update = {};
      if (!jobPosition.positionName) update["positionName"] = true;
      if (!jobPosition.recruiters) update["recruiters"] = true;
      if (!jobPosition.locations) update["locations"] = true;
      if (!jobPosition.minimumExperience) update["minimumExperience"] = true;
      if (!jobPosition.maximumExperience) update["maximumExperience"] = true;
      if (!jobPosition.vacancyApprovalDate)
        update["vacancyApprovalDate"] = true;
      if (!jobPosition.vacancyClosureDate) update["vacancyClosureDate"] = true;
      if (!jobPosition.interviewersSelect.length)
        update["interviewersSelect"] = true;
      if (!jobPosition.interviewRoundsSelect.length)
        update["interviewRoundsSelect"] = true;
      setError((prev) => ({ ...prev, ...update }));
      return WarningToast("Please Enter All fields");
    }
   
    if ((!jobPosition.domainSkills || jobPosition.domainSkills.length === 0) && (!jobPosition.softSkills || jobPosition.softSkills.length === 0)) {
      return WarningToast("Please select any one skill from domain skills or soft skills");
    }

    // Job Description validity
    if (!jobDescription || jobDescription.trim() === "") {
      return WarningToast("Please Fill the Job Description");
    }

    if (
      !jobPosition.interviewersSelect ||
      jobPosition.interviewersSelect.length === 0
    ) {
      return WarningToast("Please select at least one interviewer");
    }
    if (
      !jobPosition.interviewRoundsSelect ||
      jobPosition.interviewRoundsSelect.length === 0
    ) {
      return WarningToast("Please select at least one interviewer");
    }

    // citywise openings validity
    let totalVacancies = 0;
    const cityWiseVacancies = Object.entries(positionSelected).map(
      ([city, openings]) => {
        totalVacancies += Number(openings);
        return {
          city,
          openings,
        };
      }
    );

    if (totalVacancies > jobPosition.positionCounts) {
      return WarningToast("Position selected is greater than position count");
    }

    // experience validity check
    if (
      Number(jobPosition.minimumExperience) >
      Number(jobPosition.maximumExperience)
    ) {
      return WarningToast(
        "Min Experience cannot be greater than Max Experience"
      );
    }

    // ctc validity check
    if (jobPosition.minCtc && jobPosition.maxCtc) {
      if (Number(jobPosition.minCtc) > Number(jobPosition.maxCtc)) {
        return WarningToast("Minimum CTC cannot be greater than Maximum CTC");
      }
    }
    const response = await dispatch(
      saveJobPosition2({
        ...jobPosition,
        jobCreationStatus: "100",
        // orgId: orgId,
        jobId: jobId || currentJobDetails?.jobId,
        openPositions: cityWiseVacancies,
        jobDescription: jobDescription,
        // Not sure where it's being converted to the literal string "null"
        hiringType:
          jobPosition.hiringType && jobPosition.hiringType !== "null"
            ? jobPosition.hiringType
            : DEFAULT_HIRING_TYPE,
      })
    );
    console.log("check job postions differences")
    console.log(jobPosition)
    
    if (
      response.type === "saveJobPosition2/fulfilled" &&
      response?.payload?.message?.toLowerCase().includes("success")
    ) {
      navigate("/admin/define-interview");
    }
  };

  const handleData = (data) => {
    setJobDescription(data);
  };

  useEffect(() => {
    // TODO: Should be fixed in the create job tables component
    // Send showRows as string with one space
    // so that we don't page, and get all jobs
    dispatch(getAllJob({ showRows: " " }));
  }, []);

  useEffect(() => {
    setJobPosition({
      ...jobPosition,
      isFile: true,
      jobDescription: jobDescrptionFromFile,
      jobDescriptionMedia: file,
    });
    setJobDescription(jobDescrptionFromFile);
  }, [jobDescrptionFromFile]);

  useEffect(() => {
    // taking first name of interviewers
    const selectedInterviewersNames = interviewrs

      ?.filter((iv) => currentJobDetails?.interviewers?.includes(String(iv.id)))
      ?.map((iv) => `${iv.firstName} ${iv.lastName}`);

    const selectedInterviewRoundsNames = interviewerRounds
      ?.filter((iv) =>
        currentJobDetails?.interviewRounds?.includes(String(iv.optionKey))
      )
      ?.map((iv) => `${iv.optionKey}`);
    setJobPosition({
      ...currentJobDetails,
      orgId: currentJobDetails?.orgId,
      jobId: currentJobDetails?.jobId,
      positionName: currentJobDetails?.positionName,
      positionCounts: currentJobDetails?.positionCounts,
      recruiters: currentJobDetails?.recruiterName,
      jobDescription: currentJobDetails?.jobDescription?.join(","),
      interviewersSelect: selectedInterviewersNames || [],
      interviewers: currentJobDetails?.interviewers,
      interviewRounds: currentJobDetails?.interviewRounds,
      interviewRoundsSelect: selectedInterviewRoundsNames || [],
      vacancyStartDate: dateFormatterForTimeZone(
        currentJobDetails?.vacancyStartDate
      )?.substr(0, 10),
      vacancyClosureDate: getDDMMYYYY(currentJobDetails?.vacancyClosureDate),
      vacancyApprovalDate: getDDMMYYYY(currentJobDetails?.vacancyApprovalDate),
      locations: currentJobDetails?.locations,
      orgId: currentJobDetails?.orgId,
    });

    setShowFileUploadStatus({
      status: "",
      message: "",
    });
    setJobDescription(currentJobDetails?.jobDescription?.join(","));
  }, [currentJobDetails]);

  const entityMap = entities.reduce((acc, { id, businessName }) => {
    acc[id] = businessName;
    return acc;
  }, {});

  // Assuming jobPosition.orgId contains the ID you want
  const businessName = entityMap[jobPosition.orgId] || "Unknown";

  useEffect(() => {
    if (currentJobDetails) {
      const cityWiseVacancies = currentJobDetails?.openPositions || [];
      setPositionsSelected(() => {
        const newPositions = {};
        cityWiseVacancies.forEach((cityOpenings) => {
          newPositions[cityOpenings.city] = cityOpenings.openings;
        });
        return newPositions;
      });
    }
  }, [currentJobDetails]);

  return (
    <div className="container">
      {userType === "admin" && (
        <div className="row row-margin valign-wrapper height-50">
          <aside className="input-field bginput col xl3 l3 m6 s12 padding-0">
            <div
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {businessName}
            </div>
          </aside>
        </div>
      )}
      <div className="body-box-header">
        <div className="body-box-body" style={{ padding: "1rem" }}>
          <div className="row multiRows">
            <>
              <div className=" col s12">
                <SelectInputField
                  divTagCssClasses={"input-field col xl3 l3 m3 s12"}
                  required
                  missing={error.positionName}
                  // disabled={jobId ? true : false}
                  options={optionMapper(
                    tableData,
                    "positionName",
                    "jobId",
                    "Select a job"
                  )}
                  value={jobPosition.jobId}
                  placeholder={"Position Name"}
                  onChange={(e) => handleJobChange(e)}
                  labelText={"Position Name"}
                  firstOptionDisabled={true}
                />

                <SelectInputField
                  divTagCssClasses={"input-field col xl3 l3 m3 s12"}
                  selectTagIdAndName={"recruiters"}
                  required
                  missing={error.recruiters}
                  disabled
                  options={jobPosition?.recruiters?.map((val) => {
                    return {
                      optionKey: val,
                      optionValue: val,
                    };
                  })}
                  value={jobPosition.recruiters}
                  handleRemoveSelectedValue={handleRemoveOption}
                  selectedValues={jobPosition?.recruiterName}
                  onChange={(e) => handleOnChange(e)}
                  labelText={"Recruiter Name"}
                  multiple={true}
                />

                <SelectInputField
                  divTagCssClasses="input-field col xl3 l3 m3 s12"
                  selectTagIdAndName="locations"
                  required
                  missing={error.locations}
                  disabled
                  options={jobPosition.locations?.map((val) => {
                    return {
                      optionKey: val,
                      optionValue: val,
                    };
                  })}
                  handleRemoveSelectedValue={handleRemoveOption}
                  selectedValues={jobPosition.locations}
                  value={jobPosition.locations}
                  onChange={(e) => handleOnChange(e)}
                  labelText={"Vacancy Location"}
                  multiple={true}
                />
                <div className="position-input input-field col xl3 l3 m3 s12 job-position-city-input-wrapper">
                  <label htmlFor="city" className="active labelCss">
                    {/* Select City */}
                    No. of Open Positions
                  </label>

                  <select
                    name="positionCity"
                    defaultValue={"default"}
                    required
                    onChange={handleOnChange}
                  >
                    <option value={"default"} disabled>
                      Select City
                    </option>
                    {jobPosition?.locations?.map((val, index) => {
                      return (
                        <option key={index} index={index} value={val}>
                          {val}
                        </option>
                      );
                    })}
                  </select>

                  <input
                    type="number"
                    id="myInput"
                    className="city-vacancy-input"
                    style={{ maxWidth: "25%" }}
                    onChange={(e) => setCount(e.target.value)}
                    min={0}
                    max={jobPosition.positionCounts}
                    value={count}
                    required
                  />
                  <button
                    className="add-city-vacancy-btn"
                    onClick={(e) =>
                      handlePositions(jobPosition.positionCity, count)
                    }
                  >
                    +
                  </button>
                  <div class="m3">
                    {Object.keys(positionSelected)?.map((val) => {
                      return (
                        <div
                          key={val}
                          onClick={() => handleRemovePosition(val)}
                          className="chip"
                        >
                          {val} ({positionSelected[val]})
                          <i className="close material-icons">close</i>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          </div>

          <div className="row multiRows">
            <>
              <div className="valign-wrapper body-box-body col s12">
                <div
                  className={`input-field ${
                    error.minimumExperience ? "select-missing-value" : ""
                  } col xl3 l3 m6 s12`}
                >
                  <label
                    htmlFor="minimumExperience"
                    className="active labelCss"
                  >
                    Min Experience <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="minimumExperience"
                    name="minimumExperience"
                    required
                    // value={
                    //   jobPosition.minimumExperience
                    //     ? jobPosition.minimumExperience
                    //     : ""
                    // }
                    value={jobPosition.minimumExperience || ""}
                    onChange={handleOnChange}
                  >
                    <option value="" disabled>
                      Select Min Experience
                    </option>
                    {generateExperienceOptions(0, 35)}
                    {/* {generateExperienceOptions(
                      experienceRange.min,
                      experienceRange.max
                    )} */}
                  </select>
                </div>

                <div
                  className={`input-field ${
                    error.maximumExperience ? "select-missing-value" : ""
                  } col xl3 l3 m6 s12`}
                >
                  <label
                    htmlFor="maximumExperience"
                    className="active labelCss"
                  >
                    Max Experience <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="maximumExperience"
                    name="maximumExperience"
                    required
                    value={jobPosition.maximumExperience || ""}
                    // value={
                    //   jobPosition.maximumExperience
                    //     ? jobPosition.maximumExperience
                    //     : ""
                    // }
                    onChange={handleOnChange}
                  >
                    <option value="" disabled>
                      Select Max Experience
                    </option>
                    {generateExperienceOptions(0, 35)}
                    {/* {generateExperienceOptions(
                      (jobPosition.hiringType === "Campus Hiring" ? experienceRange.min : experienceRange.min+1),
                      experienceRange.max
                    )} */}
                  </select>
                </div>

                <DateInputField
                  divTagCssClasses="input-field col xl3 l3 m4 s12"
                  inputTagIdAndName="vacancyApprovalDate"
                  required
                  missing={error.vacancyApprovalDate}
                  value={jobPosition.vacancyApprovalDate}
                  onClick={() => handlDateInput("vacancyApprovalDate")}
                  labelText={"Vacancy Approval Date"}
                />

                <DateInputField
                  divTagCssClasses="input-field col xl3 l3 m4 s12"
                  inputTagIdAndName="vacancyClosureDate"
                  required
                  missing={error.vacancyClosureDate}
                  value={jobPosition.vacancyClosureDate}
                  onClick={() => handlDateInput("vacancyClosureDate")}
                  labelText={"Vacancy Closure Target Date"}
                />
              </div>
            </>
          </div>

          <div className="row multiRows">
            <>
              <div className="valign-wrapper body-box-body col s12">
                <div className="col xl3 l3 m4 s12 padding-left-0">
                  <SelectInputField
                    divTagCssClasses={"col input-field m9"}
                    selectTagIdAndName={"interviewers"}
                    required={true}
                    options={optionMapperFns(
                      interviewrs,
                      (val) => `${val.firstName} ${val.lastName}`,
                      (val) => val.id,
                      "Select Interviewers"
                    )}
                    value={jobPosition.interviewers}
                    selectedValues={jobPosition.interviewersSelect}
                    handleRemoveSelectedValue={handleRemoveOption}
                    onChange={(e) => handleOnChange(e)}
                    labelText={"Interviewers"}
                    multiple={true}
                    missing={error.interviewersSelect}
                  />
                  <EvuemeModalTrigger
                    modalId={"interviewerModal"}
                    className={"col m2 s2"}
                  >
                    <NormalButton
                      buttonTagCssClasses={
                        "btn-clear btn-submit add-interviewer-btn"
                      }
                      onClick={() => {}}
                      buttonText={"+"}
                    />
                  </EvuemeModalTrigger>
                </div>

                <NewTypeaheadInputField
                  divTagCssClasses="input-field col xl3 l3 m4 s12"
                  selectTagIdAndName="domainSkills"
                  labelText="Domain Skills"
                  placeholder="Select Domain Skills..."
                  options={optionMapper(
                    availableOptionsDomainSkills,
                    "name",
                    "name",
                    "Select Domain Skills"
                  )}
                  value={jobPosition.domainSkills}
                  onChange={handleOnChangeDomainSkills}
                  handleRemoveMultiValue={handleRemoveMultiValueDomainSkills}
                  multiple={true}
                  required={false}
                  missing={error.domainSkills}
                  viewMore={hasMorePages}
                  handleViewMore={handleViewMoreDomainSkills}
                />
                <NewTypeaheadInputField
                  divTagCssClasses="input-field col xl3 l3 m4 s12"
                  selectTagIdAndName="softSkills"
                  labelText="Soft Skills"
                  placeholder="Select Soft Skills..."
                  options={optionMapper(
                    availableOptionsSoftSkills,
                    "name",
                    "name",
                    "Select Soft Skills"
                  )}
                  value={jobPosition.softSkills}
                  onChange={handleOnChangeSoftSkills}
                  handleRemoveMultiValue={handleRemoveMultiValueSoftSkills}
                  multiple={true}
                  required={false}
                  missing={error.softSkills}
                />
                <NewTypeaheadInputField
                  divTagCssClasses="input-field col xl3 l3 m4 s12"
                  selectTagIdAndName="interviewRounds"
                  labelText="Interview Rounds"
                  placeholder="Select Interview Rounds..."
                  options={optionMapper(
                    availableOptionsInterviewRound,
                    "optionKey",
                    "optionValue",
                    "Select Interview Rounds"
                  )}
                  value={jobPosition.interviewRoundsSelect}
                  onChange={handleOnChangeInterviewRound}
                  selectedValues={jobPosition.interviewRoundsSelect}
                  handleRemoveSelectedValue={handleRemoveSelectedInterviewRound}
                  multiple={true}
                  required={true}
                  missing={error.interviewRoundsSelect}
                />
              </div>
            </>
          </div>
          <div className="row multiRows">
            <div className="valign-wrapper body-box-body col s12">
              {/* <NormalInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                inputTagIdAndName="minCtc"
                value={jobPosition.minCtc ? jobPosition.minCtc : ""}
                onChange={(e) => handleOnChange(e)}
                type="number"
                labelText={"Min CTC"}
                placeholder={"Enter value in Rs. Lacs"}
              />

              <NormalInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                inputTagIdAndName={"maxCtc"}
                value={jobPosition.maxCtc ? jobPosition.maxCtc : ""}
                onChange={(e) => handleOnChange(e)}
                type="number"
                labelText={"Max CTC"}
                placeholder={"Enter value in Rs. Lacs"}
              /> */}
              <NormalInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                inputTagIdAndName="minCtc"
                value={jobPosition.minCtc || ""}
                onChange={(e) => handleOnChange(e)}
                type="number"
                labelText={"Min CTC"}
                step={"0.001"}
                placeholder={"Enter value in Rs. Lacs"}
              />

              <NormalInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                inputTagIdAndName="maxCtc"
                value={jobPosition.maxCtc || ""}
                onChange={(e) => handleOnChange(e)}
                type="number"
                step={"0.001"}
                labelText={"Max CTC"}
                placeholder={"Enter value in Rs. Lacs"}
              />
              {/* <NormalInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                inputTagIdAndName="minCtc"
                value={jobPosition.minCtc ? jobPosition.minCtc : ""}
                onChange={(e) => handleOnChange(e)}
                type="number"
                labelText={"Min CTC"}
                placeholder={"Enter value in Rs. Lacs"}
                // missing={jobPosition.minCtc <= 0}  // Check if min CTC is less than or equal to 0
              />

              <NormalInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                inputTagIdAndName={"maxCtc"}
                value={jobPosition.maxCtc ? jobPosition.maxCtc : ""}
                onChange={(e) => handleOnChange(e)}
                type="number"
                labelText={"Max CTC"}
                placeholder={"Enter value in Rs. Lacs"}
                // missing={jobPosition.maxCtc <= 0}  // Check if max CTC is less than or equal to 0
              /> */}

              <div className="file-upload-field-container col xl3 l3 m4 s12">
                {loadingReadFile && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "87%",
                      right: "8%",
                      // transform: 'translate(-50%, 0)',
                      zIndex: 100,
                    }}
                  >
                    {" "}
                    <CustomClockLoader size={20} />
                  </div>
                )}
                <FileUploadInput
                  divTagCssClasses="file-upload-field"
                  onClick={handleClick}
                  onChange={handleFileChange}
                  onReset={handleFileReset}
                  idAndName={"job-description-file"}
                  placeholder="Upload PDF/DOC file"
                  value={
                    showFileUploadStatus.status
                      ? file.name
                      : "Upload PDF/DOCX file"
                  }
                  label={<UploadFileLabel />}
                  uploadStatus={showFileUploadStatus.status}
                  // loading={loadingReadFile}
                />
              </div>
            </div>
          </div>

          <TextEditor
            label={"Job Description"}
            required={true}
            value={jobDescription}
            isFile={jobPosition.isFile}
            handleData={handleData}
            style={{
              border: "1px solid #ccc",
              margin: "1.5rem",
              height: "30rem",
              padding: "1rem",
            }}
          />

          <div className="add-job-footer multiRows" style={{ padding: "20px" }}>
            <div className="row">
              <aside className="label-radio col xl3 l3 m6 s12">
                <h6>Hiring Type</h6>
                <EvuemeLabelTag>
                  <RadioButtonInputField
                    inputTagCssClasses={"with-gap"}
                    groupName="hiringType"
                    labelText={"Campus Hiring"}
                    radioButtonValue={
                      jobPosition.hiringType || DEFAULT_HIRING_TYPE
                    }
                    value={"Campus Hiring"}
                    onChange={(e) => handleOnChange(e)}
                  />

                  <RadioButtonInputField
                    inputTagCssClasses={"with-gap"}
                    groupName="hiringType"
                    labelText={"Lateral Hiring"}
                    radioButtonValue={
                      jobPosition.hiringType || DEFAULT_HIRING_TYPE
                    }
                    value={"Lateral Hiring"}
                    onChange={(e) => handleOnChange(e)}
                  />
                </EvuemeLabelTag>
              </aside>
              {jobPosition.hiringType !== "Campus Hiring" ? (
                <aside className="input-field col xl3 l3 m6 s12">
                  <div className="col xl12 l12 m16 s12">
                    <NewTypeaheadInputField
                      divTagCssClasses="input-field"
                      selectTagIdAndName="placementAgencies"
                      placeholder="Select approved placement agencies"
                      options={optionMapper(
                        availableOptionsPlacement,
                        "name",
                        "name",
                        "Select approved placement agencies"
                      )}
                      value={jobPosition.placementAgencies}
                      onChange={(selected) =>
                        setJobPosition({
                          ...jobPosition,
                          placementAgencies: selected,
                        })
                      }
                      handleRemoveMultiValue={handleRemoveMultiValuePlacement}
                      multiple={true}
                      required={true}
                      labelText="Placement Agencies"
                      placementAgencyLabel={true}
                    />

                    <EvuemeModalTrigger modalId={"placementModal"}>
                      <NormalButton
                        buttonTagCssClasses={"btn-clear btn-submit"}
                        buttonText={"+ Add Agency"}
                      />
                    </EvuemeModalTrigger>
                  </div>
                </aside>
              ) : (
                <aside className="input-field col xl3 l3 m6 s12">
                  <div className="col xl12 l12 m16 s12">
                    <NewTypeaheadInputField
                      divTagCssClasses="input-field"
                      selectTagIdAndName="placementAgencies"
                      placeholder="Select approved Campuses"
                      options={optionMapper(
                        availableOptionsCampuses,
                        "name",
                        "name",
                        "Select approved Campuses"
                      )}
                      value={jobPosition.placementAgencies}
                      onChange={(selected) =>
                        setJobPosition({
                          ...jobPosition,
                          placementAgencies: selected,
                        })
                      }
                      handleRemoveMultiValue={handleRemoveMultiValueCampuses}
                      multiple={true}
                      required={true}
                      labelText="Campuses"
                    />

                    <EvuemeModalTrigger modalId={"campusModal"}>
                      <NormalButton
                        buttonTagCssClasses={"btn-clear btn-submit"}
                        buttonText={"+ Add Campus"}
                      />
                    </EvuemeModalTrigger>
                  </div>
                </aside>
              )}

              <aside className="col xl12 l12 m12 s12">
                <NormalButton
                  buttonTagCssClasses="waves-effect waves-light btn btn-clear left"
                  buttonText={"Cancel"}
                />
                &nbsp;
                <NormalButton
                  buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit"
                  onClick={() => handleSubmit()}
                  buttonText={"Submit"}
                />
              </aside>
            </div>
          </div>
        </div>
        <CampusModal />
        <PlacemetModal />
        <InterviewerModal />
      </div>
    </div>
  );
};

function UploadFileLabel() {
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label
        className="labelCss active"
        style={{ fontSize: "15px", top: "4px", position: "relative" }}
      >
        Job Description
        <i className="show-details infermation-ico-black">
          i
          <Tooltip divTagCssClasses="infbox-click">
            <p>Upload the Job Description here in PDF or Word format.</p>
          </Tooltip>
        </i>
      </label>
    </div>
  );
  // (
  //   <span>
  //     Job Description
  //     <i className="material-icons" style={{ width: '1.5rem', verticalAlign: 'middle', color: '#6A6E66', marginLeft: '0.3rem', cursor: 'default' }}
  //       onMouseEnter={() => setIsHovered(true)}
  //       onMouseLeave={() => setIsHovered(false)}
  //     >
  //       info_filled
  //     </i>
  //     {isHovered && (
  //       <span
  //         style={{
  //           position: 'absolute',
  //           backgroundColor: '#fff',
  //           border: '1px solid #ccc',
  //           padding: '0.5rem',
  //           // borderRadius: '4px',
  //           marginLeft: '0.5rem',
  //           maxWidth: '200px',
  //           width: 'max-content',
  //           zIndex: 1000
  //         }}
  //       >
  //         Upload the Job Description here in PDF or Word format
  //       </span>
  //     )}
  //   </span>
  // )
}

export default CreatejobPosition;
