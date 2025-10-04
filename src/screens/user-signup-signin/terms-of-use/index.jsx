import React, { useEffect, useState } from "react";
import NormalButton from "../../../components/buttons/normal-button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";
// import { useLocation } from "react-router-dom";
import EvuemeModal from "../../../components/modals/evueme-modal";
import EvuemeModalTrigger from "../../../components/modals/evueme-modal-trigger";
import M from "materialize-css";
import WarningToast from "../../../components/toasts/warning-toast";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setTnCStatus } from "../../../redux/slices/signin-slice";
import RadioButtonInputField from "../../../components/input-fields/radio-button-input-field";
import SuccessToast from "../../../components/toasts/success-toast";
import Cookies from "js-cookie";
import { baseUrl } from "../../config/config";

const DisagreementReason2 = ({ onClose = () => { } }) => {
  const [reason, setReason] = useState("");
  return (
    <EvuemeModal modalId="disagreementModal">
      <h4>Feedback</h4>
      <p>You are valuable to us. Please give your reasons for disagreement.</p>
      <div className="input-field col s12">
        <textarea
          id="textarea1"
          className="materialize-textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason for disagreement"
        ></textarea>
      </div>
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn-large btn-reject btn-display"
        onClick={() => onClose(reason)}
        buttonText={"Submit"}
      />
    </EvuemeModal>
  );
};

