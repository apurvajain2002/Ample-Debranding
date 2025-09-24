import { useEffect, useState } from "react";
import { icon } from "../assets/assets";
import NormalButton from "../buttons/normal-button";
import SelectInputField from "../input-fields/select-input-field";
import SuccessToast from "../toasts/success-toast";
import { optionMapper } from "../../utils/optionMapper";
import CustomModal from "../modals/custom-modal";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTemplate,
  fetchTemplateNames,
  sendInvite,
} from "../../redux/actions/invite-candidates";

const CandidateWhatsappModal = ({ onOpen, onClose }) => {
  const dispatch = useDispatch();
  const [whatsappTemplate, setWhatsappTemplate] = useState("");

  const { successMessage, failMessage, template, templateNames, candidates } =
    useSelector((state) => state.inviteCandidatesSliceReducer);

  const templateOptions = [
    {
      optionKey: "Select template",
      optionValue: "",
    },
    ...(templateNames && templateNames.length > 0
      ? templateNames.map((val, index) => ({
          optionKey: `Template ${index + 1}`,
          optionValue: val,
        }))
      : [{ optionKey: "No templates available", optionValue: "" }]),
  ];

  const handleWhatsappTemplateChange = (e) => {
    setWhatsappTemplate(e.target.value);
  };

  const handleSaveWhatsapp = () => {
    SuccessToast("Email sent");
    setWhatsappTemplate("");
  };

  useEffect(() => {
    if (whatsappTemplate) {
      dispatch(fetchTemplate(whatsappTemplate));
    }
  }, [whatsappTemplate]);

  useEffect(() => {
    // api call to get all templates
    dispatch(fetchTemplateNames());
    return () => {
      setWhatsappTemplate("");
    };
  }, []);

  return (
    <CustomModal isOpen={onOpen} onClose={onClose}>
      <div className="col s12 xl6 l6 m6 login-wrap" style={{ width: "100%" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <i>
            <img src={icon.whatsappIconShare} />
          </i>{" "}
          Send Whatsapp to candidate
        </span>
        <div className="email-template-box-inner input-field-">
          <div className="input-field input-field-modal">
            <SelectInputField
              divTagCssClasses="input-field-modal"
              options={optionMapper(
                templateOptions,
                "optionKey",
                "optionValue",
                "Choose Template"
              )}
              onChange={handleWhatsappTemplateChange}
            />
          </div>
          <div className="input-field input-field-modal">
            <div
              className="message-preview candidate-boxscroll"
              style={{ height: "300px" }}
            >
              <div className={"media-file-preview"}>
                <div>{template}</div>
                {/* {emailTemplate && template ? (
                    <div dangerouslySetInnerHTML={{ __html: template }} />
                  ) : (
                    <p>No template selected or template not available.</p>
                  )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit modal-close"
        onClick={() => handleSaveWhatsapp()}
        buttonText={"Send"}
      />
    </CustomModal>
  );
};
export default CandidateWhatsappModal;
