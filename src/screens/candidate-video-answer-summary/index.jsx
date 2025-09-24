import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CandidateLHiringRoundScore from "../../components/candidate-video-answers-summary/candidate-l1hiring-round-score";
import CandidateQuestionDisplay from "../../components/candidate-video-answers-summary/candidate-question-display";
import CandidateRecruiterRoundScore from "../../components/candidate-video-answers-summary/candidate-recruiter-round-score";
import CandidateTableSummary from "../../components/candidate-video-answers-summary/candidate-table-summary";

const CandidateVideoAnswerSummary = () => {
    const location = useLocation();
  const { selectedQuestionData } = location.state || {};
    const {filteredCandidateResponseList,selectedCandidateInfo,SelectedCandidateRating, candidateResponseList} = useSelector((state)=>state.interviewResponsesL1DashboardSliceReducer);
    
    

    return (
        <div className="right-sidebar-summary">
            <div className="container">
                <div className="row row-margin">
                    <aside className="col xl4 l4 m4 s12">
                        <CandidateTableSummary />
                    </aside>
                    <aside className="col xl4 l4 m4 s12">
                        <CandidateRecruiterRoundScore 
                        selectedQuestionData={selectedQuestionData}/>
                    </aside>
                    <aside className="col xl4 l4 m4 s12">
                        <CandidateLHiringRoundScore />
                    </aside>
                    <aside className="col xl12 l12 m12 s12" style={{marginTop: "1rem"}}>
                        <CandidateQuestionDisplay />
                    </aside>


                </div>
            </div>
        </div>
    )

}

export default CandidateVideoAnswerSummary;