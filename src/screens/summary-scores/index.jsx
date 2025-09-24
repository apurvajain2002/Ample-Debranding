import { useEffect, useState } from "react";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { icon } from "../../components/assets/assets";
import TableComponent from "../../components/table-components/table-component";
import CandidateSummaryTableRow from "./candidate-summary-table-row";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../config/config";
import { getAllSummaryScoreRows } from "../../redux/actions/summary-scores-actions";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import {
  setIsLoading,
  setSearchValue,
  setTotalItems,
  setTableData,
} from "../../redux/slices/summary-scores-slice";

const tableHeadValues = [
  {
    optionKey: "ID",
    optionValue: "id",
  },
  {
    optionKey: "Job Title",
    optionValue: "jobTitle",
    allowFilter: true,
    customTableName: "jobdetails",
    customOptionValue: "position_name"
  },
  {
    optionKey: "Locations",
    optionValue: "locations",
    allowFilter: true,
    customTableName: "city",
    customOptionValue: "name"
  },
  {
    optionKey: "Interview Round",
    optionValue: "interviewRound",
    allowFilter: true,
    customTableName: "interviewroundstable",
    customOptionValue: "interview_rounds"
  },
  {
    optionKey: "Candidates Completed",
    optionValue: "candidatesCompleted",
  },
  {
    optionKey: "HR Level",
    optionValue: "hrLevel",
  },
  {
    optionKey: "L1 Level",
    optionValue: "l1Level",
  },
  {
    optionKey: "L2 Level",
    optionValue: "l2Level",
  },
  {
    optionKey: "L3 Level",
    optionValue: "l3Level",
  },
  {
    optionKey: "Offered",
    optionValue: "offered",
  },
  {
    optionKey: "Joined",
    optionValue: "joined",
  },
];

const searchApiUrl = `${baseUrl}/job-posting/api/candidate-status/get-job-round-users`;
const tableName = "summaryscores";

const SummaryScores = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.signinSliceReducer);
  const {
    totalItems,
    tableData,
    isLoading,
    // successMessage,
    searchValue,
    // failMessage,
  } = useSelector((state) => state.summaryScoresScliceReducer);

  const [showRows, setShowRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!searchValue) {
      dispatch(
        getAllSummaryScoreRows({
          currentPage,
          showRows,
          newFilterArray: filterArray,
          customSortArray: customSortArray,
        })
      );
    }
  }, [showRows, currentPage, customSortArray, filterArray, searchValue]);

  return (
    <div className="container summary-scores-container">
      <ul className="breadcrome-wr">
        <li>
          <a href="">
            <i>
              <EvuemeImageTag imgSrc={icon.homeIcon} altText="" />
            </i>
            &nbsp; Home
          </a>
        </li>
        <li>Sees Summary Scores</li>
      </ul>
      <h3 className="h3-header">My dashboard</h3>
      <div className="body-box-header">
        <div className="body-box-body">
          <div className="row">
            <aside className="testing">
              <TableComponent
                showTableComponentHeader={true}
                showRows={showRows}
                setShowRows={setShowRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                tableHeadValues={tableHeadValues}
                displayCandidateSummaryColorCodes={true}
                totalItems={totalItems}
                setTotalItems={setTotalItems}
                getExcel={() => {}}
                searchApiUrl={searchApiUrl}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
                loading={isLoading}
                setLoading={setIsLoading}
                customSortArray={customSortArray}
                setCustomSortArray={setCustomSortArray}
                tableName={tableName}
                setTableData={setTableData}
                isVCPLHeaderVisible={false}
                showPrintButton={false}
                showExcelButton={false}
                showPDFButton={false}
                showCustomFilter={true}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                filterArray={filterArray}
                setFilterArray={setFilterArray}
              >
                {isLoading ? (
                  <EvuemeLoader />
                ) : (
                  <CandidateSummaryTableRow
                    tableData={tableData}
                    userId={userId}
                    showRows={showRows}
                    currentPage={currentPage}
                  />
                )}
              </TableComponent>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryScores;
