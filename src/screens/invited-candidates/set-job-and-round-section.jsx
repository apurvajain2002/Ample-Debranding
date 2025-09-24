import { useEffect, useMemo, useState } from "react";
import RadioButtonInputField from "../../components/input-fields/radio-button-input-field";
import { optionMapper } from "../../utils/optionMapper";
import SelectInputField from "../../components/input-fields/select-input-field";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotPublishedCampusJobs, getAllNotPublishedJobs, getAllNotPublishedLateralJobs } from "../../redux/actions/define-interview-actions/define-interview-actions";
import { getAllEntities, getJob } from "../../redux/actions/create-job-actions";
import { selectJobId, selectOrganizationId } from "../../redux/slices/create-new-job-slice";
import ErrorToast from "../../components/toasts/error-toast";
import NormalButton from "../../components/buttons/normal-button";
import DateInputField from "../../components/input-fields/date-input-field";
import SuccessToast from "../../components/toasts/success-toast";

const SetJobAndRoundSection = ({ round, setRound, onFilterSubmit }) => {
  const { organizationId, jobId, currentJobDetails } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { allNotPublishedJobs } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { currentUser, userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const { organizationsList } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const { userId } = useSelector((state) => state.signinSliceReducer);
  const dispatch = useDispatch();
  const { hiringType } = currentJobDetails || {};

  // Add state for additional filter fields (removed recruiter name)
  const [selectedInterviewRound, setSelectedInterviewRound] = useState("");
  const [selectedVacancyLocation, setSelectedVacancyLocation] = useState("");
  const [selectedPlacementAgency, setSelectedPlacementAgency] = useState("");
  const [selectedRecruiterName, setSelectedRecruiterName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Handle get job details
  const handleGetJobDetails = () => {
    dispatch(getJob({ jobId: jobId }));
  };

  useEffect(() => {
    if (userType === 'manpower') {
      dispatch(getAllNotPublishedLateralJobs({ userId }));
      dispatch(getAllEntities());
      return;
    }
    if (userType === 'campus') {
      dispatch(getAllNotPublishedCampusJobs({ userId }));
      return;
    }
    dispatch(getAllNotPublishedJobs({ userId }));
  }, []);

  // Choose a job and based on that setting the inital round
  useEffect(() => {
    if (jobId) {
      handleGetJobDetails();
      // Reset other filter fields when job changes (removed recruiter name)
      setSelectedInterviewRound("");
      setSelectedVacancyLocation("");
      setSelectedPlacementAgency("");
      setSelectedRecruiterName("");
    }
  }, [jobId]);

  const invitedCandidatesDropdownOptions = () => {
    const selectedJobPosition = allNotPublishedJobs?.find((item) => item?.jobId == jobId);

    const defaultOption = { optionKey: 'Select from list', optionValue: '' };
    // Helper function to extract an array safely
    const extractArray = (data, key) => {
      return Array.isArray(data?.[key])
        ? data[key]
        : data?.[key]
          ? [data[key]]
          : [];
    };
    // Extract options - using correct field names from API response (removed recruiter names)
    const recruiterNames = extractArray(selectedJobPosition, 'recruiterName');
    const placementAgencies = extractArray(selectedJobPosition, 'placementAgencies');
    const locations = extractArray(selectedJobPosition, 'locations');
    const interviewRounds = extractArray(selectedJobPosition, 'interviewRounds');

    // Generate dropdown options (removed recruiter name options)
    const recruiterNameOptions = [
      defaultOption,
      ...recruiterNames.map(name => ({ optionKey: name, optionValue: name }))
    ];
    const placementAgencyOptions = [
      defaultOption,
      ...placementAgencies.map(agency => ({ optionKey: agency, optionValue: agency }))
    ];
    const locationOptions = [
      defaultOption,
      ...locations.map(location => ({ optionKey: location, optionValue: location }))
    ];
    const interviewRoundOptions = [
      defaultOption,
      ...interviewRounds.map(round => ({ optionKey: round, optionValue: round }))
    ];

    return { recruiterNameOptions, placementAgencyOptions, locationOptions, interviewRoundOptions };
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedInterviewRound("");
    setSelectedVacancyLocation("");
    setSelectedPlacementAgency("");
    setSelectedRecruiterName("");
    setFromDate("");
    setToDate("");

    // Call the parent component's filter submit handler with empty filters
    if (onFilterSubmit) {
      onFilterSubmit({
        filterList: [],
        sortList: [],
        pagingNo: 1,
        pageSize: 10
      });
    }

    SuccessToast("All filters cleared successfully");
  };

  // Handle submit button click
  const handleSubmit = () => {
    if (!jobId) {
      ErrorToast("Please select a job first");
      return;
    }

    // Check if at least one additional filter is selected (removed recruiter name check)
    if (!selectedInterviewRound && !selectedVacancyLocation && !selectedPlacementAgency && !fromDate && !toDate) {
      ErrorToast("Please select at least one filter option (Interview Round, Vacancy Location, Placement Agency/Agency Name, or Date Range)");
      return;
    }

    // Note: Date filtering is now implemented
    if (fromDate || toDate) {
      console.log("Date filters selected:", { fromDate, toDate });
    }

    console.log("Submit button clicked with filters:", {
      jobId,
      selectedInterviewRound,
      selectedVacancyLocation,
      selectedRecruiterName,
      selectedPlacementAgency,
      fromDate,
      toDate
    });

    // Create filter payload
    const filterPayload = {
      filterList: [
        {
          columnName: "inviteDetails.interviewRounds.jobId",
          values: [jobId]
        }
      ],
      sortList: [],
      pagingNo: 1,
      pageSize: 10
    };

    // Add interview round filter if selected
    if (selectedInterviewRound) {
      filterPayload.filterList.push({
        columnName: "inviteDetails.interviewRounds.interviewRounds",
        values: [selectedInterviewRound]
      });
    }

    // Add vacancy location filter if selected
    if (selectedVacancyLocation) {
      filterPayload.filterList.push({
        columnName: "inviteDetails.vacancyLocations",
        values: [selectedVacancyLocation]
      });
    }

    // Add placement agency filter if selected
    if (selectedPlacementAgency) {
      filterPayload.filterList.push({
        columnName: "inviteDetails.agencyName",
        values: [selectedPlacementAgency]
      });
    }

    // Add from date filter if selected
    if (fromDate) {
      filterPayload.filterList.push({
        columnName: "inviteDetails.createdDate",
        values: [fromDate],
        operator: "gte" // greater than or equal to
      });
    }

    // Add to date filter if selected
    if (toDate) {
      filterPayload.filterList.push({
        columnName: "inviteDetails.createdDate",
        values: [toDate],
        operator: "lte" // less than or equal to
      });
    }

    console.log("Final filter payload:", filterPayload);

    // Call the parent component's filter submit handler
    if (onFilterSubmit) {
      onFilterSubmit(filterPayload);
    }
  };

  const fieldsArrayList1 = useMemo(() => {
    return [
      ...(userType === 'manpower' ? [
        {
          selectTagIdAndName: "Organization Name",
          options: optionMapper(organizationsList, "businessName", "id", "Select Organization Name"),
          value: organizationId,
          onChange: (e) => { dispatch(selectOrganizationId(e.target.value)); },
          labelText: "Organization Name",
        },
      ] : []),
      {
        selectTagIdAndName: "Position Name",
        options: optionMapper(allNotPublishedJobs, "positionName", "jobId", "Select a Job"),
        value: jobId,
        onChange: (e) => { invitedCandidatesDropdownOptions(); dispatch(selectJobId(e.target.value)); },
        labelText: "Position Name",
      },
      ...(userType !== 'manpower' ? [
        ...(hiringType === 'Campus Hiring' ? [
          {
            selectTagIdAndName: "Campus Name",
            options: invitedCandidatesDropdownOptions().placementAgencyOptions,
            value: selectedPlacementAgency,
            onChange: (e) => setSelectedPlacementAgency(e.target.value),
            labelText: "Campus Name",
          },
        ] : [
          {
            selectTagIdAndName: "Placement Agency Name",
            options: invitedCandidatesDropdownOptions().placementAgencyOptions,
            value: selectedPlacementAgency,
            onChange: (e) => setSelectedPlacementAgency(e.target.value),
            labelText: "Placement Agency Name",
          },
        ]),
      ] : []),
      {
        selectTagIdAndName: "Interview round",
        options: invitedCandidatesDropdownOptions().interviewRoundOptions,
        value: selectedInterviewRound,
        onChange: (e) => setSelectedInterviewRound(e.target.value),
        labelText: "Interview round",
      },
      {
        selectTagIdAndName: "Vacancy Location",
        options: invitedCandidatesDropdownOptions().locationOptions,
        value: selectedVacancyLocation,
        onChange: (e) => setSelectedVacancyLocation(e.target.value),
        labelText: "Vacancy Location",
      },
      {
        selectTagIdAndName: "Recruiter Name",
        options: invitedCandidatesDropdownOptions().recruiterNameOptions,
        value: selectedRecruiterName,
        onChange: (e) => setSelectedRecruiterName(e.target.value),
        labelText: "Recruiter Name",
      },
    ];
  }, [
    hiringType, allNotPublishedJobs, jobId, selectedInterviewRound,
    selectedVacancyLocation, selectedRecruiterName, selectedPlacementAgency,
    userType
  ]);

  return (
    <div className="body-box-header">
      <div className="body-box-body">
        <div className="row">
          {fieldsArrayList1.map((field, index) => (
            <SelectInputField
              key={index}
              divTagCssClasses={'col xl3 l3 m4 s12'}
              selectTagIdAndName={field.selectTagIdAndName}
              options={field.options}
              value={field.value}
              onChange={field.onChange}
              labelText={field.labelText}
            />
          ))}
          <div class="input-field col xl3 l3 m4 s12 date-field">
            <DateInputField
              inputTagIdAndName="fromDate"
              value={fromDate}
              placeholder="From Date"
              onChange={(e) => setFromDate(e.target.value)}
              labelText={"From Date"}
            />
            <DateInputField
              inputTagIdAndName={"toDate"}
              value={toDate}
              placeholder="To Date"
              onChange={(e) => setToDate(e.target.value)}
              labelText={"To Date"}
            />
          </div>
          <div className="col xl6 l6 m8 s12">
            <NormalButton
              buttonTagCssClasses={"waves-effect waves-light btn-clear btn-submit mt-17 margin-right-10"}
              buttonText={"Submit"}
              onClick={handleSubmit}
            />
            <NormalButton
              buttonTagCssClasses={"waves-effect waves-light btn-clear mt-17"}
              buttonText={"Clear Filters"}
              onClick={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetJobAndRoundSection;
