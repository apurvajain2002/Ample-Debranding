import { useState } from "react";
import CheckboxInputField from "../../components/input-fields/checkbox-input-field";

function TreeNode({ node, checkedNodes, onCheckboxChange }) {
  const [expanded, setExpanded] = useState(false);
  const isChecked = checkedNodes.includes(node.id);

  const handleCheckboxChange = () => {
    onCheckboxChange(node.id, !isChecked);
  };

  return (
    <div>
      <div className="node-head">
        <CheckboxInputField
          inputTagIdAndName={node.id}
          checked={isChecked}
          onChange={handleCheckboxChange}
          labelText={node.name}
        />
        <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {node.children.length ? (
            <input
              type="button"
              className="expand-btn"
              value={expanded ? " - " : " + "}
              style={{ cursor: "pointer" }}
            />
          ) : null}
        </div>
      </div>
      {expanded && node.children && (
        <div className="node-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checkedNodes={checkedNodes}
              onCheckboxChange={onCheckboxChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
