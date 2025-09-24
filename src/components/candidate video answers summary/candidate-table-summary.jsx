import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CandidateTableSummary = () => {
  const [candidateDetails, setCandidateDetails] = useState({});
  const { selectedCandidateInfo } = useSelector(
    (state) => state.interviewResponsesL1DashboardSliceReducer
  );

  return (
    <div class="box-main-bg minheightbox">
      <h4>
        Name: <span>{selectedCandidateInfo?.name}</span>
      </h4>
      <table class="box-table">
        <tr>
          <td>Highest Degree</td>
          <td> {selectedCandidateInfo?.higherEducation} </td>
        </tr>
        <tr>
          <td>Experience</td>
          <td> {selectedCandidateInfo?.totalExperience} </td>
        </tr>
        <tr>
          <td>Company</td>
          <td> {selectedCandidateInfo.organizationName} </td>
          </tr>
        <tr>
          <td>Designation</td>
          <td> {selectedCandidateInfo.designation } </td>
          </tr>
        <tr>
          <td>CTC</td>
          <td> {selectedCandidateInfo.currentCTC } </td>
          </tr>
        <tr>
          <td>Joining Time</td>
          <td> {selectedCandidateInfo.noticePeriod }</td>
          </tr>
        <tr>
          <td>Current Location</td>
          <td> {selectedCandidateInfo?.currentLocation} </td>
          </tr>
      </table>
{/* 
      <td> {selectedCandidateInfo.organizationName} </td>
					<td> {selectedCandidateInfo.designation } </td>
					<td> {selectedCandidateInfo.currentCTC } </td>
					<td> {selectedCandidateInfo.noticePeriod }</td>
					<td> {selectedCandidateInfo?.currentLocation} </td> */}

      <ul className="socialbox-ul" style={{ textAlign: "start" }}>
        <li>
          <a
            target="_blank"
            href={candidateDetails["userSocialProfileDTO"]?.linkedInProfile}
            className="linked-in"
          ></a>
        </li>
        <li>
          <a
            target="_blank"
            href={`http://github.com/${
              candidateDetails["userSocialProfileDTO"]?.githubUsername ?? ""
            }`}
            className="github"
          ></a>
        </li>
        <li>
          <a
            target="_blank"
            href={
              candidateDetails["userSocialProfileDTO"]?.stackOverflowProfile
            }
            className="stackoverflow"
          ></a>
        </li>
        <li>
          <a
            target="_blank"
            href={candidateDetails["userSocialProfileDTO"]?.resumeFile}
            className="resume-ico"
          ></a>
        </li>
      </ul>
    </div>
  );
};

export default CandidateTableSummary;
