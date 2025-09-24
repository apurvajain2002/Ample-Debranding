import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { useDispatch } from "react-redux";
import CheckboxInputField from "../../components/input-fields/checkbox-input-field";
import {
  cancelInviteStatus,
  updateInterviewTime,
  sendReminder,
} from "../../redux/actions/invited-candidates";
import { icon } from "../../components/assets/assets";
import SuccessToast from "../../components/toasts/success-toast";
import WarningToast from "../../components/toasts/warning-toast";
import TimePickerModal from "../../components/modals/time-picker-modal";
import { useGlobalContext } from "../../context";
import { manpowerStatuses } from "../../utils/functions";
import { setIsGetJobsApiCalled } from "../../redux/slices/create-new-job-slice";
import { setIsNotPublishedJobsApiCalled } from "../../redux/slices/define-interview-slice";

const deliveryMap = {
  sent: {
    icon: icon.exportShareIcon,
    css: "sent-btn",
  },
  delivered: {
    icon: icon.emailInvitationInviteIcon,
    css: "delivered-btn",
  },
  read: {
    icon: icon.instructionIcon,
    css: "read-btn",
  },
  failed: {
    icon: icon.failedIcon,
    css: "failed-btn",
  },
  clicked: {
    icon: icon.linkIcon,
    css: "clicked-btn",
  },
  bounced: {
    icon: icon.instructionIcon,
    css: "bounced-btn",
  },
};

const linkOpeningMap = {
  whatsapp: {
    icon: icon.whatsappIconInvitedCandidate,
    css: "btn-linkopening",
  },
  email: { icon: icon.emailInvitationInviteIcon, css: "email-btn" },
  publiclink: { icon: icon.linkIcon, css: "publiclink-btn" }, // need to add width
  login: { icon: icon.musicSwitchOnOffButtonIcon, css: "login-btn" },
};

const candidateActionColorMap = {
  notinterested: {
    icon: icon.accessDeniedForbiddenIcon,
    css: "btn-notinterested btn-candidateaction",
  },
  notstarted: {
    icon: icon.sandClockFullLineIcon,
    css: "btn-not-started btn-candidateaction",
  },
  completingtoday: {
    icon: icon.timePeriodIcon,
    css: "btn-completedtoday btn-candidateaction",
  },
  started: { icon: icon.pendingIcon, css: "btn-candidateaction" },
  hindi: {
    icon: icon.languageTranslatorIconInvitedCandidate,
    css: "language-btn btn-candidateaction",
  },
  english: {
    icon: icon.languageTranslatorIconInvitedCandidate,
    css: "language-btn btn-candidateaction",
  },
  completed: { icon: icon.completeIcon, css: "read-btn btn-candidateaction" },
};

const recruiterActionMap = {
  speakto: {
    icon: icon.phoneIconDark,
    css: "btn-spekcandidate",
  },
  interviewlink: {
    icon: icon.linkIconDark,
    css: "btn-interviewlink",
  },
  changetime: {
    icon: icon.timePeriodIconDark,
    css: "btn-completedtoday",
  },
  cancelinvite: {
    icon: icon.crossIconInvitedCandidateDark,
    css: "failed-btn",
  },
  undocancel: {
    icon: icon.replyArrowIconDark,
    css: "delivered-btn",
  },
  sendreminder: {
    icon: icon.exportShareIconDark,
    css: "",
  },
  nextround: {
    icon: icon.doubleArrowRightIconDark,
    css: "next-round-btn",
  },
};

const defaultBtnClassName =
  "btn-success btn-textleft btn-linkopening mb2 soft-round-btn";

