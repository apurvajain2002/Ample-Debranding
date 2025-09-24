import { baseUrl } from "../../config/config";
import axiosInstance from "../../interceptors";
import { QTYPES } from "../../resources/constant-data/question-types";

export async function saveCandidateResponse(
  interviewId,
  question,
  userId,
  answer,
  audioBlob,
  scriptType = "skillBased",
  serviceId = null,
  conferenceNo = null,
  roomId = null,
  snapshotImage = null,
  tenantId = '0'
) {

  console.log('userId :: ', userId)
  console.log('question :: ', question)
  console.log('answer :: ', answer)
  console.log('audioBlob :: ', audioBlob)
  console.log('scriptType :: ', scriptType)
  console.log('serviceId :: ', serviceId)
  console.log('conferenceNo :: ', conferenceNo)
  console.log('roomId :: ', roomId)
  console.log('snapshotImage :: ', snapshotImage)
  console.log('tenantId :: ', tenantId)

  let allowedTypes = ["skillBased", "filtration"];
  let allowedFeedBackTypes = [QTYPES.FEEDBACK, QTYPES.RATING, QTYPES.TEXTBOX, QTYPES.STARS];
  let allowedPracticeTypes = ["audio", "video"];
  if (
    !allowedTypes.includes(question.questionType) &&
    !(scriptType === "feedBack" && allowedFeedBackTypes.includes(question.questionType)) &&
    !(scriptType === "practice" && allowedPracticeTypes.includes(question.questionType))
  )
    return;

  let { questionType: qType, responseType: rType, questionId: qId } = question;

  let body = new FormData();

  console.log('save candidate response payload :: ', userId)

  body.append("interviewId", interviewId);
  body.append("userId", userId);
  body.append("questionType", qType);
  body.append("questionId", qId);
  body.append("answerType", rType);
  // backend requires practiceQuestion
  body.append("scriptType", scriptType === "practice" ? "practiceQuestion" : scriptType);

  // Don't do anything else for video, enablex calls backend
  if (rType === "audio") {
    // add enhanced media
    const file = new File([audioBlob], "file.mp3", { type: "audio/mp3" });
    body.append("enhancedMedia", file);
  } else if (rType !== "video") {
    // add answer
    body.append("response", answer);
  }

  if (rType === "video") {
    if (roomId) {
      body.append("roomId", roomId)
    }
    if (conferenceNo) {
      body.append("conferenceNo", conferenceNo)
    }
  }

  if (scriptType === "practice") {
    body.append("serviceId", serviceId)
  }

  if (snapshotImage !== null) {
    body.append("snapshotImage", snapshotImage);
  }

  body.append("tenantId", tenantId);

  try {
    const { data } = await axiosInstance.post(
      `${baseUrl}/job-posting/api/enablex/save-candidate-response`,
      body,
      rType === "audio" ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );

    if (data?.success && scriptType === "practice") {
      return data?.candidateVideoLink;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error saving response for question: ", question, error);
    // Throw the error so calling functions can handle it
    throw new Error(`Failed to save candidate response: ${error.message || 'Unknown error'}`);
  }
}

export async function updateCandidateInterviewStatus(
  jobId,
  userId,
  interviewRound,
  interviewStatus,
  language,
  tenantId
) {
  try {
    await axiosInstance.post(`${baseUrl}/job-posting/interview-link/candidate-interview-status`, {
      jobId,
      userId,
      interviewRound,
      interviewStatus,
      language,
      tenantId: tenantId || '0'
    });
  } catch (error) {
    console.error("Error updating status for candidate");
  }
}
