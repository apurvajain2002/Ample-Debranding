import React from "react";

const EvuemeAiRating = ({ scores = [] }) => {
  const selectedCandidateRating = {};
  return (
    <div className="box-main-bg summary-page" style={{ minHeight: "251px" }}>
      <h3 style={{ margin: "5px 0px 10px 0px" }}>Evueme AI Rating</h3>
      <span className="ev-ai-rating-scores">
        {scores.length ? (
          scores.map((sc, index) => (
            <div key={index} className="scoregraph-wr scoregraph-cus">
              <div className="multigraph">
                <span
                  className="graph"
                  style={{
                    "--score": `${((sc?.score ?? 0) * 180) / 100}deg`,
                  }}
                >
                  {sc?.score ?? "-"}
                </span>
                <span
                  className="circle"
                  style={{
                    "--score": `${((sc?.score ?? 0) * 158) / 100 - 3}deg`,
                  }}
                >
                  <span className="ball"></span>
                </span>
              </div>
              <p>{sc.competancy}</p>
            </div>
          ))
        ) : (
          <div className="default-state-text">No Data</div>
        )}
      </span>
    </div>
  );
};

export default EvuemeAiRating;
