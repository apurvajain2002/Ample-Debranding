import { useState, useEffect, useRef } from "react";
import TableComponent from "../../../../components/table-components/table-component";
import UserInterviewTableRow from "./UserInterviewTableRow";
import { useDispatch, useSelector } from "react-redux";
import { getUserInterviews, getUserNotifications } from "../../../../redux/actions/user-informations";
import getUniqueId from "../../../../utils/getUniqueId";
import { setLogout } from "../../../../redux/slices/signin-slice";

const sortByOptionTable = [
  { optionKey: "Sort By Option", optionValue: "" },
  { optionKey: "Sort Ascending", optionValue: "asc" },
  { optionKey: "Sort Descending", optionValue: "dsc" },
];


const tableHeadValues = [
  { optionKey: "Invite From", optionValue: "inviteForm", allowFilter: false },
  {
    optionKey: "Position Name",
    optionValue: "positionName",
    allowFilter: false,
  },
  {
    optionKey: "Vacancy Location",
    optionValue: "vacancyLocation",
    allowFilter: false,
  },
  { optionKey: "CTC", optionValue: "ctc", allowFilter: false },
  {
    optionKey: "Interview Round",
    optionValue: "interviewRound",
    allowFilter: false,
  },
  {
    optionKey: "Interview Start",
    optionValue: "interviewStart",
    allowFilter: false,
  },
  {
    optionKey: "Interview Link Validity",
    optionValue: "interviewLinkValidity",
    allowFilter: false,
  },
  {
    optionKey: "Interview Link",
    optionValue: "interviewLink",
    allowFilter: false,
  },
  { optionKey: "Status", optionValue: "status", allowFilter: false },
  { optionKey: "Result", optionValue: "result", allowFilter: false },
];

const UserInterview = () => {
  // const userId2 = localStorage.getItem('userId');
  const userId = useSelector((state) => state.signinSliceReducer.userId);
  // const currentUser = useSelector(
  //   (state) => state.signinSliceReducer.currentUser
  // );
  // console.log("userId :: ", userId);
  
  const modalTriggerRef = useRef(null);
  const [messageBodyContent, setMessageBodyContent] = useState(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  const openMessageDetailsModal = (userData) => {
    if (modalTriggerRef.current) {
      modalTriggerRef.current.click();
      setMessageBodyContent(userData?.messageDetails);
    }
  };

  const {
    interviewList,
    totalItems,
    setTotalItems
  } = useSelector((state) => state.userInfoReducer);

  useEffect(() => {
    dispatch(getUserInterviews({ userId }));
  }, []);

  return (
    <>
      <div className="main-section clogin-section">
        <div className="right-sidebar candidate-rightwrapper">
          <div className="container">
            <header className="mapfile-header body-box-top">
              <h3>My Interviews</h3>
            </header>
            <div className="showMastersData">
              <TableComponent
                tableName="Notifications"
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
      </div>
    </>
  );
};

export default UserInterview;
