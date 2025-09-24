import { useState } from "react";

const CandidateScoreTableModal = ({ children,setVisible,visible ,content, position = "top"}) => {
 
  const tooltipClasses = `score-table-modal-content score-table-modal-${position}`;

  return (
    <div>
 <div
      className="custom-tooltip-wrapper"
     
    >
      {children}
      {visible && (
        <div className={tooltipClasses}>
          <div className="score-table-modal-header-wrapper">
            <span>Audio Scores</span>
               <a
        href="#!"
        className="modal-close waves-effect waves-red btn-flat close-ixon"
        onClick={()=>setVisible(false)}
      ></a>
          </div>
         
          {content}
        </div>
      )}
    </div>
    </div>
   
  );
};

export default CandidateScoreTableModal;
