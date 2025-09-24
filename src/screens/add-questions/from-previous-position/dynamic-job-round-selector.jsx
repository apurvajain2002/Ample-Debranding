import React, { useState, useMemo } from "react";
import SelectInputField from "../../../components/input-fields/select-input-field";
import { optionMapper } from "../../../utils/optionMapper";
import { arrayToKeyValue } from "../../../utils/arrayToKeyValue";
import { icon } from "../../../components/assets/assets";
import NormalButton from "../../../components/buttons/normal-button";
const DynamicJobRoundSelector = ({ allNotPublishedJobs, jobDetails }) => {
  const [rows, setRows] = useState([{ jobId: "", roundName: "" }]);
  const [showSelectors, setShowSelectors] = useState(false);

  // Options for jobs and rounds
  const jobOptions = useMemo(
    () =>
      optionMapper(allNotPublishedJobs, "positionName", "jobId", "Select Job "),
    [allNotPublishedJobs]
  );

  // Handle job selection change
  const handleJobChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].jobId = value;
    setRows(updatedRows);
  };

  // Handle round selection change
  const handleRoundChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].roundName = value;
    setRows(updatedRows);
  };

  // Add a new row
  const addRow = () => {
    setRows([...rows, { jobId: "", roundName: "" }]);
  };

  // Remove a row
  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="dynamic-job-round-selector">
      <NormalButton
        buttonText={"Select jobs and rounds"}
        onClick={() => setShowSelectors(!showSelectors)}
        buttonTagCssClasses={"btn-clear btn-submit"}
      />
      
      <div
        className="row dynamic-job-round-selector-row"
        // style={{ display: showSelectors ? "block" : "none", height:"auto" }}
      >
        {rows.map((row, index) => (
          <div
            key={index}
            className="row dynamic-job-round-selector-row"
            style={{ display: "block" }}
          >
            <SelectInputField
              divTagCssClasses="input-field col xl3 l4 m4 s12"
              selectTagIdAndName={`job-${index}`}
              options={jobOptions}
              value={row.jobId}
              onChange={(e) => handleJobChange(index, e.target.value)}
              labelText={"Select job"}
            />
            <SelectInputField
              divTagCssClasses="input-field col xl3 l4 m4 s12"
              selectTagIdAndName={`round-${index}`}
              options={arrayToKeyValue(
                ["L1 Hiring Round", "Recruiter Round"],
                "Round Name"
              )}
              value={row.roundName}
              onChange={(e) => handleRoundChange(index, e.target.value)}
              labelText={"Select round"}
            />
            <img
              src={icon.crossIcon}
              alt="remove"
              onClick={() => removeRow(index)}
            />
          </div>
        ))}
      </div>
      <NormalButton
        buttonText={"+"}
        onClick={() => addRow()}
        buttonTagCssClasses={"btn-clear btn-submit"}
      />
    </div>
  );
};

export default DynamicJobRoundSelector;
