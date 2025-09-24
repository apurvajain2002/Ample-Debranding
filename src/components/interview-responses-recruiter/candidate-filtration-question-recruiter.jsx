import { useDispatch, useSelector } from "react-redux";
import { icon } from "../assets/assets";
import { useState, useEffect } from "react";
import { fetchFilterRejectCandidates } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import {
  setSelectedQuestionsMap,
  setQuestionMap,
  setFilteredResponses,
} from "../../redux/slices/interview-responses-recuriter-dashboard-slice";

const CandidateFiltrationQuestionRecruiter = ({
  questions,
  type,
  setShowTable,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [isFilteredCandidateInfoFetched, setIsFilteredCandidateInfoFetched] =
    useState(false);
  const [filterRejectImgSrc, setFilterRejectImgSrc] = useState(
    icon.filterSettingIconShare
  );
  const { selectedJobId, selectedRoundId, selectedQuestionsResponse } =
    useSelector(
      (state) => state.interviewResponsesRecruiterDashboardSliceReducer
    );
  const dispatch = useDispatch();

  useEffect(() => {
    const queMap = {};
    const initialSelection = type.reduce((acc, queType) => {
      acc[queType] = questions[queType]?.map((que, index) => {
        const options = JSON.parse(que.questionOptions || "[]");
        const opt = [...options];
        queMap[que?.questionId] = index;
        return {
          questionId: que?.["questionId"],
          selected: false,
          answers: opt,
        };
      });
      return acc;
    }, {});
    setSelectedQuestions(initialSelection);
    dispatch(setQuestionMap({ filtration: queMap }));
  }, [questions]);

  const handleQuestionToggle = (index, isChecked) => {
    const quetype = "filtration";
    const setSelectedQueArray = [...selectedQuestions[quetype]];
    setSelectedQueArray[index]["selected"] = isChecked;
    setSelectedQuestions((prev) => ({
      ...prev,
      [quetype]: setSelectedQueArray,
    }));
  };

  const handleSelectAllToggle = (isChecked) => {
    const quetype = "filtration";
    const setSelectedQueArray = [...selectedQuestions[quetype]];
    setSelectedQueArray.forEach((que) => (que["selected"] = isChecked));
    setSelectedQuestions((prev) => ({
      ...prev,
      [quetype]: setSelectedQueArray,
    }));
  };

  const onSelectOption = (queIndex, optIndex, option) => {
    const temp = [...selectedQuestions["filtration"]];
    temp[queIndex]["answers"][optIndex] = {
      ...option,
      correct: !option["correct"],
    };
    setSelectedQuestions((prev) => ({ ...prev, ["filtration"]: temp }));
  };

  const handleFilterRejectClick = async () => {
    const deepCopyArr = JSON.parse(
      JSON.stringify(selectedQuestions["filtration"])
    ).filter((question) => question?.["selected"]);
    dispatch(setSelectedQuestionsMap({ filtration: deepCopyArr }));
    const queData = [];
    selectedQuestions["filtration"].forEach((que, index) => {
      if (que["selected"]) {
        const letters = que["answers"].map((answer, index) => {
          if (answer["correct"]) return String.fromCharCode(97 + index);
          else return "";
        });
        const result = letters.filter((letter) => letter !== "").join(",");
        queData.push({
          question: String(questions["filtration"][index]["questionId"]) ?? "",
          answer: result,
        });
      }
    });
    const questionData = { filtration: queData };
    setIsFilteredCandidateInfoFetched(true);
    await dispatch(
      fetchFilterRejectCandidates({
        selectedJobId,
        selectedRoundId,
        questionData,
      })
    );
  };

  useEffect(() => {
    async function FilterResponses() {
      let data = [...selectedQuestionsResponse];
      const filteredCandidateResponse = data?.map((obj) => {
        let response = [];
        response = selectedQuestions["filtration"]?.filter((val)=>val['selected']??false)?.map((que, index) => {
          let result = {};
          if (que["selected"]) {
            const queId = que?.["questionId"] ?? "";
            Object.entries(obj?.["filtration"] || {})?.forEach(
              ([key, val], index) => {
                for (let key in val) {
                  if (String(key) === String(queId)) {
                    result = { ...val };
                  }
                }
              }
            );
          }
          return result;
        });

        return { ...obj, filtration: response };
      });
      console.log("filteredCandiataresps", filteredCandidateResponse);
      await dispatch(setFilteredResponses(filteredCandidateResponse));
      setShowTable(true);
    }
    if (isFilteredCandidateInfoFetched) {
      setIsFilteredCandidateInfoFetched(false);
      FilterResponses();
    }
  }, [selectedQuestionsResponse]);

  const handleMouseOver = () => {
    setFilterRejectImgSrc(icon.filterSettingIconWhite);
  };
  const handleMouseOut = () => {
    setFilterRejectImgSrc(icon.filterSettingIconShare);
  };
  return (
    <div className="body-box-bodybg-question">
      <h3 className="innerboxhead">
        <label>
          <input
            type="checkbox"
            className="filled-in"
            checked={
              selectedQuestions["filtration"]?.every(
                (isSelected) => isSelected["selected"]
              ) || false
            }
            onChange={(e) => handleSelectAllToggle(e.target.checked)}
          />
          <span style={{ fontWeight: "700", fontSize: "15px" }}>
            Choose options to filter Reject
          </span>
        </label>
      </h3>
      {questions["filtration"]?.map((question, index) => {
        const options = JSON.parse(question.questionOptions || "[]");
        return (
          <div className="trqs-box-filtration" key={question.id || index}>
            <label>
              <input
                type="checkbox"
                className="filled-in"
                checked={
                  selectedQuestions["filtration"]?.[index]?.["selected"] ??
                  false
                }
                onChange={(e) => handleQuestionToggle(index, e.target.checked)}
              />
              <span>{question.questionText}</span>
            </label>
            <span className="qstype ln-qst">{question.type || "MCQ"}</span>
            <div className="btn-wr redbtnwr">
              {selectedQuestions["filtration"]?.[index]?.["answers"]?.map(
                (option, optIndex) => (
                  <a
                    key={optIndex}
                    className={`waves-effect waves-light btn-large left btn-mcw-robo
                     ${option?.["correct"] ?? "" ? "selected" : ""}`}
                    onClick={() => onSelectOption(index, optIndex, option)}
                  >
                    {option?.["optionValue"] ?? ""}
                  </a>
                )
              )}
            </div>
          </div>
        );
      })}
      <div className="filter-reject-footer">
        <button
          className="waves-effect waves-light btn-large btn-reject"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={handleFilterRejectClick}
        >
          <i>
            <img src={filterRejectImgSrc} alt="Filter Icon" />
          </i>
          Filter Reject
        </button>
       
      </div>
    </div>
  );
};

export default CandidateFiltrationQuestionRecruiter;
