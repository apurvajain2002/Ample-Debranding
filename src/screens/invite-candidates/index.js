import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BreadCrome from "../../components/admin/admin-breadcrome/admin-breadcrome";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import Modal from "../../components/modals/modal";
import RadioButtonInputField from "../../components/input-fields/radio-button-input-field";
import { Link } from "react-router-dom";
import BulkInvite from "./bulk-invite";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { useDispatch, useSelector } from "react-redux";
import { readFile, getJob, getAllEntities } from "../../redux/actions/create-job-actions";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import {
  fetchTemplate,
  fetchTemplateNames,
  fetchWATemplate,
  fetchWATemplateNames,
  interviewLinkInviteDetails,
  sendInvite,
} from "../../redux/actions/invite-candidates";
import SelectInputField from "../../components/input-fields/select-input-field";
import { optionMapper } from "../../utils/optionMapper";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { getEntity } from "../../redux/actions/sign-up-actions";
import { getAllNotPublishedCampusJobs, getAllNotPublishedJobs, getAllNotPublishedLateralJobs } from "../../redux/actions/define-interview-actions/define-interview-actions";
import {
  selectJobId,
  selectOrganizationId,
  setIsGetJobsApiCalled,
  setRoundName,
} from "../../redux/slices/create-new-job-slice";
import { arrayToKeyValue } from "../../utils/arrayToKeyValue";
import DateInputField from "../../components/input-fields/date-input-field";
import handleDate from "../../utils/handleDate";
import handleTime from "../../utils/handleTime";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import TimePickerModal from "../../components/modals/time-picker-modal";
import SendLaterModal from "./send-later-modal";
import WarningToast from "../../components/toasts/warning-toast";
import getUniqueId from "../../utils/getUniqueId";
import { roundsData } from "../../resources/constant-data/roundsData";
import AddReceiverModal from "./add-receiver-modal";
import NormalButton from "../../components/buttons/normal-button";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import WhatappChatView from "./whatapp-chat-view";
import { clearIsInterviewRoundTemplate, clearIsInterviewRoundTemplateWA, clearIsTemplate, clearIsTemplateWA, setInterviewLinkInviteDetailsApiCalled, setInviteCandidateButtonDisable, setMessagesEmpty } from "../../redux/slices/invite-candidates-slice";
import { instructionsData } from "./data";
import { useGlobalContext } from "../../context";
import { formatFileNamesForTemplates, generateTemplateOptions, mergeAndRemoveDuplicates } from "../../utils/functions";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import { setIsNotPublishedJobsApiCalled } from "../../redux/slices/define-interview-slice";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Arrays for dropdowns
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const months = [
  { name: "January", value: "Jan" },
  { name: "February", value: "Feb" },
  { name: "March", value: "Mar" },
  { name: "April", value: "Apr" },
  { name: "May", value: "May" },
  { name: "June", value: "Jun" },
  { name: "July", value: "Jul" },
  { name: "August", value: "Aug" },
  { name: "September", value: "Sep" },
  { name: "October", value: "Oct" },
  { name: "November", value: "Nov" },
  { name: "December", value: "Dec" }
];
const year = new Date().getFullYear()
const years = Array.from({ length: 2 }, (_, i) => year + i); // 2025 → 2035

const hours = Array.from({ length: 24 }, (_, i) => i + 1); // 1 → 12

const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")); // 00 → 59




