import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { selectJobId } from "../../redux/slices/create-new-job-slice";
import { actionFieldIconsList } from "../../resources/constant-data/CreateNewPosition";
import {
  dateFormatterForTimeZone,
  formatDateToDDMMYYYY,
} from "../../utils/dateFormatter";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";
import getUniqueId from "../../utils/getUniqueId";
import WarningToast from "../../components/toasts/warning-toast";
import CustomTooltip from "../../components/CustomTooltip";

const CreateJobRowTable = ({ jobs }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = (e, job) => {
    e.preventDefault();
    navigate(`edit-job/${job.jobId}`, {
      state: {
        job,
      },
    });
  };

  const handleInviteCandidate = (e, job) => {
    e.preventDefault();
    navigate(`/admin/invite-link`);
    dispatch(selectJobId(jobs.jobId));
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
          {actionFieldIconsList.map((data, index) => (
            <li
              key={index}
              style={{ padding: "2px" }}
              className={"job-actions-icon"}
            >
              <CustomTooltip
                content={
                  data.dataToolTipContent !== "Completed Job"
                    ? data.dataToolTipContent
                    : "Enter Job Position Details"
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
                ) : data.dataToolTipContent === "Delete Position" ? (
                  <EvuemeModalTrigger modalId={"confirmDeleteModal"}>
                    <i>
                      <EvuemeImageTag
                        imgSrc={data.imgSrc}
                        altText={data.imgSrc}
                        onClick={() => {
                          dispatch(selectJobId(jobs.jobId));
                        }}
                      />
                    </i>
                  </EvuemeModalTrigger>
                ) : data.dataToolTipContent === "Edit Position" ? (
                  <i>
                    <EvuemeImageTag
                      imgSrc={data.imgSrc}
                      altText={data.imgSrc}
                      onClick={(e) => {
                        handleEdit(e, jobs);
                      }}
                    />
                  </i>
                ) : data.dataToolTipContent === "Invite Candidates" ? (
                  <i>
                    <EvuemeImageTag
                      imgSrc={data.imgSrc}
                      altText={data.imgSrc}
                      onClick={(e) => {
                        handleInviteCandidate(e, jobs);
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
      <TableDataOverflowWrapper content={jobs?.positionName} />
      <td>{jobs.positionCounts}</td>
      <td>
        {formatDateToDDMMYYYY(dateFormatterForTimeZone(jobs.vacancyStartDate))}
      </td>
      <td>
        {formatDateToDDMMYYYY(
          dateFormatterForTimeZone(jobs.vacancyClosureDate)
        )}
      </td>
      <TableDataOverflowWrapper content={jobs?.recruiterName?.join(",")} />
      <TableDataOverflowWrapper content={jobs?.interviewRounds?.join(",")} />
      <TableDataOverflowWrapper content={jobs?.locations?.join(",")} />
    </tr>
  );
};

export default CreateJobRowTable;
