import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import TableComponent from "../../components/table-components/table-component";
import CreateLocation from "./create-location";
import EditLocation from "./edit-location";
import LocationTableRow from "./location-table-row";
import {
  setIsLoading,
  setMessagesEmpty,
  setTableData,
} from "../../redux/slices/location-slice";
import {
  deleteLocation,
  getAllLocations,
  getCountries,
} from "../../redux/actions/location-actions/location-actions";
import "../../styles/style.css";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../components/toasts/error-toast";
import SuccessToast from "../../components/toasts/success-toast";
import getUniqueId from "../../utils/getUniqueId";

const tableHeadValues = [
  "S.No.",
  "Country",
  "State",
  "City",
  "Address",
  "Edit/Delete Location",
];

const searchApiUrl = `${baseUrl}/common/location/search-locations`;

const Location = () => {
  const {
    totalItems,
    deleteLocationId,
    tableData,
    isLoading,
    successMessage,
    failMessage,
  } = useSelector((state) => state.manageLocationsSliceReducer);
  const selectColumnListCountriesTable = [
    { optionKey: "Select Column", optionValue: "" },
    { optionKey: "Id", optionValue: "id" },
    { optionKey: "Country", optionValue: "country" },
    { optionKey: "State", optionValue: "state" },
    { optionKey: "City", optionValue: "city" },
    { optionKey: "Address", optionValue: "address" },
  ];

  const sortByOptionIndustriesTable = [
    { optionKey: "Sort By Option", optionValue: "" },
    { optionKey: "Sort Ascending", optionValue: "asc" },
    { optionKey: "Sort Descending", optionValue: "dsc" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectColumn, setSelectColumn] = useState("countryName");
  const [sortByOption, setSortByOption] = useState("asc");
  const [showRows, setShowRows] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get all countries
  useEffect(() => {
    fetchCountries();
    fetchAllLocations();
  }, []);

  const fetchCountries = () => {
    const data = dispatch(getCountries());
    return data;
  };

  const fetchAllLocations = () => {
    dispatch(getAllLocations());
  };
  // Delete Location
  const handleDeleteLocation = () => {
    dispatch(deleteLocation({ deleteLocationId }));
  };

  useEffect(() => {
    if (failMessage) {
      ErrorToast(failMessage);
    } else if (successMessage) {
      SuccessToast(successMessage);
      dispatch(getAllLocations());
    }
  }, [successMessage, failMessage]);

  useEffect(() => {
    dispatch(setMessagesEmpty());
  });

  return (
    <div className="container">
      <div className="createEditMasters">
        <Routes>
          <Route path="/" element={<CreateLocation />} />
          <Route path="/edit-location/:locationId" element={<EditLocation />} />
        </Routes>
      </div>
      <div className="showRoles">
        <TableComponent
          tableHeading="All Locations"
          selectColumnList={selectColumnListCountriesTable}
          sortByOptionList={sortByOptionIndustriesTable}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
          searchApiUrl={searchApiUrl}
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
        >
          {tableData?.list?.length !== 0 &&
            tableData?.list?.map((location, index) => (
              <LocationTableRow key={getUniqueId()} location={location} index={index} />
            ))}
        </TableComponent>

        <ConfirmDeleteModal
          onClickNo={() => navigate("")}
          onClickYes={() => handleDeleteLocation()}
        />
      </div>
    </div>
  );
};

export default Location;
