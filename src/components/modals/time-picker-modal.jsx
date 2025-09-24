import React, { useEffect, useState } from "react";
import EvuemeModal from "../../components/modals/evueme-modal";
import WarningToast from "../../components/toasts/warning-toast";
import timezones from "../../utils/timezones";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TimePickerModal = ({
  initialStartDate,
  initialEndDate,
  customTimeHandler,
  modalId = "timePickerModal",
}) => {
  // Get current IST time
  const getCurrentISTTime = () => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    
    return {
      day: istTime.getUTCDate(),
      month: istTime.getUTCMonth() + 1,
      year: istTime.getUTCFullYear(),
      hour: istTime.getUTCHours(),
      minute: istTime.getUTCMinutes(),
    };
  };

  // Get two days from now in IST
  const getTwoDaysFromNowIST = () => {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000)); // Add 2 days
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(twoDaysFromNow.getTime() + istOffset);
    
    return {
      day: istTime.getUTCDate(),
      month: istTime.getUTCMonth() + 1,
      year: istTime.getUTCFullYear(),
      hour: 22, // Set to 10 PM
      minute: 0,
    };
  };

  const currentISTTime = getCurrentISTTime();
  const twoDaysFromNowIST = getTwoDaysFromNowIST();

  const [interviewData, setInterviewData] = useState({
    interviewOpeningTiming: {
      day: currentISTTime.day,
      month: currentISTTime.month,
      year: currentISTTime.year,
      hour: currentISTTime.hour.toString(),
      minute: currentISTTime.minute.toString(),
    },
    interviewExpirationTiming: {
      day: twoDaysFromNowIST.day,
      month: twoDaysFromNowIST.month,
      year: twoDaysFromNowIST.year,
      hour: twoDaysFromNowIST.hour.toString(),
      minute: twoDaysFromNowIST.minute.toString(),
    },
    timezone: "UTC+05:30 Indian Standard Time",
  });
  const [yearsArray, setYearsArray] = useState([]);

  const handleSelectChange = (section, e) => {
    if (e.target.name === "timezone") {
      setInterviewData({
        ...interviewData,
        [e.target.name]: e.target.value,
      });
    } else {
      setInterviewData({
        ...interviewData,
        [section]: {
          ...interviewData[section],
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  useEffect(() => {
    setInterviewData((prev) => {
      return {
        ...prev,
        interviewOpeningTiming: {
          day: prev.interviewOpeningTiming.day || initialStartDate?.day || currentISTTime.day,
          month:
            prev.interviewOpeningTiming.month || initialStartDate?.month || currentISTTime.month,
          year:
            prev.interviewOpeningTiming.year || initialStartDate?.year || currentISTTime.year,
          hour:
            prev.interviewOpeningTiming.hour || initialStartDate?.hour || currentISTTime.hour.toString(),
          minute:
            prev.interviewOpeningTiming.minute ||
            initialStartDate?.minute ||
            currentISTTime.minute.toString(),
        },
        interviewExpirationTiming: {
          day: prev.interviewExpirationTiming.day || initialEndDate?.day || twoDaysFromNowIST.day,
          month:
            prev.interviewExpirationTiming.month || initialEndDate?.month || twoDaysFromNowIST.month,
          year:
            prev.interviewExpirationTiming.year || initialEndDate?.year || twoDaysFromNowIST.year,
          hour:
            prev.interviewExpirationTiming.hour || initialEndDate?.hour || twoDaysFromNowIST.hour.toString(),
          minute:
            prev.interviewExpirationTiming.minute ||
            initialEndDate?.minute ||
            twoDaysFromNowIST.minute.toString(),
        },
        timezone: prev.timezone || "UTC+05:30 Indian Standard Time",
      };
    });
  }, [initialStartDate, initialEndDate]);

  const validateTime = (time) => {
    const { interviewOpeningTiming, interviewExpirationTiming, timezone } =
      time;
    for (const [key, value] of Object.entries(interviewOpeningTiming)) {
      if (!value) {
        return `Opening timing ${key} is missing.`;
      }
    }
    for (const [key, value] of Object.entries(interviewExpirationTiming)) {
      if (!value) {
        return `Expiration timing ${key} is missing.`;
      }
    }

    if (!timezone) {
      return "Timezone must be selected.";
    }
    const startDateUTC = Date.UTC(
      Number(interviewOpeningTiming.year),
      Number(interviewOpeningTiming.month),
      Number(interviewOpeningTiming.day),
      Number(interviewOpeningTiming.hour),
      Number(interviewOpeningTiming.minute)
    );
    const closeDateUTC = Date.UTC(
      Number(interviewExpirationTiming.year),
      Number(interviewExpirationTiming.month),
      Number(interviewExpirationTiming.day),
      Number(interviewExpirationTiming.hour),
      Number(interviewExpirationTiming.minute)
    );
    const openingDate = new Date(startDateUTC);
    const expirationDate = new Date(closeDateUTC);

    if (openingDate > expirationDate) {
      return "Opening timing cannot be after Expiration timing.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validity = validateTime(interviewData);
    if (validity) {
      return WarningToast(validity);
    }
    customTimeHandler(interviewData);
  };

  useEffect(() => {
    setYearsArray(() => {
      const curr = new Date().getFullYear();
      return [curr, curr + 1]; // based on the recent bug list, we are showing only 2 years
      // return [curr, curr + 1, curr + 2, curr + 3, curr + 4];
    });
  }, []);

  return (
    <EvuemeModal
      divTagClasses="evuemeModal"
      id="modal4"
      modalId={modalId}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <div className="modal-content">
            <a
              href="#!"
              className="modal-close waves-effect waves-red btn-flat close-ixon"
            ></a>
            <h4>Timing</h4>
            <div className="full-width">
              <div className="row row-margin">
                <div className="row">
                  <label htmlFor="" className="col m12 label-margin">
                    Opening Time
                  </label>
                  <div className="col xl6 l6 m6 s6 open-select">
                    <select
                      name="day"
                      onChange={(e) =>
                        handleSelectChange("interviewOpeningTiming", e)
                      }
                      value={interviewData.interviewOpeningTiming.day}
                    >
                      <option value="" disabled>
                        Day
                      </option>
                      {[...Array(31).keys()].map((day) => {
                        // const dayValue = String(day + 1).padStart(2, "");
                        const dayValue = day + 1;
                        return (
                          <option key={dayValue} value={dayValue}>
                            {dayValue}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      name="month"
                      onChange={(e) =>
                        handleSelectChange("interviewOpeningTiming", e)
                      }
                      value={interviewData.interviewOpeningTiming.month}
                    >
                      <option value="" disabled>
                        Month
                      </option>
                      {months.map((month, index) => {
                        // const monthValue = String(index + 1).padStart(2, "");
                        const monthValue = index + 1;
                        return (
                          <option key={month} value={monthValue}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      name="year"
                      onChange={(e) =>
                        handleSelectChange("interviewOpeningTiming", e)
                      }
                      value={interviewData.interviewOpeningTiming.year}
                    >
                      <option value="" disabled>
                        Year
                      </option>
                      {yearsArray.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col xl6 l6 m6 s6 open-select-right">
                    <select
                      name="hour"
                      onChange={(e) =>
                        handleSelectChange("interviewOpeningTiming", e)
                      }
                      value={interviewData.interviewOpeningTiming.hour}
                    >
                      <option value="" disabled>
                        Hour
                      </option>
                      {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span>:</span>
                    <select
                      name="minute"
                      onChange={(e) =>
                        handleSelectChange("interviewOpeningTiming", e)
                      }
                      value={interviewData.interviewOpeningTiming.minute}
                    >
                      <option value="" disabled>
                        Minute
                      </option>
                      {[...Array(60).keys()].map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <label htmlFor="" className="col m12 label-margin">
                    Expiration Time
                  </label>
                  <div className="col xl6 l6 m6 s6 open-select">
                    <select
                      name="day"
                      onChange={(e) =>
                        handleSelectChange("interviewExpirationTiming", e)
                      }
                      value={interviewData.interviewExpirationTiming.day}
                    >
                      <option value="" disabled>
                        Day
                      </option>
                      {[...Array(31).keys()].map((day) => {
                        // const dayValue = String(day + 1).padStart(2, "");
                        const dayValue = day + 1;
                        return (
                          <option key={dayValue} value={dayValue}>
                            {dayValue}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      name="month"
                      onChange={(e) =>
                        handleSelectChange("interviewExpirationTiming", e)
                      }
                      value={interviewData.interviewExpirationTiming.month}
                    >
                      <option value="" disabled>
                        Month
                      </option>
                      {months.map((month, index) => {
                        // const monthValue = String(index + 1).padStart(2, "");
                        const monthValue = index + 1;
                        return (
                          <option key={month} value={monthValue}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      name="year"
                      onChange={(e) =>
                        handleSelectChange("interviewExpirationTiming", e)
                      }
                      value={interviewData.interviewExpirationTiming.year}
                    >
                      <option value="" disabled>
                        Year
                      </option>
                      {yearsArray.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col xl6 l6 m6 s6 open-select-right">
                    <select
                      name="hour"
                      onChange={(e) =>
                        handleSelectChange("interviewExpirationTiming", e)
                      }
                      value={interviewData.interviewExpirationTiming.hour}
                    >
                      <option value="" disabled>
                        Hour
                      </option>
                      {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span>:</span>
                    <select
                      name="minute"
                      onChange={(e) =>
                        handleSelectChange("interviewExpirationTiming", e)
                      }
                      value={interviewData.interviewExpirationTiming.minute}
                    >
                      <option value="" disabled>
                        Minute
                      </option>
                      {[...Array(60).keys()].map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <label htmlFor="" className="col m12 label-margin">
                    Time Zone
                  </label>
                  <div className="col m12">
                    <select
                      name="timezone"
                      onChange={(e) => handleSelectChange("timezone", e)}
                      value={interviewData.timezone}
                    >
                      <option value="" disabled>
                        Select Time Zone
                      </option>
                      {timezones.map((tz) => (
                        <option key={tz.optionKey} value={tz.optionValue}>
                          {tz.optionValue}
                        </option>
                      ))}
                    </select>
                    <button className="waves-effect waves-light btn btn-clear btn-submit btn-small btnsmall-tr mt-10 modal-close">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </EvuemeModal>
  );
};

export default TimePickerModal;
