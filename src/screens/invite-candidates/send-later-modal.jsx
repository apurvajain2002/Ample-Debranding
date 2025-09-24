import React, { useEffect, useState } from "react";
import Modal from "../../components/modals/modal";
import WarningToast from "../../components/toasts/warning-toast";

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")); // 00 → 59

// const timezones = [
//   {
//     optionKey: "UTC+00:00 Coordinated Universal Time",
//     optionValue: "UTC+00:00 Coordinated Universal Time",
//   },
//   {
//     optionKey: "UTC-05:00 Eastern Standard Time",
//     optionValue: "UTC-05:00 Eastern Standard Time",
//   },
//   {
//     optionKey: "UTC-06:00 Central Standard Time",
//     optionValue: "UTC-06:00 Central Standard Time",
//   },
//   {
//     optionKey: "UTC-07:00 Mountain Standard Time",
//     optionValue: "UTC-07:00 Mountain Standard Time",
//   },
//   {
//     optionKey: "UTC-08:00 Pacific Standard Time",
//     optionValue: "UTC-08:00 Pacific Standard Time",
//   },
//   {
//     optionKey: "UTC+09:00 Japan Standard Time",
//     optionValue: "UTC+09:00 Japan Standard Time",
//   },
//   {
//     optionKey: "UTC+05:30 Indian Standard Time",
//     optionValue: "UTC+05:30 Indian Standard Time",
//   }, // IST
//   {
//     optionKey: "UTC+11:00 Australian Eastern Daylight Time",
//     optionValue: "UTC+11:00 Australian Eastern Daylight Time",
//   },
//   {
//     optionKey: "UTC+13:00 New Zealand Daylight Time",
//     optionValue: "UTC+13:00 New Zealand Daylight Time",
//   },
//   {
//     optionKey: "UTC+01:00 Central European Time",
//     optionValue: "UTC+01:00 Central European Time",
//   },
//   {
//     optionKey: "UTC+02:00 Eastern European Time",
//     optionValue: "UTC+02:00 Eastern European Time",
//   },
//   {
//     optionKey: "UTC+03:00 Moscow Standard Time",
//     optionValue: "UTC+03:00 Moscow Standard Time",
//   },
//   {
//     optionKey: "UTC+03:30 Iran Standard Time",
//     optionValue: "UTC+03:30 Iran Standard Time",
//   },
//   {
//     optionKey: "UTC+04:00 Gulf Standard Time",
//     optionValue: "UTC+04:00 Gulf Standard Time",
//   },
//   {
//     optionKey: "UTC+04:30 Afghanistan Time",
//     optionValue: "UTC+04:30 Afghanistan Time",
//   },
//   {
//     optionKey: "UTC+05:00 Pakistan Standard Time",
//     optionValue: "UTC+05:00 Pakistan Standard Time",
//   },
//   {
//     optionKey: "UTC+06:00 Bangladesh Standard Time",
//     optionValue: "UTC+06:00 Bangladesh Standard Time",
//   },
//   {
//     optionKey: "UTC+07:00 Indochina Time",
//     optionValue: "UTC+07:00 Indochina Time",
//   },
//   {
//     optionKey: "UTC+08:00 China Standard Time",
//     optionValue: "UTC+08:00 China Standard Time",
//   },
//   {
//     optionKey: "UTC+08:00 Western Australian Standard Time",
//     optionValue: "UTC+08:00 Western Australian Standard Time",
//   },
//   {
//     optionKey: "UTC+10:00 Australian Eastern Standard Time",
//     optionValue: "UTC+10:00 Australian Eastern Standard Time",
//   },
//   {
//     optionKey: "UTC+12:00 Fiji Time",
//     optionValue: "UTC+12:00 Fiji Time",
//   },
//   {
//     optionKey: "UTC-01:00 Cape Verde Time",
//     optionValue: "UTC-01:00 Cape Verde Time",
//   },
//   {
//     optionKey: "UTC-02:00 South Georgia Time",
//     optionValue: "UTC-02:00 South Georgia Time",
//   },
//   {
//     optionKey: "UTC-03:00 Argentina Time",
//     optionValue: "UTC-03:00 Argentina Time",
//   },
//   {
//     optionKey: "UTC-04:00 Atlantic Standard Time",
//     optionValue: "UTC-04:00 Atlantic Standard Time",
//   },
//   {
//     optionKey: "UTC+00:00 Greenwich Mean Time",
//     optionValue: "UTC+00:00 Greenwich Mean Time",
//   },
//   {
//     optionKey: "UTC+01:00 West Africa Time",
//     optionValue: "UTC+01:00 West Africa Time",
//   },
//   {
//     optionKey: "UTC+02:00 Central Africa Time",
//     optionValue: "UTC+02:00 Central Africa Time",
//   },
//   {
//     optionKey: "UTC+02:00 South Africa Standard Time",
//     optionValue: "UTC+02:00 South Africa Standard Time",
//   },
//   {
//     optionKey: "UTC+03:00 East Africa Time",
//     optionValue: "UTC+03:00 East Africa Time",
//   },
//   {
//     optionKey: "UTC+03:30 Tehran Time",
//     optionValue: "UTC+03:30 Tehran Time",
//   },
//   {
//     optionKey: "UTC+05:45 Nepal Time",
//     optionValue: "UTC+05:45 Nepal Time",
//   },
//   {
//     optionKey: "UTC+06:30 Myanmar Time",
//     optionValue: "UTC+06:30 Myanmar Time",
//   },
//   {
//     optionKey: "UTC+07:00 Bangkok Time",
//     optionValue: "UTC+07:00 Bangkok Time",
//   },
//   {
//     optionKey: "UTC+08:00 Singapore Time",
//     optionValue: "UTC+08:00 Singapore Time",
//   },
//   {
//     optionKey: "UTC+08:30 Pyongyang Time",
//     optionValue: "UTC+08:30 Pyongyang Time",
//   },
//   {
//     optionKey: "UTC+09:00 Korean Standard Time",
//     optionValue: "UTC+09:00 Korean Standard Time",
//   },
//   {
//     optionKey: "UTC+09:30 Australian Central Standard Time",
//     optionValue: "UTC+09:30 Australian Central Standard Time",
//   },
//   {
//     optionKey: "UTC+10:30 Lord Howe Island Time",
//     optionValue: "UTC+10:30 Lord Howe Island Time",
//   },
//   {
//     optionKey: "UTC+12:45 Chatham Islands Time",
//     optionValue: "UTC+12:45 Chatham Islands Time",
//   },
// ];

