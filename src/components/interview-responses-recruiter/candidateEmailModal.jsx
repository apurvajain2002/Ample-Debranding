import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { icon } from "../assets/assets";
import EvuemeModal from "../modals/evueme-modal";
import NormalButton from "../buttons/normal-button";
import SelectInputField from "../input-fields/select-input-field";
import SuccessToast from "../toasts/success-toast";
import { optionMapper } from "../../utils/optionMapper";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../modals/custom-modal";

import {
  fetchTemplate,
  fetchTemplateNames,
  sendInvite,
} from "../../redux/actions/invite-candidates";

const CandidateEmailModal = ({ onClose, onOpen, candidateRowIndex }) => {
  const dispatch = useDispatch();
  const [emailTemplate, setEmailTemplate] = useState("");

  const { successMessage, failMessage, template, templateNames, candidates } =
    useSelector((state) => state.inviteCandidatesSliceReducer);
  const { selectedJobId, selectedRoundId, selectedQuestionsResponse } =
    useSelector(
      (state) => state.interviewResponsesRecruiterDashboardSliceReducer
    );
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

  const handleEmailTemplateChange = (e) => {
    setEmailTemplate(e.target.value);
  };

  const handleSaveEmail = () => {
    const selectedCandidateInfo =
      selectedQuestionsResponse[candidateRowIndex]["applicant"];
    const details = {
      jobId: selectedJobId,
      interviewRoundName: selectedRoundId,
      emailTemplate: template,
      whatsappTemplate: "",
      candidateInfo: [
        {
          index: "1",
          firstName: selectedCandidateInfo["firstName"],
          lastName: selectedCandidateInfo["lastName"],
          primaryMailId: selectedCandidateInfo["primaryEmailId"],
          secondaryMailId: selectedCandidateInfo["secondaryEmailId"],
          whatsappNumber: "",
          primaryPhoneNumber: "",
          secondaryPhoneNumber: "",
        },
      ],
      interviewExpirationDate: "",
      mandateFullScreen: false,
      sendLater: false,
      mailSendingTime: "",
      timezone: "Asia/Kolkata",
      receivers: [],
      redirectLink: "",
    };
    dispatch(sendInvite(details));
    SuccessToast("Email sent");
    setEmailTemplate("");
  };

  useEffect(() => {
    if (emailTemplate) {
      dispatch(fetchTemplate(emailTemplate));
    }
  }, [emailTemplate]);

  useEffect(() => {
    // api call to get all templates

    dispatch(fetchTemplateNames());
    return () => {
      setEmailTemplate("");
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
            <img src={icon.emailAddressIconShare} />
          </i>{" "}
          Send Email to candidate
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
              onChange={handleEmailTemplateChange}
            />
          </div>
          <div className="input-field input-field-modal">
            <div
              className="message-preview candidate-boxscroll"
              style={{ height: "300px" }}
            >
              <div className={"media-file-preview"}>
                <div>{template}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit modal-close"
        onClick={() => handleSaveEmail()}
        buttonText={"Send"}
      />
    </CustomModal>
  );
};
export default CandidateEmailModal;
