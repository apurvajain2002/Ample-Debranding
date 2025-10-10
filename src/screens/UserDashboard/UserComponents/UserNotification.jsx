import { useEffect, useRef, useState } from "react";
import TableComponent from "../../../components/table-components/table-component.jsx";
import NotificationRow from "./NotificationRow.jsx";
import { getUserNotifications } from "../../../redux/actions/user-informations/index.js";
import { useDispatch, useSelector } from "react-redux";
import getUniqueId from "../../../utils/getUniqueId.js";
import EvuemeModalTrigger from "../../../components/modals/evueme-modal-trigger.jsx";
import NotificationMsgDetails from "../../../components/modals/notification-message-details/index.jsx";

const sortByOptionTable = [
  { optionKey: "Sort By Option", optionValue: "" },
  { optionKey: "Sort Ascending", optionValue: "asc" },
  { optionKey: "Sort Descending", optionValue: "dsc" },
];

const tableHeadValues = [
  {
    optionKey: "Date and Time",
    optionValue: "inviteSentTime",
    allowFilter: false,
  },
  { optionKey: "Company Name", optionValue: "inviteFrom", allowFilter: false },
  {
    optionKey: "Communication Mode",
    optionValue: "communicationMode",
    allowFilter: true,
  },
  { optionKey: "Message to", optionValue: "messageTo", allowFilter: false },
  { optionKey: "Subject Line", optionValue: "subjectLine", allowFilter: false },
  {
    optionKey: "Message Details",
    optionValue: "messageDetails",
    allowFilter: false,
  },
  {
    optionKey: "Message Status",
    optionValue: "status",
    allowFilter: true,
  },
];

const UserNotification = () => {
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const modalTriggerRef = useRef(null);
  const [messageBodyContent, setMessageBodyContent] = useState(null);

  const openMessageDetailsModal = (userData) => {
    // console.log("modalTriggerRef.current",userData?.messageDetails);
    // console.log("messageBodyContent------------>",messageBodyContent);
    
    // Set the content first, then open the modal
    setMessageBodyContent(userData?.messageDetails);
    
    // Use setTimeout to ensure state is updated before opening modal
    setTimeout(() => {
      if (modalTriggerRef.current) {
        modalTriggerRef.current.click();
      }
    }, 100);
  };

  const {
    candidateGetInviteTableData,
    totalItems,
    setTotalItems
  } = useSelector((state) => state.userInfoReducer);

  useEffect(() => {
    dispatch(getUserNotifications({ userId, requestType: 'interview' }));
  }, []);

  return (
    <>
      <div className="main-section clogin-section">
        <div className="right-sidebar candidate-rightwrapper">
          <div className="container">
            <header className="mapfile-header body-box-top">
              <h3>My Notification</h3>
            </header>
            <div className="showMastersData">
              <TableComponent
                currentPage={currentPage}
                customSortArray={customSortArray}
                filterArray={filterArray}
                itemName="Roles"
                loading={isLoading}
                searchValue={searchValue}
                setCurrentPage={setCurrentPage}
                setCustomSortArray={setCustomSortArray}
                setFilterArray={setFilterArray}
                setLoading={setIsLoading}
                setSearchValue={setSearchValue}
                setShowRows={setShowRows}
                setShowCustomSort={setShowCustomSort}
                setTotalItems={setTotalItems}
                showRows={showRows}
                showCustomSort={showCustomSort}
                tableData={candidateGetInviteTableData}
                tableHeadValues={tableHeadValues}
                tableName="Notifications"
                totalItems={totalItems}
              >
                {candidateGetInviteTableData &&
                  candidateGetInviteTableData.map((userData, index) => (
                    <NotificationRow
                      key={getUniqueId()}
                      userData={userData}
                      index={index}
                      onclick={() => openMessageDetailsModal(userData)}
                    />
                  ))}
              </TableComponent>
            </div>
          </div>
          {/* <AdminFooter /> */}
          {/* <footer className="main-footer">
                        <div className="container">
                            <div className="footer-right right">
                                <span>Strategic Partner</span>
                                <a href="#" className="logo-main"><img src={image.brandEvuemeStrategicPartnerLogo} alt="" /></a>
                            </div>
                        </div>
                    </footer> */}
        </div>
      </div>
      <EvuemeModalTrigger modalId={"notificationMsgDetailsModal"} ref={modalTriggerRef}></EvuemeModalTrigger>
      <NotificationMsgDetails content={messageBodyContent} />
    </>
  );
};
export default UserNotification;