const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

const SendLaterModal = ({ sendLaterHandler, isOpen, onClose }) => {
  // Initialize with current time
  const getCurrentTime = () => {
    const now = new Date();
    return {
      day: now.getDate().toString(),
      month: (now.getMonth() + 1).toString(),
      year: now.getFullYear().toString(),
      hour: now.getHours().toString(),
      minute: now.getMinutes().toString().padStart(2, '0'),
    };
  };

  const [time, setTime] = useState(getCurrentTime());
  const [years, setYears] = useState([]);

  const convertTimeToDate = (time) => {
    const { day, month, year, hour, minute } = time;
    
    // Ensure the day and month are zero-padded
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');
    const paddedHour = hour.padStart(2, '0');
    const paddedMinute = minute.padStart(2, '0');
  
    // Create a date string in the format 2025-09-23T16:11:00
    const dateString = `${year}-${paddedMonth}-${paddedDay}T${paddedHour}:${paddedMinute}:00`;
    return dateString;
  };
  
  const handleTimeChange = (field, value) => {
    setTime({
      ...time,
      [field]: value,
    });
  };

  const validateTime = (time) => {
    for (let key in time) {
      if (!time[key]) {
        return "Please select all fields.";
      }
    }
  
    const currentTime = new Date();
    const selectedTime = new Date(`${time.year}-${time.month.padStart(2, '0')}-${time.day.padStart(2, '0')}T${time.hour.padStart(2, '0')}:${time.minute.padStart(2, '0')}:00`);
  
    if (isNaN(selectedTime.getTime())) {
      return "Invalid date format.";
    }
  
    if (selectedTime <= currentTime) {
      console.log("xxxxxxxxxx--->",selectedTime);
      console.log("xxxxxxxxxx--->",currentTime);
      
      return "Selected time should be later than the current time.";
    }
  
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validity = validateTime(time);
    if (validity) {
      return WarningToast(validity);
    }
    const formattedTime = convertTimeToDate(time);
    console.log("formattedTime--->",formattedTime);
    
    sendLaterHandler(formattedTime);
    setTime(getCurrentTime());
    // Modal will be closed by the parent component
  };

  const handleCancel = () => {
    // Reset to current time when canceling
    setTime(getCurrentTime());
    onClose();
  };

  // Handle modal close (X button or clicking outside)
  const handleModalClose = () => {
    // Reset to current time when modal is closed
    setTime(getCurrentTime());
    onClose();
  };

  useEffect(() => {
    setYears(() => {
      const curr = new Date().getFullYear();
      return [curr, curr + 1, curr + 2];
    });
  }, []);

  // Set current date and time when modal opens
  useEffect(() => {
    if (isOpen) {
      setTime(getCurrentTime());
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Interview Timing" style={{ marginBottom: "150px" }}>
      <form onSubmit={handleSubmit}>
        <div >
          <label style={{ display: "block", marginBottom: "8px" }}>
            Interview Timing
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Day */}
            <select style={{ width: "70px" }} value={time.day} onChange={(e) => handleTimeChange("day", e.target.value)}>
              <option value="" disabled>
                Day
              </option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Month */}
            <select style={{ width: "120px" }} value={time.month} onChange={(e) => handleTimeChange("month", e.target.value)}>
              <option value="" disabled>
                Month
              </option>
              {months.map((m, i) => (
                <option key={i} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* Year */}
            <select style={{ width: "90px" }} value={time.year} onChange={(e) => handleTimeChange("year", e.target.value)}>
              <option value="" disabled>
                Year
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Hour */}
            <select style={{ width: "70px" }} value={time.hour} onChange={(e) => handleTimeChange("hour", e.target.value)}>
              <option value="" disabled>
                Hour
              </option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <span>:</span>

            {/* Minutes */}
            <select style={{ width: "70px" }} value={time.minute} onChange={(e) => handleTimeChange("minute", e.target.value)}>
              <option value="" disabled>
                Minute
              </option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        <div style={{ display: "flex",  gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={{ cursor:"pointer", padding: "8px 16px", background: "#c5a55a", color: "white", border: "none", borderRadius: "50px" }}>
            Submit
          </button>
        </div>
        </div>
      </form>
    </Modal>
  );
};

export default SendLaterModal;
