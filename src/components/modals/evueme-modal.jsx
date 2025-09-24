import React, { useEffect, useRef } from "react";

const EvuemeModal = ({
  children,
  modalId,
  divTagClasses,
  modalClasses='',
  onClose = () => {},
}) => {
  const modalRef = useRef(null);

  const onModalClose = (event) => {
event.preventDefault();
onClose();
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div id={modalId}  className={`modal ${modalClasses}`} ref={modalRef}>
      <a
        href="#!"
        className="modal-close waves-effect waves-red btn-flat close-ixon"
        onClick={onModalClose}
      ></a>
      <div className={`modal-content ${divTagClasses} `}  >{children}</div>
    </div> 
  );
};

export default EvuemeModal;
