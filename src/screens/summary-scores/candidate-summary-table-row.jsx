import React from "react";
import getUniqueId from "../../utils/getUniqueId";
import Tooltip from "../../components/miscellaneous/tooltip";
import axiosInstance from "../../interceptors";
import downloadExcelPdfFile from "../../utils/download-excel-pdf-file";
import ErrorToast from "../../components/toasts/error-toast";
import { baseUrl } from "../../config/config";
import { icon } from "../../components/assets/assets";

const STATUS_TYPES = {
  AVAILABLE: "Available",
  CAN_CONSIDER: "Can Consider",
  REJECTED: "Rejected",
  SHORTLISTED: "Shortlisted",
  NOT_RATED: "Not rated",
};

const handleOnClickExcel = async (jobId, tableName) => {
  try {
    const { data } = await axiosInstance.post(
      `${baseUrl}/job-posting/report/download`,
      { jobId: jobId, dataType: 'excel' },
      {
        responseType: "blob",
      }
    );
    downloadExcelPdfFile(data, tableName, "xlsx");
  } catch (error) {
    ErrorToast("Failed to download excel!");
  }
};

const groupByStatus = (levelData) => {
  const statusMap = {
    [STATUS_TYPES.AVAILABLE]: { count: 0, candidates: [] },
    [STATUS_TYPES.CAN_CONSIDER]: { count: 0, candidates: [] },
    [STATUS_TYPES.REJECTED]: { count: 0, candidates: [] },
    [STATUS_TYPES.SHORTLISTED]: { count: 0, candidates: [] },
    [STATUS_TYPES.NOT_RATED]: { count: 0, candidates: [] },
  };

  const getStatusKey = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    if (lowerCaseStatus.includes("shortlisted")) {
      return STATUS_TYPES.SHORTLISTED;
    } else if (lowerCaseStatus.includes("rejected")) {
      return STATUS_TYPES.REJECTED;
    } else if (lowerCaseStatus.includes("available")) {
      return STATUS_TYPES.AVAILABLE;
    } else if (lowerCaseStatus.includes("can consider")) {
      return STATUS_TYPES.CAN_CONSIDER;
    } else {
      return STATUS_TYPES.NOT_RATED;
    }
  };

  levelData.forEach((candidate) => {
    const statusKey = getStatusKey(candidate.status);
    statusMap[statusKey].count += 1;
    statusMap[statusKey].candidates.push(candidate);
  });
  return statusMap;
};

const StatusCounts = ({ statusMap }) => (
  <ul className="box-color-ul summary-candidate-status-count">
    {Object.entries(statusMap).map(([status, { count, candidates }]) => (
      <li key={status}>
        <div
          className={`box-color-round ${status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {count}
          <Tooltip divTagCssClasses={"information-box infbox-click"}>
            <header>
              <h3>Status: {status}</h3>
            </header>
            <div className="table-bodywr table-responsive scrollable-candidates">
              <table className="striped">
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.candidateName}>
                      <td>
                        <img
                          src={candidate.image}
                          alt={`${candidate.candidateName}-thumbnail`}
                        />
                      </td>
                      <td>{candidate.candidateName}</td>
                      <td>
                        <span>Score</span> {candidate.score ?? "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tooltip>
        </div>
      </li>
    ))}
  </ul>
);

const getStringFromArray = (array = []) => {
  return array.join(", ");
};

const CandidateSummaryTableRow = ({
  tableData = [],
  showRows = 10,
  currentPage = 1,
}) => {
  return (
    <>
      {tableData.map(
        (
          {
            jobId,
            jobTitle,
            jobLocations,
            candidatesStatusList,
            jobRoundsList,
          },
          index
        ) => {
          const l1StatusCounts = groupByStatus(
            candidatesStatusList["L1 Status"]
          );
          const l2StatusCounts = groupByStatus(
            candidatesStatusList["L2 Status"]
          );
          const l3StatusCounts = groupByStatus(
            candidatesStatusList["L3 Status"]
          );
          const recruiterRoundStatusCounts = groupByStatus(
            candidatesStatusList["Recruiter Round Status"]
          );
          const l1RoundStatusCounts = groupByStatus(
            candidatesStatusList["L1 Round Status"]
          );
          const joined = candidatesStatusList["Joined"]?.length;
          const offered = candidatesStatusList["Offered"]?.length;
          const rowSpan = jobRoundsList.length;
          const candidatesCompletedL1 =
            candidatesStatusList["Recruiter Round Status"]?.length || 0;
          const candidatesCompletedRecruiter =
            candidatesStatusList["L1 Round Status"]?.length || 0;

          return (
            <React.Fragment key={getUniqueId()}>
              <tr className="custom-row">
                <td rowSpan={rowSpan} className="multi-row-span ">
                  {index + showRows * (currentPage - 1) + 1}
                </td>
                <td rowSpan={rowSpan} className="multi-row-span centered-td">
                  {jobTitle}
                  <span
                    onClick={() => handleOnClickExcel(jobId, "")}
                    title="Download Scores Excel"
                    className="cs-download-excel"
                  >
                    <img
                      src={icon.excelIconWhite}
                      alt="Download Excel"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </span>
                </td>
                <td rowSpan={rowSpan} className="multi-row-span ">
                  {getStringFromArray(jobLocations)}
                </td>
                <td className="multi-row-span">{jobRoundsList[0]}</td>
                <td className="multi-row-span">{candidatesCompletedL1}</td>
                <td className="multi-row-span">
                  <StatusCounts statusMap={recruiterRoundStatusCounts} />
                </td>
                <td rowSpan={rowSpan} className="multi-row-span ">
                  <StatusCounts statusMap={l1StatusCounts} />
                </td>
                <td rowSpan={rowSpan} className="multi-row-span ">
                  <StatusCounts statusMap={l2StatusCounts} />
                </td>
                <td rowSpan={rowSpan} className="multi-row-span ">
                  <StatusCounts statusMap={l3StatusCounts} />
                </td>
                <td rowSpan={rowSpan} className="multi-row-span ">
                  {offered}
                </td>
                <td rowSpan={rowSpan} className="multi-row-span ">
                  {joined}
                </td>
              </tr>
              {rowSpan > 1 && (
                <tr className="custom-row">
                  <td className="multi-row-span">{jobRoundsList[1]}</td>
                  <td className="multi-row-span">
                    {candidatesCompletedRecruiter}
                  </td>
                  <td className="multi-row-span">
                    <StatusCounts statusMap={l1RoundStatusCounts} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        }
      )}
    </>
  );
};

export default CandidateSummaryTableRow;
