import React, { useEffect, useState } from "react";
import EvuemeModal from "../../components/modals/evueme-modal";

const AddReceiverModal = ({
  handleAddReciver,
}) => {

  const [person, setPerson] = useState({
    firstName: "",
    LastName: "",
    emailId: "",
    mobileNumber: "",
    whatsappNumber: "",
  });

  const handleChangeReceiver = (key, value) => {
    setPerson({ ...person, [key]: value });
  };

  return (
    <EvuemeModal
      divTagClasses="evuemeModal"
      id="modal3"
      modalId={"addReceiverModal"}
    >
      <div className="modal-content">
        <a
          href="#!"
          className="modal-close waves-effect waves-red btn-flat close-ixon"
        ></a>

        <h4>Add Receiver</h4>
        <div className="full-width">
          <div className="row row-margin">
            <div className="input-field col xl6 l6 m4 s12">
              <input
                placeholder="First Name"
                id="first_name"
                name="firstName"
                type="text"
                className="validate"
                onChange={(e) =>
                  handleChangeReceiver("firstName", e.target.value)
                }
                value={person.firstName}
              />
              <label htmlFor="first_name">
                First Name <span>*</span>
              </label>
            </div>
            <div className="input-field col xl6 l6 m4 s12">
              <input
                placeholder="Last Name"
                id="last_name"
                name="LastName"
                type="text"
                className="validate"
                onChange={(e) =>
                  handleChangeReceiver("LastName", e.target.value)
                }
                value={person.LastName}
              />
              <label htmlFor="first_name">
                Last Name <span>*</span>
              </label>
            </div>
            <div className="input-field col xl6 l6 m4 s12">
              <input
                placeholder="Last Name"
                id="email_id"
                type="text"
                name="emailId"
                className="validate"
                onChange={(e) =>
                  handleChangeReceiver("emailId", e.target.value)
                }
                value={person.emailId}
              />
              <label htmlFor="first_name">
                Email ID <span>*</span>
              </label>
            </div>
            <div className="input-field col xl6 l6 m4 s12">
              <input
                placeholder="Last Name"
                id="Mobile_no"
                type="text"
                name="mobileNumber"
                className="validate"
                onChange={(e) =>
                  handleChangeReceiver("mobileNumber", e.target.value)
                }
                value={person.mobileNumber}
              />
              <label htmlFor="first_name">
                Mobile No. <span>*</span>
              </label>
            </div>
            <div className="input-field col xl6 l6 m4 s12">
              <input
                placeholder="Last Name"
                id="Whatsaap_no"
                type="text"
                className="validate"
                name="whatsappNumber"
                onChange={(e) =>
                  handleChangeReceiver("whatsappNumber", e.target.value)
                }
                value={person.whatsappNumber}
              />
              <label htmlFor="first_name">
                WhatsApp No. <span>*</span>
              </label>
            </div>
            <div className="col xl6 l6 m4 s12">
              <button
                onClick={() => {
                  handleAddReciver(person);
                  setTimeout(() => {
                    setPerson({
                      firstName: "",
                      LastName: "",
                      emailId: "",
                      mobileNumber: "",
                      whatsappNumber: "",
                    })
                  }, 1000);
                }} // Pass person to parent
                className="waves-effect waves-light btn btn-clear btn-submit btn-small btnsmall-tr"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </EvuemeModal>
  );
};

export default AddReceiverModal;
