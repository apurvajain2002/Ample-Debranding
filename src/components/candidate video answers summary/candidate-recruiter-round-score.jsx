import React from 'react'
import SelectInputField from '../input-fields/select-input-field'
import { useState, useEffect } from 'react';
import { icon } from '../assets/assets';
import M from 'materialize-css';

const CandidateRecruiterRoundScore = () => {
    const [isAICommentModalOpen, setAICommentModalOpen] = useState(false);
    const [isPositionReportModalOpen, setPositionReportModalOpen] = useState(false);

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);
    }, []);


    const openPositionReportModal = () => {
        setPositionReportModalOpen(true);
    };

    // Function to close modal
    const closePositionReportModal = () => {
        setPositionReportModalOpen(false);
    };
    const [selectedOptions, setSelectedOptions] = useState("");
    return (
        <>
            <div className="box-main-bg summary-page">
                <h4 className="recruiter">Recruiter Round Score</h4>
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
            </div>
            {/* <div className="box-main-bg" style={{ marginTop: "10px" }}>
                <h4 className="recruiter">Recruiter Action</h4>
                <aside className="input-field-summary full-inputbox">
                    {/* <div className="input-field">
                        <label htmlFor="job-position">Job Position</label>
                        <select>
                            <option value="" disabled selected>Shortlisted</option>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                    </div> */}
            {/* <aside class="input-field col xl3 l3 m4 s12">
                    <select value={selectedOptions} onChange={(e) => setSelectedOptions(e.target.value)}>
                        <option value="" selected>Select Candidate Status</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label for="vacancy_locations">Candidate Status</label> */}
            {/* </aside> 
                    <SelectInputField
                        // divTagCssclassNamees="input-field-summary col xl3 l3 m4 s12"
                        labelText={"Rate Candidate"}
                        options={[
                            { value: "", label: "Shortlisted", disabled: true },
                            { value: "1", label: "Option 1" },
                            { value: "2", label: "Option 2" },
                            { value: "3", label: "Option 3" },
                        ]}
                        firstOptionDisabled={true}
                        required
                        value={selectedOptions}
                        onChange={(e) => setSelectedOptions(e.target.value)}
                    />
                </aside>
                <ul className="enhance-sectionul interview-actionul" style={{ marginTop: 0 }}>
                    <li className="active">
                        <a href="#">
                            <i><img src="images/enhance-video.svg" alt="" /></i>
                            <p>Add Voice Note</p>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i><img src="images/enhance-text.svg" alt="" /></i>
                            <p>Add Text Note</p>
                        </a>
                    </li>
                </ul>
            </div> */}
            <div className="box-main-bg boxmainmargin">
                <h4 className="recruiter">Recruiter Action</h4>
                <div className="row row-margin" style={{ marginTop: 0 }}>
                    <SelectInputField
                        labelText={"Rate Candidate"}
                        divTagCssClasses="col xl12 l12 m12 s12"
                        options={[
                            { optionKey: "Shortlisted", optionValue: "Shortlisted" },
                            { optionKey: "Option 1", optionValue: "Option 1" },
                            { optionKey: "Option 2", optionValue: "Option 2" },
                            { optionKey: "Option 2", optionValue: "Option 2" },
                        ]}
                        value={"Shortlisted"}
                        onChange={() => { }}
                    />

                    <aside className="col xl12 l12 m12 s12">
                        <ul className="enhance-sectionul interview-actionul">
                            <li className="active">
                                <a href="#">
                                    <i><img src={icon.enhanceAudioIcon} /></i>
                                    <p>Add Voice Note</p>
                                </a>
                            </li>
                            <li style={{ margin: "0 5px" }}>
                                <a href="#">
                                    <i><img src={icon.enhanceTextIcon} /></i>
                                    <p>Add Text Note</p>
                                </a>
                            </li>
                            {/* <a class="tooltipped" data-position="top" data-tooltip="Download Position Report"> */}
                            <a href="#" className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped" data-position="top" data-tooltip="Download Candidate Report"><i><img src={icon.downloadPositionReportIcon} /></i></a>
                            <a href="#" className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped " data-position="top" data-tooltip="Share Candidate Report"><i><img src={icon.sharePositionReportIcon} /></i></a>
                            <a href="#" className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped" data-position="top" data-tooltip="Change Score"><i><img src={icon.changeScoreIcon} /></i></a>

                        </ul>
                    </aside>
                </div>

                {/* <div id="comm_full_screen" className="modal open">
						<a
							href="#!"
							className="modal-close waves-effect waves-red btn-flat close-ixon-can-rating"
							onClick={closePositionReportModal}
						></a>
						<div className="modal-content">
							<div className="coment_content">
							</div>
						</div>
					</div> */}
            </div>

        </>
    )
}

export default CandidateRecruiterRoundScore