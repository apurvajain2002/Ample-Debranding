import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import GridselectInputField from "../../components/input-fields/grid-input-select";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeModal from "../../components/modals/evueme-modal";
import M from "materialize-css";
import WarningToast from "../../components/toasts/warning-toast";
import timezones from "../../utils/timezones";
import { updateInterviewTime } from "../../redux/actions/invited-candidates";

const intialDate = {
  day: "",
  month: "",
  year: "",
  hour: "",
  minutes: "",
};

const ValidityModal = ({ onClick = () => {}, selectedCandidates = [] }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(intialDate);
  const [endDate, setEndDate] = useState(intialDate);
  const [timezone, setTimezone] = useState("");

  const dateUTC = (dateObj) => {
    return Date.UTC(
      Number(dateObj.year),
      Number(dateObj.month) - 1,
      Number(dateObj.day),
      Number(dateObj.hour),
      Number(dateObj.minutes)
    );
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate.day || !endDate.day) {
      return { isValid: false, message: "Both start and end dates are required." };
    }

    const startTime = dateUTC(startDate);
    const endTime = dateUTC(endDate);

    if (startTime > endTime) {
      return { isValid: false, message: "Start date cannot be after end date." };
    }

    return { isValid: true, message: "Dates are valid." };
  };

  useEffect(() => {
    M.FormSelect.init(document.querySelectorAll("select"));
  }, [startDate, endDate, timezone]);

  const minutesOptions = Array.from([0, 15, 30, 45], (_, index) => {
      const dayNumber = index;
      const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
      return { optionKey: formattedDay, optionValue: formattedDay };
    });

    const hourOptions = Array.from({ length: 25 }, (_, index) => {
      const dayNumber = index;
      const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
      return { optionKey: formattedDay, optionValue: formattedDay };
    });

    const daysOptions = Array.from({ length: 31 }, (_, index) => {
      const dayNumber = index + 1;
      const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
      return { optionKey: formattedDay, optionValue: formattedDay };
    });

    const monthOptions = [
      { optionKey: "January", optionValue: "01" },
      { optionKey: "February", optionValue: "02" },
      { optionKey: "March", optionValue: "03" },
      { optionKey: "April", optionValue: "04" },
      { optionKey: "May", optionValue: "05" },
      { optionKey: "June", optionValue: "06" },
      { optionKey: "July", optionValue: "07" },
      { optionKey: "August", optionValue: "08" },
      { optionKey: "September", optionValue: "09" },
      { optionKey: "October", optionValue: "10" },
      { optionKey: "November", optionValue: "11" },
      { optionKey: "December", optionValue: "12" },
    ];

  const handleStartDateChange = (e) => {
    const updatedStartDate = { ...startDate, [e.target.name]: e.target.value };
    setStartDate(updatedStartDate);
  };

  const handleEndDateChange = (e) => {
    const updatedEndDate = { ...endDate, [e.target.name]: e.target.value };
    setEndDate(updatedEndDate);
  };

  const handleTimezoneChange = (e) => {
    setTimezone(e.target.value);
  };

  const yearOptions = Array.from({ length: 5 }, (_, index) => {
      const currentYear = new Date().getFullYear();
      const year = currentYear + index;
      return { optionKey: year.toString(), optionValue: year.toString() };
    });

  const handleSetValidity = () => {
  const dateValidity = validateDates(startDate, endDate);

  if (!dateValidity.isValid) {
    return WarningToast(dateValidity.message);
  }

  const startUTC = dateUTC(startDate);
  const endUTC = dateUTC(endDate);
  dispatch(
    updateInterviewTime({
    inviteId: selectedCandidates,
    startValidityTime: new Date(startUTC),
    endValidityTime: new Date(endUTC),
    })
    );
    onClick(new Date(startUTC), new Date(endUTC), timezone);
  };

  return (
    <EvuemeModal divTagClasses="evuemeModal" modalId={"validity"}>
      <div className="row" style={{ height: "40%" }}>
        <div className="col xl12 l12 m12 s12">
          <div className="body-box-body body-bg">
            <h6>Set Interview Link Validity</h6>
            <div className="row">
              <label htmlFor="" className="col m12 label-margin">
                Interview Opening Time
              </label>
              <div className="col xl6 l6 m6 s6 open-select">
                <GridselectInputField
                  options={daysOptions}
                  name="day"
                  onChange={handleStartDateChange}
                  value={startDate?.day}
                />
                <GridselectInputField
                  options={monthOptions}
                  name="month"
                  onChange={handleStartDateChange}
                  value={startDate?.month}
                />
                <GridselectInputField
                  options={yearOptions}
                  name="year"
                  onChange={handleStartDateChange}
                  value={startDate?.year}
                />
              </div>
              <div className="col xl6 l6 m6 s6">
                <div className="row">
                  <div className="col xl6 l6 m6 s6 open-select-right">
                    <GridselectInputField
                      options={hourOptions}
                      name="hour"
                      onChange={handleStartDateChange}
                      value={startDate?.hour}
                    />
                    <span>:</span>
                    <GridselectInputField
                      options={minutesOptions}
                      name="minutes"
                      onChange={handleStartDateChange}
                      value={startDate?.minutes}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <label htmlFor="" className="col m12 label-margin">
                Interview Closing Time
              </label>
              <div className="col xl6 l6 m6 s6 open-select">
                <GridselectInputField
                  options={daysOptions}
                  name="day"
                  onChange={handleEndDateChange}
                  value={endDate?.day}
                />
                <GridselectInputField
                  options={monthOptions}
                  name="month"
                  onChange={handleEndDateChange}
                  value={endDate?.month}
                />
                <GridselectInputField
                  options={yearOptions}
                  name="year"
                  onChange={handleEndDateChange}
                  value={endDate?.year}
                />
              </div>
              <div className="col xl6 l6 m6 s6">
                <div className="row">
                  <div className="col xl6 l6 m6 s6 open-select-right">
                    <GridselectInputField
                      options={hourOptions}
                      name="hour"
                      onChange={handleEndDateChange}
                      value={endDate?.hour}
                    />
                    <span>:</span>
                    <GridselectInputField
                      options={minutesOptions}
                      name="minutes"
                      onChange={handleEndDateChange}
                      value={endDate?.minutes}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <label htmlFor="" className="col m12 label-margin">
                Time Zone
              </label>
              <div className="input-field col m12">
                <GridselectInputField
                  options={timezones}
                  onChange={handleTimezoneChange}
                  value={timezone}
                />
              </div>
              <NormalButton
                href="#"
                buttonTagCssClasses="btn btn-clear btn-submit modal-close"
                buttonText={"Set Validity"}
                onClick={handleSetValidity}
              />
            </div>
          </div>
        </div>
      </div>
    </EvuemeModal>
  );
};

export default ValidityModal;