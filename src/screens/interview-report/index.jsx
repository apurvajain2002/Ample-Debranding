import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateQuestionDisplay from "../../components/candidate-video-answers-summary/candidate-question-display";
import CandidateTableSummary from "../../components/candidate-video-answers-summary/candidate-table-summary";
import RatingSection from "../../components/candidate-score-summary/rating-section";
import CandidateListWidget from "../../components/candidate-score-summary/candidates-list-widget";
import CandidateSearch from "../../components/interview-responses/candidate-search";
import {
  fetchCandidateVideoScores,
  fetchCandidateList,
  fetchTotalQuestions,
  fetchSelectedCandidateInfo,
  fetchCandidateResponseList,
} from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { fetchFilterRejectCandidates } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import {
  setFilteredCandidateResponseList,
  setCandidateResponseMap,
  setSelectedQuestionMap,
} from "../../redux/slices/interview-responses-l1-dashboard-slice";

const InterviewReport = () => {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const dispatch = useDispatch();
  const {

    selectedQuestionMap,
    candidateResponseMap,
    candidateResponseList,
    totalQuestionList,
    displayCandidateWidgetList,
    fetchingCandidateList,
    selectedJobId,
    selectedRoundId,
    reportLink,
    roundSpecificHashMap,
  } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);

  useEffect(()=>{
    console.log(selectedJobId,"-",selectedRoundId);
    
    dispatch(fetchCandidateList({ selectedJobId, selectedRoundId,reportLink }));
    const responseType="audio,video";
    dispatch(fetchTotalQuestions({ selectedJobId, selectedRoundId,responseType }));
  },[])
  useEffect(() => {
    dispatch(
      setSelectedQuestionMap({ totalQuestionList, isViewByApplicant: true })
    );
  }, [totalQuestionList]);

  useEffect(() => {
    dispatch(
      setCandidateResponseMap({ candidateResponseList, selectedQuestionMap })
    );
  }, [candidateResponseList]);

  useEffect(() => {
    dispatch(
      setFilteredCandidateResponseList({
        selectedQuestionMap,
        candidateResponseMap,
        candidateResponseList,
        totalQuestionList,
      })
    );
  }, [candidateResponseMap]);

  useEffect(() => {
    if (selectedJobId && selectedRoundId) {
      dispatch(
        fetchFilterRejectCandidates({
          selectedJobId,
          selectedRoundId,
          questionData: {},
        })
      );
    }
  }, [selectedJobId, selectedRoundId]);

  const handleSelectApplicant = (id) => {
    setSelectedCandidateId(id);
    dispatch(fetchSelectedCandidateInfo({ id }));
    //TODO: Candidate ratings api needed to be varified.
    dispatch(fetchCandidateVideoScores({ selectedJobId, selectedRoundId }));
    const responseTypes = "video,audio";
    dispatch(
      fetchCandidateResponseList({ selectedJobId, selectedRoundId, id,responseTypes })
    );
  };

  return (
    <div style={{overflow:'auto'}}>
     <div className="right-sidebar-summary" >
        <div className="container">
          <div className="row row-margin">
            <aside className="col xl4 l4 m4 s12">
              <CandidateListWidget
                candidateList={displayCandidateWidgetList}
                handleSelectApplicant={handleSelectApplicant}
                fetchingCandidateList={fetchingCandidateList}
              />
            </aside>
            <aside className="col xl4 l4 m4 s12">
              <CandidateTableSummary />
            </aside>
            <aside className="col xl4 l4 m4 s12" style={{pointerEvents:'none',opacity:0.5}}>
              <RatingSection
                roundSpecificHashMap={roundSpecificHashMap}
                selectedCandidateId={selectedCandidateId}
                selectedRoundId={selectedRoundId}
              />
            </aside>
            <aside
              className="col xl12 l12 m12 s12"
              style={{ marginTop: "1rem" }}
            >
              <CandidateQuestionDisplay displayBackButton={false} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
