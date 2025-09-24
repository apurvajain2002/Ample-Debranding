const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose(); // Close the modal when clicking outside the content area
      }
    };
  
    return (
      <div className="custom-modal-overlay" onClick={handleOverlayClick}>
        <div className="custom-modal-content">
          <button
            className="modal-close waves-effect waves-red btn-flat close-ixon"
            onClick={onClose}
          />
          {children}
        </div>
      </div>
    );
  };
  
  export default CustomModal;