import React, { useState, useEffect } from "react";
import { icon } from "../assets/assets";
import Tooltip from "../miscellaneous/tooltip";
import CodeSnippet from "../../ui-reference-screen/code-snippet";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilterRejectCandidates,
  fetchAudioScores,
  fetchVideoScores,
  fetchDomainScores,
} from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import {
  setFilteredResponses,
  setSelectedQuestionsMap,
  setSelectedQuestionsResponse,
} from "../../redux/slices/interview-responses-recuriter-dashboard-slice";
import ErrorToast from "../toasts/error-toast";

const CandidateQuestionSection = ({ questions, type, setShowTable }) => {
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [isFilteredCandidateInfoFetched, setIsFilteredCandidateInfoFetched] =
    useState(false);
  const [isAudioScoreFetched, setIsAudioScoreFetched] = useState(false);
  const [isVideoScoreFetched, setIsVideoScoreFetched] = useState(false);
  const [isDomainScoreFetched, setIsDomainScoreFetched] = useState(false);
  const [isRejectButtonVisible,setIsRejectButtonVisible] = useState(false);
  const [filterRejectImgSrc, setFilterRejectImgSrc] = useState(
    icon.filterSettingIconShare
  );
  const {
    selectedJobId,
    selectedRoundId,
    selectedQuestionsResponse,
    domainSkills,
    videoSkills,
  } = useSelector(
    (state) => state.interviewResponsesRecruiterDashboardSliceReducer
  );
  const dispatch = useDispatch();

  const titlesByType = {
    mcq: "Choose competency sections to display",
    audio: "Choose audio questions to display",
    video: "Choose video questions to display",
  };
  const [scoreByQuestionType, setScoreByQuestionType] = useState({
    audio: -1,
    video: -1,
  });
  const typeMapping = {
    mcq: "Competency",
    audio: "Audio",
    video: "Video",
  };

  const filterResponses = async () => {
    const responses = [...selectedQuestionsResponse];
    const filteredCandidateResponse = responses?.map(
      (candidateData, pIndex) => {
        const data = {};
        data["applicant"] = candidateData["applicant"];
        data["status"] = candidateData["status"];
        data["published"] = candidateData["published"];

        type.forEach((queType) => {
          if (selectedQuestions[queType].some((val) => val)) {
            const typeData = [];
            selectedQuestions[queType].forEach((bool, index) => {
              if (bool) {
                if (queType !== "mcq") {
                  const queId = questions?.[queType][index]?.["questionId"];
                  const queResponse =
                    candidateData[queType]?.find(
                      (response) => response?.["questionId"] === queId
                    ) ?? {};
                  typeData.push(queResponse);
                } else {
                  const competancyName =
                    questions?.[queType][index]?.["questionText"] ?? "";
                  const response =
                    candidateData["domainScore"]?.find(
                      (scoreData) =>
                        scoreData?.["competancy"] === competancyName
                    ) ?? {};
                  typeData.push(response);
                }
              }
            });
            if (
              queType === "mcq" &&
              selectedQuestions[queType].some((val) => val)
            ) {
              const sum = typeData.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue?.["averageScore"] ?? 0);
              }, 0);
              const len = selectedQuestions[queType].length ?? 1;
              data["domainScore"] = len !== 0 ? (sum / len).toFixed(2) : "-";
            }
            data[queType] = typeData;

            if (queType === "audio") {
              data["audioScore"] = candidateData["audioScore"] ?? {};
            } else if (queType === "video") {
              data["videoScore"] =
                candidateData["videoScore"]?.filter(
                  (obj) => obj?.["skillType"] === "Soft"
                ) ?? [];
              if (data["videoScore"] < videoSkills.length) {
                const size = videoSkills.length - data["videoScore"].length;
                const arr = Array(size).fill({});
                data["videoScore"] = [...data["videoScore"], ...arr];
              }
              const sum =
                data["videoScore"]?.reduce((accumulator, currentValue) => {
                  return accumulator + (currentValue?.["score"] ?? 0);
                }, 0) ?? 0;

              data["softskillScore"] =
                videoSkills.length !== 0
                  ? (sum / videoSkills.length).toFixed(2)
                  : "-";
            }
          }
        });
        return data;
      }
    );
    await dispatch(setFilteredResponses(filteredCandidateResponse));
    setShowTable(true);
  };
  const handleDisplayClick = async () => {
    const questionData = {};
    dispatch(setSelectedQuestionsMap(selectedQuestions));
    Object.entries(selectedQuestions).forEach(([key, value], index) => {
      const arr = [];

      if (key !== "mcq") {
        value.forEach((val, idx) => {
          if (val)
            arr.push({
              question: String(questions[key][idx]?.["questionId"]) ?? "",
              answer: Number(scoreByQuestionType[key]) ?? 0,
            });
        });
      }
      if (arr.length > 0) {
        questionData[key] = arr;
      }
    });
    setIsFilteredCandidateInfoFetched(true);
    await dispatch(
      fetchFilterRejectCandidates({
        selectedJobId,
        selectedRoundId,
        questionData,
      })
    );
  };

  const handleFilterRejectClick = async () => {
    let isConditionSatisfied = "yes";
    let errorText = "Please select Question and fill its score";
    // Object.entries(scoreByQuestionType).forEach(([key, value]) => {
    //   const questionObj = selectedQuestions?.[key] ?? [];
    //   if (
    //     Object.entries(questionObj).some(([key, val]) => val) &&
    //     isConditionSatisfied !== "partially"
    //   ) {
    //     if (value !== -1) {
    //       isConditionSatisfied = "yes";
    //     } else {
    //       isConditionSatisfied = "partially";
    //     }
    //   }
    // });
    if (isConditionSatisfied === "yes") {
      handleDisplayClick();
    } else {
      ErrorToast(errorText);
    }
  };

  useEffect(() => {
    const initialSelection = type.reduce((acc, queType) => {
      acc[queType] = questions[queType]?.map(() => {
        return false;
      });
      return acc;
    }, {});
    setSelectedQuestions(initialSelection);
  }, [questions, type]);

  const handleQuestionToggle = (quetype, index, isChecked) => {
    const setSelectedQueArray = [...selectedQuestions[quetype]];
    setSelectedQueArray[index] = isChecked;
    setSelectedQuestions((prev) => ({
      ...prev,
      [quetype]: setSelectedQueArray,
    }));
  };

  const onChangeQuestionScore = (e, quetype, index) => {
    let bool = false;
    setScoreByQuestionType((prev) => ({
      ...prev,
      [quetype]: +e.target.value || -1,
    }));
    console.log("scoreByQuestionTYpe",scoreByQuestionType);
    if(quetype === 'audio'&& (e.target.value !=='' || scoreByQuestionType['video'] !== -1)) {
        bool=true;
    }
    else if(quetype==='video' && (e.target.value !=='' || scoreByQuestionType['audio'] !== -1)) {
     bool = true;
    }
    else {
      bool = false;
    }
    setIsRejectButtonVisible(bool);
   
  };

  useEffect(() => {
    if (isFilteredCandidateInfoFetched) {
      setIsFilteredCandidateInfoFetched(false);
      if (selectedQuestionsResponse?.length) {
        setIsAudioScoreFetched(true);
        dispatch(fetchAudioScores({ selectedJobId, selectedRoundId }));
      } else {
        filterResponses();
      }
    } else if (isAudioScoreFetched) {
      setIsAudioScoreFetched(false);
      setIsVideoScoreFetched(true);
      dispatch(fetchVideoScores({ selectedJobId, selectedRoundId }));
    } else if (isVideoScoreFetched) {
      setIsVideoScoreFetched(false);
      setIsDomainScoreFetched(true);
      dispatch(fetchDomainScores({ selectedJobId, selectedRoundId }));
    } else if (isDomainScoreFetched) {
      setIsDomainScoreFetched(false);
      filterResponses();
    }
  }, [selectedQuestionsResponse]);

  const handleSelectAllToggle = (quetype, isChecked) => {
    const setSelectedQueArray = selectedQuestions[quetype].map(
      (prev) => isChecked
    );
    setSelectedQuestions((prev) => ({
      ...prev,
      [quetype]: setSelectedQueArray,
    }));
  };

  const handleMouseOver = () => {
    setFilterRejectImgSrc(icon.filterSettingIconWhite);
  };
  const handleMouseOut = () => {
    setFilterRejectImgSrc(icon.filterSettingIconShare);
  };
  return (
    <div>
      {type?.map(
        (queType, index) =>
          questions[queType]?.length > 0 && (
            <div key={index} className={`body-box-bodybg-question`}>
              <h3 className="innerboxhead">
                <label className="question-recruiter-header">
                  <input
                    type="checkbox"
                    className="filled-in"
                    checked={
                      selectedQuestions[queType]?.every(
                        (isSelected) => isSelected
                      ) || false
                    }
                    onChange={(e) =>
                      handleSelectAllToggle(queType, e.target.checked)
                    }
                  />
                  <span style={{ fontWeight: "700", fontSize: "15px" }}>
                    {titlesByType[queType] || typeMapping[queType] || queType}
                  </span>
                  {queType !== "mcq" &&
                    typeMapping[queType] <= "someCondition" && (
                      <span className="question-condition">
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            textTransform: "capitalize",
                          }}
                        >
                          {typeMapping[queType]} score
                        </span>
                        <i className="show-details infermation-ico-black candidate-question-i-rec">
          i
          <Tooltip divTagCssClasses="infbox-click">
            <p>Candidates with {typeMapping[queType]} score less or equal will be rejected</p>
          </Tooltip>
        </i>
                      <span style={{fontSize:"1.2rem"}}>{"<="}</span>
                        <input
                          onChange={(e) => onChangeQuestionScore(e, queType)}
                          type="number"
                          style={{ width: "10rem" }}
                          placeholder="Enter marks"
                        />
                      </span>
                    )}
                </label>
              </h3>
              {questions[queType]?.map((question, index) => (
                <div className="trqs-box" key={index}>
                  <label style={{ width: "65%" }}>
                    <input
                      type="checkbox"
                      className="filled-in"
                      checked={selectedQuestions[queType]?.[index] || false}
                      onChange={(e) =>
                        handleQuestionToggle(queType, index, e.target.checked)
                      }
                    />
                    <span>{question?.questionText}</span>
                  </label>
                  <div className="trqs-question-condition-type-box">
                    <span className="qstype ln-qst">
                      {typeMapping[queType] || queType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
      <div class="filter-reject-footer">
        {/* <button
          class="waves-effect waves-light btn-large btn-reject"
          onClick={handleDisplayClick}
        >
          Display
        </button> */}
        <button
          class="waves-effect waves-light btn-large btn-reject"
          onClick={handleFilterRejectClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
         {isRejectButtonVisible ?<> <i>
            <img src={filterRejectImgSrc} />
          </i>
          <span>Reject</span>
         </>:"Display"}
        </button>
      </div>
    </div>
  );
};

export default CandidateQuestionSection;
