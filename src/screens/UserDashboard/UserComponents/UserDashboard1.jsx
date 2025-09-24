import { useState, useEffect } from "react";
// import TableComponent from "../../../../components/table-components/table-component";
import TableComponent from "../../../components/table-components/table-component";
// import UserInterviewTableRow from "./UserInterviewTableRow";
import UserInterviewTableRow from "./UserInterviews/UserInterviewTableRow";
import { useDispatch, useSelector } from "react-redux";
import {getUserInterviews} from "../../../redux/actions/user-informations";
// import getUniqueId from "../../../../utils/getUniqueId";
import getUniqueId from "../../../utils/getUniqueId";

const sortByOptionTable = [
  { optionKey: "Sort By Option", optionValue: "" },
  { optionKey: "Sort Ascending", optionValue: "asc" },
  { optionKey: "Sort Descending", optionValue: "dsc" },
];



const tableHeadValues = [
  // { optionKey: "Select Column", optionValue: "" },
  { optionKey: "Invite From", optionValue: "inviteForm", allowFilter: false },
  {
    optionKey: "Position Name",
    optionValue: "positionName",
    allowFilter: true,
  },
  {
    optionKey: "Vacancy Location",
    optionValue: "vacancyLocation",
    allowFilter: true,
  },
  { optionKey: "CTC", optionValue: "ctc", allowFilter: true },
  {
    optionKey: "Interview Round",
    optionValue: "interviewRound",
    allowFilter: true,
  },
  {
    optionKey: "Interview Start",
    optionValue: "interviewStart",
    allowFilter: true,
  },
  {
    optionKey: "Interview Link Validity",
    optionValue: "interviewLinkValidity",
    allowFilter: true,
  },
  {
    optionKey: "Interview Link",
    optionValue: "interviewLink",
    allowFilter: false,
  },
  { optionKey: "Status", optionValue: "status", allowFilter: true },
  { optionKey: "Result", optionValue: "result", allowFilter: true },
];

const UserInterview = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [totalItems, setTotalItems] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const userid = useSelector((state)=>state.signinSliceReducer.userId);
  const interviewList = useSelector((state)=>state.userInfoReducer.interviewList)
  useEffect(() => {
    dispatch(getUserInterviews(userid));
    console.log("userid: "+userid);
    // dispatch(getUserInterviews(1366));
  }, []);
  return (
    <>

        <div className="right-sidebar candidate-rightwrapper">
          <div className="container">
            <header className="mapfile-header body-box-top">
              <h3>My Interviews</h3>
            </header>
            <div className="showMastersData">
              <TableComponent
                tableName="UserInterviews"
                tableHeadValues={tableHeadValues}
                tableData={interviewList}
                selectColumnList={tableHeadValues}
                sortByOptionList={sortByOptionTable}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
                setTotalItems={setTotalItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                showRows={showRows}
                setShowRows={setShowRows}
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
                itemName="Roles"
              >
                {interviewList &&
                  interviewList.map((userData, index) => (
                    <UserInterviewTableRow
                      key={getUniqueId()}
                      userData={userData}
                      index={index}
                    />
                  ))}
              </TableComponent>
            </div>
          </div>
        </div>
    </>
  );
};

export default UserInterview;
