import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import DateInputField from "../../components/input-fields/date-input-field";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import {
  parseExcel,
  saveJobPosition,
  getAllEntities,
} from "../../redux/actions/create-job-actions";
import handleDate from "../../utils/handleDate";
import { optionMapper, optionMapperFns } from "../../utils/optionMapper";
import WarningToast from "../../components/toasts/warning-toast";
import NormalButton from "../../components/buttons/normal-button";
import NewTypeaheadInputField from "../../components/input-fields/NewTypeaheadInputField";
import NewCityTypeaheadInputField from "../../components/input-fields/NewCityTypeaheadInputField";
import { setCurrentEntity } from "../../redux/slices/entity-slice";
import axiosInstance from "../../interceptors";
import ErrorToast from "../../components/toasts/error-toast";

const initialState = {
  jobTitle: "",
  noOfPosition: "",
  recruiters: [],
  locations: [],
  vacancyStartDate: "",
  vacancyClosureDate: "",
  entities: [],
};
const INITIAL_ERROR_STATE = {
  jobTitle: false,
  noOfPosition: false,
  recruiters: false,
  locations: false,
  entities: false,
  vacancyStartDate: false,
  vacancyClosureDate: false,
};

const CreateNewPosition = () => {
  const { recruiters } = useSelector((state) => state.createNewJobSliceReducer);
  // const {entity} = useSelector((state) => state.entitySliceReducer);
  const { cities } = useSelector((state) => state.manageLocationsSliceReducer);
  const { userId } = useSelector((state) => state.signinSliceReducer);
  const [jobDetails, setJobDetails] = useState(initialState);
  const tableData = useSelector(state => state.entitySliceReducer.tableData)

  const [selectedEntities, setSelectedEntities] = useState([]);
  const { userType } = useSelector((state) => state.signinSliceReducer);
  const { tableData: entities, currentEntity } = useSelector(
    (state) => state.entitySliceReducer
  );
  const entityId = currentEntity ? currentEntity.id : "";

  const [minDate, setMinDate] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    const todayDate = `${day}/${month}/${year}`;

    // Set the minDate state
    setMinDate(todayDate);
  }, []);

  useEffect(() => {
    dispatch(getAllEntities());
  }, []);

  const handleReset = () => {
    setJobDetails(initialState);
  };

  const handlDateInput = (name) => {
    function convertToDate(dateString) {
      const [day, month, year] = dateString.split("/");
      // Month in JavaScript Date object is zero-indexed (0 = January, 1 = February, etc.)
      return new Date(year, month - 1, day);
    }
    const onCloseCallback = (result) => {
      const selectedDate = result.date;

      // Check if `vacancyStartDate` is selected after `vacancyClosureDate` and reset if necessary
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
    // Disable past closure dates if selecting `vacancyClosureDate`
    if (name === "vacancyStartDate") {
      handleDate(name, onCloseCallback, selectedDate, {
        minDate: today, // Prevent selecting past dates
      });
    } else if (name === "vacancyClosureDate") {
      const startDate = convertToDate(jobDetails.vacancyStartDate) || today; // Use today if no start date
      handleDate(name, onCloseCallback, selectedDate, {
        minDate: startDate > today ? startDate : today, // Prevent selecting past dates and ensure it's after start date
      });
    }
  };

  // TODO: Test the new Typeahead comp
  const handleOnChangeCities = (selected) => {
    setJobDetails({
      ...jobDetails,
      locations: selected,
    });
  };

  const handleRemoveMultiValue = (key, value) => {
    const updatedLocations = jobDetails.locations?.filter(
      (location) => location !== value
    );

    setJobDetails({
      ...jobDetails,
      locations: updatedLocations,
    });
  };

  const handleOnChangeRecruiters = (selected) => {
    setJobDetails({
      ...jobDetails,
      recruiters: selected,
    });
  };

  // const availableOptionsRecruiters = filteredRecruiters.filter(
  //     (recruiter) => !jobDetails.recruiters.includes(recruiter.firstName)
  //   );

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

  const handleRemoveInterviewer = (data, s) => {
    const modifiedSelectedValues = jobDetails.recruiters?.filter(
      (val) => val !== data
    );
    setJobDetails({ ...jobDetails, recruiters: modifiedSelectedValues });
  };

  const handleRemoveMultiValueRecruiter = (key, value) => {
    const updatedRecruiter = jobDetails.recruiters?.filter(
      (recruiter) => recruiter !== value
    );

    setJobDetails({
      ...jobDetails,
      recruiters: updatedRecruiter,
    });
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

    if (startDate < today) {
      return `'Vacancy start date' cannot be earlier than today.`;
    }
    if (closureDate < startDate) {
      return `'Vacancy closure date' cannot be earlier than 'Vacancy start date'.`;
    }

    const oneYearLater = new Date(startDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (closureDate > oneYearLater) {
      return `'Vacancy closure date' cannot be more than one year after the 'Vacancy start date'.`;
    }

    return "";
  };

  const [error, setError] = useState(INITIAL_ERROR_STATE);

  const handleSave = () => {
    setError(INITIAL_ERROR_STATE);
    if (
      !jobDetails.jobTitle ||
      !jobDetails.noOfPosition ||
      !jobDetails.recruiters.length ||
      !jobDetails.locations.length ||
      // !jobDetails.entities.length ||
      !jobDetails.vacancyStartDate ||
      !jobDetails.vacancyClosureDate
    ) {
      let update = {};
      if (!jobDetails.jobTitle) update["jobTitle"] = true;
      if (!jobDetails.noOfPosition) update["noOfPosition"] = true;
      if (!jobDetails.recruiters.length) update["recruiters"] = true;
      if (!jobDetails.locations.length) update["locations"] = true;
      // if (!jobDetails.entities.length) update["entities"] = true;
      if (!jobDetails.vacancyStartDate) update["vacancyStartDate"] = true;
      if (!jobDetails.vacancyClosureDate) update["vacancyClosureDate"] = true;
      setError((prev) => ({ ...prev, ...update }));
      return WarningToast("Please fill required fields");
    }

    if (+jobDetails.noOfPosition < 0)
      {
        return WarningToast("Number of positions must be 0 or greater!");
      }

    if (Object.values(jobDetails).some((val) => !val || val[0] === "")) {
      return WarningToast("Please enter the required fields!");
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
        positionName: jobDetails.jobTitle.trim(),
        noOfPosition: jobDetails.noOfPosition,
        recruiters: jobDetails.recruiters,
        vacancyStartDate: jobDetails.vacancyStartDate,
        vacancyEndDate: jobDetails.vacancyClosureDate,
        locations: jobDetails.locations,
        orgId: entityId,
        jobCreationStatus: "25",
        userId: userId,
      })
    );

    handleReset();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href =
      "https://evueme-templates.s3.ap-south-1.amazonaws.com/job-position-template.xlsx";
    link.download = "JobTemplate.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleButtonClick = (event) => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        await dispatch(parseExcel(file));
        window.location.reload();
      } else {
        alert("Please select a valid Excel file (XLSX format).");
      }
    }
  };

  const filteredCities = cities?.filter(
    (city) => !jobDetails.locations.includes(city.optionKey)
  );

  const displayedOptions = optionMapperFns(
    filteredCities?.filter(
      (city) => !jobDetails.locations.includes(city.optionKey)
    ),
    // Get key
    (city) => city.optionKey,
    // Get value
    (city) => city.optionKey,
    "Select Cities"
  );
  // const displayedOptions = filteredCities;

  const handleViewMorePaginate = () => {
    // This function is called by the NewCityTypeaheadInputField component
    // The pagination is now handled internally by the component
    console.log("View more clicked - pagination handled by component");
  };

  const filteredRecruiters = recruiters && Array.isArray(recruiters) ? recruiters?.filter(
    (recruiter) => !jobDetails.recruiters.includes(`${recruiter.firstName} ${recruiter.lastName}`)
  ) : [];

  const availableOptions = optionMapperFns(
    filteredRecruiters?.filter(
      (recruiter) =>
        !jobDetails.recruiters.includes(
          `${recruiter.firstName} ${recruiter.lastName}`
        )
    ),
    // Get key
    (recruiter) => `${recruiter.firstName} ${recruiter.lastName}`,
    // Get value
    (recruiter) => `${recruiter.firstName} ${recruiter.lastName}`,
    "Select Recruiters"
  );

  // const entities = [
  //   { optionValue: "Company A", optionKey: "Company A" },
  //   { optionValue: "Company B", optionKey: "Company B" },
  //   { optionValue: "Company C", optionKey: "Company C" },
  //   { optionValue: "Company D", optionKey: "Company D" },
  //   { optionValue: "Company E", optionKey: "Company E" },
  //   { optionValue: "Company F", optionKey: "Company F" },
  //   { optionValue: "Company G", optionKey: "Company G" },
  //   { optionValue: "Company H", optionKey: "Company H" },
  //   { optionValue: "Company I", optionKey: "Company I" },
  //   { optionValue: "Company J", optionKey: "Company J" }
  // ];

  const filteredentities = entities?.filter(
    (entity) => !jobDetails.entities.includes(entity.optionKey)
  );

  const handleOnChangeEntity = (selected) => {
    setJobDetails({
      ...jobDetails,
      entities: selected,
    });
  };

  const handleRemoveMultipleEntities = (key, value) => {
    const updatedEntities = jobDetails.entities?.filter(
      (entity) => entity !== value
    );

    setJobDetails({
      ...jobDetails,
      entities: updatedEntities,
    });
  };

  // console.log(entities);

  return (
    <>
      <div className="row createRole">
        <div>
          <header className="body-box-top">
            <div className="row">
              <aside className="xl-6 lg-6 md-6 s12">
                <h3>
                  <i>
                    <EvuemeImageTag
                      src={icon.brandingLogo}
                      altText={"Brand logo"}
                      style={{
                        marginRight: "2px",
                      }}
                      alt=""
                    />
                  </i>
                  Create Job Position
                </h3>
              </aside>

              <aside className="xl-6 lg-6 md-6 s12">
                <ul className="top-btn-wrap right  flex-center">
                  {userType === "admin" && (
                    <li style={{ width: "300px" }}>
                      <SelectInputField
                        selectTagIdAndName={"entityName"}
                        options={optionMapper(
                          entities,
                          "businessName",
                          "id",
                          "Entity Name"
                        )}
                        value={entityId}
                        labelText={"Entity"}
                        onChange={(e) => {
                          const id = e.target.value;
                          const currentEntt = entities.find(
                            (entt) => Number(entt.id) === Number(id)
                          );
                          dispatch(setCurrentEntity(currentEntt));
                        }}
                        // disabled={userType !== "admin"}
                      />
                    </li>
                  )}

                  <li>
                    <a onClick={handleButtonClick} className="cursor-pointer">
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{
                          display: "none",
                        }}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileChange}
                      />

                      <p className="flex-center">
                        <EvuemeImageTag
                          className={"upload-csv-icon"}
                          imgSrc={icon.fileUploadIcon}
                          altText={"Upload CSV"}
                        />
                        Upload CSV
                      </p>
                    </a>
                  </li>
                  <span className="create-job-pipe-symbol">|</span>
                  <li>
                    <a href="#" onClick={handleDownload}>
                      <p className="flex-center">Download CSV format</p>
                    </a>
                  </li>
                </ul>
              </aside>
            </div>
          </header>
          <div className=" col s12 padding-left-right-0 createRole-top">
            <NormalInputField
              divTagCssClasses={"input-field col xl6 l6 m6 s12"}
              inputTagIdAndName={"jobTitle"}
              value={jobDetails.jobTitle}
              missing={error.jobTitle}
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
              missing={error.noOfPosition}
            />

            <NewTypeaheadInputField
              divTagCssClasses="input-field col xl3 l3 m3 s12"
              labelText="Recruiters"
              selectTagIdAndName="recruiters"
              placeholder="Select recruiters..."
              options={availableOptions}
              value={jobDetails.recruiters}
              onChange={handleOnChangeRecruiters}
              required={true}
              handleRemoveMultiValue={handleRemoveMultiValueRecruiter}
              multiple={true}
              missing={error.recruiters}
            />
          </div>
        </div>
      </div>
      <div className="row createRole padding-left-right-0">
        <div className="valign-wrapper body-box-body col s12">
          {/* <SelectInputField
            divTagCssClasses={"input-field col xl3 l3 m4 s12"}
            selectTagIdAndName={"locations"}
            options={optionMapper(
              cities.slice(0, 200),
              "optionKey",
              "optionValue",
              "Select Cities"
            )}
            selectedValues={jobDetails.locations}
            value={jobDetails.locations}
            required={true}
            onChange={(e) => handleOnChange(e)}
            handleRemoveSelectedValue={handleRemoveLocation}
            labelText={"Vacancy Locations"}
            multiple={true}
          /> */}

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
            missing={error.locations}
            handleViewMore={handleViewMorePaginate}
            viewMore={true}
          />

          <DateInputField
            divTagCssClasses="col xl3 l3 m4 s12"
            inputTagIdAndName="vacancyStartDate"
            value={jobDetails.vacancyStartDate}
            required={true}
            onClick={() => handlDateInput("vacancyStartDate")}
            labelText={"Vacancy Start Date"}
            missing={error.vacancyStartDate}
          />

          <DateInputField
            divTagCssClasses="col xl3 l3 m4 s12"
            inputTagIdAndName={"vacancyClosureDate"}
            value={jobDetails.vacancyClosureDate}
            required
            onClick={() => handlDateInput("vacancyClosureDate")}
            labelText={"Vacancy Closure Date"}
            missing={error.vacancyClosureDate}
          />

          <div className="input-field col xl3 l3 m6 s12">
            <NormalButton
              buttonTagCssClasses=" btn-clear left"
              buttonText={"Clear"}
              onClick={handleReset}
            />
            <NormalButton
              buttonTagCssClasses=" btn-clear btn-submit right"
              buttonText={"Submit"}
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewPosition;
