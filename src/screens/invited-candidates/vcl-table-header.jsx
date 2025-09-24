import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NormalButton from "../../components/buttons/normal-button";
import { icon } from "../../components/assets/assets";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { cancelInviteStatus, updateInterviewTime } from "../../redux/actions/invited-candidates";
import ValidityModal from "../../screens/invite-link/validityModal";
import TimePickerModal from "../../components/modals/time-picker-modal";
import { useRef, useState } from "react";
import SuccessToast from "../../components/toasts/success-toast";

const VCPLHeader = ({
  selectedCandidates = [],
  setSelectedCandidates = () => { },
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDisabled = selectedCandidates.length === 0;
  const disabledButtonClassName = isDisabled ? "disabled-btn" : "";
  const modalTriggerRef = useRef(null);

  // send selected candidates to next round
  const nextRoundHandler = () => {
    if (isDisabled) return;
    navigate("/admin/invite-candidates?type=invited-candidates");
  };

  // change time of selected candidates
  const changeTimeHandler = () => {
    if (isDisabled) return;
    if (modalTriggerRef.current) {
      modalTriggerRef.current.click();
    }
  };

  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  const [timezone, setTimezone] = useState("");

  // Convert time object to UTC date string
  const convertTimeToUTCString = (timeObj) => {
    const { day, month, year, hour, minute } = timeObj;
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    return date.toISOString();
  };

  const customTimeHandler = (timeObj) => {
    setStartDate(() => {
      return {
        minute: Number(timeObj.interviewOpeningTiming.minute),
        hour: Number(timeObj.interviewOpeningTiming.hour),
        day: Number(timeObj.interviewOpeningTiming.day),
        month: Number(timeObj.interviewOpeningTiming.month),
        year: Number(timeObj.interviewOpeningTiming.year),
      };
    });
    setEndDate(() => {
      return {
        minute: Number(timeObj.interviewExpirationTiming.minute),
        hour: Number(timeObj.interviewExpirationTiming.hour),
        day: Number(timeObj.interviewExpirationTiming.day),
        month: Number(timeObj.interviewExpirationTiming.month),
        year: Number(timeObj.interviewExpirationTiming.year),
      };
    });
    setTimezone(() => timeObj.timezone);

    // Convert to UTC strings for API
    const startValidityTime = convertTimeToUTCString(timeObj.interviewOpeningTiming);
    const endValidityTime = convertTimeToUTCString(timeObj.interviewExpirationTiming);

    // Call the API to update interview time for all selected candidates in a single call
    dispatch(
      updateInterviewTime({
        inviteId: selectedCandidates,
        startValidityTime: startValidityTime,
        endValidityTime: endValidityTime,
      })
    );

    // Show success message
    SuccessToast("Interview time updated successfully!");
    
    // Clear selected candidates
    setSelectedCandidates([]);
  };

  // cancel invitation of selected candidates
  const cancelInvitationHandler = (status) => {
    if (isDisabled) return;
    dispatch(
      cancelInviteStatus({
        inviteIds: selectedCandidates,
        status: status,
      })
    );
    setSelectedCandidates([]);
  };

  return (
    <>
      <div className="tableheader-border">
        <div className="row row-margin">
          <div className="col xl4 l4 m4 s12">
            <input type="Search" class="tableheader-search" />
            <NormalButton
              buttonTagCssClasses={`waves-effect waves-light btn btn-clear btn-submit btn-small noborder`}
              buttonText="Clear"
            />
          </div>
          <div className="xl8 l8 m8 s12 right-align mobile-margin">
            {/* <NormalButton
              buttonTagCssClasses={`btn waves-effect waves-light btn-success navyblue-btn ${disabledButtonClassName} btn-m1`}
              buttonText="Next Round"
              onClick={nextRoundHandler}
              // leftIconSrc={icon.doubleArrowRightIcon}
              // disabled={isDisabled}
            /> */}
            {/* <EvuemeModalTrigger
              modalId={"validity"}
              onClick={changeTimeHandler}
            // disabled={isDisabled}
            > */}
            <NormalButton
              buttonTagCssClasses={`btn waves-effect waves-light btn-success navyblue-btn ${disabledButtonClassName} btn-m1`}
              buttonText="Change Time"
              onClick={changeTimeHandler}
            // leftIconSrc={icon.timePeriodIcon}
            // disabled={isDisabled}
            />
            {/* </EvuemeModalTrigger> */}

            <EvuemeModalTrigger modalId={"timePickerModal"} ref={modalTriggerRef}></EvuemeModalTrigger>

            <NormalButton
              buttonTagCssClasses={`btn waves-effect waves-light btn-success navyblue-btn ${disabledButtonClassName} btn-m1`}
              buttonText="Cancel Invitation"
              onClick={() => cancelInvitationHandler(true)}
              // leftIconSrc={icon.crossIconInvitedCandidate}
              // disabled={isDisabled}
              style={{ width: '150px' }}
            />

            <NormalButton
              buttonTagCssClasses={`btn waves-effect waves-light btn-success navyblue-btn ${disabledButtonClassName} btn-m1`}
              buttonText="Undo Cancel"
              onClick={() => cancelInvitationHandler(false)}
            // leftIconSrc={icon.replyArrowIcon}
            // disabled={isDisabled}
            />
          </div>
        </div>
      </div>
      <ValidityModal
        selectedCandidates={selectedCandidates}
        onClick={changeTimeHandler}
      />
      <TimePickerModal
        modalId={"timePickerModal"}
        initialStartDate={startDate}
        initialEndDate={endDate}
        customTimeHandler={customTimeHandler}
      />
    </>
  );
};

export default VCPLHeader;
