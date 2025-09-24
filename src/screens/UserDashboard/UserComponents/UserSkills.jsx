import { useEffect } from "react";
import EvuemeSelectTag from "../../../components/evueme-html-tags/evueme-select-tag";
import M from "materialize-css";

const options = [
  { optionKey: "Highest Score", optionValue: "Highest Score" },
  { optionKey: "2", optionValue: "2" },
  { optionKey: "3", optionValue: "3" },
];

const UserSkills = () => {
  useEffect(() => {
    M.AutoInit();
  }, []);
  return (
    <div className="row row-margin">
      <div className="col xl12 l12 m12 s12">
        <div className="evuemescore-wr">
          <div className="header-evueme valign-wrapper">
            <h3>EvueMe Score</h3>
            <aside className="input-field col xl3 l3 m3 s12 right">
              <EvuemeSelectTag options={options} />
            </aside>
          </div>
          <div className="evuemecan-body">
            <div className="row row-margin">
              <aside className="col xl4 l4 m4 s12">
                <div className="score-wrapper">
                  <h5>Domain Skills</h5>
                  <div className="scoregraph-wr scoregraph-2">
                    <div className="multigraph">
                      <span className="graph">47</span>
                    </div>
                    <p>Node JS</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2">
                    <div className="multigraph">
                      <span className="graph">85</span>
                    </div>
                    <p>MySQL</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2">
                    <div className="multigraph">
                      <span className="graph">65</span>
                    </div>
                    <p>Express Js</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2">
                    <div className="multigraph">
                      <span className="graph">55</span>
                    </div>
                    <p>API</p>
                  </div>
                </div>
              </aside>
              <aside className="col xl6 l6 m6 s12">
                <div className="score-wrapper">
                  <h5>Soft Skills</h5>
                  <div className="scoregraph-wr scoregraph-2 scoregraph-3">
                    <div className="multigraph">
                      <span className="graph">73</span>
                    </div>
                    <p>Voice Pitch</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2 scoregraph-3">
                    <div className="multigraph">
                      <span className="graph">85</span>
                    </div>
                    <p>Speech Fluency</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2 scoregraph-3">
                    <div className="multigraph">
                      <span className="graph">65</span>
                    </div>
                    <p>Spending Speed</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2 scoregraph-3">
                    <div className="multigraph">
                      <span className="graph">43</span>
                    </div>
                    <p>Pause/15 Sec</p>
                  </div>
                  <div className="scoregraph-wr scoregraph-2 scoregraph-3">
                    <div className="multigraph">
                      <span className="graph">53.8</span>
                    </div>
                    <p>Audio Score</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserSkills;
