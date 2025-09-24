import { useSelector } from "react-redux";
import CandidateRating from "../../components/interview-responses/candidate-rating";
import CandidateTable from "../../components/interview-responses/candidate-table";
import CandidateVideo from "../../components/interview-responses/candidate-video";
import CandidatesCard from "../../components/interview-responses/candidates-card";
import CandidateSearch from "../../components/interview-responses/candidate-search";
import { useState, useEffect } from "react";


const InterviewResponses = () => {
	const jobId = useSelector(state => state.createNewJobSliceReducer.jobId);

	const [selectedCandidateId, setSelectedCandidateId] = useState("");
	const [selectedQuestionData, setSelectedQuestionData] = useState(null);

	return (
		<div className="row row-margin">
			{/* <div>candidate-search</div> */}
			<div className="right-sidebar-can-search" >
				<CandidateSearch />
			</div>
			<aside className="col xl3 l3 m12 s12" style={{ paddingLeft: 0 }}>
				<CandidatesCard />
			</aside>

			<aside className="col xl9 l9 m12 s12" style={{ paddingRight: 0 }}>
				{/* <div className="row row-margin">
					<aside className="col xl6 l6 m6 s12"> */}
				<CandidateTable />



				<div className="row-margin">
					<aside className="col xl9 l9 m6 s12">
						<CandidateVideo setSelectedQuestionData={setSelectedQuestionData} />
					</aside>


					<aside className="col xl3 l3 m3 s12">
						<CandidateRating
							selectedCandidateId={selectedCandidateId}
							selectedQuestionData={selectedQuestionData} />
					</aside>
				</div>
			</aside>

		</div >
	)
}

export default InterviewResponses;
