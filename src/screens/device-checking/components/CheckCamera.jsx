const CheckCamera = ({ result }) => {
  return (
    <div className="container fileupload-container nopadding-container">
      <div className="row">
        <header className="test-cameraheader">
          <i>
            <img src="images/camera-icon.svg" alt="" />
          </i>{" "}
          Test Camera
        </header>
        <div className="recvideo-body">
          <img src="images/rec-video.png" alt="" />
        </div>
        <div className="camera-optionwe">
          <label htmlFor="choose-camera">Camera</label>
          <select>
            <option value="" disabled default selected>
              HP True Vision HD Camera
            </option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
        </div>
        <footer className="upload-footer test-camerawr">
          <h5>Play back</h5>
          <button className="btn waves-effect waves-light btn-cancel recordnow-btn">
            Record Now
          </button>
          <button className="btn waves-effect waves-light btn-success">PLAY</button>
        </footer>
      </div>
    </div>
  );
};

export default CheckCamera;
