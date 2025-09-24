import { useState, useEffect } from 'react';
import { icon } from '../assets/assets';
import M from 'materialize-css';

const CandidateLHiringRoundScore = () => {
  const [isAICommentModalOpen, setAICommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");


  useEffect(() => {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
  }, []);

  // const openAICommentModal = () => {
  //   setAICommentModalOpen(true);
  // };
  const openAICommentModal = () => {
    setAICommentModalOpen(true);

    // const modalElem = document.querySelector('#com_full_screen');
    // if (modalElem) {
    //   const modalInstance = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    //   modalInstance.open();
    // } else {
    //   console.error('Modal element not found');
    // }
  };
  useEffect(() => {
    if (isAICommentModalOpen) {
      const modalElem = document.querySelector('#com_full_screen');
      if (modalElem) {
        M.Modal.init(modalElem);
        const modalInstance = M.Modal.getInstance(modalElem);
        modalInstance.open();
      }
    }
  }, [isAICommentModalOpen]);

  const closeAICommentModal = () => {
    setAICommentModalOpen(false);
  };
  return (
    <>
    <div class="box-main-bg summary-page">
      <h4 className="recruiter">L1 Hiring Manager Round Score </h4>
      <div class="score-wrapper">
                    <h5>Domain Skills</h5>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                80 * 180) /
                              100
                            }deg`,
                          }}>80</span>
                        </div>
                        <p>Node JS</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                85 * 180) /
                              100
                            }deg`,
                          }}>85</span>
                        </div>
                        <p>MySQL</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                65 * 180) /
                              100
                            }deg`,
                          }}>65</span>
                        </div>
                        <p>Express Js</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                55 * 180) /
                              100
                            }deg`,
                          }}>55</span>
                        </div>
                        <p>API</p>
                    </div>
                </div>
                <div className="score-wrapper">
                    <h5>Soft Skills</h5>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                73 * 180) /
                              100
                            }deg`,
                          }}>73</span>
                        </div>
                        <p>Voice <br />Pitch</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                85 * 180) /
                              100
                            }deg`,
                          }}>85</span>
                        </div>
                        <p>Speech <br />Fluency</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                65 * 180) /
                              100
                            }deg`,
                          }}>65</span>
                        </div>
                        <p>Spending <br />Speed</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                43 * 180) /
                              100
                            }deg`,
                          }}>43</span>
                        </div>
                        <p>Pause/15 Sec</p>
                    </div>
                    <div className="scoregraph-wr scoregraph-2">
                        <div className="multigraph">
                            <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                53.8 * 180) /
                              100
                            }deg`,
                          }}>53.8</span>
                        </div>
                        <p>Audio <br />Score</p>
                    </div>
                </div>

      {/* <textarea placeholder="Comments" id="textarea1" class="materialize-textarea aicomments"></textarea>
        <label for="vacancy_locations" class="active"><i><img src="images/comment-blog-icon.svg" alt="" /></i> Evueme AI Comments</label>
      </aside> */}
      </div>
      <div class="box-main-bg" style={{marginTop: "10px", paddingTop: 0}}>
     <aside className="input-field textarea-full aicomments">
					<a href="#com_full_screen" className="comment-fullscreen modal-trigger" onClick={openAICommentModal}><i><img src={icon.commentFullscreenIcon} /></i>
					</a>
					<textarea placeholder={"Comments"} id="aicomments" className="materialize-textarea aicomments">
						{/* <i><img src={icon.commentFullscreenIcon} /></i> */}

					</textarea>
					<label for="aicomments" className="active" 
          // style={{color: "black", fontWeight: 500, fontSize: "18px"}}
          >
						<i><img src={icon.commentblogIconsvg} /></i> Evueme AI overallComments
					</label>
				</aside>
				{isAICommentModalOpen && (
					<div id="com_full_screen" className="modal open">
						<a
							href="#!"
							className="modal-close waves-effect waves-red btn-flat close-ixon-can-rating"
							onClick={closeAICommentModal}
						></a>
						<div className="modal-content">
							<div className="coment_content">
							</div>
						</div>
					</div>
				)}
    </div>
    </>
  )
}

export default CandidateLHiringRoundScore;