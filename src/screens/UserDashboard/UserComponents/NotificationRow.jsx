import NormalButton from "../../../components/buttons/normal-button";
import { icon } from "../../../components/assets/assets";

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

const defaultBtnClassName = "btn-success btn-textleft btn-linkopening mb2 soft-round-btn";

const NotificationRow = ({ userData, index, onclick }) => {
  // Helper function to get button styling
  const getButtonClassName = (status = "") => {
    status = status?.replace(/\s+/g, "").toLowerCase();
    const css = deliveryMap[status]?.css || "";
    return `${defaultBtnClassName} ${css}`;
  };

  // Helper function to get button icons
  const getButtonIcons = (status = "") => {
    status = status?.replace(/\s+/g, "").toLowerCase();
    return deliveryMap[status]?.icon;
  };

  // Get status based on communication mode
  const getStatus = () => {
    const mode = userData.communicationMode?.toLowerCase();
    if (mode === 'email') {
      return userData.emailStatus || 'sent';
    } else if (mode === 'whatsapp') {
      return userData.whatsappStatus || 'sent';
    }
    return 'sent';
  };

  const status = getStatus();

  return (
    <tr>
      <td>
        {userData.inviteSentTime ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{userData.inviteSentTime.split(' ')[0]}</span>
            <span>{userData.inviteSentTime.substring(userData.inviteSentTime.indexOf(' ') + 1)}</span>
          </div>
        ) : (
          userData.inviteSentTime
        )}
      </td>
      <td>{userData.inviteFrom}</td>
      <td>{userData.communicationMode}</td>
      <td>{userData.messageTo}</td>
      <td>{userData.subjectLine}</td>
      <td>
        <span onClick={onclick} style={{ cursor: 'pointer' }}>
          {'Message Details'}
        </span>
      </td>
      <td>
        <NormalButton
          buttonTagCssClasses={`${getButtonClassName(status)} ${status.toLowerCase() === 'read' ? 'btn-success' : ''}`}
          buttonText={status}
          leftIconSrc={getButtonIcons(status)}
        />
      </td>
    </tr>
  );
};

export default NotificationRow;