import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectColumnListRolesTable,
  sortByOptionRolesTable,
} from "../../resources/constant-data/roles-constant-data";
import TableComponent from "../../components/table-components/table-component";
import RoleTableRow from "./role-table-row";
import CreateRole from "./create-role";
import EditRole from "./edit-role";
import NoRouteFound from "../no-route-found/no-route-found";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import {
  deleteRole,
  getAllRoles,
} from "../../redux/actions/role-actions/role-actions";
import {
  setIsLoading,
  setMessagesEmpty,
  setSearchValue,
  setTableData,
  setTotalItems,
} from "../../redux/slices/role-slice";
import { baseUrl } from "../../config/config";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import getUniqueId from "../../utils/getUniqueId";
import axiosInstance from "../../interceptors";

const GET_ROLE_FEATURES_ENDPOINT =
  `${baseUrl}/common/base/features/features`;

const tableHeadValues = [
  // { optionKey: "Select Column", optionValue: "" },
  { optionKey: "Action", optionValue: "Action" },
  { optionKey: "Role Name", optionValue: "name", allowFilter: true },
  { optionKey: "Description", optionValue: "description", allowFilter: true },
  {
    optionKey: "Permission Allowed",
    optionValue: "permissionAllowed",
    allowFilter: false,
  },
];

const searchApiUrl = `${baseUrl}/common/base/roles/get-filtered`;
const tableName = "roles";

const Role = () => {
  const {
    tableData,
    totalItems,
    searchValue,
    deleteRoleId,
    isLoading,
    successMessage,
    failMessage,
  } = useSelector((state) => state.roleSliceReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get all roles
  const handleGetAllRoles = () => {
    dispatch(
      getAllRoles({ currentPage, showRows, filterArray, customSortArray })
    );
  };

  // Delete role
  const handleDeleteRole = () => {
    dispatch(deleteRole({ deleteRoleId }));
    handleGetAllRoles();
  };

  // converts array of nodes to tree like array of objects
  const convertData = (roleFeatureNodes = []) => {
    const constructTree = (nodes, parentId = "") => {
      const newNodes = [];
      nodes.forEach((node) => {
        if (
          (parentId === "" && !node.id.includes(".")) ||
          (node.id.startsWith(parentId) &&
            node.id.split(".").length === parentId.split(".").length + 1)
        ) {
          newNodes.push({
            ...node,
            children: constructTree(nodes, node.id),
          });
        }
      });
      return newNodes;
    };

    return constructTree(roleFeatureNodes).filter(
      (curVal) => !curVal.id.includes(".")
    );
  };

  // gets all role features
  const getRoleFeatures = async () => {
    try {
      const { data } = await axiosInstance.post(GET_ROLE_FEATURES_ENDPOINT);
      if (data.success) {
        const convertedTreeData = convertData(data.list);
        setTreeData(convertedTreeData);
        return data.list;
      }
    } catch (error) {
      console.error("GET ROLES ", error);
      return ErrorToast(error.message);
    }
  };

  useEffect(() => {
    document.title = "Manage Roles";
    getRoleFeatures();
  }, []);

  useEffect(() => {
    if (!searchValue || searchValue === "") handleGetAllRoles();
  }, [searchValue, currentPage, showRows, customSortArray, filterArray]);

  useEffect(() => {
    if (successMessage) {
      SuccessToast(successMessage);
      handleGetAllRoles();
    } else if (failMessage) {
      ErrorToast(failMessage);
      if (failMessage !== "Duplicate Role") navigate("/admin/role");
    }
    dispatch(setMessagesEmpty());
  }, [successMessage, failMessage]);

  return (
    <div className="container">
      {isLoading && <EvuemeLoader />}
      <div className="createEditMasters">
        <Routes>
          <Route
            path="/"
            element={<CreateRole handleGetAllRoles={handleGetAllRoles} />}
          />
          <Route
            path="/edit-role/:roleId"
            element={<EditRole handleGetAllRoles={handleGetAllRoles} />}
          />
          <Route
            path="/*"
            element={<NoRouteFound navigateToPath={"/admin/role"} />}
          />
        </Routes>
      </div>

      <div className="showMastersData">
        <TableComponent
          tableHeading="All Roles"
          tableName={tableName}
          selectColumnList={selectColumnListRolesTable}
          sortByOptionList={sortByOptionRolesTable}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
          setTotalItems={setTotalItems}
          setTableData={setTableData}
          searchApiUrl={searchApiUrl}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
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
          itemName="Roles"
        >
          {tableData &&
            tableData.map((role, index) => (
              <RoleTableRow
                key={getUniqueId()}
                role={role}
                index={index + showRows * (currentPage - 1)}
                treeData={treeData}
                setTableData={setTableData}
                tableData={tableData}
              />
            ))}
        </TableComponent>

        <ConfirmDeleteModal
          onClickNo={() => navigate("")}
          onClickYes={() => handleDeleteRole()}
        />
      </div>
    </div>
  );
};

export default Role;
