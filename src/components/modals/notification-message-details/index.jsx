import EvuemeModal from "../evueme-modal";
import styles from './style.module.css'

const NotificationMsgDetails = ({
    content,
}) => {

    return (
        <EvuemeModal
            divTagClasses={`evuemeModal ${styles['notification-msg-content-details']}`}
            id="notificationMsgDetailsModal"
            modalId={"notificationMsgDetailsModal"}
        >
            {content &&
                <div
                    className={`media-file-preview ${styles['notification-msg-details-modal']}`}
                    dangerouslySetInnerHTML={{
                        __html: (content),
                    }}
                />
            }
        </EvuemeModal>
    );
};

export default NotificationMsgDetails;