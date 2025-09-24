import { useSearchParams } from "react-router-dom";
import CandidateFiltrationQuestionRecruiter from "../../components/interview-responses-recruiter/candidate-filtration-question-recruiter";
import CandidateQuestionSection from "../../components/interview-responses-recruiter/candidate-question-recruiter";
import CandidateSearchRecruiter from "../../components/interview-responses-recruiter/candidate-search-recruiter";
import CandidateTableRecruiter from "../../components/interview-responses-recruiter/candidate-table-recruiter";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const InterviewResponseRecruiter = () => {

    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
    const [displayQuestionList, setDisplayQuestionList] = useState([]);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showtable, setShowTable] = useState(false);
    const [filteredQueList, setFilteredQueList] = useState([]);
    const [selectedJobId, setJobId] = useState("");
    const [selectedRoundId, setRoundId] = useState("");
   
    const {selectedQueTypes,questionsByTypes}  = useSelector((state)=>state.interviewResponsesRecruiterDashboardSliceReducer);
       const [selectedInterviewers, setSelectedInterviewers] = useState([]); 

    const handleQuestionTypeChange = (types) => {
        setSelectedQuestionTypes(types);
    };


    useEffect(() => {
        console.log("Selected Interviewers list in the parent:", selectedInterviewers);
    }, [selectedInterviewers]);

    useEffect(()=>{
        console.log("displayQuestionLIst",displayQuestionList);
    },[displayQuestionList])

    return (
        <div className="row row-margin">
            <div class="right-sidebar-can-search-recruiter">
                <CandidateSearchRecruiter
                    onQuestionTypeChange={handleQuestionTypeChange}
                    setShowQuestions={setShowQuestions}
                    setShowTable={setShowTable}
                    filteredQueList={filteredQueList}
                    setFilteredQueList={setFilteredQueList}
                    setDisplayQuestionList={setDisplayQuestionList}
                    setJobId={setJobId}
                    setRoundId={setRoundId}
                    setSelectedInterviewers={setSelectedInterviewers} 
                />
            </div>
            {showQuestions && (
                <div class="bodybox-bodywr-recruiter">

                    {selectedQueTypes?.includes("filtration") && (
                        <CandidateFiltrationQuestionRecruiter
                            questions={questionsByTypes}
                            type={selectedQueTypes}
                            setShowTable={setShowTable}
                        />
                    )}
                    
                    {selectedQueTypes?.some((type) => ["audio", "video", "mcq"].includes(type)) && (
                        <CandidateQuestionSection
                            questions={questionsByTypes}
                            type={selectedQueTypes}
                            setShowTable={setShowTable}
                       
                        />
                    )}
                </div>
            )}
            {showQuestions && showtable && (
                <div class="body-box-header m30 candidateTableRecruiter">
                    <CandidateTableRecruiter selectedInterviewersInJob={selectedInterviewers}/>
                </div>
             )}
        </div>
    )
}

export default InterviewResponseRecruiter;