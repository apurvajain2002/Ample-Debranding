import { useEffect, useState } from "react";
import EvuemeModal from "../../modals/evueme-modal";
import { useSelector } from "react-redux";
import { getAllInterviewrs } from "../../../redux/actions/create-job-actions";
import { useDispatch } from "react-redux";

const ViewMoreInformationModal = ({ candidateInformation }) => {
  const [details, setDetails] = useState("");
  const { tableData, jobId, currentJobDetails } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );

  const dispatch = useDispatch();
  const [interviewersName, setInterviewersName] = useState([]);

  useEffect(() => {
    setDetails(tableData.find((val) => val.jobId === jobId));
  }, [jobId, tableData]);

  useEffect(() => {
    // Only call getAllInterviewrs() if user is not a recruiter
    if (userType !== "recruiter") {
      dispatch(getAllInterviewrs());
    }
  }, [dispatch, userType]);

  useEffect(() => {
    const ivNames = interviewrs?.filter((iv) =>
      currentJobDetails?.interviewers?.includes(String(iv.id))
    );
    setInterviewersName(ivNames);
  }, [currentJobDetails, interviewrs]);




  const getInterviewerNames = (ids) => {
    const names = ids?.map(id => {
        const numericId = parseInt(id, 10); 
        const interviewer = interviewrs?.find(interviewer => interviewer?.id === numericId);
        return interviewer 
            ? `${interviewer?.firstName.trim()} ${interviewer?.lastName.trim()}` 
            : 'Unknown';
    });

    return names?.join(', ');
};

const interviewerNames = getInterviewerNames(details?.interviewers);
  
  
  

  return (
    <EvuemeModal modalId={"viewMoreInformationModal"}>
      <h6>View More Information</h6>

      <div className="table-bodywr">
        <table>
          <tbody>
            {/* <tr>
              <td>{"Domain Skills"}</td>
              <td>
                {(details?.domainSkills && details?.domainSkills.join(",")) ||
                  "NA"}
              </td>
            </tr> */}
            <tr>
              <td>{"Domain Skills"}</td>
              <td>
                {details?.domainSkills && details.domainSkills.length > 0
                  ? details.domainSkills.map((skill, index) => `${index + 1}. ${skill}`).join(" ")
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td>{"Soft Skills"}</td>
              <td>
                {details?.softSkills && details.softSkills.length > 0
                  ? details.softSkills.map((skill, index) => `${index + 1}. ${skill}`).join(" ")
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td>{"Interviewers"}</td>
              <td>
                {interviewerNames||
                  "NA"}
              </td>
            </tr>
            <tr>
              <td>{"Approved Placement Agencies"}</td>
              <td>
                {details?.hiringType === "Lateral Hiring" && details?.placementAgencies && details.placementAgencies.length > 0
                  ? details.placementAgencies.map((agency, index) => `${index + 1}. ${agency}`).join(" ")
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td>{"Approved Campuses"}</td>
              <td>
                {details?.hiringType === "Campus Hiring" && details?.placementAgencies && details.placementAgencies.length > 0
                  ? details.placementAgencies.map((agency, index) => `${index + 1}. ${agency}`).join(" ")
                  : "NA"}
              </td>
            </tr>
            {/* <tr>
              <td>{"isPublished"}</td>
              <td>
                {(details?.isPublished && details?.isPublished.join(",")) ||
                  "NA"}
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </EvuemeModal>
  );
};

export default ViewMoreInformationModal;
