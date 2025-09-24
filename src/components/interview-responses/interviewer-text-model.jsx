import React, { useEffect, useState, useRef } from "react";
import EvuemeModal from "../modals/evueme-modal";
import { icon } from "../assets/assets";
import M from "materialize-css";

const InterviewerTextModel = React.memo(({ recruiterNote }) => {


    useEffect(() => {
        const modalElement = document.getElementById("interviewerTextNote");
        if (modalElement) {
            const modalInstance = M.Modal.init(modalElement);
            return () => {
                if (modalInstance) {
                    modalInstance.destroy();
                }
            };
        }
    }, []);


    return (
        <EvuemeModal divTagClasses="evuemeModal" modalId={"interviewerTextNote"}>
            <div className="col s12 xl6 l6 m6 login-wrap" style={{ width: "100%" }}>
                <span
                    style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                    }}
                >
                    <i>
                        <img src={icon.textDocumentCheckIconShare} />
                    </i>{" "}
                    Add Assessor Text Note
                </span>
                <div className="modal-content">
                    <div className="coment_content">
                        {recruiterNote}
                    </div>
                </div>
            </div>
        </EvuemeModal>
    );
});

export default InterviewerTextModel;