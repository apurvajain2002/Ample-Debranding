import { useDispatch, useSelector } from "react-redux";
import { optionMapper } from "../../utils/optionMapper";
import NormalInputField from "../input-fields/normal-input-field";
import RadioButtonInputField from "../input-fields/radio-button-input-field";
import SelectInputField from "../input-fields/select-input-field";
import CandidateProfile from "./candidate-profile";
import { searchedCandidateList } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import { useEffect, useState } from "react";
import { getAllJob } from "../../redux/actions/create-job-actions";
import { selectApplicant } from "../../redux/slices/interview-responses-slice";
import { image } from "../../components/assets/assets";
import EvuemeLabelTag from "../evueme-html-tags/evueme-label-tag";
import { setSelectedCandidateId, setCandidateResponseMap, setIsViewByApplicant, updateSelectedQuestionMap, setFilteredCandidateResponseList, setSelectedQuestionMap } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import { fetchCandidateResponseList, fetchSelectedCandidateInfo } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { useGlobalContext } from "../../context";
const CANDIDATE_LIST = [
	{
		id: 1,
		img: "cand-1.png",
		name: "Yash Naik",
		status: "Joined",
		score: 67
	},
	{
		id: 2,
		img: "cand-2.png",
		name: "Yash Naik",
		status: "Offered",
		score: 67
	},
	{
		id: 3,
		img: "cand-3.png",
		name: "Yash Naik",
		status: "L2 Shortlisted",
		score: 67
	},
	{
		id: 4,
		img: "cand-4.png",
		name: "Yash Naik",
		status: "L1 Shortlisted",
		score: 67
	},
	{
		id: 5,
		img: "cand-5.png",
		name: "Yash Naik",
		status: "L3 Shortlisted",
		score: 67
	},
	{
		id: 6,
		img: "cand-6.png",
		name: "Yash Naik",
		status: "HR Shortlisted",
		score: 67
	},
	{
		id: 7,
		img: "cand-1.png",
		name: "Yash Naik",
		status: "Can Consider",
		score: 67
	},
	{
		id: 8,
		img: "cand-1.png",
		name: "Yash Naik",
		status: "Rejected",
		score: 67
	},
	{
		id: 9,
		img: "cand-1.png",
		name: "Yash Naik",
		status: "Rejected",
		score: 67
	},
]
const QuestionList = [
	{ queId: 1, queText: "Please tell us something about yourself and your family?" },
	{ queId: 2, queText: "Please tell us what you plan to do after you have gained some work experience?" },
	{ queId: 3, queText: "Please tell us how you intend to develop yourself to be an expert in your are of work?" },
	{ queId: 4, queText: "Please tell us why it is important for you to be employed?" }
]

