import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { selectJobId } from "../../redux/slices/create-new-job-slice";
import { actionFieldIconsList, umActionFieldIconsList } from "../../resources/constant-data/CreateNewPosition";
import {
  dateFormatterForTimeZone,
  formatDateToDDMMYYYY,
} from "../../utils/dateFormatter";

import {deleteUserManagement,getUserManagement,getRoleUserManagement} from "../../redux/actions/create-user-management-action";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";
import WarningToast from "../../components/toasts/warning-toast";
import CustomTooltip from "../../components/CustomTooltip";
import { useCreateNewRole } from "./useCreateNewRole";


const CreateJobRowTable = ({ jobs,index }) => {
  const {setUserRolesForm,userRolesForm,userDetailsForm} = useCreateNewRole()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);

  const handleEdit = (e, job) => {
    e.preventDefault();
    navigate(`edit-user-management/${job.id}`, {
      state: { user:job,
      },
    });
  };

  const confirmDeleteUser = async () => {
    if (!pendingDeleteUser) return;
    try{
      await dispatch(deleteUserManagement({id: pendingDeleteUser.id})).unwrap();
      await dispatch(getRoleUserManagement()).unwrap();
      await dispatch(getUserManagement({
        filterList: [],
        sortList: [],
        pagingNo: 1,
        pageSize: 10,
      })).unwrap();
    }catch(err){
    } finally {
      setPendingDeleteUser(null);
    }
  };

  const handleStatus = (e, jobs) => {
    e.preventDefault();
    console.log(jobs.jobCreationStatus);

    if (jobs.jobCreationStatus === "100") {
      navigate(`/admin/define-interview`);
    } else {
      return WarningToast("Please enter job position details");
    }

    dispatch(selectJobId(jobs.jobId));
  };

  const handleJobPositionDetails = (e, jobs) => {
    e.preventDefault();
    navigate(`/admin/job-details/job-position-details`);
    dispatch(selectJobId(jobs.jobId));
  };

  return (
    <tr>
      <td>
        <ul className="action">
          {umActionFieldIconsList.map((data, index) => (
            <li
              key={index}
              style={{ padding: "2px" }}
              className={"job-actions-icon"}
            >
              <CustomTooltip
                content={
                  data.dataToolTipContent !== "Completed Job"
                    ? data.dataToolTipContent
                    : "Job User Details"
                }
                position="top"
              >
                {data.modal ? (
                  data.modal && (
                    <EvuemeModalTrigger modalId={"viewMoreInformationModal"}>
                      <i>
                        <EvuemeImageTag
                          imgSrc={data.imgSrc}
                          altText={data.imgSrc}
                          onClick={() => dispatch(selectJobId(jobs.jobId))}
                        />
                      </i>
                    </EvuemeModalTrigger>
                  )
                ) : data.dataToolTipContent === "Define Interview" ? (
                  <i>
                    <EvuemeImageTag
                      imgSrc={data.imgSrc}
                      altText={data.imgSrc}
                      height="13px"
                      className={
                        jobs.jobCreationStatus === null ||
                          jobs.jobCreationStatus === "25"
                          ? "redColorFilter"
                          : "greenColorFilter"
                      }
                      onClick={(e) => {
                        handleStatus(e, jobs);
                      }}
                    />
                  </i>
                ) : data.dataToolTipContent === "Delete User" ? (
                  <EvuemeModalTrigger modalId={"confirmDeleteModal"}>
                    <i>
                      <EvuemeImageTag
                        imgSrc={data.imgSrc}
                        altText={data.imgSrc}
                        onClick={() => setPendingDeleteUser(jobs)}
                      />
                    </i>
                  </EvuemeModalTrigger>
                ) : data.dataToolTipContent === "Edit User" ? (
                  <i>
                    <EvuemeImageTag
                      imgSrc={data.imgSrc}
                      altText={data.imgSrc}
                      onClick={(e) => {
                        handleEdit(e, jobs);
                      }}
                    />
                  </i>
                ) : data.dataToolTipContent === "Completed Job" ? (
                  <i>
                    <EvuemeImageTag
                      imgSrc={data.imgSrc}
                      altText={data.imgSrc}
                      onClick={(e) => {
                        handleJobPositionDetails(e, jobs);
                      }}
                    />
                  </i>
                ) : (
                  <i>
                    <EvuemeImageTag
                      className={"job-actions-icon"}
                      imgSrc={data.imgSrc}
                      altText={data.imgSrc}
                    />
                  </i>
                )}
              </CustomTooltip>
            </li>
          ))}
        </ul>
      </td>
      <TableDataOverflowWrapper content={`${jobs?.firstName} ${jobs?.lastName}`} />
      <td>{jobs.primaryEmailId}</td>
      <td>{jobs.mobileNumber1}</td>
      <td>{jobs.whatsappNumber}</td>
      <td>{jobs.roleName}</td>
     
      <ConfirmDeleteModal
        onClickYes={confirmDeleteUser}
        onClickNo={() => setPendingDeleteUser(null)}
      />
    </tr>
  );
};

export default CreateJobRowTable;