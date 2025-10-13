import { useState, useEffect } from "react";
import { icon } from "../../components/assets/assets";
import NormalButton from "../../components/buttons/normal-button";
import QRCodeGenerator from "./qrGenerate";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import Tooltip from "../../components/miscellaneous/tooltip";
import NormalInputField from "../../components/input-fields/normal-input-field";
import RadioButtonInputField from "../../components/input-fields/radio-button-input-field";
import SwitchInputField from "../../components/input-fields/switch-input-field";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { useDispatch, useSelector } from "react-redux";
import {
  generateLink,
  generateShortenLink,
} from "../../redux/actions/invite-candidates";
import {
  setCustomLinkGenerated,
  setMessagesEmpty,
} from "../../redux/slices/invite-candidates-slice";
import { useNavigate } from "react-router-dom";
import {
  getAllNotPublishedLateralJobs,
  getAllNotPublishedJobs,
  getAllNotPublishedCampusJobs,
} from "../../redux/actions/define-interview-actions/define-interview-actions";
import {
  selectJobId,
  setRoundName,
} from "../../redux/slices/create-new-job-slice";
import { getJob } from "../../redux/actions/create-job-actions";
import { arrayToKeyValue } from "../../utils/arrayToKeyValue";
import SelectInputField from "../../components/input-fields/select-input-field";
import { optionMapper } from "../../utils/optionMapper";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import WarningToast from "../../components/toasts/warning-toast";
import TimePickerModal from "../../components/modals/time-picker-modal";
import ShortenLink from "./shorten-link";
import { setSelectedCandidateEmailWpInfo } from "../../redux/slices/interview-responses-recuriter-dashboard-slice";
import { getCurrentAndFutureDate } from "../../utils/functions";
const initialInviteState = {
  public: true,
  inviteOnly: false,
  linkType: "Copy Link",
  linkValue: "",
  shortenLink: "",
};

const customLinkInitialState = {
  jobId: "",
  interview_round: "",
  customEditLink: "",
  shortenedInterviewLinkTitle: "",
};

const isEmpty = (obj) => {
  return Object.entries(obj).length === 0;
};