const InvitedCandidateTableRow = ({
  candidateInvitation,
  userType
}) => {
  const { isTableHeaderChecked, selectedCandidates, setSelectedCandidates } = useGlobalContext();

  useEffect(() => {
    if (isTableHeaderChecked) {
      // Select all candidate inviteIds
      setSelectedCandidates((prevSelects) => {
        return [...prevSelects, inviteId];
      });
    }
  }, [isTableHeaderChecked])

  const modalTriggerRef = useRef(null);
  const navigate = useNavigate();

  const handleNextRoundInvite = () => {
    dispatch(setIsGetJobsApiCalled(false));
    dispatch(setIsNotPublishedJobsApiCalled(false));
    navigate("/admin/invite-candidates?type=invited-candidates", {
      state: { candidateInvitation: candidateInvitation }
    });
  };

  const {
    whatsappStatus: initialWhatsappStatus = "",
    emailStatus: initialEmailStatus = "",
    emailAddress = "",
    linkOpeningStatus: initialLinkOpeningStatus = "",
    candidateActionStatus: initialCandidateActionStatus = "",
    interviewLink = "",
    mobileNumber = "",
    username = "",
    isInviteCanceled,
    inviteId = "",
    inviteStatus = "",
    emailInviteLink = "",
    statusUpdate = '0'
  } = candidateInvitation;

  const [whatsappStatus, setWhatsappStatus] = useState(
    initialWhatsappStatus || "Sent"
  );
  const [emailStatus, setEmailStatus] = useState(initialEmailStatus || "Sent");
  const [candidateActionStatus, setCandidateActionStatus] = useState(
    initialCandidateActionStatus || "start interview"
  );
  const [linkOpeningStatus, setLinkOpeningStatus] = useState(
    initialLinkOpeningStatus || "Public Link"
  );
  const [hasCancelledInvite, setHasCancelledInvite] = useState(
    isInviteCanceled || false
  );
  const [isSelected, setIsSelected] = useState(
    selectedCandidates.includes(inviteId)
  );

  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  const [timezone, setTimezone] = useState("");
  const dispatch = useDispatch();

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

    // Convert time object to UTC date string
    const convertTimeToUTCString = (timeObj) => {
      const { day, month, year, hour, minute } = timeObj;
      const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
      return date.toISOString();
    };

    // Convert to UTC strings for API
    const startValidityTime = convertTimeToUTCString(timeObj.interviewOpeningTiming);
    const endValidityTime = convertTimeToUTCString(timeObj.interviewExpirationTiming);

    // Call the API to update interview time for this specific candidate
    dispatch(
      updateInterviewTime({
        inviteId: inviteId,
        startValidityTime: startValidityTime,
        endValidityTime: endValidityTime,
      })
    );

    // Show success message
    SuccessToast("Interview time updated successfully!");
  };

  // className for buttons
  const getButtonClassName = (map, status = "") => {
    status = status?.replace(/\s+/g, "").toLowerCase().toLowerCase();
    let css = "";
    if (map === "delivery") {
      css = deliveryMap[status]?.css || "";
    } else if (map === "linkOpening") {
      css = linkOpeningMap[status]?.css || "";
    } else if (map === "candidateAction") {
      css = candidateActionColorMap[status]?.css || "";
    } else {
      css = `${recruiterActionMap[status]?.css} tooltipped` || "";
    }
    return `${defaultBtnClassName} ${css}`;
  };

  // icons for buttons
  const getButtonIcons = (map, status = "") => {
    status = status?.replace(/\s+/g, "").toLowerCase().trim();
    if (map === "delivery") return deliveryMap[status]?.icon;
    else if (map === "linkOpening") return linkOpeningMap[status]?.icon;
    else if (map === "candidateAction")
      return candidateActionColorMap[status]?.icon;
    return recruiterActionMap[status]?.icon;
  };

  // copies to clipboard
  const copyToClipboard = (text = "", type = "") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        SuccessToast(`${type} copied to clipboard !`);
      })
      .catch((err) => {
        WarningToast(`${type} : ${text}`);
        console.error("Failed to copy text: ", err);
      });
  };

  // checkbox handler
  const checkboxHandler = () => {
    setSelectedCandidates((prevSelects) => {
      if (!isSelected) {
        return [...prevSelects, inviteId];
      } else {
        return prevSelects.filter((rowInd) => rowInd !== inviteId);
      }
    });
    setIsSelected((prev) => !prev);
  };

  // cancelling the invite
  const cancelInviteHandler = () => {
    const status = true;
    setHasCancelledInvite(status);
    dispatch(cancelInviteStatus({ inviteIds: [inviteId], status }));
  };

  const undoCancelInviteHandler = () => {
    const status = false;
    setHasCancelledInvite(status);
    dispatch(cancelInviteStatus({ inviteIds: [inviteId], status }));
  };

  // phone handler
  const speakToHandler = () => {
    copyToClipboard(mobileNumber, "Phone Number :");
    if (mobileNumber) window.location.href = `tel:${mobileNumber}`;
  };

  const linkHandler = () => {
    console.log('candidateInvitation :: ', candidateInvitation)
    copyToClipboard(emailInviteLink, "Interview Link :");
  };

  const openChangeTimer = () => {
    console.log('candidateInvitation :: ', candidateInvitation);
    if (modalTriggerRef.current) {
      modalTriggerRef.current.click();
    }
    return;
  };

  // change time handler
  const setValidityHandler = () => {
    dispatch(
      updateInterviewTime({
        inviteId: inviteId,
        startValidityTime: "",
        endValidityTime: "",
      })
    );
  };

  // send reminder
  const sendReminderHandler = () => {
    dispatch(sendReminder({ inviteId: inviteId, inviteStatus: inviteStatus }));
  };

  const actionButtons = [
    {
      className: "btn-interviewlink",
      dataTooltip: "Interview link",
      iconSrc: icon.linkSvgIcon,
      onClick: linkHandler,
    },
    {
      className: "btn-completedtoday",
      dataTooltip: "Change Time",
      iconSrc: icon.timePeriodSvgIcon,
      onClick: openChangeTimer,
    },
    {
      className: "failed-btn",
      dataTooltip: "Cancel invite",
      iconSrc: icon.crossSvgIcon,
      onClick: cancelInviteHandler,
    },
    {
      className: "delivered-btn",
      dataTooltip: "Undo Cancel",
      iconSrc: icon.replyArrowSvgIcon,
      onClick: undoCancelInviteHandler,
    },
    /* {
      className: "btn-success",
      dataTooltip: "Send reminder",
      iconSrc: icon.shareSvgIcon,
    }, */
    {
      className: "next-round-btn",
      dataTooltip: "Next Round Invite",
      iconSrc: icon.doubleArrowRightSvgIcon,
      onClick: handleNextRoundInvite,
    },
  ];


  return (
    <>
      <tr>
        <td>
          <label style={{ float: 'left' }}>
            <input type="checkbox" className="filled-in"
              checked={isSelected}
              onChange={checkboxHandler} />
            <span>&nbsp;</span>
          </label>
        </td>
        <td>
          <p>
            {emailAddress}
            <br />
            {mobileNumber}
          </p>
        </td>
        <td>{inviteStatus}</td>
        <td>
          <NormalButton
            buttonTagCssClasses={getButtonClassName("delivery", whatsappStatus)}
            buttonText={whatsappStatus}
            leftIconSrc={getButtonIcons("delivery", whatsappStatus)}
          />
        </td>

        <td>
          <NormalButton
            buttonTagCssClasses={getButtonClassName("delivery", emailStatus)}
            buttonText={emailStatus}
            leftIconSrc={getButtonIcons("delivery", emailStatus)}
          />
        </td>
        <td>
          <NormalButton
            buttonTagCssClasses={getButtonClassName("linkOpening", linkOpeningStatus)}
            buttonText={linkOpeningStatus}
            leftIconSrc={getButtonIcons("linkOpening", linkOpeningStatus)}
          />
        </td>
        {userType === 'manpower' &&
          <td>
            <NormalButton
              buttonTagCssClasses={'text-capitalize'}
              buttonText={statusUpdate ? manpowerStatuses[parseInt(statusUpdate)] ?? 'Status Update' : 'Status Update'}
            />
          </td>
        }
        <td>
          <NormalButton
            buttonTagCssClasses={getButtonClassName(
              "candidateAction",
              candidateActionStatus
            )}
            buttonText={candidateActionStatus}
            leftIconSrc={getButtonIcons(
              "candidateAction",
              candidateActionStatus
            )}
          />
        </td>
        <td>
          <ul className="rcaction">
            {actionButtons.map((button, index) => (
              <li key={index}>
                <a
                  href={'#'}
                  className={`tooltipped ${button.className}`}
                  data-position={'top'}
                  data-tooltip={button.dataTooltip}
                  onClick={(event) => {
                    event.preventDefault();
                    button.onClick();
                  }}
                >
                  <i>
                    <img src={button.iconSrc} alt={button.alt} />
                  </i>
                </a>
              </li>
            ))}
          </ul>
          <EvuemeModalTrigger modalId={"timePickerModalRow"} ref={modalTriggerRef}>
          </EvuemeModalTrigger>
        </td>
      </tr>

      {/* Modal */}
      <TimePickerModal
        modalId={"timePickerModalRow"}
        initialStartDate={startDate}
        initialEndDate={endDate}
        customTimeHandler={customTimeHandler}
      />
    </>
  );
};

export default InvitedCandidateTableRow;
