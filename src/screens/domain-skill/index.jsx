import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectColumnListDomainSkillsTable,
  sortByOptionDomainSkillsTable,
} from "../../resources/constant-data/domain-skill-constant-data";
import TableComponent from "../../components/table-components/table-component";
import DomainSkillTableRow from "./domain-skill-table-row";
import CreateDomainSkill from "./create-domain-skill";
import EditDomainSkill from "./edit-domain-skill";
import NoRouteFound from "../no-route-found/no-route-found";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import {
  deleteDomainSkill,
  getAllDomainSkills,
} from "../../redux/actions/domain-skill-actions/domain-skill-actions";
import {
  setIsLoading,
  setMessagesEmpty,
  setSearchValue,
  setTableData,
  setTotalItems,
} from "../../redux/slices/domain-skill-slice";
import { baseUrl } from "../../config/config";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import getUniqueId from "../../utils/getUniqueId";

const tableHeadValues = [
  { optionKey: "Select Column", optionValue: "" },
  { optionKey: "Skill Name", optionValue: "name", allowFilter: true },
  { optionKey: "Description", optionValue: "description", allowFilter: true },
  { optionKey: "Edit/Delete Role", optionValue: "editDelete" },
];

const searchApiUrl = `${baseUrl}/common/base/domain-skills/get-filtered`;
const tableName = "domainSkills";

const DomainSkill = () => {
  const {
    tableData,
    totalItems,
    searchValue,
    deleteDomainSkillId,
    isLoading,
    successMessage,
    failMessage,
  } = useSelector((state) => state.domainSkillSliceReducer);

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

  // Get all domainSkills
  const handleGetAllDomainSkills = () => {
    dispatch(
      getAllDomainSkills({
        currentPage,
        showRows,
        filterArray,
        customSortArray,
      })
    );
  };

  // Delete domainSkill
  const handleDeleteDomainSkill = () => {
    dispatch(deleteDomainSkill({ deleteDomainSkillId }));
    handleGetAllDomainSkills();
  };

  useEffect(() => {
    document.title = "Domain Skills";
  }, []);

  useEffect(() => {
    if (!searchValue || searchValue === "") handleGetAllDomainSkills();
  }, [searchValue, currentPage, showRows, customSortArray, filterArray]);

  useEffect(() => {
    if (successMessage) {
      SuccessToast(successMessage);
      handleGetAllDomainSkills();
    } else if (failMessage) {
      ErrorToast(failMessage);
      if (failMessage !== "Duplicate Domain Skills")
        navigate("/admin/domain-skill");
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
              <CreateDomainSkill
                handleGetAllDomainSkills={handleGetAllDomainSkills}
              />
            }
          />
          <Route
            path="/edit-domain-skill/:domainSkillId"
            element={
              <EditDomainSkill
                handleGetAllDomainSkills={handleGetAllDomainSkills}
              />
            }
          />
          <Route
            path="/*"
            element={<NoRouteFound navigateToPath={"/admin/domain-skill"} />}
          />
        </Routes>
      </div>

      <div className="showMastersData">
        <TableComponent
          tableHeading="All DomainSkills"
          tableName={tableName}
          selectColumnList={selectColumnListDomainSkillsTable}
          sortByOptionList={sortByOptionDomainSkillsTable}
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
          itemName="Domain Skills"
        >
          {tableData &&
            tableData.map((domainSkill, index) => (
              <DomainSkillTableRow
                key={getUniqueId()}
                domainSkill={domainSkill}
                index={index + showRows * (currentPage - 1)}
              />
            ))}
        </TableComponent>

        <ConfirmDeleteModal
          onClickNo={() => navigate("")}
          onClickYes={() => handleDeleteDomainSkill()}
        />
      </div>
    </div>
  );
};

export default DomainSkill;