const TermsOfUse = () => {
  const dispatch = useDispatch();
  const { userId, tncStatus } = useSelector((state) => state.signinSliceReducer);
  const [reason, setReason] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [disagreement, setDisagreement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!agreement && !disagreement)
      return WarningToast("Please select agreement choice!");
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      // Ensure we have a valid token before making the API call
      const token = localStorage.getItem("e_access_token") || Cookies.get("e_access_token");
      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      console.log("Submitting TNC acceptance with:", {
        userId,
        agreement,
        reason,
        token: token.substring(0, 20) + "..."
      });

      const { data } = await axiosInstance.post(
        `${baseUrl}/common/user/accept-tnc`,
        {
          id: userId,
          tncStatus: agreement,
          tncDismissText: reason,
        }
      );
      
      console.log("TNC acceptance response:", data);
      
      if (data.success || data.status) {
        if (agreement) {
          // Update TNC status in Redux and localStorage
          console.log("Updating TNC status in Redux");
          dispatch(setTnCStatus({ userId: userId, tncStatus: true }));
          
          // Show success message
          SuccessToast("Terms and Conditions accepted successfully!");
          
          // Small delay to ensure state is updated before navigation
          setTimeout(() => {
            console.log("Navigating to dashboard");
            navigate("/admin/candidate-video-answers");
          }, 500);
        } else {
          dispatch(setLogout());
          navigate("/login");
        }
      } else {
        throw new Error("Unable to submit TNC acceptance!");
      }
    } catch (error) {
      console.error("TNC acceptance error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to accept terms and conditions";
      ErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (tncStatus) {
      SuccessToast("Terms and Conditions already agreed.");
      navigate("/admin/candidate-video-answers");
    } else if (!userId) {
      navigate("/admin/candidate-video-answers");
    }
    M.AutoInit();
  });

  return (
    <>
      <div className="container container-tearms-condition">
        <div className="terms-condition-wr">
          <header>
            <h3>Terms of use</h3>
            <span className="terms-click"></span>
          </header>
          <div className="trc-body" >
            <div className="trcbody-inner" >
              <h3>Terms and Conditions for Digital Interview Participation</h3>
              <h4>Introduction</h4>
              <p>
                By registering on the EvueMe AI platform and participating in a
                Digital Interview assessment, you (the "Candidate") agree to the
                following terms and conditions. If you do not agree with any of
                these terms, please exit the registration process and contact
                your assessment/ hiring representative of the company.
              </p>
              <h4>1. Consent to Participate:</h4>
              <p>
                You acknowledge and agree to participate in a Digital Interview
                assessment using EvueMe’s AI platform. Your participation is
                entirely voluntary, and you are free to discontinue at any
                point.
              </p>
              <h4>2. Data Collection and Recording:</h4>
              <p>
                You acknowledge that during the assessment, the following may be
                recorded:
              </p>
              <ul>
                <li>
                  • <b>Video and audio:</b> Your image and voice may be captured
                  and stored.
                </li>
                <li>
                  • <b>interactions:</b> Any screen activity (if applicable)
                  during the interview may also be recorded.
                </li>
              </ul>
              <h4>3. Use of Collected Data:</h4>
              <p>
                By consenting to participate, you grant EvueMe and its clients
                (the Company for which you are being interviewed)
                the right to collect, store, process, and use
                your data for the purpose of assessing your suitability for the
                position you are interviewing for. This includes:
              </p>
              <ul>
                <li>• Analyzing your video and audio responses.</li>
                <li>
                  • Evaluating any technical or behavioral skills demonstrated
                  during the interview.
                </li>
                <li>
                  • Sharing the assessment data with the company and relevant third parties involved in
                  the recruitment process, subject to applicable data protection laws and the privacy
                  policies of the company.
                </li>
              </ul>
              <h4>4. Transfer of Rights:</h4>
              <p>
                You hereby transfer to EvueMe all rights, title, and interest in the content created from the
                Digital Interview assessment, including video recordings, for use in the recruitment process.
                This includes the right to store, process, and share this data with the company and their
                representatives as necessary.
              </p>
              <h4>5. Data Privacy and Compliance:</h4>
              <p>
                EvueMe and its Client will handle your data in compliance with all applicable data privacy
                laws, including, but not limited to, the General Data Protection Regulation (GDPR), as well as
                any other relevant local laws. Your data will be stored and processed securely in accordance
                with our Privacy Policy.
              </p>
              <p>You retain the right to:</p>
              <ul>
                <li>• Request access to your personal data.</li>
                <li>
                  • Request the correction or deletion of your data, subject to
                  legal and regulatory retention requirements.
                </li>
                <li>
                  • Withdraw your consent at any time. However, withdrawing
                  consent may impact your ability to continue in the recruitment
                  process.
                </li>
              </ul>
              <h4>6. Waiver of Claims:</h4>
              <p>
                By agreeing to these terms, you waive any right to make claims or demands, or bring any
                legal action, against EvueMe or its client concerning:
              </p>
              <ul>
                <li>
                  • The collection and use of your video, audio, and any other
                  assessment-related data.
                </li>
                <li>
                  • The transfer or processing of your data as described in
                  these terms.
                </li>
                <li>
                  • Any outcome of the assessment, including hiring decisions.
                </li>
              </ul>
              <h4>7. Entire Agreement:</h4>
              <p>
                This document constitutes the entire agreement between you and EvueMe regarding your
                participation in the Digital Interview assessment and the handling of your data.
              </p>
              <h4>Important:</h4>
              <p>
                If you do not agree to these terms and conditions, please exit the assessment process
                immediately and contact your assessment/ hiring representative of the company for further
                assistance.
              </p>
            </div>
            <footer className="trc-footer">
              <RadioButtonInputField
                labelText={"I agree to the above Terms & Conditions"}
                onChange={() => {
                  setAgreement(true);
                  setDisagreement(false);
                }}
                radioButtonValue={true}
                value={agreement}
              />
              <EvuemeModalTrigger
                modalId={"disagreementModal"}
                onClick={() => {
                  setDisagreement(true);
                  setAgreement(false);
                }}
              >
                <RadioButtonInputField
                  value={disagreement}
                  radioButtonValue={true}
                  labelText={"I Disagree"}
                />
              </EvuemeModalTrigger>
              <div className="btn-footwr">
                <NormalButton
                  buttonText={isSubmitting ? "Processing..." : "Proceed"}
                  buttonTagCssClasses={
                    "waves-effect waves-light btn btn-clear btn-submit"
                  }
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                />
              </div>
            </footer>
          </div>
        </div>
        <DisagreementReason2
          onClose={(reason) => {
            setReason(reason);
          }}
        />
      </div>
    </>
  );
};

export default TermsOfUse;
