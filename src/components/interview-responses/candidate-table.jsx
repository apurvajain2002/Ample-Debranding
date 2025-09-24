import { useEffect, useState } from "react";
import EvuemeLoader from "../loaders/evueme-loader";
import { baseUrl } from "../../config/config";
import axiosInstance from "../../interceptors";
import ErrorToast from "../toasts/error-toast";
import { useSelector } from "react-redux";

const CandidateTable = () => {
  const [candidateDetails, setCandidateDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const { selectedCandidateInfo } = useSelector(
    (state) => state.interviewResponsesL1DashboardSliceReducer
  );

  return (
    <div className="box-main-bg mb-15" c>
      {loading && <EvuemeLoader />}
      <div className="row">
        <aside className="col xl6 l6 m6 s12">
          <h4>
            Name: <span>{selectedCandidateInfo?.name}</span>
          </h4>
        </aside>
        <aside className="col xl6 l6 m6 s12">
          <ul className="socialbox-ul">
            <li>
              <a
                target="_blank"
                href={candidateDetails["userSocialProfileDTO"]?.linkedInProfile}
                className="tooltipped linked-in"
                data-position="top"
                data-tooltip="LinkedIn Profile"
              ></a>
            </li>
            <li>
              <a
                target="_blank"
                href={`http://github.com/${
                  candidateDetails["userSocialProfileDTO"]?.githubUsername ?? ""
                }`}
                className="tooltipped github"
                data-position="top"
                data-tooltip="GitHub"
              ></a>
            </li>
            <li>
              <a
                target="_blank"
                href={
                  candidateDetails["userSocialProfileDTO"]?.stackOverflowProfile
                }
                className="tooltipped stackoverflow"
                data-position="top"
                data-tooltip="Stack Overflow"
              ></a>
            </li>
            <li>
              <a
                target="_blank"
                href={candidateDetails["userSocialProfileDTO"]?.resumeFile}
                className="tooltipped resume-ico"
                data-position="top"
                data-tooltip="CV"
              ></a>
            </li>
          </ul>
        </aside>
      </div>
      <table className="box-table">
        <tr>
          <th>Highest Degree</th>
          <th>Experience</th>
          <th>Company</th>
          <th>Designation</th>
          <th>CTC</th>
          <th>Joining Time</th>
          <th>Current Location</th>
        </tr>
        <tr className="table-content">
          <td> {selectedCandidateInfo?.higherEducation} </td>
          <td> {selectedCandidateInfo?.totalExperience} </td>
          <td> {selectedCandidateInfo.organizationName} </td>
          <td> {selectedCandidateInfo.designation} </td>
          <td> {selectedCandidateInfo.currentCTC} </td>
          <td> {selectedCandidateInfo.noticePeriod}</td>
          <td> {selectedCandidateInfo?.currentLocation} </td>
        </tr>
      </table>
    </div>
  );
};

export default CandidateTable;
