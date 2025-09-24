import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { selectJobId } from "../../redux/slices/create-new-job-slice";
import {
  dateFormatterForTimeZone,
  formatDateToDDMMYYYY,
} from "../../utils/dateFormatter";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";
import WarningToast from "../../components/toasts/warning-toast";
import CustomTooltip from "../../components/CustomTooltip";
import { icon } from "../../components/assets/assets";

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

  const actionFieldIconsList = [
    {
      dataToolTipContent: "Completed Job",
      imgSrc: icon.officeChairIcon,
    },
    {
      dataToolTipContent: "Define Interview",
      imgSrc: icon.accountSettingIcon,
    },
    {
      dataToolTipContent: "Edit Position",
      imgSrc: icon.editBoxIcon,
    },
  ];

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
                    : "Job User Details"
                }
                position="top"
              >
                <i>
                  <EvuemeImageTag
                    imgSrc={data.imgSrc}
                    altText={data.imgSrc}
                    onClick={(e) => {

                    }}
                  />
                </i>
              </CustomTooltip>
            </li>
          ))}
        </ul>
      </td>
      <TableDataOverflowWrapper content={jobs?.positionName} />
      <td>{jobs.positionCounts}</td>
      <td>{formatDateToDDMMYYYY(dateFormatterForTimeZone(jobs.vacancyStartDate))}</td>
      <td>{formatDateToDDMMYYYY(dateFormatterForTimeZone(jobs.vacancyClosureDate))}</td>
      <td>{formatDateToDDMMYYYY(dateFormatterForTimeZone(jobs.vacancyClosureDate))}</td>
      <td>{formatDateToDDMMYYYY(dateFormatterForTimeZone(jobs.vacancyClosureDate))}</td>
      <td>{formatDateToDDMMYYYY(dateFormatterForTimeZone(jobs.vacancyClosureDate))}</td>
    </tr>
  );
};

export default CreateJobRowTable;