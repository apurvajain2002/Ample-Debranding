import React, { useEffect, useState, useRef } from "react";
import EvuemeModal from "../modals/evueme-modal";
import { icon } from "../assets/assets";
import M from "materialize-css";
import { useGlobalContext } from "../../context";

const RecorderPlayModal = React.memo(({ audioUrl }) => {

    // console.log("audioURL ===>>>>> ", audioUrl);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const audioRef = useRef(null);

    const handlePlaybackSpeed = (speed) => {
        setPlaybackSpeed(speed);
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    };

    const { rootColor } = useGlobalContext();

    return (
        <EvuemeModal
            modalId={"interviewerAudioNote"}
            divTagClasses="audioModalDivTagClass"
            modalClasses="audioModal"
        >
            <div
                style={{
                    display: "flex",
                    border: "3px solid #d9d9d9",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "white",
                }}
            >
                <div
                    style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        height: "10%",
                        borderBottom: "2px solid #d9d9d9",
                        paddingLeft: "8px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <img src={icon.micIcon} style={{ paddingRight: "5px" }} />
                    Interviewer Voice Note
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "4px 10px 4px 10px",
                        height: "90%",
                    }}
                >
                    <div
                        style={{
                            height: "85%",
                            backgroundColor: "#f3f2ee",
                            padding: "5px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#3a0531",
                                height: "45%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                        </div>

                        <div style={{ backgroundColor: "#f3f2ee", height: "55%" }}>
                            <div
                                style={{
                                    //   height: "35%",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    color: "#3a0531",
                                    justifyContent: "center",
                                }}
                            >
                                {/* {!audioUrl && <span>No audio available to play.</span>} */}
                            </div>

                            <div
                                style={{
                                    //   height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {audioUrl ? (
                                    <audio
                                        ref={audioRef}
                                        controls
                                        src={audioUrl}
                                        style={{
                                            width: "90%",
                                            //   height: "82%",
                                        }}
                                    ></audio>
                                ) : (
                                    <span>No audio to display</span>
                                )}
                            </div>
                            {audioUrl && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "65%",
                                        gap: "20px",
                                        flexDirection: "row",
                                        color: "white",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ul className="video-speed" style={{ border: `1px solid ${rootColor.primary}` }}>
                                        <li>
                                            <a
                                                onClick={() => handlePlaybackSpeed(0.5)}
                                                className={playbackSpeed === 0.5 ? "active" : ""}
                                            >
                                                0.5X
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() => handlePlaybackSpeed(0.75)}
                                                className={playbackSpeed === 0.75 ? "active" : ""}
                                            >
                                                0.75X
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() => handlePlaybackSpeed(1)}
                                                className={playbackSpeed === 1 ? "active" : ""}
                                            >
                                                1X
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() => handlePlaybackSpeed(1.5)}
                                                className={playbackSpeed === 1.5 ? "active" : ""}
                                            >
                                                1.5X
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() => handlePlaybackSpeed(2)}
                                                className={playbackSpeed === 2 ? "active" : ""}
                                            >
                                                2X
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </EvuemeModal>
    );
});

export default RecorderPlayModal;