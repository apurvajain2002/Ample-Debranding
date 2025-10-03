import { useEffect, useState } from "react";
import BreadCrome from "../../components/admin/admin-breadcrome/admin-breadcrome";
import SetJobAndRoundSection from "./set-job-and-round-section";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvitedCandidates } from "../../redux/actions/invited-candidates";
import {
  setMessagesEmpty,
  setSearchValue,
  setIsLoading,
  setTableData,
  setTotalItems,
} from "../../redux/slices/invited-candidates-slice";
import VCPLHeader from "./vcl-table-header";
import TableComponent from "../../components/table-components/table-component";
import InvitedCandidateTableRow from "./invited-candidate-table-row";
import ValidityModal from "../invite-link/validityModal";
import ErrorToast from "../../components/toasts/error-toast";
import SuccessToast from "../../components/toasts/success-toast";
import getUniqueId from "../../utils/getUniqueId";
import { useGlobalContext } from "../../context";
import { baseUrl } from "../../config/config";

const tableName = "inviteCandidates";
const jobIdColumnName = "inviteDetails.interviewRounds.jobId";
const interviewIdColumnName = "inviteDetails.interviewRounds.interviewRounds";
const searchApiUrl =
  `${baseUrl}/job-posting/interview-link/details`;

const InvitedCandidates = () => {
  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );

  const tableHeadValues = [
    {
      optionKey: "selectCheckbox",
      optionValue: "selectCheckbox",
      allowFilter: false,
    },
    {
      optionKey: "Candidate Details",
      optionValue: "candidateDetails",
      allowFilter: false,
    },
    {
      optionKey: "Type of interview sent",
      optionValue: "inviteStatus",
      allowFilter: true,
    },
    { optionKey: "Whatsapp", optionValue: "whatsappStatus", allowFilter: true },
    { optionKey: "Email", optionValue: "emailStatus", allowFilter: true },
    {
      optionKey: "Link Opening",
      optionValue: "linkOpeningStatus",
      allowFilter: true,
    },
    ...(userType === 'manpower') ? [
      {
        optionKey: "Status Update",
        optionValue: "statusUpdate",
        allowFilter: true,
      },
    ] : [],
    {
      optionKey: "Candidate Action",
      optionValue: "candidateAction",
      allowFilter: true,
    },
    {
      optionKey: "Recruiter Action",
      optionValue: "recruiterAction",
      allowFilter: false,
    },
  ];

  const [round, setRound] = useState("");
  const [showRows, setShowRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [timezone, setTimezone] = useState();
  const { selectedCandidates, setSelectedCandidates } = useGlobalContext();

  const dispatch = useDispatch();
  const {
    tableData,
    totalItems,
    searchValue,
    isLoading,
    successMessage,
    failMessage,
  } = useSelector((state) => state.invitedCandidatesSliceReducer);
  const { jobId } = useSelector((state) => state.createNewJobSliceReducer);


  console.log('tableData', tableData);
  console.log('totalItems', totalItems);
  console.log('searchValue', searchValue);
  console.log('isLoading', isLoading);
  console.log('successMessage', successMessage);
  console.log('failMessage', failMessage);

  // gets all invited candidates
  const handleGetAllCandidates = async () => {
    if (!jobId) return;
    dispatch(
      getAllInvitedCandidates({
        currentPage,
        showRows,
        filterArray,
        customSortArray,
      })
    );
  };

  // Handle filter submission from SetJobAndRoundSection
  const handleFilterSubmit = (filterPayload) => {
    console.log("Filter submission received in main component:", filterPayload);

    // Update the filter array with the new payload
    setFilterArray(filterPayload.filterList);

    // Reset pagination to first page
    setCurrentPage(1);

    console.log("Updated filter array:", filterPayload.filterList);

    // Apply the filters immediately
    if (filterPayload.filterList.length > 0) {
      console.log("Dispatching getAllInvitedCandidates with filters");

      // Show success message
      const filterCount = filterPayload.filterList.length;
      const filterNames = filterPayload.filterList.map(filter => {
        const columnName = filter.columnName.split('.').pop();
        return columnName.charAt(0).toUpperCase() + columnName.slice(1);
      }).join(', ');

      SuccessToast(`Filters applied successfully: ${filterNames} (${filterCount} filter${filterCount > 1 ? 's' : ''})`);

      dispatch(
        getAllInvitedCandidates({
          currentPage: 1,
          showRows,
          filterArray: filterPayload.filterList,
          customSortArray,
        })
      );
    }
  };

  useEffect(() => {
    document.title = "Check Invited Candidates";
  }, []);

  // success/fail message toast
  useEffect(() => {
    if (successMessage) {
      SuccessToast(successMessage);
    }

    if (failMessage) {
      ErrorToast(failMessage);
    }
    handleGetAllCandidates();
    dispatch(setMessagesEmpty());
  }, [successMessage, failMessage]);

  // get all invited candidates on update
  useEffect(() => {
    handleGetAllCandidates();
  }, [showRows, currentPage, customSortArray, filterArray, jobId]);

  useEffect(() => {
    if (jobId) {
      const newColumnObj = {
        columnName: jobIdColumnName,
        values: [jobId],
      };
      setFilterArray((prev) => {
        const ind = prev.findIndex(
          (column) => column.columnName === jobIdColumnName
        );
        if (ind === -1) {
          return [...prev, newColumnObj];
        }
        const newArray = [...prev];
        newArray[ind] = newColumnObj;
        return newArray;
      });
    }
  }, [jobId]);

  useEffect(() => {
    if (round) {
      const newColumnObj = {
        columnName: interviewIdColumnName,
        values: [round],
      };
      setFilterArray((prev) => {
        const ind = prev.findIndex(
          (column) => column.columnName === interviewIdColumnName
        );
        if (ind === -1) {
          return [...prev, newColumnObj];
        }
        const newArray = [...prev];
        newArray[ind] = newColumnObj;
        return newArray;
      });
    }
  }, [round]);

  useEffect(() => {
    if (!searchValue || searchValue === "") handleGetAllCandidates();
  }, [searchValue, currentPage, showRows, customSortArray, filterArray]);

  return (
    <div className="container">
      <BreadCrome />
      <SetJobAndRoundSection
        round={round}
        setRound={setRound}
        onFilterSubmit={handleFilterSubmit}
      />
      <div className="bodybox-bodywr">
        <h3>Vacant Positions Listings</h3>
        <div className="body-box-bodybg">
          <TableComponent
            currentPage={currentPage}
            customSortArray={customSortArray}
            filterArray={filterArray}
            itemName="candidates"
            loading={isLoading}
            searchApiUrl={searchApiUrl}
            searchValue={searchValue}
            setCurrentPage={setCurrentPage}
            setCustomSortArray={setCustomSortArray}
            setFilterArray={setFilterArray}
            setLoading={setIsLoading}
            setSearchValue={setSearchValue}
            setShowRows={setShowRows}
            setShowCustomSort={setShowCustomSort}
            setTableData={setTableData}
            setTotalItems={setTotalItems}
            showRows={showRows}
            showCustomSort={showCustomSort}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            tableData={tableData}
            tableHeadValues={tableHeadValues}
            tableName={tableName}
            totalItems={totalItems}
            selectedCandidates={selectedCandidates}
            setSelectedCandidates={setSelectedCandidates}
            isVCPLHeaderVisible={true}
            vclTableData={tableData}
          >
            {tableData.map((row, index) => (
              <InvitedCandidateTableRow
                candidateInvitation={row}
                key={getUniqueId()}
                userType={userType}
              />
            ))}
          </TableComponent>
        </div>
      </div>
      <ValidityModal
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        timezone={timezone}
        setTimezone={setTimezone}
      />
    </div>
  );
};

export default InvitedCandidates;