const CandidatesCard = () => {
	const tableData = useSelector(state => state.createNewJobSliceReducer.tableData);
	const jobId = useSelector(state => state.createNewJobSliceReducer.jobId);
	const [selectedView, setSelectedView] = useState("applicant");
	const dispatch = useDispatch();

	const { rootColor } = useGlobalContext();

	const { selectedJobId, selectedRoundId, isViewByApplicant, selectedCandidateId, selectedQuestionMap, candidateResponseMap, candidateResponseList, totalQuestionList, candidateList } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);


	const handleSelectApplicant = (id) => {

		dispatch(setSelectedCandidateId(id));
		dispatch(fetchCandidateResponseList({ selectedJobId, selectedRoundId, id }));
		dispatch(fetchSelectedCandidateInfo({ id }));
		// dispatch(setSelectedCandidateRating({}));

		if (isViewByApplicant) {

			updateFilterResponseList(selectedQuestionMap);
		}

	}


	useEffect(() => {
		dispatch(setCandidateResponseMap({ candidateResponseList, selectedQuestionMap }));
	}, [candidateResponseList]);

	useEffect(() => {

		dispatch(setFilteredCandidateResponseList({ selectedQuestionMap, candidateResponseMap, candidateResponseList, totalQuestionList }));

	}, [candidateResponseMap]);


	const sortingOptions = [
		{
			optionKey: "Descending Order",
			optionValue: "descending_order",
		},
		{
			optionKey: "Ascending Order",
			optionValue: "ascending_order",
		},
	];

	const [selectedOrder, setSelectedOrder] = useState("");
	const [searchText, setSearchText] = useState("");

	const handleOnChange = (event) => {
		const order = event.target.value;
		setSelectedOrder(order);

		// Dispatching the sorted list
		dispatch(
			searchedCandidateList({
				searchTerm: "", // Keeping searchTerm empty for now
				sortOrder: order,
			})
		);
	};

	const sortCandidates = (order) => {
		const sortedCandidates = [...candidateList];
		if (order === "ascending_order") {
			sortedCandidates.sort((a, b) => a.aiScore - b.aiScore); // Ascending order by aiScore
		} else if (order === "descending_order") {
			sortedCandidates.sort((a, b) => b.aiScore - a.aiScore); // Descending order by aiScore
		}
		return sortedCandidates;
	};




	function updateFilterResponseList(selectedQueMap) {
		const lst = [];
		selectedQueMap?.forEach((obj, index) => {
			if (obj.active) {
				const responseIndex = candidateResponseMap[obj.questionId];
				if (responseIndex) {
					lst.push({
						id: (+index + 1),
						queText: totalQuestionList[index]['questionText'],
						response: candidateResponseList[responseIndex]['amazonS3Link']
					});
					console.log("isprobel:", totalQuestionList[index]['isProbeQuestion']);
					if (totalQuestionList[index]['isProbeQuestion']) {
						console.log("isProbeQuestion");

						totalQuestionList[index]['probingQuestionsList']?.forEach((que, pIndex) => {

							const probeQueId = que['questionId'];
							const probeResponseIndex = candidateResponseMap[probeQueId] ?? -1;
							console.log("probeQuestionRecorded", {
								id: (Number(index) + 1) + "P" + (pIndex + 1),
								queText: que['questionText'],
								response: candidateResponseList[probeResponseIndex]?.['amazonS3Link'] ?? ''
							});
							if (probeResponseIndex !== -1) {
								lst.push({
									id: (Number(index) + 1) + "P" + (pIndex + 1),
									queText: que['questionText'],
									response: candidateResponseList[probeResponseIndex]?.['amazonS3Link'] ?? ''
								});
							}
						})
					}
				}

				// lst.push({
				// 	id:(1+Number(candidateResponseMap[obj.questionId])),
				// 	queText:candidateResponseList[key]['createdOn'],
				// 	response:candidateResponseList[key]['amazonS3Link']
				// });
				// if(candidateResponseList[key]['probing']) {
				// 	candidateResponseList[key]['probing'].forEach((obj,index)=>{
				// 		lst.push({
				// 			id:(Number(key)+1)+"P"+(index+1),
				// 			queText:obj['createdOn'],
				// 			response:obj['amazonS3Link']
				// 		});
				// 	})
				// }
			}
		});

		setFilteredCandidateResponseList(lst);
	}


	const handleOnClickQuestion = (event, index) => {
		const lst = [...selectedQuestionMap];
		if (event.target.checked) {
			if (!lst[index].active) {
				// lst[index].active = true;
				lst[index] = {
					...lst[index],
					active: true,
				}
			}
		}
		else {
			lst[index] = {
				...lst[index],
				active: false,
			}
			// lst[index].active = false;
		}
		// setSelectedQuestionMap(lst);
		dispatch(updateSelectedQuestionMap({ lst }));
	}

	useEffect(() => {
		dispatch(setFilteredCandidateResponseList({ selectedQuestionMap, candidateResponseMap, candidateResponseList, totalQuestionList }));
	}, [selectedQuestionMap]);



	const handleIsViewByApplicant = (isViewByApplicant) => {
		dispatch(setIsViewByApplicant(isViewByApplicant));
		dispatch(setSelectedQuestionMap({ totalQuestionList, isViewByApplicant }));
	}



	return (
		<div className="box-main-bg mob-margin">

			<header className="box-header">
				<div className="row">
					<aside className="label-radio col xl12 l12 m12 s12">
						<h6>View By</h6>
						<EvuemeLabelTag style={{ display: 'flex', gap: "2px" }}>
							<RadioButtonInputField
								inputTagCssClasses={"with-gap"}
								groupName="view-by"
								labelText={"Applicant"}
								radioButtonValue={true}
								value={isViewByApplicant}
								onChange={(e) => {
									handleIsViewByApplicant(true);
								}}
							/>

							<RadioButtonInputField
								inputTagCssClasses={"with-gap"}
								groupName="view-by"
								labelText={"Question"}
								radioButtonValue={false}
								value={isViewByApplicant}
								onChange={(e) => {
									handleIsViewByApplicant(false);
								}}
							/>
						</EvuemeLabelTag>
					</aside>
				</div>
				<div className="row">
					<select
						id="sortByScore"
						name="sortByScore"
						value={selectedOrder}
						onChange={handleOnChange}
					>
						<option value="" disabled>
							Select Sort Order
						</option>
						{sortingOptions.map((option) => (
							<option key={option.optionValue} value={option.optionValue}>
								{option.optionKey}
							</option>
						))}
					</select>

				</div>
			</header >
			<div className="clw-cand-boxscrollwr">
				{isViewByApplicant && (<ul className="clw-cand-ul" style={{width: "100%"}}>
					{sortCandidates(selectedOrder).map((candidate, index) => (
						<li
							key={candidate.id || index}
							onClick={() => handleSelectApplicant(candidate.id)}
							tabIndex={0}
						>
							<CandidateProfile
								name={`${candidate.firstName} ${candidate.lastName}`}
								imgSrc={image.userProfileImage}
							// score={candidate.aiScore}
							// status={candidate.status}
							/>
						</li>
					))}
				</ul>
				)}
				{!isViewByApplicant &&
					totalQuestionList.map((que, index) =>
						<div id={que.questionId} key={index} className="questionnumbercheck" style={{ overflow: "auto" }}>
							<label>
								{/* <input type="checkbox" class="filled-in" onClick={(e)=>handleOnClickQuestion(e,que.questionId)}/> */}
								<input type="checkbox" class="filled-in" checked={selectedQuestionMap[index]?.active} onChange={() => { }} onClick={(e) => handleOnClickQuestion(e, index)} />
								<span>Question {index + 1}</span>
								<p>{que.questionText}</p>
								{
									que.isProbeQuestion &&
									<div style={{ paddingLeft: '20px' }}>
										{
											que['probingQuestionsList']?.map((pQue, index) => <p key={index} style={{ paddingBottom: "5px" }}><span style={{ paddingRight: '3px', fontWeight: 600, color: rootColor.primary }}>P{index + 1}: </span>{pQue.questionText}</p>)
										}
									</div>
								}
							</label>
						</div>)
				}
			</div>
		</div >
	)
}

export default CandidatesCard;
