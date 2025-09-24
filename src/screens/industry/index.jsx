import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectColumnListIndustriesTable,
  sortByOptionIndustriesTable,
} from "../../resources/constant-data/industry-constant-data";
import TableComponent from "../../components/table-components/table-component";
import IndustryTableRow from "./industry-table-row";
import CreateIndustry from "./create-industry";
import EditIndustry from "./edit-industry";
import NoRouteFound from "../no-route-found/no-route-found";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import {
  deleteIndustry,
  getAllIndustries,
} from "../../redux/actions/industry-actions/industry-actions";
import {
  setIsLoading,
  setMessagesEmpty,
  setSearchValue,
  setTableData,
  setTotalItems,
} from "../../redux/slices/industry-slice";
import { baseUrl } from "../../config/config";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import getUniqueId from "../../utils/getUniqueId";

const tableHeadValues = [
  { optionKey: "Select Column", optionValue: "" },
  { optionKey: "Industry Name", optionValue: "name", allowFilter: true },
  {
    optionKey: "Industry Description",
    optionValue: "description",
    allowFilter: true,
  },
  {
    optionKey: "Edit/Delete Role",
    optionValue: "editDelete",
    allowFilter: false,
  },
];

const searchApiUrl = `${baseUrl}/common/base/roles/get-filtered`;
const tableName = "industry-type";

const Industry = () => {
  const {
    tableData,
    totalItems,
    searchValue,
    deleteIndustryId,
    isLoading,
    successMessage,
    failMessage,
  } = useSelector((state) => state.industrySliceReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectColumn, setSelectColumn] = useState("name");
  const [sortByOption, setSortByOption] = useState("asc");
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get all industries
  const handleGetAllIndustries = () => {
    dispatch(
      getAllIndustries({
        currentPage,
        showRows,
        filterArray,
        customSortArray,
      })
    );
  };

  // Delete industry
  const handleDeleteIndustry = () => {
    dispatch(deleteIndustry({ deleteIndustryId }));
    handleGetAllIndustries();
  };

  useEffect(() => {
    if (!searchValue || searchValue === "") handleGetAllIndustries();
  }, [searchValue, currentPage, showRows, customSortArray, filterArray]);

  useEffect(() => {
    if (successMessage) {
      SuccessToast(successMessage);
      handleGetAllIndustries();
    } else if (failMessage) {
      ErrorToast(failMessage);
      if (failMessage !== "Duplicate Industry Type")
        navigate("/admin/industry");
    }
    dispatch(setMessagesEmpty());
  }, [successMessage, failMessage]);

  return (
    <div className="container">
      <div className="createEditMasters">
        <Routes>
          <Route
            path="/"
            element={
              <CreateIndustry handleGetAllIndustries={handleGetAllIndustries} />
            }
          />
          <Route
            path="/edit-industry/:industryId"
            element={
              <EditIndustry handleGetAllIndustries={handleGetAllIndustries} />
            }
          />
          <Route
            path="/*"
            element={<NoRouteFound navigateToPath={"/admin/industry"} />}
          />
        </Routes>
      </div>

      <div className="showMastersData">
        <TableComponent
          tableHeading="All Industries"
          tableName={tableName}
          selectColumnList={selectColumnListIndustriesTable}
          sortByOptionList={sortByOptionIndustriesTable}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
          setTotalItems={setTotalItems}
          setTableData={setTableData}
          searchApiUrl={searchApiUrl}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
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
          itemName=""
        >
          {tableData &&
            tableData.map((industry, index) => (
              <IndustryTableRow
                key={getUniqueId()}
                industry={industry}
                index={index + showRows * (currentPage - 1)}
              />
            ))}
        </TableComponent>

        <ConfirmDeleteModal
          onClickNo={() => navigate("")}
          onClickYes={() => handleDeleteIndustry()}
        />
      </div>
    </div>
  );
};

export default Industry;
