import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import TableComponent from "../../components/table-components/table-component";
import { baseUrl } from "../../config/config";


import {getUserManagement,getRoleUserManagement} from "../../redux/actions/create-user-management-action";
import {
  setIsLoading,
  setMessagesEmpty,
  setTableData,
  setTotalItems,
  setSearchValue,
} from "../../redux/slices/create-new-user-management-slice";
import "../../styles/style.css";
import CreateNewJobPosition from "./create-new-user-management";
import CreateNewJobRowTable from "./create-new-job-row";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import NoRouteFound from "../no-route-found/no-route-found";
import { getCityAll } from "../../redux/actions/location-actions/location-actions";
import ErrorToast from "../../components/toasts/error-toast";
import SuccessToast from "../../components/toasts/success-toast";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import getUniqueId from "../../utils/getUniqueId";
import { getAllEntities } from "../../redux/actions/entity-actions/entity-actions";
import EditUserManagement from './edit-user-management'
const tableHeadValues = [
  { optionKey: "Action", optionValue: "Action" },
  { optionKey: "User Name", optionValue: "userName", allowFilter: true },
  { optionKey: "Email ID", optionValue: "primaryEmailId", allowFilter: true, },
  { optionKey: "Mobile Number", optionValue: "mobileNumber1", allowFilter: true, },
  { optionKey: "WhatsApp Number", optionValue: "whatsappNumber", allowFilter: true, },
  { optionKey: "Role", optionValue: "roleName", allowFilter: true, },
];

const searchApiUrl = `${baseUrl}/common/user/get-filtered`;
const tableName = "users";
const jobOpenStatusColumnName = "jobOpenStatus";

const UserManagement = () => {
  const {
    totalItems,
    tableData,
    isLoading,
    successMessage,
    searchValue,
    failMessage,
    jobId,
    roleList
  } = useSelector((state) => state.createUserManagementSliceReducer);

 
  
  

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
    if (failMessage) {
      ErrorToast(failMessage);
    } else if (successMessage) {
      SuccessToast(successMessage);
      // dispatch(getAllJob());
    }
  }, [successMessage, failMessage]);

 

  // Get all jobs
  const handleGetAllJobs = async () => {
    dispatch(setMessagesEmpty());
    dispatch(getRoleUserManagement());
   const response = await dispatch(getUserManagement({filterList: [],
      sortList:customSortArray || [],
      pagingNo:currentPage || 1,
      pageSize:showRows
    }));
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
            <Route path="/edit-user-management/:userId" element={<EditUserManagement />} />
            <Route
                path="/*"
                element={<NoRouteFound navigateToPath={"/admin/create-job"} />}
            />
          </Routes>
        </div>
        <div className="showJobs bodybox-bodywr createRole">
          <h3>User Management</h3>
          <TableComponent
              tableHeading="User Management"
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
              itemName="Users"
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
          
        </div>
      </div>
  );
};

export default UserManagement;