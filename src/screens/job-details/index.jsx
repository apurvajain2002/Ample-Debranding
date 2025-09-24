import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "../../styles/style.css";
import CreateJobDetails from "./create-job-details";
import BreadCrome from "../../components/admin/admin-breadcrome/admin-breadcrome";
import {
  getAllInterviewrs,
  getAllJob,
  getCampuses,
  getJob,
  getPlacementAgencies,
} from "../../redux/actions/create-job-actions";
import { getAllDomainSkills } from "../../redux/actions/domain-skill-actions/domain-skill-actions";
import { getAllSoftSkills } from "../../redux/actions/soft-skill-actions/soft-skill-actions";
import {
  setFailMessage,
  setSuccessMessage,
} from "../../redux/slices/create-new-job-slice";
import ErrorToast from "../../components/toasts/error-toast";
import SuccessToast from "../../components/toasts/success-toast";
import { getAllEntities } from "../../redux/actions/entity-actions/entity-actions";

const JobDetails = () => {
  const { jobId, currentJobDetails, successMessage, failMessage } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Add Job Details";
    dispatch(getJob({ jobId: jobId }));
    dispatch(
      getAllJob({
        currentPage: 1,
        showRows: null,
        selectColumn: null,
        sortByOption: null,
        job_status: null,
      })
    );
    dispatch(getAllDomainSkills({}));
    dispatch(getAllSoftSkills({}));
    dispatch(getAllInterviewrs());
    dispatch(getAllEntities());
    console.log("currentJobDetails",currentJobDetails);
    if(currentJobDetails){
      dispatch(getPlacementAgencies({orgId : currentJobDetails.orgId}));
      dispatch(getCampuses({orgId : currentJobDetails.orgId}));
    }
  }, []);


  

  useEffect(() => {
    if (failMessage) {
      ErrorToast(failMessage);
    } else if (successMessage) {
      SuccessToast(successMessage);
      dispatch(setSuccessMessage(""));
      dispatch(setFailMessage(""));
    }
  }, [successMessage, failMessage]);

  return (
    <div className="container">
      <BreadCrome />
      <div className="createEditMasters">
        <Routes>
          <Route
            path="/"
            element={<CreateJobDetails currentJobDetails={currentJobDetails} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default JobDetails;
