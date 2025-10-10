import EvuemeModal from "../evueme-modal";
import styles from './style.module.css'

const NotificationMsgDetails = ({
    content,
}) => {
    const processContent = (htmlContent) => {
        if (!htmlContent) return '';

        let processedContent = htmlContent
            .replace(/\\n/g, '\n')
            .replace(/\n/g, ' ') // Replace newlines with spaces instead of <br>
            .trim();

        // Remove all <br> tags completely
        processedContent = processedContent.replace(/<br\s*\/?>/gi, ' ');

        // Clean up multiple spaces
        processedContent = processedContent.replace(/\s+/g, ' ');

        // Remove margin from text-align center divs
        processedContent = processedContent.replace(
            /<div\s+style="text-align:\s*center;\s*margin:\s*20px\s+0;"/gi,
            '<div style="text-align: center; display:flex; justify-content: center; align-items: center;"'
        );

        // Disable all anchor tags by removing href and adding disabled styling
        processedContent = processedContent.replace(
            /<a\s+([^>]*?)href\s*=\s*["'][^"']*["']([^>]*?)>/gi,
            (match, beforeHref, afterHref) => {
                // Remove href attribute and add disabled styling while preserving existing styles
                const existingStyle = match.match(/style\s*=\s*["']([^"']*)["']/i);
                let newStyle = "pointer-events: none; background-color: #fff; position: relative; cursor: default; left:-476px;";
                
                if (existingStyle) {
                    // Preserve existing styles and add disabled styles
                    newStyle = existingStyle[1] + "; " + newStyle;
                }
                
                return `<a ${beforeHref}${afterHref} style="${newStyle}" disabled>`;
            }
        );

        if (!processedContent.startsWith('<')) {
            processedContent = `<div>${processedContent}</div>`;
        }
        
        return processedContent;
    };

    return (
        <EvuemeModal
            divTagClasses={`evuemeModal ${styles['notification-msg-content-details']}`}
            id="notificationMsgDetailsModal"
            modalId={"notificationMsgDetailsModal"}
        >
            {content &&
                <div
                    className={`${styles['notification-msg-details-modal']} ${styles['message-content']}`}
                    dangerouslySetInnerHTML={{
                        __html: processContent(content),
                    }}
                />
            }
        </EvuemeModal>
    );
};

export default NotificationMsgDetails;