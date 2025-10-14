import { useEffect, useState } from "react";
import Tooltip from "../../../miscellaneous/tooltip";

const DoneButton = ({ type, stopAudioRecording, stopVideoRecording }) => {
  const [recording, setRecording] = useState(true);
  const [btnVisible,setBtnVisible] = useState(false);

  useEffect(()=>{
    setTimeout(()=>{
      setBtnVisible(true);
    },10000)  
  },[])

  if (type === "audio") {
    return (
      <div className="robochart user-chatt">
        <div className="chatt-round roboround"></div>
        <div className="rochat-wrap">
          <div className="chatt-text">
            <div
              className={"recImgDiv"}
              style={{ width: "60px", position: "unset", padding: "0" }}
            >
              <ul className="rec-image">
                <li>
                  <div className="rec-round pulse"></div>
                </li>
                <li>REC</li>
              </ul>
              <br />
            </div>
          </div>
          <div className="btn-wr user-btnside" style={{
            display:"flex",justifyContent:"center"
          }}>
            <a
              className="waves-effect waves-light btn-large center btn-mcw-robo "
              href="#"
              onClick={() => {
                stopAudioRecording();
                setRecording(false);
              }}
              style={
                recording
                  ? { backgroundColor: "red", color: "white" , width:"auto",position:"relative", top:"80px",left:"-120px",zIndex:10,alignItems:"center", display:btnVisible ? "flex" : "none"}
                  : { backgroundColor: "#00bf7e", color: "white", width:"auto",position:"relative", top: "80px",left:"-120px",zIndex:10,display:"flex",alignItems:"center"}
              }
            >
              Stop Recording
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Video JSX
  return (
    <div className="btn-wr" style={{ textAlign: 'center', marginTop: '20px',display:"flex",justifyContent:"center",gap:"10px" }}>
      <a
        href="#"
        className="waves-effect waves-light btn btn-clear btn-submit btn-small"
        onClick={stopVideoRecording}
        style={{ marginRight: '10px',width:"50%",position:"relative", top:"80px",left:"-120px",zIndex:10, display:btnVisible ? "flex" : "none" }}
      >
        DONE
      </a>

      <i
        className="show-details infermation-ico-black"
        style={{ padding: "0" }}
      >
        i
        <Tooltip divTagCssClasses={"infbox-click-done information-box-done"}>
          <p>Press Done, once you have finished recording your answer</p>
        </Tooltip>
      </i>
    </div>
  );
};

export default DoneButton;
