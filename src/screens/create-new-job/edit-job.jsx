import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import DateInputField from "../../components/input-fields/date-input-field";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import { saveJobPosition } from "../../redux/actions/create-job-actions";
import "../../styles/style.css";
import handleDate from "../../utils/handleDate";
import { useNavigate, useLocation } from "react-router-dom";
import { dateFormatterForTimeZone } from "../../utils/dateFormatter";
import { optionMapper, optionMapperFns } from "../../utils/optionMapper";
import WarningToast from "../../components/toasts/warning-toast";
import NewTypeaheadInputField from "../../components/input-fields/NewTypeaheadInputField";
import NewCityTypeaheadInputField from "../../components/input-fields/NewCityTypeaheadInputField";
import { current } from "@reduxjs/toolkit";

const getDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const EditJob = () => {
  const { state } = useLocation();
  const { cities } = useSelector((state) => state.manageLocationsSliceReducer);
  const { userId } = useSelector((state) => state.signinSliceReducer);
  const currentJob = state?.job;

  const initialState = {
    ...currentJob,
    jobTitle: currentJob?.positionName || "",
    noOfPosition: currentJob?.positionCounts || "",
    recruiters: currentJob?.recruiterName || [],
    locations: currentJob?.locations || [],
    vacancyStartDate: getDDMMYYYY(currentJob?.vacancyStartDate) || "",
    vacancyClosureDate: getDDMMYYYY(currentJob?.vacancyClosureDate) || "",
    orgId: currentJob?.orgId || "",
  };

  const { recruiters } = useSelector((state) => state.createNewJobSliceReducer);

  const [jobDetails, setJobDetails] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setJobDetails(initialState);
  }, [state]);

  useEffect(() => {
    if (!currentJob) {
      navigate("/admin/create-job");
    }
  }, [currentJob, navigate]);

  const handleCancel = () => {
    navigate("/admin/create-job");
  };

  // Function to clear all fields
  const handleReset = () => {
    setJobDetails({
      jobTitle: "",
      noOfPosition: "",
      recruiters: [],
      locations: [],
      vacancyStartDate: "",
      vacancyClosureDate: "",
    });
  };

  const filteredCities = cities.filter(
    (city) => !jobDetails.locations.includes(city.optionKey)
  );

  const displayedOptions = optionMapperFns(
    filteredCities.filter(
      (city) => !jobDetails.locations.includes(city.optionKey)
    ),
    // Get key
    (city) => city.optionKey,
    // Get value
    (city) => city.optionKey,
    "Select Cities"
  );

  const handleSave = () => {
    const requiredFields = {
      jobTitle: "",
      noOfPosition: "",
      recruiters: [],
      locations: [],
      vacancyStartDate: "",
      vacancyClosureDate: "",
    };

    if (
      Object.entries(requiredFields).some(
        ([key]) =>
          !jobDetails[key] ||
          (Array.isArray(jobDetails[key]) && jobDetails[key].length === 0)
      )
    ) {
      return WarningToast("Please enter the required fields!");
    }

    if (+jobDetails.noOfPosition < 0)
      {
        return WarningToast("Number of positions must be 0 or greater!");
      }

    const dateValidity = validateDate(
      jobDetails.vacancyStartDate,
      jobDetails.vacancyClosureDate
    );
    if (dateValidity !== "") {
      return WarningToast(dateValidity);
    }

    dispatch(
      saveJobPosition({
        ...jobDetails,
        jobId: currentJob.jobId,
        positionName: jobDetails.jobTitle,
        noOfPosition: jobDetails.noOfPosition,
        recruiters: jobDetails.recruiters,
        vacancyStartDate: jobDetails.vacancyStartDate,
        vacancyEndDate: jobDetails.vacancyClosureDate,
        locations: jobDetails.locations,
        userId: userId,
        orgId: jobDetails.orgId,
      })
    );

    handleReset(); // Clear fields after saving the job
    navigate("/admin/create-job");
  };

  // const handlDateInput = (name) => {
  //   function convertToDate(dateString) {
  //     const [day, month, year] = dateString.split("/");
  //     return new Date(year, month - 1, day);
  //   }

  //   const onCloseCallback = (result) => {
  //     const selectedDate = result.date;

  //     if (name === "vacancyStartDate") {
  //       setJobDetails((prevDetails) => ({
  //         ...prevDetails,
  //         vacancyStartDate: selectedDate,
  //         vacancyClosureDate:
  //           prevDetails.vacancyClosureDate &&
  //           convertToDate(selectedDate) > convertToDate(prevDetails.vacancyClosureDate)
  //             ? "" // Reset `vacancyClosureDate` if it's before the new `vacancyStartDate`
  //             : prevDetails.vacancyClosureDate,
  //       }));
  //     } else {
  //       setJobDetails((prevDetails) => ({
  //         ...prevDetails,
  //         [name]: selectedDate,
  //       }));
  //     }
  //   };

  //   const selectedDate = convertToDate(jobDetails[name]);
  //   if (name === "vacancyClosureDate" && jobDetails.vacancyStartDate) {
  //     const startDate = convertToDate(jobDetails.vacancyStartDate);
  //     handleDate(name, onCloseCallback, selectedDate, {
  //       minDate: startDate, // Prevent selecting a closure date before start date
  //     });
  //   } else {
  //     handleDate(name, onCloseCallback, selectedDate);
  //   }
  // };

  // DISABLE ALL THE PREVIOUS DATES EARLIER THAN THE PREVIOUSLY SELECTED DATES=========================================
  const handlDateInput = (name) => {
    function convertToDate(dateString) {
      const [day, month, year] = dateString.split("/");
      return new Date(year, month - 1, day);
    }

    const onCloseCallback = (result) => {
      const selectedDate = result.date;

      if (name === "vacancyStartDate") {
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          vacancyStartDate: selectedDate,
          vacancyClosureDate:
            prevDetails.vacancyClosureDate &&
            convertToDate(selectedDate) >
              convertToDate(prevDetails.vacancyClosureDate)
              ? "" // Reset `vacancyClosureDate` if it's before the new `vacancyStartDate`
              : prevDetails.vacancyClosureDate,
        }));
      } else {
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          [name]: selectedDate,
        }));
      }
    };

    const selectedDate = convertToDate(jobDetails[name]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (name === "vacancyStartDate") {
      // Allow previously selected date or today's date, whichever is earlier
      const minDate = jobDetails.vacancyStartDate
        ? new Date(Math.min(today, convertToDate(jobDetails.vacancyStartDate)))
        : today;

      handleDate(name, onCloseCallback, selectedDate, { minDate });
    } else if (name === "vacancyClosureDate" && jobDetails.vacancyStartDate) {
      const startDate = convertToDate(jobDetails.vacancyStartDate);
      handleDate(name, onCloseCallback, selectedDate, {
        minDate: startDate, // Prevent selecting a closure date before start date
      });
    } else {
      handleDate(name, onCloseCallback, selectedDate, { minDate: today });
    }
  };

  const handleOnChange = (e) => {
    if (e.target.name === "recruiters" || e.target.name === "locations") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setJobDetails({
        ...jobDetails,
        [e.target.name]: [...selectedOptions],
      });
    } else {
      setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
    }
  };

  const handleOnChangeRecruiters = (selected) => {
    setJobDetails({
      ...jobDetails,
      recruiters: selected,
    });
  };

  const handleRemoveMultiValueRecruiter = (key, value) => {
    const updatedRecruiter = jobDetails.recruiters.filter(
      (recruiter) => recruiter !== value
    );

    setJobDetails({
      ...jobDetails,
      recruiters: updatedRecruiter,
    });
  };

  const handleOnChangeCities = (selected) => {
    setJobDetails({
      ...jobDetails,
      locations: selected,
    });
  };

  const handleRemoveMultiValue = (key, value) => {
    const updatedLocations = jobDetails.locations.filter(
      (location) => location !== value
    );

    setJobDetails({
      ...jobDetails,
      locations: updatedLocations,
    });
  };

  const filteredRecruiters = recruiters.filter(
    (recruiter) => !jobDetails.recruiters.includes(recruiters.optionKey)
  );

  const availableOptions = optionMapperFns(
    filteredRecruiters.filter(
      (recruiter) =>
        !jobDetails.recruiters.includes(
          `${recruiter.firstName} ${recruiter.lastName}`
        )
    ),
    // Get key
    (recruiter) => `${recruiter.firstName} ${recruiter.lastName}`,
    // Get value
    (recruiter) => `${recruiter.firstName} ${recruiter.lastName}`,
    "Select Recruiter"
  );

  const handleRemove = (data, where) => {
    let modifiedSelectedValues = [];
    if (where === "recruiter") {
      modifiedSelectedValues = jobDetails.recruiters.filter(
        (val) => val !== data
      );
      setJobDetails({ ...jobDetails, recruiters: modifiedSelectedValues });
    } else if (where === "location") {
      modifiedSelectedValues = jobDetails.locations.filter(
        (val) => val !== data
      );
      setJobDetails({ ...jobDetails, locations: modifiedSelectedValues });
    }
  };

  const validateDate = (vacancyStartDate, vacancyClosureDate) => {
    const [startDay, startMonth, startYear] = vacancyStartDate.split("/");
    const [closureDay, closureMonth, closureYear] =
      vacancyClosureDate.split("/");

    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
    const closureDate = new Date(
      `${closureYear}-${closureMonth}-${closureDay}`
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (closureDate < startDate) {
      return `'Vacancy closure date' cannot be earlier than 'Vacancy start date'.`;
    }

    return "";
  };

  return (
    <>
      <div className="row createRole">
        <header className="body-box-top">
          <div className="row">
            <aside className="xl-6 lg-6 md-6 s12">
              <h3>
                <i>
                  <EvuemeImageTag
                    src={icon.brandingLogo}
                    altText={"Brand logo"}
                    style={{ marginRight: "2px" }}
                    alt=""
                  />
                </i>
                Edit Job Position
              </h3>
            </aside>
          </div>
        </header>
        <div className="col s12 padding-left-right-0 createRole-top">
          <NormalInputField
            divTagCssClasses={"input-field col xl6 l6 m6 s12"}
            inputTagIdAndName={"jobTitle"}
            value={jobDetails.jobTitle}
            placeholder={"Job Title"}
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"Job Title"}
          />

          <NormalInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s12"}
            value={jobDetails.noOfPosition}
            placeholder={"No. of Positions"}
            type="number"
            inputTagIdAndName="noOfPosition"
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"No. of Positions"}
          />

          <NewTypeaheadInputField
            divTagCssClasses="input-field col xl3 l3 m3 s12"
            labelText="Recruiters"
            selectTagIdAndName="recruiters"
            placeholder="Select recruiters..."
            options={availableOptions}
            value={jobDetails.recruiters}
            onChange={handleOnChangeRecruiters}
            required
            handleRemoveMultiValue={handleRemoveMultiValueRecruiter}
            multiple={true}
          />
        </div>
      </div>

      <div className="row createRole padding-left-right-0">
        <div className="valign-wrapper body-box-body col s12">
          <NewCityTypeaheadInputField
            divTagCssClasses="col xl3 l3 m4 s12"
            labelText="Vacancy Locations"
            selectTagIdAndName="locations"
            placeholder="Select Cities..."
            options={displayedOptions}
            value={jobDetails.locations}
            onChange={handleOnChangeCities}
            handleRemoveMultiValue={handleRemoveMultiValue}
            multiple={true}
            required={true}
            viewMore={true}
            handleViewMore={() => {
              // This function is called by the NewCityTypeaheadInputField component
              // The pagination is now handled internally by the component
              console.log("View more clicked - pagination handled by component");
            }}
          />

          <DateInputField
            divTagCssClasses="input-field col xl3 l3 m4 s12"
            inputTagIdAndName="vacancyStartDate"
            value={jobDetails.vacancyStartDate}
            required={true}
            onClick={() => handlDateInput("vacancyStartDate")}
            labelText={"Vacancy Start Date"}
            // disabled
          />

          <DateInputField
            divTagCssClasses="input-field col xl3 l3 m4 s12"
            inputTagIdAndName={"vacancyClosureDate"}
            value={jobDetails.vacancyClosureDate}
            required={true}
            onClick={() => handlDateInput("vacancyClosureDate")}
            labelText={"Vacancy Closure Date"}
          />

          <div className="input-field col xl3 l3 m6 s12">
            <button
              className="waves-effect waves-light btn btn-clear left"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="waves-effect waves-light btn btn-clear btn-submit right"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJob;
