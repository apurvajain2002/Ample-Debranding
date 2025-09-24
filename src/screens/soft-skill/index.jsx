import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectColumnListSoftSkillsTable,
  sortByOptionSoftSkillsTable,
} from "../../resources/constant-data/soft-skill-constant-data";
import TableComponent from "../../components/table-components/table-component";
import SoftSkillTableRow from "./soft-skill-table-row";
import CreateSoftSkill from "./create-soft-skill";
import EditSoftSkill from "./edit-soft-skill";
import NoRouteFound from "../no-route-found/no-route-found";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import {
  deleteSoftSkill,
  getAllSoftSkills,
} from "../../redux/actions/soft-skill-actions/soft-skill-actions";
import {
  setIsLoading,
  setMessagesEmpty,
  setSearchValue,
  setTableData,
  setTotalItems,
} from "../../redux/slices/soft-skill-slice";
import { baseUrl } from "../../config/config";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import getUniqueId from "../../utils/getUniqueId";

const tableHeadValues = [
  { optionKey: "Select Column", optionValue: "" },
  { optionKey: "Skill Name", optionValue: "name", allowFilter: true },
  { optionKey: "Description", optionValue: "description", allowFilter: true },
  {
    optionKey: "Edit/Delete Role",
    optionValue: "editDelete",
    allowFilter: false,
  },
];

const searchApiUrl = `${baseUrl}/common/base/roles/get-filtered`;
const tableName = "softSkills";

const SoftSkill = () => {
  const {
    tableData,
    totalItems,
    searchValue,
    deleteSoftSkillId,
    isLoading,
    successMessage,
    failMessage,
  } = useSelector((state) => state.softSkillSliceReducer);

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

  // Get all softSkills
  const handleGetAllSoftSkills = async () => {
    dispatch(
      getAllSoftSkills({
        currentPage,
        showRows,
        filterArray,
        customSortArray,
      })
    );
  };

  // Delete softSkill
  const handleDeleteSoftSkill = async () => {
    dispatch(deleteSoftSkill({ deleteSoftSkillId }));
    handleGetAllSoftSkills();
  };

  useEffect(() => {
    document.title = "Soft Skills";
  }, []);

  useEffect(() => {
    if (!searchValue || searchValue === "") handleGetAllSoftSkills();
  }, [searchValue, currentPage, showRows, customSortArray, filterArray]);

  useEffect(() => {
    if (successMessage) {
      SuccessToast(successMessage);
      handleGetAllSoftSkills();
    } else if (failMessage) {
      ErrorToast(failMessage);
      if (failMessage !== "Duplicate Soft Skills")
        navigate("/admin/soft-skill");
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
              <CreateSoftSkill
                handleGetAllSoftSkills={handleGetAllSoftSkills}
              />
            }
          />
          <Route
            path="/edit-soft-skill/:softSkillId"
            element={
              <EditSoftSkill handleGetAllSoftSkills={handleGetAllSoftSkills} />
            }
          />
          <Route
            path="/*"
            element={<NoRouteFound navigateToPath={"/admin/soft-skill"} />}
          />
        </Routes>
      </div>

      <div className="showMastersData">
        <TableComponent
          tableHeading="All SoftSkills"
          tableName={tableName}
          selectColumnList={selectColumnListSoftSkillsTable}
          sortByOptionList={sortByOptionSoftSkillsTable}
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
          tableData={tableData}
          itemName="Soft skills"
        >
          {tableData &&
            tableData.map((softSkill, index) => (
              <SoftSkillTableRow
                key={getUniqueId()}
                softSkill={softSkill}
                index={index + showRows * (currentPage - 1)}
              />
            ))}
        </TableComponent>

        <ConfirmDeleteModal
          onClickNo={() => navigate("")}
          onClickYes={() => handleDeleteSoftSkill()}
        />
      </div>
    </div>
  );
};

export default SoftSkill;
