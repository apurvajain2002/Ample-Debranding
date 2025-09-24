import React, { useMemo } from "react";
import EvuemeAiRating from "./evueme-ai-rating";
import HiringManagerAction from "./hiring-manger-action";

const RatingSection = ({
  roundSpecificHashMap = {},
  selectedCandidateId,
  selectedRoundId,
}) => {
  const scores = useMemo(() => {
    if (selectedCandidateId !== null) {
      const roundData = roundSpecificHashMap[selectedRoundId];
      if (roundData && roundData[selectedCandidateId]) {
        return roundData[selectedCandidateId];
      }
    }
    return [];
  }, [roundSpecificHashMap, selectedCandidateId, selectedRoundId]);

  return (
    <div>
      <EvuemeAiRating scores={scores} />
      <HiringManagerAction selectedCandidateId={selectedCandidateId} selectedRoundId={selectedRoundId} />
    </div>
  );
};

export default RatingSection;
