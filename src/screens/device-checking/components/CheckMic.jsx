const CheckMic = ({ result }) => {
  return (
    <div className="container fileupload-container nopadding-container">
      <div className="row">
        <header className="test-cameraheader">
          <i>
            <img src="images/sound-speaker.svg" alt="" />
          </i>{" "}
          Test Sound
        </header>
        <div className="camera-optionwe vol-marginbottom">
          <label for="choose-camera">Speaker</label>
          <div className="row row-margin">
            <aside className="col xl4 l4 m4 s4">
              <button className="btn waves-effect waves-light btn-cancel recordnow-btn test-btn">
                Test Speaker
              </button>
            </aside>
            <aside className="col xl8 l8 m8 s8">
              <select>
                <option value="" disabled selected>
                  Same as system (Sony TV *00 (intel (R)..{" "}
                </option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </aside>
          </div>
          <div className="row row-margin row-topmargin valign-wrapper">
            <aside className="col xl4 l4 m4 s4">
              <p>Output Level: </p>
            </aside>
            <aside className="col xl8 l8 m8 s8">
              <div className="output-label"></div>
            </aside>
          </div>
          <div className="row row-margin row-topmargin valign-wrapper">
            <aside className="col xl4 l4 m4 s4">
              <p>Volume </p>
            </aside>
            <aside className="col xl8 l8 m8 s8">
              <div className="volume-slide">
                <i className="sound-medium">
                  <img src="images/sound-medium-icon.svg" alt="" />
                </i>
                <div className="slider-range"></div>
                <i className="fullsound">
                  <img src="images/sound-full-icon.svg" alt="" />
                </i>
              </div>
            </aside>
          </div>
        </div>
        <div className="camera-optionwe nosound-margin">
          <label for="choose-camera">Microphone</label>
          <div className="row row-margin">
            <aside className="col xl4 l4 m4 s4">
              <button className="btn waves-effect waves-light btn-cancel recordnow-btn test-btn">
                Test Mic
              </button>
            </aside>
            <aside className="col xl8 l8 m8 s8">
              <select>
                <option value="" disabled selected>
                  Same as system (Sony TV *00 (intel (R)..{" "}
                </option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </aside>
          </div>
          <div className="row row-margin row-topmargin valign-wrapper">
            <aside className="col xl4 l4 m4 s4">
              <p>Output Level: </p>
            </aside>
            <aside className="col xl8 l8 m8 s8">
              <div className="output-label"></div>
            </aside>
          </div>
          <div className="row row-margin row-topmargin valign-wrapper">
            <aside className="col xl4 l4 m4 s4">
              <p>Volume </p>
            </aside>
            <aside className="col xl8 l8 m8 s8">
              <div className="volume-slide">
                <i className="sound-medium">
                  <img src="images/sound-medium-icon.svg" alt="" />
                </i>
                <div className="slider-range"></div>
                <i className="fullsound">
                  <img src="images/sound-full-icon.svg" alt="" />
                </i>
              </div>
            </aside>
          </div>
          <div className="row row-topmargin">
            <label>
              <input type="checkbox" className="filled-in" />
              <span>Automatically adjust microphone volume</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckMic;