const InviteLink = () => {
  const state = useSelector((state) => state.inviteCandidatesSliceReducer);
  const [generatedLink, setGeneratedLink] = useState("");
  const { jobId, roundName, currentJobDetails } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { allNotPublishedJobs } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { currentUser, userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const { userId } = useSelector((state) => state.signinSliceReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add title and metadata when component mounts
  useEffect(() => {
    // Set page title
    document.title = "Your Job Interview Invitation";

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content =
      "Click the 'Speak Now' button to begin. Ms. Avi will explain the company and guide you through your interview. No app, no login, just follow her lead";

    // Set Open Graph tags for link previews
    const setMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Set Twitter Card tags
    const setTwitterTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Determine if this is a tenant subdomain or main domain
    const hostname = window.location.hostname;
    const isTenantSubdomain = hostname !== "app.evueme.live";

    // Set dynamic title based on domain
    let ogTitle = "Your Job Interview Invitation";
    if (isTenantSubdomain) {
      // Extract entity short name from subdomain (e.g., "company" from "company.app.evueme.live")
      const entityShortName = hostname.split(".")[0];
      const capitalizedEntityShortName =
        entityShortName.charAt(0).toUpperCase() + entityShortName.slice(1);
      ogTitle = `Interview Invite from ${capitalizedEntityShortName}`;
      document.title = ogTitle;
    }

    // Set Open Graph tags
    setMetaTag("og:title", ogTitle);
    setMetaTag(
      "og:description",
      "Click the 'Speak Now' button to begin. Ms. Avi will explain the company and guide you through your interview. No app, no login, just follow her lead"
    );
    setMetaTag("og:type", "website");
    setMetaTag("og:url", window.location.href);

    // Set logo and favicon based on domain
    const favicon = document.querySelector('link[rel="icon"]');
    if (isTenantSubdomain) {
      // For tenant subdomains, use tenant logo (you'll need to get this dynamically)
      setMetaTag("og:image", `${window.location.origin}/tenant-logo.png`);
      if (favicon) favicon.href = `${window.location.origin}/tenant-logo.png`;
    } else {
      // For main domain, use EvueMe V Logo
      setMetaTag("og:image", `${window.location.origin}/evueme-logo.png`);
      if (favicon) favicon.href = `${window.location.origin}/evueme-logo.png`;
    }

    // Set Twitter Card tags
    setTwitterTag("twitter:card", "summary_large_image");
    setTwitterTag("twitter:title", ogTitle);
    setTwitterTag(
      "twitter:description",
      "Click the 'Speak Now' button to begin. Ms. Avi will explain the company and guide you through your interview. No app, no login, just follow her lead"
    );

    if (isTenantSubdomain) {
      setTwitterTag(
        "twitter:image",
        `${window.location.origin}/tenant-logo.png`
      );
    } else {
      setTwitterTag(
        "twitter:image",
        `${window.location.origin}/evueme-logo.png`
      );
    }

    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = "EvueMe App";

      // Remove dynamically added meta tags
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');

      ogTags.forEach((tag) => tag.remove());
      twitterTags.forEach((tag) => tag.remove());

      // Restore original favicon
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.href = "/favicon.ico"; // Assuming default is favicon.ico
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // want title and meta
      console.log("title and meta ::: ", document);
    }, 5000);
  }, []);

  // Get current IST time for default values
  const getCurrentISTTime = () => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + istOffset);

    return {
      day: istTime.getUTCDate(),
      month: istTime.getUTCMonth() + 1,
      year: istTime.getUTCFullYear(),
      hour: istTime.getUTCHours(),
      minute: istTime.getUTCMinutes(),
    };
  };

  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  // const [isHoveredType, setIsHoveredType] = useState(false);
  // const [isHoveredTypeLink, setIsHoveredTypeLink] = useState(false);
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);
  const [timezone, setTimezone] = useState("UTC+05:30 Indian Standard Time");
  const [inviteInfo, setInviteInfo] = useState(initialInviteState);
  const [customLink, setCustomLink] = useState(customLinkInitialState);
  const [isCustomLinkGenerated, setIsCustomLinkGenerated] = useState(false);
  const [isCreateLinkButtonClicked, setIsCreateLinkButtonClicked] =
    useState(false);
  dispatch(setSelectedCandidateEmailWpInfo(""));
  useEffect(() => {
    setInviteInfo((prev) => {
      return {
        ...prev,
        linkValue: state?.generatedLinkState?.interviewLink,
        shortenLink: state?.generatedLinkState?.shortenLink,
      };
    });

    if (state.customEditLink) {
      setIsCustomLinkGenerated(true);
    } else {
      setIsCustomLinkGenerated(false);
    }

    setCustomLink((prev) => {
      return {
        ...prev,
        // customEditLink: state.customEditLink || state.shortenLink, // previous code
        customEditLink:
          state?.customEditLink || state?.generatedLinkState?.shortenLink, // updated to prioritize customEditLink from response
        shortenedInterviewLinkTitle: state.shortenLinkTitle,
      };
    });
  }, [state]);

  useEffect(() => {
    setCustomLink((prev) => {
      prev.jobId = jobId;
      prev.interview_round = roundName;
      return prev;
    });
  }, [inviteInfo]);

  useEffect(() => {
    if (state.successMessage) {
      SuccessToast(state.successMessage);
    } else if (state.failMessage) {
      ErrorToast(state.failMessage);
    }
    dispatch(setMessagesEmpty());
  }, [state.successMessage, state.failMessage]);

  useEffect(() => {
    dispatch(setCustomLinkGenerated(false));
    if (userType === "manpower") {
      dispatch(getAllNotPublishedLateralJobs({ userId }));
      return;
    }
    if (userType === "campus") {
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

  // Initialize startDate and endDate with current IST time
  useEffect(() => {
    const currentISTTime = getCurrentISTTime();
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const dayAfterTomorrowIST = new Date(
      dayAfterTomorrow.getTime() + 5.5 * 60 * 60 * 1000
    );

    setStartDate({
      day: currentISTTime.day,
      month: currentISTTime.month,
      year: currentISTTime.year,
      hour: currentISTTime.hour,
      minute: currentISTTime.minute,
    });

    setEndDate({
      day: dayAfterTomorrowIST.getUTCDate(),
      month: dayAfterTomorrowIST.getUTCMonth() + 1,
      year: dayAfterTomorrowIST.getUTCFullYear(),
      hour: 22,
      minute: 0,
    });
  }, []);

  const handleToggleChange = (e) => {
    setInviteInfo({
      ...inviteInfo,
      public: !inviteInfo.public,
      inviteOnly: !inviteInfo.inviteOnly,
    });

    if (!inviteInfo.inviteOnly) {
      navigate("/admin/invite-candidates");
    }
  };

  const handleLinkChange = (e) => {
    setInviteInfo({ ...inviteInfo, linkValue: e.target.value });
  };

  const handleGenerateLink = () => {
    if (!jobId || !roundName) {
      return WarningToast("'Position Name' or 'Round Name' not selected");
    }
    const dateValidity = validateDates(startDate, endDate);
    const selectedPositionName = allNotPublishedJobs?.find(
      (item) => item?.jobId == jobId
    );

    if (!dateValidity.isValid || isEmpty(startDate) || isEmpty(endDate)) {
      return WarningToast(dateValidity.message);
    }

    const startDateUTC = Date.UTC(
      startDate.year,
      startDate.month - 1,
      startDate.day,
      startDate.hour,
      startDate.minute
    );
    const endDateUTC = Date.UTC(
      endDate.year,
      endDate.month - 1,
      endDate.day,
      endDate.hour,
      endDate.minute
    );

    const lowerLimitUTC = new Date(
      selectedPositionName?.vacancyStartDate
    ).getTime();
    const upperLimitUTC = new Date(
      selectedPositionName?.vacancyClosureDate
    ).getTime();

    // console.log(lowerLimitUTC, upperLimitUTC);
    // console.log(startDateUTC, endDateUTC);

    if (startDateUTC < lowerLimitUTC || startDateUTC > upperLimitUTC) {
      /* console.log(
        "Start Date:",
        startDateUTC,
        "should be between:",
        lowerLimitUTC,
        upperLimitUTC
      ); */
      return WarningToast(
        `Start Date should be between Vacancy Start Date and Vacancy Closure Date`
      );
    }

    if (endDateUTC < lowerLimitUTC || endDateUTC > upperLimitUTC) {
      /* console.log(
        "End Date:",
        endDateUTC,
        "should be between:",
        lowerLimitUTC,
        upperLimitUTC
      ); */
      return WarningToast(
        `Close Date should be between Vacancy Start Date and Vacancy Closure Date`
      );
    }

    const startDateTime = new Date(startDateUTC);
    const endDateTime = new Date(endDateUTC);

    dispatch(
      generateLink({
        jobId: jobId,
        interviewRound: roundName,
        isPublic: inviteInfo.public,
        startValidityTime: startDateTime,
        endValidityTime: endDateTime,
        timeZone: timezone || new Date().toTimeString().substring(9),
      })
    );
  };

  useEffect(() => {
    if (state.link) {
      setGeneratedLink(state.link);
    }
  }, [state.link]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteInfo.linkValue);
    SuccessToast("Copied");
  };

  const handleOnChange = (e) => {
    setInviteInfo({ ...inviteInfo, [e.target.name]: e.target.value });
  };

  const validateDates = (startDate, endDate) => {
    if (isEmpty(startDate) || isEmpty(endDate)) {
      return {
        isValid: false,
        message: "Dates cannot be empty",
      };
    }

    const startDateUTC = Date.UTC(
      startDate.year,
      startDate.month - 1,
      startDate.day,
      startDate.hour,
      startDate.minute
    );
    const endDateUTC = Date.UTC(
      endDate.year,
      endDate.month - 1,
      endDate.day,
      endDate.hour,
      endDate.minute
    );
    if (isNaN(startDateUTC) || isNaN(endDateUTC)) {
      return {
        isValid: false,
        message: "Invalid date format",
      };
    }
    if (startDateUTC > endDateUTC) {
      return {
        isValid: false,
        message: "Opening date cannot be after Closing date",
      };
    }
    return {
      isValid: true,
      message: "Valid dates",
    };
  };

  const customTimeHandler = (timeObj) => {
    setStartDate(() => {
      return {
        minute: Number(timeObj.interviewOpeningTiming.minute),
        hour: Number(timeObj.interviewOpeningTiming.hour),
        day: Number(timeObj.interviewOpeningTiming.day),
        month: Number(timeObj.interviewOpeningTiming.month),
        year: Number(timeObj.interviewOpeningTiming.year),
      };
    });
    setEndDate(() => {
      return {
        minute: Number(timeObj.interviewExpirationTiming.minute),
        hour: Number(timeObj.interviewExpirationTiming.hour),
        day: Number(timeObj.interviewExpirationTiming.day),
        month: Number(timeObj.interviewExpirationTiming.month),
        year: Number(timeObj.interviewExpirationTiming.year),
      };
    });
    setTimezone(() => timeObj.timezone);
  };

  const createLinkHandler = async () => {
    if (!customLink.customEditLink) {
      return WarningToast(`Custom link is empty!`);
    }

    // Validate dates before sending
    const dateValidity = validateDates(startDate, endDate);
    if (!dateValidity.isValid || isEmpty(startDate) || isEmpty(endDate)) {
      return WarningToast(dateValidity.message);
    }

    // Convert dates to UTC for backend
    const startDateUTC = Date.UTC(
      startDate.year,
      startDate.month - 1,
      startDate.day,
      startDate.hour,
      startDate.minute
    );
    const endDateUTC = Date.UTC(
      endDate.year,
      endDate.month - 1,
      endDate.day,
      endDate.hour,
      endDate.minute
    );

    const startDateTime = new Date(startDateUTC);
    const endDateTime = new Date(endDateUTC);

    // Add validity times to the payload
    const payloadWithValidity = {
      ...customLink,
      startValidityTime: startDateTime,
      endValidityTime: endDateTime,
      timeZone: timezone || new Date().toTimeString().substring(9),
    };

    dispatch(generateShortenLink(payloadWithValidity));
    setIsCreateLinkButtonClicked(true);
  };

  useEffect(() => {
    if (state.successMessage) {
      SuccessToast(state.successMessage);
    } else if (state.failMessage) {
      ErrorToast(state.failMessage);
    }
    dispatch(setMessagesEmpty());
  }, [state.successMessage, state.failMessage]);

  useEffect(() => {
    if (jobId) {
      dispatch(getJob({ jobId: jobId }));
    }
  }, [jobId]);

  // Auto-set dates when both jobId and roundName are selected
  useEffect(() => {
    if (
      jobId &&
      roundName &&
      allNotPublishedJobs &&
      Array.isArray(allNotPublishedJobs)
    ) {
      const selectedPositionName = allNotPublishedJobs?.find(
        (item) => item?.jobId == jobId
      );
      if (!selectedPositionName) return;
      const { vacancyStartDate, vacancyClosureDate } = selectedPositionName;
      if (!vacancyStartDate || !vacancyClosureDate) return;

      const vsd = new Date(vacancyStartDate);
      const vcd = new Date(vacancyClosureDate);

      setStartDate(getCurrentAndFutureDate().currentDateParts);
      setEndDate(getCurrentAndFutureDate().futureDateParts);
    }
  }, [jobId, roundName, allNotPublishedJobs]);

  const handleJobPositionChange = (event) => {
    dispatch(setCustomLinkGenerated(false));
    const { value } = event?.target;
    if (!value || !allNotPublishedJobs || !Array.isArray(allNotPublishedJobs))
      return;
    const selectedPositionName = allNotPublishedJobs?.find(
      (item) => item?.jobId == value
    );
    // console.log('selectedPositionName :: ', selectedPositionName)
    if (!selectedPositionName) return;
    const { vacancyStartDate, vacancyClosureDate } = selectedPositionName;
    if (!vacancyStartDate || !vacancyClosureDate) return;

    const vsd = new Date(vacancyStartDate);
    const vcd = new Date(vacancyClosureDate);

    setStartDate(getCurrentAndFutureDate().currentDateParts);
    setEndDate(getCurrentAndFutureDate().futureDateParts);
  };

  return (
    <>
      <div className="right-sidebar">
        <div className="container container-popup">
          <div className="row">
            <aside className="form-group col s6 whitebg">
              <SelectInputField
                selectTagIdAndName={"selectJobPosition"}
                labelText="Position Name"
                options={optionMapper(
                  allNotPublishedJobs,
                  "positionName",
                  "jobId",
                  "Position Name"
                )}
                value={jobId}
                onChange={(e) => {
                  handleJobPositionChange(e);
                  dispatch(selectJobId(e.target.value));
                }}
              />
            </aside>
            <aside className="form-group col s6 whitebg">
              <SelectInputField
                selectTagIdAndName={"selectJobPosition"}
                labelText="Round Name"
                options={arrayToKeyValue(
                  currentJobDetails?.interviewRounds?.toString().split(","),
                  "Round Name"
                )}
                value={roundName}
                onChange={(e) => dispatch(setRoundName(e.target.value))}
              />
            </aside>
          </div>
          <div className="row">
            <div className="col xl12 l12 m12 s12">
              <div className="body-box-body body-bg">
                <div className="type-header">
                  <span>Type</span>
                  <i
                    class="material-icons dp48 tooltipped"
                    data-position="top"
                    data-tooltip="Interview type is public or invite only"
                  >
                    info
                  </i>
                </div>

                <div className="row mo-header">
                  <aside className="col col-md-6 col-12">
                    <ul className="right-q-action interview-ul">
                      <li className="modal-radio">
                        <SwitchInputField
                          switchInputFieldIdAndName="public"
                          labelText="Public"
                          onChange={handleToggleChange}
                          checked={inviteInfo.public}
                        />
                        <SwitchInputField
                          switchInputFieldIdAndName="inviteOnly"
                          labelText="Invite Only"
                          onChange={handleToggleChange}
                          checked={inviteInfo.inviteOnly}
                        />
                      </li>
                    </ul>
                  </aside>
                  <aside className="col col-md-6 col-12 right">
                    <EvuemeModalTrigger modalId={"timePickerModal"}>
                      <NormalButton
                        className="btn btn-clear"
                        buttonText={"Set Validity"}
                      />
                    </EvuemeModalTrigger>
                    <NormalButton
                      className="btn btn-clear btn-submit"
                      buttonText={"Generate Link"}
                      onClick={handleGenerateLink}
                    />
                    {/* {generatedLink && <QRCodeGenerator value={generatedLink} />} */}
                  </aside>
                </div>
                <div className="col xl12 l12 m12 s12 interview-radio">
                  <EvuemeLabelTag style={{ marginRight: "1rem" }}>
                    <RadioButtonInputField
                      inputTagCssClasses={"with-gap"}
                      groupName="linkType"
                      labelText={"Copy Link"}
                      radioButtonValue={inviteInfo.linkType}
                      value={"Copy Link"}
                      // isTooltip={true}
                      onChange={(e) => handleOnChange(e)}
                    />
                  </EvuemeLabelTag>
                  <EvuemeLabelTag style={{ position: "relative" }}>
                    <RadioButtonInputField
                      inputTagCssClasses={"with-gap"}
                      groupName="linkType"
                      labelText={"Shorten Link"}
                      radioButtonValue={inviteInfo.linkType}
                      value={"Shorten Link"}
                      onChange={(e) => handleOnChange(e)}
                      isTooltip={true}
                      toolTipPosition="top"
                      tooltipLabel="Short link for the interview io"
                    />
                    {/* <i className="show-details infermation-ico-black">
                      i
                      <Tooltip divTagCssClasses={"infbox-click"}>
                        <div className="tooltip-content">
                          <p>Short link for the interview</p>
                        </div>
                      </Tooltip>
                    </i> */}
                  </EvuemeLabelTag>
                </div>
                {inviteInfo.linkType === "Shorten Link" ? (
                  <ShortenLink
                    inviteInfo={inviteInfo}
                    customLink={customLink}
                    setCustomLink={setCustomLink}
                    createLinkHandler={createLinkHandler}
                    isCustomLinkGenerated={isCustomLinkGenerated}
                  />
                ) : (
                  <div className="row">
                    <div className="col input-field xl12 l12 m12 s12 copy-code">
                      <NormalInputField
                        rightIconSrc={icon.copyIcon}
                        onClickRightIcon={handleCopy}
                        rightIconCss="validate copy-ico"
                        value={inviteInfo.linkValue}
                        placeholder={
                          "Click on generate link to get the invited link"
                        }
                        onChange={(e) => handleLinkChange(e)}
                        style={{ paddingRight: "30px" }}
                      />
                      {generatedLink && (
                        <QRCodeGenerator
                          value={generatedLink}
                          isCopyIcon={true}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TimePickerModal
        initialStartDate={startDate}
        initialEndDate={endDate}
        customTimeHandler={customTimeHandler}
      />
    </>
  );
};

export default InviteLink;
