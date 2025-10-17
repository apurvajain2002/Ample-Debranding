import NormalButton from "../../../../components/buttons/normal-button";
import { icon } from "../../../../components/assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInterviewStatus } from "../../../../redux/slices/interview-slice";



const interviewLinkMap = {
    notstarted: {
        icon: icon.sandClockFullLineIcon,
        text: "Start Interview",
        css: "btn-interview-start"
    },
    started: {
        icon: icon.pendingIcon,
        text: "Resume Interview",
        css: 'btn-interview-resume'
    }
}
const interviewLinkMapButton = {
    notstarted: {
        icon: icon.sandClockFullLineIcon,
        text: "Start Interview",
        css: "btn-interview-start"
    },
    started: {
        icon: icon.pendingIcon,
        text: "Resume Interview",
        css: 'btn-interview-resume'
    },
    completed: {
        icon: icon.pendingIcon,
        text: "Completed Interview",
        css: 'btn-interview-completed'
    }
}

const interviewStatusMap = {
    notstarted: {
        icon: icon.sandClockFullLineIcon,
        text: "Not Started",
        css: 'btn-interview-not-started'
    },
    started: {
        icon: icon.pendingIcon,
        text: "Started",
        css: 'btn-interview-started'
    },
    completed: {
        icon: icon.completeIcon,
        text: "Completed",
        css: 'btn-interview-completed'
    }

}

const interviewResultMap = {
    joined: { icon: icon.addMaleUserIcon, text: "Joined", css: "btn-interview-result-joined" },
    offered: { icon: icon.giftHandPresentIcon, text: "Offered", css: "btn-interview-result-offered" },
    l3shortlisted: { icon: icon.completeIcon, text: "L3 Shortlisted", css: "btn-interview-result-l3shortlisted" },
    l2shortlisted: { icon: icon.completeIcon, text: "L2 Shortlisted", css: "btn-interview-result-l2shortlisted" },
    l1shortlisted: { icon: icon.completeIcon, text: "L1 Shortlisted", css: "btn-interview-result-l1shortlisted" },
    hrshortlisted: { icon: icon.completeIcon, text: "HR Shortlisted", css: "btn-interview-result-hrshortlisted" },
    waitlisted: { icon: icon.clockIcon, text: "Waitlisted", css: "btn-interview-result-waitlisted" },
    notselected: { icon: icon.rejectedIcon, text: "Not Selected", css: "btn-interview-result-notselected" }
}

