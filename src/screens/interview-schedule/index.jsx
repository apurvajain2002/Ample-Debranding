import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import TableComponent from "../../components/table-components/table-component";
import { baseUrl } from "../../config/config";
import {
  deleteJob,
  getAllJob,
  getAllRecruiters,
} from "../../redux/actions/create-job-actions";
import {
  setIsLoading,
  setMessagesEmpty,
  setTableData,
  setTotalItems,
  setSearchValue,
} from "../../redux/slices/create-new-job-slice";
import "../../styles/style.css";
import CreateNewJobPosition from "./create-new-role";
import CreateNewJobRowTable from "./create-new-job-row";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import NoRouteFound from "../no-route-found/no-route-found";
import { getCityAll } from "../../redux/actions/location-actions/location-actions";
import ErrorToast from "../../components/toasts/error-toast";
import SuccessToast from "../../components/toasts/success-toast";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import getUniqueId from "../../utils/getUniqueId";
import { getAllEntities } from "../../redux/actions/entity-actions/entity-actions";

const tableHeadValues = [
  { optionKey: "Select Column", optionValue: "" },
  { optionKey: "Action", optionValue: "Action" },
  { optionKey: "Company Name", optionValue: "companyName", allowFilter: true },
  { optionKey: "Position Name", optionValue: "positionName", allowFilter: true, },
  { optionKey: "Vacancy Locations", optionValue: "locations", allowFilter: true, },
  { optionKey: "No. of Positions", optionValue: "positionCounts", allowFilter: true, },
  { optionKey: "Position Opening Date", optionValue: "vacancyStartDate", allowFilter: true, },
  { optionKey: "Recruiter", optionValue: "recruiterName", allowFilter: true, },
  { optionKey: "Status", optionValue: "status", allowFilter: true, },
];

const searchApiUrl = `${baseUrl}/job-posting/job-details/get-filtered`;
const tableName = "jobdetails";
const jobOpenStatusColumnName = "jobOpenStatus";

const InterviewSchedule = () => {
  const {
    totalItems,
    tableData,
    isLoading,
    successMessage,
    searchValue,
    failMessage,
    jobId,
  } = useSelector((state) => state.createNewJobSliceReducer);

  const selectColumnListCountriesTable = [
    { optionKey: "Select Column", optionValue: "" },
    { optionKey: "Position Name", optionValue: "positionName" },
  ];

  const sortByOptionIndustriesTable = [
    { optionKey: "Sort By Option", optionValue: "" },
    { optionKey: "Sort Ascending", optionValue: "asc" },
    { optionKey: "Sort Descending", optionValue: "dsc" },
  ];

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectColumn, setSelectColumn] = useState("positionName");
  const [sortByOption, setSortByOption] = useState("asc");
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const dispatch = useDispatch();

  // Get all jobs
  useEffect(() => {
    document.title = "Create Job";
    dispatch(getAllJob());
    dispatch(getAllRecruiters());
    // dispatch(getAllLocations())
    dispatch(getCityAll());
    dispatch(getAllEntities());
  }, []);

  useEffect(() => {
    if (failMessage) {
      ErrorToast(failMessage);
    } else if (successMessage) {
      SuccessToast(successMessage);
      // dispatch(getAllJob());
    }
  }, [successMessage, failMessage]);

  useEffect(() => {
    dispatch(setMessagesEmpty());
  });

  // Get all jobs
  const handleGetAllJobs = async () => {
    let newFilterArray = [...filterArray];
    const jobStatusIndex = newFilterArray.indexOf(
      (columnObj) => columnObj.columnName === jobOpenStatusColumnName
    );
    if (!jobStatusIndex || jobStatusIndex === -1) {
      newFilterArray = [
        ...newFilterArray,
        {
          columnName: jobOpenStatusColumnName,
          values: [],
        },
      ];
    } else {
      newFilterArray[jobStatusIndex] = {
        columnName: jobOpenStatusColumnName,
        values: [],
      };
    }

    const response = await dispatch(
      getAllJob({
        currentPage,
        showRows,
        newFilterArray,
        customSortArray,
        // userId
      })
    );

    if (response.success) dispatch(setTableData(response.list));
  };

  useEffect(() => {
    if (!searchValue || searchValue === "") handleGetAllJobs();
  }, [
    searchValue,
    selectColumn,
    sortByOption,
    currentPage,
    showRows,
    customSortArray,
    filterArray,
  ]);

  return (
    <div className="container">
      {isLoading && <EvuemeLoader />}
      <div className="createEditMasters">
        <Routes>
          <Route path="/" element={<CreateNewJobPosition />} />
          <Route
            path="/*"
            element={<NoRouteFound navigateToPath={"/admin/search-interviews"} />}
          />
        </Routes>
      </div>
      <div className="showJobs bodybox-bodywr createRole">
        <h3>Search Interviews</h3>
        <TableComponent
          tableHeading="Search Interviews"
          tableName={tableName}
          selectColumnList={selectColumnListCountriesTable}
          sortByOptionList={sortByOptionIndustriesTable}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setTotalItems={setTotalItems}
          totalItems={totalItems}
          searchApiUrl={searchApiUrl}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          setTableData={setTableData}
          selectColumn={selectColumn}
          setSelectColumn={setSelectColumn}
          sortByOption={sortByOption}
          setSortByOption={setSortByOption}
          showRows={showRows}
          setShowRows={setShowRows}
          tableHeadValues={tableHeadValues}
          loading={isLoading}
          setLoading={setIsLoading}
          showCustomSort={showCustomSort}
          setShowCustomSort={setShowCustomSort}
          customSortArray={customSortArray}
          setCustomSortArray={setCustomSortArray}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          filterArray={filterArray}
          setFilterArray={setFilterArray}
          tableData={tableData}
          itemName="Interviews"
        >
          {tableData?.length !== 0 &&
            tableData?.map((jobs, index) => (
              <CreateNewJobRowTable
                key={getUniqueId()}
                jobs={jobs}
                index={index + showRows * (currentPage - 1)}
              />
            ))}
        </TableComponent>
        <ConfirmDeleteModal
          onClickNo={() => navigate("")}
          onClickYes={() => dispatch(deleteJob({ jobId: jobId }))}
        />
      </div>
    </div>
  );
};

export default InterviewSchedule;