const InviteCandidates = () => {
  const [round1, setRound1] = useState({
    day: "1",
    month: "Jan",
    year: year,
    hour: "1",
    minute: "00",
  });
  
  const [round2, setRound2] = useState({
    day: "1",
    month: "Jan",
    year: year,
    hour: "1",
    minute: "00",
  });

  const [result, setResult] = useState({
    round1StartDate: "",
    round1StartTime: "",
    round2StartDate: "",
    round2StartTime: "",
  });
  const {
    allCombinedTemplates, setAllCombinedTemplates,
    candidatesToInvite, setCandidatesToInvite, hostname
  } = useGlobalContext();
  const { selectedCandidateEmailWpInfo } = useSelector(
    (state) => state.interviewResponsesRecruiterDashboardSliceReducer
  );
  const { currentUser, userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const { organizationsList } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const handleRound1Change = (field, value) => {
    setRound1((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleRound2Change = (field, value) => {
    setRound2((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit2 = (e) => {
    e.preventDefault();
  
    const round1StartDate = `${round1.day} ${round1.month} ${round1.year}`;
    const round1StartTime = `${round1.hour}:${round1.minute} ${round1.hour >= 12 ? "PM" : "AM"}`;
  
    const round2StartDate = `${round2.day} ${round2.month} ${round2.year}`;
    const round2StartTime = `${round2.hour}:${round2.minute} ${round2.hour >= 12 ? "PM" : "AM"}`;
  
    const result = {
      round1StartDate,
      round1StartTime,
      round2StartDate,
      round2StartTime,
    };
    setResult(result);
    
    setOpenModal(false)
  };

  const initialState = {
    expireTime: "",
    expireType: "Hours",
    inviteType: "individual",
    settings: "fullScreen",
    emailTemplate: "",
    whatsappTemplate: "",
    interviewExpirationDate: "",
    mandateFullScreen: false,
    candidateInfo: selectedCandidateEmailWpInfo
      ? [selectedCandidateEmailWpInfo]
      : [],
    mailSendingTime: "",
    sendTime: "",
    sendDate: "",
    timezone: "",
    receivers: [
      {
        jobId: "",
        interviewRound: "",
        firstName: "",
        LastName: "",
        emailId: "",
        mobileNumber: "",
        whatsappNumber: "",
      },
    ],
    sendLater: false,
    redirectLink: "",
  };
  const [inviteCandidate, setInviteCandidate] = useState(initialState);
  const [isWhatsappTemplate, setIsWhatsappTemplate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sendLaterModalOpen, setSendLaterModalOpen] = useState(false);
  const [hiringTypedd, setHiringTypedd] = useState(false);
  const [isEmailTemplate, setIsEmailTemplate] = useState(false);
  const [restrictInviteTime, setRestrictInviteTime] = useState(false);
  const [isBulkInvited, setIsBulkInvited] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPlacementAgency, setSelectedPlacementAgency] = useState("");
  const [templateTypesValue, setTemplateTypesValue] = useState('');
  const [emailWhatsappTempList, setEmailWhatsappTempList] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();
  const { jobId, roundName, currentJobDetails, isGetJobsApiCalled, organizationId } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { allNotPublishedJobs, isNotPublishedJobsApiCalled } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { userId } = useSelector((state) => state.signinSliceReducer);

  const { successMessage, failMessage, template, isTemplate,
    templateWA, isTemplateWA, templateNames, templateWANames,
    interviewRoundTemplate, interviewRoundTemplateWA, isLoading, inviteDetailsDTO,
    isInterviewLinkInviteDetails, isInviteCandidateButtonDisable
  } = useSelector((state) => state.inviteCandidatesSliceReducer);

  const isSubmitDisabled = userType === 'manpower' && isInviteCandidateButtonDisable;

  console.log('isInviteCandidateButtonDisable ::: ', isInviteCandidateButtonDisable, userType, isSubmitDisabled);

  const { entityName } = useSelector((state) => state.signUpReducer);

  const handleOnChange = (e) => {
    setInviteCandidate({ ...inviteCandidate, [e.target.name]: e.target.value });
  };

  const getCandidateData = (candidateData) => {
    const result = [];
    const lines = candidateData?.trim().split("\n");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10,15}$/;

    // Loop through each line
    lines.forEach((line, index) => {
      const fields = line.split(",").map((item) => item.trim());
      
      // Skip empty lines
      if (fields.length === 0 || (fields.length === 1 && fields[0] === "")) {
        return;
      }

      let candidateObj = {
        index: (index + 1).toString(),
        firstName: "",
        lastName: "",
        primaryMailId: "",
        secondaryEmailId: "",
        whatsappNumber: "",
        primaryPhoneNumber: "",
        secondaryPhoneNumber: "",
      };

      // Handle the new format: Full Name, Email, Phone Number
      if (fields.length >= 3) {
        // First field is full name
        const nameParts = fields[0].split(" ");
        candidateObj.firstName = nameParts[0] || "";
        candidateObj.lastName = nameParts.slice(1).join(" ") || "";
        
        // Second field is email
        if (emailRegex.test(fields[1])) {
          candidateObj.primaryMailId = fields[1];
        }
        
        // Third field is phone number
        if (mobileRegex.test(fields[2])) {
          candidateObj.whatsappNumber = fields[2];
        }
      } else {
        // Fallback to original logic for other formats
        fields.forEach((field) => {
          if (emailRegex.test(field)) {
            if (!candidateObj.primaryMailId) candidateObj.primaryMailId = field;
            else candidateObj.secondaryEmailId = field;
          } else if (mobileRegex.test(field)) {
            if (!candidateObj.whatsappNumber) candidateObj.whatsappNumber = field;
            else if (!candidateObj.primaryPhoneNumber)
              candidateObj.primaryPhoneNumber = field;
            else candidateObj.secondaryPhoneNumber = field;
          } else {
            if (!candidateObj.firstName && !candidateObj.lastName) {
              const nameParts = field.split(" ");
              candidateObj.firstName = nameParts[0] || "";
              candidateObj.lastName = nameParts.slice(1).join(" ") || "";
            }
          }
        });
      }

      // Only push if any important field exists
      if (
        candidateObj.primaryMailId ||
        candidateObj.primaryPhoneNumber ||
        candidateObj.whatsappNumber
      ) {
        result.push(candidateObj);
      } else {
        WarningToast(`Invalid input: ${line}`);
      }
    });

    return result;
  };

  const getCandidateDataBulk = (candidateData) => {
    const result = [];
    const lines = candidateData?.trim().split("\n");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10,15}$/;

    if (!lines.length) return result;

    lines.forEach((line, index) => {
      const fields = line.split(",").map((item) => item.trim());
      
      // Skip empty lines
      if (fields.length === 0 || (fields.length === 1 && fields[0] === "")) {
        return;
      }

      let candidateObj = {
        index: (index + 1).toString(),
        firstName: "",
        lastName: "",
        primaryMailId: "",
        secondaryEmailId: "",
        whatsappNumber: "",
        primaryPhoneNumber: "",
        secondaryPhoneNumber: "",
      };

      // Handle the new format: Full Name, Email, Phone Number
      if (fields.length >= 3) {
        // First field is full name
        const nameParts = fields[0].split(" ");
        candidateObj.firstName = nameParts[0] || "";
        candidateObj.lastName = nameParts.slice(1).join(" ") || "";
        
        // Second field is email
        if (emailRegex.test(fields[1])) {
          candidateObj.primaryMailId = fields[1];
        }
        
        // Third field is phone number
        if (mobileRegex.test(fields[2])) {
          candidateObj.whatsappNumber = fields[2];
        }
      } else {
        // Fallback to original Excel format logic
        candidateObj = {
          index: fields[0] || "",
          firstName: fields[1] || "",
          lastName: fields[2] || "",
          primaryMailId: fields[4] || "",
          secondaryEmailId: fields[3] || "",
          whatsappNumber: fields[5] || "",
          primaryPhoneNumber: fields[6] || "",
          secondaryPhoneNumber: fields[7] || "",
        };
      }

      // Only push if any important field exists
      if (
        candidateObj.primaryMailId ||
        candidateObj.primaryPhoneNumber ||
        candidateObj.whatsappNumber
      ) {
        result.push(candidateObj);
      } else {
        WarningToast(`Invalid input: ${line}`);
      }
    });

    return result;
  };

  useEffect(() => {
    if (successMessage) {
      SuccessToast(successMessage);
      dispatch(setMessagesEmpty());

      // Reset form state after successful submission
      setInviteCandidate(prev => ({
        ...initialState,
        candidateInfo: [], // Clear candidate list
        expireTime: prev.expireTime, // Keep expiry time if set
        expireType: prev.expireType, // Keep expiry type
        interviewExpirationDate: prev.interviewExpirationDate, // Keep expiry date
      }));
      setTemplateTypesValue(''); // Clear template selection
    } else if (failMessage) {
      ErrorToast(failMessage);
      dispatch(setMessagesEmpty());
    }
  }, [successMessage, failMessage]);

  useEffect(() => {
    if (location?.state) {
      const { candidateInvitation, candidateInvitations } = location.state;
      
      // Handle multiple candidates
      if (candidateInvitations && Array.isArray(candidateInvitations)) {
        const candidateDetails = candidateInvitations.map(candidate => {
          const { emailAddress, username, mobileNumber, whatsappNumber } = candidate || {};
          const emailId = `${emailAddress ? `${emailAddress}, ` : username ? `${username}, ` : ""}`;
          const phoneNumber = `${mobileNumber ? `${mobileNumber}` : whatsappNumber ? `${whatsappNumber}` : ""}`;
          return emailId.concat(phoneNumber);
        }).join('\n'); // Join multiple candidates with newlines
        
        setCandidatesToInvite(candidateDetails);
        
        // Handle other properties from the first candidate (if needed)
        if (candidateInvitations[0]?.interviewRound) {
          dispatch(setRoundName(candidateInvitations[0]?.interviewRound));
        }
        if (candidateInvitations[0]?.vacancyLocations) {
          setSelectedLocation(candidateInvitations[0]?.vacancyLocations);
        }
        if (candidateInvitations[0]?.agencyName) {
          setSelectedPlacementAgency(candidateInvitations[0]?.agencyName);
        }
      }
      // Handle single candidate (backward compatibility)
      else if (candidateInvitation) {
        const { emailAddress, username, mobileNumber, whatsappNumber } = candidateInvitation || {};
        const emailId = `${emailAddress ? `${emailAddress}, ` : username ? `${username}, ` : ""}`;
        const phoneNumber = `${mobileNumber ? `${mobileNumber}` : whatsappNumber ? `${whatsappNumber}` : ""}`;
        const candidateDetails = emailId.concat(phoneNumber);
        setCandidatesToInvite(candidateDetails);
        
        if (candidateInvitation?.interviewRound) {
          dispatch(setRoundName(candidateInvitation?.interviewRound));
        }
        if (candidateInvitation?.vacancyLocations) {
          setSelectedLocation(candidateInvitation?.vacancyLocations);
        }
        if (candidateInvitation?.agencyName) {
          setSelectedPlacementAgency(candidateInvitation?.agencyName);
        }
      }
    }
  }, [location])

  useEffect(() => {
    if (isNotPublishedJobsApiCalled && isGetJobsApiCalled) {
      console.log('isNotPublishedJobsApiCalled, isGetJobsApiCalled ::: ', isNotPublishedJobsApiCalled, isGetJobsApiCalled);
      dispatch(interviewLinkInviteDetails({
        "jobId": jobId,
        "interviewRoundName": roundName,
        "agencyName": selectedPlacementAgency,
        "vacancyLocations": selectedLocation
      }));
      dispatch(setIsGetJobsApiCalled(false));
      dispatch(setIsNotPublishedJobsApiCalled(false));
    }
  }, [isNotPublishedJobsApiCalled, isGetJobsApiCalled]);

  useEffect(() => {
    if (isInterviewLinkInviteDetails) {
      dispatch(setInterviewLinkInviteDetailsApiCalled(false));
      setInviteCandidate({
        ...inviteCandidate,
        candidateInfo: candidatesToInvite,
      });
    }
  }, [isInterviewLinkInviteDetails]);

  useEffect(() => {
    if (isInviteCandidateButtonDisable) {
      dispatch(setInviteCandidateButtonDisable(false));
    }
  }, []);

  useEffect(() => {
    document.title = "Invite Candidates";
    dispatch(getEntity());
    dispatch(getAllEntities({ url: hostname }));

    if (roundName) {
      dispatch(
        fetchTemplateNames({
          type: "email",
          hiringType: currentJobDetails?.hiringType,
          interviewRounds: roundName,
          inviteType: section,
        })
      );
      dispatch(
        fetchWATemplateNames({
          type: "whatsapp",
          hiringType: currentJobDetails?.hiringType,
          interviewRounds: roundName,
          inviteType: section,
        })
      );
    }

    // Cleanup function to clear template flags when component unmounts
    return () => {
      dispatch(clearIsTemplate());
      dispatch(clearIsTemplateWA());
    };
  }, []);

  useEffect(() => {
    if (userType === 'manpower') {
      dispatch(getAllNotPublishedLateralJobs({ userId }));
      return;
    }
    if (userType === 'campus') {
      dispatch(getAllNotPublishedCampusJobs({ userId }));
      return;
    }
    dispatch(getAllNotPublishedJobs({ userId }));
  }, []);

  useEffect(() => {
    if (jobId) {
      dispatch(getJob({ jobId: jobId }));
    }
  }, [jobId]);

  useEffect(() => {
    if (isTemplate) {
      if (template) {
        const resultString = template.replace(/{ entity-name }/g, entityName);
        console.log('email template loaded');
        setInviteCandidate(prev => ({
          ...prev,
          emailTemplate: resultString ?? '',
        }));
        // Don't clear the flag immediately - let it stay true so the template displays
        // The flag will be cleared when a new template is selected or when the component unmounts
      }
    }
  }, [isTemplate, template, entityName]);

  useEffect(() => {
    if (isTemplateWA) {
      if (templateWA) {
        const resultString = templateWA.replace(/{ entity-name }/g, entityName);
        console.log('whatsapp template loaded');
        setInviteCandidate(prev => ({
          ...prev,
          whatsappTemplate: resultString ?? '',
        }));
        // Don't clear the flag immediately - let it stay true so the template displays
        // The flag will be cleared when a new template is selected or when the component unmounts
      }
    }
  }, [isTemplateWA, templateWA, entityName]);

  useEffect(() => {
    if (interviewRoundTemplate && templateNames?.length > 0) {
      const results = formatFileNamesForTemplates(templateNames);
      setAllCombinedTemplates((prev) =>
        mergeAndRemoveDuplicates(prev, results)
      );
      dispatch(clearIsInterviewRoundTemplate());
    }
  }, [interviewRoundTemplate, templateNames, dispatch]);

  useEffect(() => {
    if (interviewRoundTemplateWA && templateWANames?.length > 0) {
      const results = formatFileNamesForTemplates(templateWANames);
      setAllCombinedTemplates((prev) =>
        mergeAndRemoveDuplicates(prev, results)
      );
      dispatch(clearIsInterviewRoundTemplateWA());
    }
  }, [interviewRoundTemplateWA, templateWANames, dispatch]);

  // Debug logging for template states
  /* console.log('Template Debug:', {
    templateTypesValue,
    isEmailTemplate,
    isWhatsappTemplate,
    isTemplate,
    isTemplateWA,
    emailTemplate: inviteCandidate?.emailTemplate?.substring(0, 50) + '...',
    whatsappTemplate: inviteCandidate?.whatsappTemplate?.substring(0, 50) + '...',
    allCombinedTemplates: allCombinedTemplates?.length
  }); */

  const handleSubmit = () => {
    // Validate required fields
    if (!jobId) {
      return ErrorToast('Please select Position Name');
    }
    // if (!selectedPlacementAgency) {
    //   return ErrorToast(`Please select ${currentJobDetails?.hiringType === "Campus Hiring" ? "Campus Name" : "Placement Agency"} `);
    // }
    if (!roundName) {
      return ErrorToast('Please select Interview Round');
    }
    if (!selectedLocation) {
      return ErrorToast('Please select Vacancy Location');
    }

    let candidatesDTO = inviteCandidate.candidateInfo;
    if (candidatesDTO.length === 0) {
      return WarningToast(`Candidates not added`);
    }
    if (!isBulkInvited) {
      candidatesDTO = getCandidateData(candidatesDTO);
    } else {
      candidatesDTO = getCandidateDataBulk(candidatesDTO);
    }

    if (restrictInviteTime && !inviteCandidate.expireTime) {
      WarningToast("Invite Expiry Time not set");
    }
    let formattedDateTime;
    if (inviteCandidate.sendDate) {
      formattedDateTime = new Date(inviteCandidate.sendDate);
    }

    // Create a new Date object with the given date and time components

    dispatch(
      sendInvite({
        ...inviteCandidate,
        candidateInfo: candidatesDTO,
        jobId: jobId,
        roundName: roundName,
        emailTemplate: isEmailTemplate ? inviteCandidate.emailTemplate : "",
        whatsappTemplate: isWhatsappTemplate
          ? inviteCandidate.whatsappTemplate
          : "",
        mailSendingTime: inviteCandidate.sendDate,
        timezone : "Asia/Kolkata",
        templateName: templateTypesValue || '',
        inviteId: inviteDetailsDTO?.inviteId || '',
        round1StartDate : result.round1StartDate,
        round1StartTime : result.round1StartTime,
        round2StartDate : result.round2StartDate,
        round2StartTime : result.round2StartTime,

      })
    );
  };

  const interviewExpirationDateHandler = (e) => {
    if (!e.target.value) return;
    setInviteCandidate((prev) => {
      let newDate = new Date(
        new Date().getTime() + Number(e.target.value) * 60 * 60 * 1000
      );
      prev.expireTime = e.target.value; // Set expireTime with the input value
      prev.interviewExpirationDate = newDate; // Keep this for backward compatibility
      return prev;
    });
  };

  const handleAddReciver = (person) => {
    const myPerson = person;
    setInviteCandidate((prev) => ({
      ...prev,
      receivers: [
        ...prev.receivers,
        { ...myPerson, jobId: 88, interviewRound: roundsData.secondRound.name },
      ],
    }));
  };

  const handleRemoveReceiver = (index) => {
    const updateList = [...inviteCandidate.receivers];
    const a = updateList?.filter((val, i) => i !== index);
    setInviteCandidate({ ...inviteCandidate, receivers: a });
  };

  /*  const handleChange = (e) => {
     const { value } = e.target;
     setTemplateTypesValue(value);
     if (!value) return;
     console.log('value', value);
     return;
     // dispatch(fetchWATemplate(updatedStr));
     // dispatch(fetchTemplate(str));
   }; */

  const handleChange = (e) => {
    const { value } = e.target;
    console.log('Template selection changed to:', value);
    setTemplateTypesValue(value);
    if (value.toLowerCase() == "campus process intimation") {
      setOpenModal(true);
    }
    if (!value) {
      // Clear templates when no template is selected
      console.log('Clearing templates - no template selected');
      setInviteCandidate(prev => ({
        ...prev,
        emailTemplate: '',
        whatsappTemplate: ''
      }));
      // Clear the template flags
      dispatch(clearIsTemplate());
      dispatch(clearIsTemplateWA());
      return;
    }

    // Find matching templates by name
    const matchingTemplates = allCombinedTemplates?.filter(template => template.name === value);
    console.log('Matching templates:', matchingTemplates);

    if (matchingTemplates?.length > 0) {
      // Clear existing templates first
      console.log('Clearing existing templates and fetching new ones');
      setInviteCandidate(prev => ({
        ...prev,
        emailTemplate: '',
        whatsappTemplate: ''
      }));

      // Clear the template flags before fetching new ones
      dispatch(clearIsTemplate());
      dispatch(clearIsTemplateWA());

      // Fetch templates with a small delay to ensure proper state updates
      setTimeout(() => {
        matchingTemplates.forEach(template => {
          if (template.value.includes("whatsapp")) {
            console.log('Fetching WhatsApp template:', template.value);
            dispatch(fetchWATemplate(template.value));
          } else if (template.value.includes("email")) {
            console.log('Fetching Email template:', template.value);
            dispatch(fetchTemplate(template.value));
          }
        });
      }, 50);
    } else {
      console.log('No matching templates found for:', value);
    }
  };


  const handlePlacementAgencyChange = (e) =>
    setSelectedPlacementAgency(e.target.value);

  const handleLocationChange = (e) => setSelectedLocation(e.target.value);

  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get("type");
  const section =
    type === "invited-candidates" ? "invited candidates" : "invite candidates";

  const labelTexts =
    currentJobDetails?.hiringType === "Campus Hiring"
      ? "Campus Name"
      : "Placement Agency";

  const handlDateInput = (name) => {
    const onCloseCallback = (result) => {
      setInviteCandidate({ ...inviteCandidate, [result.name]: result.date });
    };
    handleDate(name, onCloseCallback, new Date());
  };

  const hanldeTimeInput = (name) => {
    const onCloseCallback = (result) => {
      setInviteCandidate({ ...inviteCandidate, [result.name]: result.time });
    };
    handleTime(name, onCloseCallback, new Date());
  };

  const customTimeHandler = (timeObj) => {
    setInviteCandidate((prev) => {
      prev.expireType = "Custom";
      const newDate = new Date(
        timeObj.interviewExpirationTiming.year,
        timeObj.interviewExpirationTiming.month - 1,
        timeObj.interviewExpirationTiming.day,
        timeObj.interviewExpirationTiming.hour,
        timeObj.interviewExpirationTiming.minute
      );
      prev.expireTime = "Custom"; // Set expireTime for custom time
      prev.interviewExpirationDate = newDate.toISOString();
      return prev;
    });
  };

  const sendLaterHandler = (timeString) => {
    setInviteCandidate((prev) => {
      return {
        ...prev,
        sendLater: true,
        sendDate: timeString // timeString is already in format "2025-09-23T16:11:00"
      };
    });
    setSendLaterModalOpen(false); // Close the modal after successful submission
  };

  const onRedirectionSaveClick = () => {
    if (!inviteCandidate.redirectLink) {
      ErrorToast("Please Enter Redirect URL");
      return;
    }
  }

  const handleInterviewLinkInviteDetails = () => {
    dispatch(interviewLinkInviteDetails({
      "jobId": jobId,
      "interviewRoundName": roundName,
      "agencyName": selectedPlacementAgency,
      "vacancyLocations": selectedLocation
    }));
  }
  
  return (
    <>
      {isLoading && <EvuemeLoader />}
      <div className="container">
        <BreadCrome />
        <ul className="tab-button">
          <li>
            <Link
              to="#"
              onClick={() =>
                setInviteCandidate({
                  ...inviteCandidate,
                  inviteType: "individual",
                })
              }
              className={
                inviteCandidate.inviteType === "individual"
                  ? "tab-selected"
                  : ""
              }
            >
              Invite Individually
              <i
                className="tooltipped infermation-ico-black"
                data-position="top"
                data-tooltip="Invite Individually"
              >
                i
              </i>
            </Link>
          </li>
          &nbsp;
          <li>
            <Link
              href="#"
              onClick={() =>
                setInviteCandidate({ ...inviteCandidate, inviteType: "bulk" })
              }
              className={
                inviteCandidate.inviteType === "bulk" ? "tab-selected" : ""
              }
            >
              Bulk Invite
              <i
                className="tooltipped infermation-ico-black"
                data-position="top"
                data-tooltip="Bulk Invite"
              >
                i
              </i>
            </Link>
          </li>
        </ul>
        {/* <aside className="col xl4 l5 m12 s12 add-questions-top-right padding-0">
          <SelectInputField
            selectTagIdAndName={"selectJobPosition"}
            options={optionMapper(
              allNotPublishedJobs,
              "positionName",
              "jobId",
              "Position Name"
            )}
            value={jobId}
            onChange={(e) => dispatch(selectJobId(e.target.value))}
          />
          <SelectInputField
            selectTagIdAndName={"selectJobPosition"}
            options={arrayToKeyValue(
              currentJobDetails?.interviewRounds?.toString().split(","),
              "Round Name"
            )}
            value={roundName}
            onChange={(e) => dispatch(setRoundName(e.target.value))}
          />
        </aside> */}
        {inviteCandidate.inviteType === "individual" ? (
          <>
            <div className="row row-margin horizontal-cards">
              <div className="body-box-body">
                <div className="row valign-wrapper">
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
                        setAllCombinedTemplates([]);
                        // Clear templates when job changes
                        setTemplateTypesValue('');
                        setInviteCandidate(prev => ({
                          ...prev,
                          emailTemplate: '',
                          whatsappTemplate: ''
                        }));
                        // Clear the template flags
                        dispatch(clearIsTemplate());
                        dispatch(clearIsTemplateWA());
                      }}
                    />
                  }
                  <SelectInputField
                    selectTagIdAndName={"selectJobPosition"}
                    divTagCssClasses="col xl3 l3 m4 s12"
                    labelText={"Position Name"}
                    customLabelNode={<>Position Name <span style={{ color: 'red' }}>*</span></>}
                    options={optionMapper(
                      allNotPublishedJobs,
                      "positionName",
                      "jobId",
                      "Select Position Name"
                    )}
                    value={jobId}
                    onChange={(e) => {
                      setAllCombinedTemplates([]);
                      // Clear templates when job changes
                      setTemplateTypesValue('');
                      setInviteCandidate(prev => ({
                        ...prev,
                        emailTemplate: '',
                        whatsappTemplate: ''
                      }));
                      // Clear the template flags
                      dispatch(clearIsTemplate());
                      dispatch(clearIsTemplateWA());
                      dispatch(selectJobId(e.target.value))
                      setHiringTypedd(true)
                      
                      console.log("currentJobDetails",currentJobDetails);
                      
                    }}
                  />
                  {(hiringTypedd && userType !== 'manpower' && currentJobDetails && currentJobDetails?.hiringType !== "Lateral Hiring") && (
                    <SelectInputField
                      selectTagIdAndName={"selectJobPosition"}
                      divTagCssClasses="col xl3 l3 m4 s12"
                      labelText={labelTexts} // plain text only
                      customLabelNode={<>{labelTexts} <span style={{ color: 'red' }}>*</span></>}
                      options={(() => {
                        const agencies = currentJobDetails?.placementAgencies
                          ?.toString()
                          .split(",")
                          .filter(agency => agency);

                        const baseOptions = arrayToKeyValue(
                          agencies || [],
                          currentJobDetails?.hiringType === "Campus Hiring" ? "Select Campus" : "Select Placement Agency"
                        );

                        // Add None for placement agency when data is null or has multiple agencies
                        if (currentJobDetails?.hiringType !== "Campus Hiring" &&
                          (!agencies || agencies.length === 0 || agencies.length > 1)) {
                          return [...baseOptions, { optionKey: "None", optionValue: "None" }];
                        }

                        return baseOptions;
                      })()}
                      value={selectedPlacementAgency}
                      onChange={handlePlacementAgencyChange}
                    />
                  )}
                  
                  <SelectInputField
                    selectTagIdAndName={"selectJobPosition2"}
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
                      dispatch(
                        fetchTemplateNames({
                          type: "email",
                          hiringType: currentJobDetails?.hiringType,
                          interviewRounds: selectedRound,
                          inviteType: section,
                        })
                      );
                      dispatch(
                        fetchWATemplateNames({
                          type: "whatsapp",
                          hiringType: currentJobDetails?.hiringType,
                          interviewRounds: selectedRound,
                          inviteType: section,
                        })
                      );
                    }}
                  />
                  <SelectInputField
                    selectTagIdAndName={"selectJobPosition"}
                    divTagCssClasses="col xl3 l3 m4 s12"
                    labelText={"Vacancy Location"}
                    customLabelNode={<>Vacancy Location <span style={{ color: 'red' }}>*</span></>}
                    options={(() => {
                      const locations = currentJobDetails?.locations
                        ?.toString()
                        .split(",")
                        .filter(location => location);

                      const baseOptions = arrayToKeyValue(
                        locations || [],
                        "Select Location"
                      );

                      // Only add Multiple locations if we have more than one location
                      if (locations?.length > 1) {
                        return [...baseOptions, { optionKey: "Multiple locations", optionValue: "Multiple locations" }];
                      }

                      return baseOptions;
                    })()}
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  />

                  <aside className="col xl2 l2 m4 s12 right-align">
                    <a
                      href="javascript:void(0)"
                      className={`waves-effect waves-light btn btn-clear btn-submit ${isSubmitDisabled && 'btn-disabled'}`}
                      style={isInviteCandidateButtonDisable ? { backgroundColor: '#666666' } : {}}
                      onClick={() => {
                        if (isSubmitDisabled || isInviteCandidateButtonDisable) return;
                        handleInterviewLinkInviteDetails()
                      }}
                    >
                      Submit
                    </a>
                  </aside>
                </div>
              </div>
            </div>
            <div className="row row-margin horizontal-cards">
              <aside className="col xl6 l6 m6 s12">
                <div className="card cand-minheight">
                  <div className="card-content">
                    <span className="card-title">Instructions</span>
                    <ul className="card-ul">
                      {instructionsData.map((item, index) => {
                        return <li>{index + 1}. {item}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </aside>
              <aside className="col xl6 l6 m6 s12">
                <div className="card">
                  <div className="card-content">
                    <span className="card-title">
                      Enter Candidates to invite
                    </span>
                    <EvuemeModalTrigger
                      modalId={"a"}
                      className="tooltipped"
                      data-position={"right"}
                    ></EvuemeModalTrigger>
                    <div
                      className="candidate-boxscroll"
                      style={{ height: "auto" }}
                    >
                      <textarea
                        value={inviteCandidate.candidateInfo}
                        onChange={(e) => {
                          if (isBulkInvited) return;
                          setInviteCandidate({
                            ...inviteCandidate,
                            candidateInfo: e.target.value,
                          });
                        }}
                        style={{
                          height: "80px",
                          outline: "none",
                          border: "none",
                        }}
                        readOnly={isBulkInvited}
                        disabled={isBulkInvited}
                      />
                    </div>
                    <div className="full-width pl-10">
                      <label className="checkboxfor-invitetime">
                        <input
                          type="checkbox"
                          className="filled-in"
                          onChange={() => {
                            setRestrictInviteTime((prev) => !prev);
                            // Clear expireTime when checkbox is unchecked
                            if (restrictInviteTime) {
                              setInviteCandidate(prev => ({
                                ...prev,
                                expireTime: ""
                              }));
                            }
                          }}
                        />
                        <span>Restrict above invites time</span>
                      </label>
                    </div>
                    {restrictInviteTime && (
                      <div className="full-width">
                        <EvuemeLabelTag>
                          <RadioButtonInputField
                            inputTagCssClasses={"with-gap"}
                            groupName="expireType"
                            labelText={"Hours"}
                            radioButtonValue={inviteCandidate.expireType}
                            value={"Hours"}
                            onChange={(e) => handleOnChange(e)}
                          />
                          &nbsp;
                          <span>
                            {inviteCandidate.expireType === "Hours" && (
                              <input
                                type="number"
                                name="expireTime"
                                className="hour-input"
                                onChange={interviewExpirationDateHandler}
                              />
                            )}
                          </span>
                          <EvuemeModalTrigger modalId={"timePickerModal"}>
                            <RadioButtonInputField
                              inputTagCssClasses={"with-gap"}
                              groupName="expireType"
                              labelText={"Custom"}
                              radioButtonValue={inviteCandidate.expireType}
                              value={"Custom"}
                              onChange={(e) => handleOnChange(e)}
                            />
                          </EvuemeModalTrigger>
                        </EvuemeLabelTag>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
            <div className="body-box-bodybg">
              <header className="body-box-top">
                <h3>Select WhatsApp and Email Template</h3>
              </header>
              <div className="row row-margin">
                <aside className="col xl6 l6 m6 s12">
                  <div className="emial-template">
                    <header className="template-header" style={{ padding: '0px' }}>
                      <label>
                        <input
                          type="checkbox"
                          className="filled-in"
                          checked={isEmailTemplate}
                          onClick={() => setIsEmailTemplate((prev) => !prev)}
                          onChange={() => { }}
                        />
                        <span>Email Invite</span>
                      </label>
                    </header>
                    <header className="template-header" style={{ padding: '0px' }}>
                      <label>
                        <input
                          type="checkbox"
                          className="filled-in"
                          checked={isWhatsappTemplate}
                          onClick={() => setIsWhatsappTemplate((prev) => !prev)}
                          onChange={() => { }}
                        />
                        <span>WhatsApp Invite</span>
                      </label>
                    </header>
                    <div className="email-teplate-box-inner">
                      <div className="input-field">
                        <div className="message-prv candidate-boxscroll">
                          {templateTypesValue && isEmailTemplate && !isTemplate && (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                              <i className="material-icons" style={{ fontSize: '24px', marginRight: '8px' }}>hourglass_empty</i>
                              Loading email template...
                            </div>
                          )}
                          <div
                            className="media-file-preview"
                            dangerouslySetInnerHTML={{
                              __html: (templateTypesValue && isEmailTemplate && inviteCandidate?.emailTemplate) ? inviteCandidate?.emailTemplate : '',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
                <aside className="col xl6 l6 m6 s12">
                  <div className="emial-template">
                    <div className="email-teplate-box-inner">
                      <div className="input-field" style={{ marginTop: '20px' }}>
                        {/* {console.log('Template options:', generateTemplateOptions(allCombinedTemplates))} */}
                        <SelectInputField
                          options={optionMapper(
                            generateTemplateOptions(allCombinedTemplates),
                            "optionKey",
                            "optionValue",
                            "Choose Template"
                          )}
                          value={templateTypesValue}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <WhatappChatView
                        htmlContent={(templateTypesValue && isWhatsappTemplate && inviteCandidate?.whatsappTemplate) ? inviteCandidate?.whatsappTemplate : ''}
                        isLoading={templateTypesValue && isWhatsappTemplate && !isTemplateWA}
                      />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
            {userType !== 'manpower' && (
              <div className="setting-section">
                <div className="setting-tab-wr">
                  <div className="row">
                    <div className="full-width">
                      <ul className="tabs setting-tab">
                        <li className="tab tab-btn">
                          <Link
                            className={
                              inviteCandidate.settings === "fullScreen"
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setInviteCandidate({
                                ...inviteCandidate,
                                settings: "fullScreen",
                              })
                            }
                          >
                            <i>
                              <EvuemeImageTag src={icon.zoomExpandIcon} alt="" />
                            </i>
                            Full Screen
                          </Link>
                        </li>
                        <li className="tab tab-btn">
                          <Link
                            className={
                              inviteCandidate.settings === "emailReport"
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setInviteCandidate({
                                ...inviteCandidate,
                                settings: "emailReport",
                              })
                            }
                          >
                            <i>
                              <EvuemeImageTag src={icon.tabEmailIcon} alt="" />
                            </i>
                            Email Report
                          </Link>
                        </li>
                        <li className="tab tab-btn">
                          <Link
                            className={
                              inviteCandidate.settings === "redirection"
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setInviteCandidate({
                                ...inviteCandidate,
                                settings: "redirection",
                              })
                            }
                          >
                            <i>
                              <EvuemeImageTag src={icon.redirectIcon} alt="" />
                            </i>
                            Redirection
                          </Link>
                        </li>
                      </ul>
                    </div>
                    {inviteCandidate.settings === "fullScreen" ? (
                      <div id="test1" className="tab-body-tabsetting">
                        <label htmlFor="">
                          Mandate Full screen
                          <i
                            className="material-icons dp48 tooltipped fl-right"
                            data-position="top"
                            data-tooltip="The candidate will be mandated to use full screen
                      <br> while taking the interview. (May not work on Mac)"
                          >
                            info
                          </i>
                        </label>

                        <label>
                          <input
                            checked={inviteCandidate.mandateFullScreen}
                            onChange={() =>
                              setInviteCandidate({
                                ...inviteCandidate,
                                mandateFullScreen:
                                  !inviteCandidate.mandateFullScreen,
                              })
                            }
                            type="checkbox"
                            className="filled-in"
                          />
                          <span>&nbsp;</span>
                        </label>
                      </div>
                    ) : null}
                    {inviteCandidate.settings === "emailReport" ? (
                      <div id="test2" className="tab-body-tabsetting">
                        <label className="lable-gap">
                          <span>
                            Receive mail whenever a candidate completes the test
                          </span>
                          <input type="checkbox" className="filled-in" />
                          <span></span>
                        </label>
                        <ul className="email-report-ul">
                          <li>
                            <span>Receiver</span>
                            <EvuemeModalTrigger modalId={"addReceiverModal"}>
                              <NormalButton
                                buttonText={"Add Receiver"}
                                leftIconSrc={icon.plusIcon}
                                buttonTagCssClasses={
                                  "btn btn-porpel waves-effect waves-light green-btn"
                                }
                              >
                                <i>
                                  <EvuemeImageTag
                                    src={icon.addOrEditUsers}
                                    alt=""
                                  />
                                </i>
                              </NormalButton>
                            </EvuemeModalTrigger>
                          </li>
                          <li className="searchreciver-wr">
                            <input
                              type="search"
                              placeholder="Search receivers"
                              className="search-reciver"
                            />

                            {inviteCandidate?.receivers
                              ?.filter((val) => val?.firstName !== "")
                              .map((val, index) => {
                                return (
                                  <div key={getUniqueId()} className="chip">
                                    {val?.firstName}
                                    <i
                                      onClick={() => handleRemoveReceiver(index)}
                                      key={getUniqueId()}
                                      className="close material-icons"
                                    >
                                      close
                                    </i>
                                  </div>
                                );
                              })}
                          </li>
                          <li>
                            <button className="waves-effect waves-light btn btn-clear btn-submit btn-small btnsmall-tr">
                              SAVE
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                    {inviteCandidate.settings === "redirection" ? (
                      <div id="test4" className="tab-body-tabsetting">
                        <div className="row">
                          <aside className="col xl2 l2 m4 s4 tabaside-p">
                            <p>Enable URL Display</p>
                            <p>Redirect URL</p>
                          </aside>
                          <aside className="col xl10 l10 m8 s8 tabside-right">
                            <label>
                              <input type="checkbox" className="filled-in" />
                              <span>
                                Show the personalized URL to the candidate
                              </span>
                            </label>
                            <div className="input-wr">
                              <input
                                type="search"
                                placeholder="https://www.hsc.com"
                                onChange={handleOnChange}
                                name="redirectLink"
                                value={inviteCandidate.redirectLink}
                              />
                            </div>
                            <button
                              className="btn btn-porpel waves-effect waves-light green-btn"
                              onClick={onRedirectionSaveClick}
                            >
                              SAVE
                            </button>
                          </aside>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            <div className="send-wrsection">
              <div className="card cand-minheight">
                <div className="card-content">
                  <span className="card-title">
                    <label className="checkboxfor-invitetime">
                      <input
                        className="with-gap"
                        name="group1"
                        type="radio"
                        checked={!inviteCandidate.sendLater}
                        onChange={() => {
                          setInviteCandidate((prev) => {
                            return {
                              ...prev,
                              sendLater: false,
                              sendDate: ""
                            };
                          });
                        }}
                      />
                      <span>Send Immediately</span>
                    </label>

                    <label className="checkboxfor-invitetime">
                      <input
                        className="with-gap"
                        name="group1"
                        type="radio"
                        checked={inviteCandidate.sendLater}
                        onChange={() => {
                          setInviteCandidate((prev) => {
                            return {
                              ...prev,
                              sendLater: true
                            };
                          });
                          setSendLaterModalOpen(true);
                          console.log("Send Later selected");
                        }}
                      />
                      <span>Send Later</span>
                    </label>
                    
                    {/* Show scheduled time if set */}
                    {inviteCandidate.sendDate && (
                      <div style={{ 
                        marginTop: "10px", 
                        padding: "8px", 
                        backgroundColor: "#e8f5e8", 
                        border: "1px solid #4caf50", 
                        borderRadius: "4px",
                        fontSize: "14px"
                      }}>
                        <strong>Scheduled for:</strong> {new Date(inviteCandidate.sendDate).toLocaleString()}
                      </div>
                    )}
                  </span>
                  {!inviteCandidate.sendDate && <div className="sendnowbox">
                    <h3>Send Now</h3>
                    <p>Press Send Invitation to immediately send the invites</p>
                  </div>}
                  <a
                    className="waves-effect waves-light btn btn-clear btn-submit"
                    href="#"
                    onClick={handleSubmit}
                  >
                    Send invitation
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <BulkInvite
            setInviteCandidate={setInviteCandidate}
            jobId={jobId}
            roundName={roundName}
            setIsBulkInvited={setIsBulkInvited}
            selectedPlacementAgency={selectedPlacementAgency}
            setSelectedPlacementAgency={setSelectedPlacementAgency}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        )}
      </div>
      <AddReceiverModal
        handleAddReciver={handleAddReciver}
      />

      <TimePickerModal customTimeHandler={customTimeHandler} />
      <SendLaterModal 
        sendLaterHandler={sendLaterHandler} 
        isOpen={sendLaterModalOpen} 
        onClose={() => {
          setSendLaterModalOpen(false);
          // Reset sendLater to false when modal is closed without submitting
          setInviteCandidate((prev) => {
            return {
              ...prev,
              sendLater: false,
              sendDate: ""
            };
          });
        }} 
      />  
      {openModal && <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Timing">
        <form>
          {/* Opening Time */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Round One Start Date
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
               {/* Day */}
               <select style={{ width: "70px" }} value={round1.day} onChange={(e) => handleRound1Change("day", e.target.value)}>
                 {days.map((d) => (
                   <option key={d} value={d}>
                     {d}
                   </option>
                 ))}
               </select>

               {/* Month */}
               <select style={{ width: "120px" }} value={round1.month} onChange={(e) => handleRound1Change("month", e.target.value)}>
                 {months.map((m, i) => (
                   <option key={i} value={m.value}>
                     {m.name}
                   </option>
                 ))}
               </select>

              {/* Year */}
              <select style={{ width: "90px" }} value={round1.year} onChange={(e) => handleRound1Change("year", e.target.value)}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Hour */}
              <select style={{ width: "70px" }} value={round1.hour} onChange={(e) => handleRound1Change("hour", e.target.value)}>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              <span>:</span>

              {/* Minutes */}
              <select style={{ width: "70px" }} value={round1.minute} onChange={(e) => handleRound1Change("minute", e.target.value)}>
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Expiration Time */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
            Round Two Start Date
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
               {/* Day */}
               <select style={{ width: "70px" }} value={round2.day} onChange={(e) => handleRound2Change("day", e.target.value)}>
                 {days.map((d) => (
                   <option key={d} value={d}>
                     {d}
                   </option>
                 ))}
               </select>

               {/* Month */}
               <select style={{ width: "120px" }} value={round2.month} onChange={(e) => handleRound2Change("month", e.target.value)}>
                 {months.map((m, i) => (
                   <option key={i} value={m.value}>
                     {m.name}
                   </option>
                 ))}
               </select>

              {/* Year */}
              <select style={{ width: "90px" }} value={round2.year} onChange={(e) => handleRound2Change("year", e.target.value)}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Hour */}
              <select style={{ width: "70px" }} value={round2.hour} onChange={(e) => handleRound2Change("hour", e.target.value)}>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              <span>:</span>

              {/* Minutes */}
              <select style={{ width: "70px" }} value={round2.minute} onChange={(e) => handleRound2Change("minute", e.target.value)}>
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: "#c5a55a",
              color: "white",
              border: "none",
              padding: "10px 24px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleSubmit2}
          >
            Submit
          </button>
        </form>
      </Modal>
      }
    </>
  );
};

export default InviteCandidates;