const candidateActionColorMap = {
    notinterested: {
        icon: icon.accessDeniedForbiddenIcon,
        css: "btn-notinterested btn-candidateaction",
    },
    startinterview: {
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

const linkOpeningMap = {
    whatsapp: {
        icon: icon.whatsappIconInvitedCandidate,
        css: "btn-linkopening",
    },
    email: { icon: icon.emailInvitationInviteIcon, css: "email-btn" },
    publiclink: { icon: icon.linkIcon, css: "publiclink-btn" },
    login: { icon: icon.musicSwitchOnOffButtonIcon, css: "login-btn" },
};

const defaultBtnClassName =
    "btn-status btn-textleft mb2 centered-btn soft-round-btn";

// const defaultBtnClassName =
//   " btn-status";

const UserInterviewTableRow = ({ userData, index }) => {
    const dispatch = useDispatch();
    //   const getButtonClassName = (map, status = "") => {
    //     status = status?.replace(/\s+/g, "").toLowerCase().toLowerCase();
    //     let css = "";
    //     if (map === "delivery") {
    //       css = deliveryMap[status]?.css || "";
    //     } else if (map === "linkOpening") {
    //       css = linkOpeningMap[status]?.css || "";
    //     } else if (map === "candidateAction") {
    //       css = candidateActionColorMap[status]?.css || "";
    //     } else {
    //       css = `${recruiterActionMap[status]?.css} tooltipped` || "";
    //     }
    //     return `${defaultBtnClassName} ${css}`;
    //   };

    // icons for buttons
    const getButtonIcons = (map, status = "") => {
        // Handle null or undefined status
        if (!status || status === null || status === undefined) {
            if (map === "status") return interviewStatusMap["notstarted"]?.icon;
            if (map === "result") return interviewResultMap["waitlisted"]?.icon || null;
            return null;
        }
        
        status = status?.replace(/\s+/g, "").toLowerCase().trim();
        if (map === "interviewLink") return interviewLinkMap[status]?.icon;
        else if (map === "status") return interviewStatusMap[status]?.icon || interviewStatusMap["notstarted"]?.icon;
        else if (map === "result")
            return interviewResultMap[status]?.icon || interviewResultMap["waitlisted"]?.icon;
        return recruiterActionMap[status]?.icon;
    };

    const getButtonText = (map, status = "") => {
        // Handle null or undefined status
        if (!status || status === null || status === undefined) {
            if (map === "status") return "Not Started";
            if (map === "result") return "Awaiting Interview";
            return "";
        }
        
        status = status?.replace(/\s+/g, "").toLowerCase().trim();
        console.log("status" + status);
        if (map === "interviewLink") return interviewLinkMap[status]?.text;
        else if (map === "status") return interviewStatusMap[status]?.text || "Not Started";
        else if (map === "result")
            return interviewResultMap[status]?.text || "Awaiting Interview";
        return recruiterActionMap[status]?.text;
    };
    const getButtonClassName = (map, status = "") => {
        // Handle null or undefined status
        if (!status || status === null || status === undefined) {
            if (map === "status") return `${defaultBtnClassName} ${interviewStatusMap["notstarted"]?.css || ""}`;
            if (map === "result") return `${defaultBtnClassName} ${interviewResultMap["waitlisted"]?.css || ""}`;
            return defaultBtnClassName;
        }
        
        status = status?.replace(/\s+/g, "").toLowerCase().toLowerCase();
        let css = "";
        if (map === "interviewLink") {
            css = interviewLinkMapButton[(status).toLowerCase()]?.css || "";
        } else if (map === "status") {
            css = interviewStatusMap[status]?.css || interviewStatusMap["notstarted"]?.css || "";
        } else if (map === "result") {
            css = interviewResultMap[status]?.css || interviewResultMap["waitlisted"]?.css || "";
        } else {
            css = `${interviewLinkMap[status]?.css} tooltipped` || "";
        }
        return `${defaultBtnClassName} ${css}`;
    };
    const navigate = useNavigate();
    const startTime = userData.startValidityTime?.slice(0, 10) + "\n" + userData.startValidityTime?.slice(11, 16) + " Hrs";
    const endTime = userData.endValidityTime?.slice(0, 10) + "\n" + userData.endValidityTime?.slice(11, 16) + " Hrs";
    const userInterviewStatus = userData.interviewStatus || 'notstarted'
    console.log("userInterviewStatus",userInterviewStatus);
    
    return (
        <tr>
            <td>{userData.businessName}</td>
            <td>{userData.positionName}</td>
            <td>{userData.vacancyLocation}</td>
            <td>{userData.minCtc} - {userData.maxCtc} LPA</td>
            <td>{userData.interviewRounds}</td>
            <td >{startTime}</td>
            <td >{endTime}</td>
            <td>
                <div className="flex-start manage-masters-table-row">
                    <NormalButton
                        buttonTagCssClasses={getButtonClassName("interviewLink", userInterviewStatus)}
                        buttonText={getButtonText("interviewLink", userInterviewStatus)}
                        leftIconSrc={getButtonIcons("interviewLink", userInterviewStatus)}
                        onClick={() => {
                            console.log(userData,userInterviewStatus);
                            // Update userInterviewStatus in Redux before navigation
                            dispatch(setUserInterviewStatus(userInterviewStatus));
                            
                            // Add status as URL parameter to ensure it's available immediately
                            const url = new URL(userData.interviewLink);
                            // url.searchParams.set('status', userInterviewStatus);
                            window.open(url.toString(), '_blank');
                        }}
                        disabled={(userInterviewStatus).toLowerCase() === 'completed'}
                    />
                </div>
            </td>
            <td>
                <div className="flex-start manage-masters-table-row">
                    {/* <Link to="/user/device-checking">
          </Link> */}
                    <NormalButton
                        buttonTagCssClasses={getButtonClassName(
                            "status",
                            userData.interviewStatus
                        )}
                        buttonText={getButtonText("status", userData.interviewStatus)}
                        // onClick={() => navigate("/interview/language-selection")}
                        leftIconSrc={getButtonIcons("status", userData.interviewStatus)}
                    />
                </div>
            </td>
            <td>
                {
                    <div className="flex-start manage-masters-table-row">
                        {/* userData.candidateResult && <div className="flex-start manage-masters-table-row"> */}
                        <NormalButton
                            buttonTagCssClasses={getButtonClassName(
                                "result",
                                userData.candidateResult
                            )}
                            buttonText={getButtonText("result", userData.candidateResult)}
                            leftIconSrc={getButtonIcons("result", userData.candidateResult)}
                        />
                    </div>
                }
            </td>
        </tr>
    );
};
export default UserInterviewTableRow;
