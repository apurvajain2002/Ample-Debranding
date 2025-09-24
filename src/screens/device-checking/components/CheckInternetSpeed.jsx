const CheckInternetSpeed = ({ result }) => {
  return (
    <div className="container fileupload-container">
      <div className="row">
        <div className="chatt-text chatt-notext test-wr">
          <h4>Internet Speed</h4>
          <p className="color-p">Test Now</p>
          <div className="internet-wr">
            <div className="strenth">
              <p>Poor</p>
              <div className="danger"></div>
            </div>
            <div className="strenth">
              <p>Average</p>
              <div className="average"></div>
            </div>
            <div className="strenth">
              <p>Good</p>
              <div className="good"></div>
            </div>
          </div>
          {result?.bandwidth?.result === "good" && (
            <p className="goodp">
              Result: <span>Good</span> (Internet speed supports video)
            </p>
          )}
          {result?.bandwidth?.result === "avergae" && (
            <p className="average-p">
              Result: <span>Average</span> (Internet speed will not support good quality video)
            </p>
          )}
          {result?.bandwidth?.result === "poor" && (
            <p className="poor-p">
              Result: <span>Poor</span> (Internet speed does not support video. Try from a different
              Wi-Fi or Mobile hotspot connection)
            </p>
          )}
        </div>
        <div className="testbrowswe-wr">
          <div className="row">
            <aside className="col xl8 l8 m8 s8">
              <h2 className="test-brow">Testing Browser</h2>
              {result?.browser?.supported === true && (
                <p className="goodp">
                  Browser - <span>Passed</span>
                </p>
              )}
              {result?.browser?.supported === false && (
                <p className="poor-p">
                  Browser - <span>Failed</span>
                </p>
              )}
            </aside>
            <aside className="col xl4 l4 m4 s4 ">
              <i className="right">
                <img src="images/round-score.svg" alt="" />
              </i>
            </aside>
          </div>
          {result?.browser?.supported === false && (
            <div className="full-width center-align">
              <i>
                <img src="images/google-chrome-icon.svg" alt="" />
              </i>
              <p className="red-color">
                Your browser version is not supported. Uninstall <br />
                and install the latest version
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInternetSpeed;
