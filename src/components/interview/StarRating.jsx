import { useState } from "react";

const StarRating = ({ onClick = () => {} }) => {
  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);

  const handleStarHover = (starCount) => {
    setHoveredStars(starCount);
  };

  const resetHover = () => {
    setHoveredStars(0);
  };

  return (
    <div className="star-rating-container">
      {[...Array(10)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <div
            key={starNumber}
            className={`star ${
              starNumber <= (hoveredStars || selectedStars) ? "active" : ""
            }`}
            onMouseEnter={() => handleStarHover(starNumber)}
            onMouseLeave={resetHover}
            onClick={() => onClick(starNumber)}
          >
            ★
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
