import React, { useState, useRef, useEffect } from "react";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectDeleteRoleId } from "../../redux/slices/role-slice";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";
import { icon } from "../../components/assets/assets";
import FeatureTree from "../feature-tree";

const RoleTableRow = ({ role, index, treeData, setTableData, tableData }) => {
  const { id, name, description, featureSetList } = role;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(false);
  const [featureSetDescription, setFeatureSetDescription] = useState("");
  const boxRef = useRef(null);

  const onEditRole = () => {
    navigate(`edit-role/${id}`, {
      state: {
        name,
        description,
      },
    });
  };

  const showBoxHandler = () => {
    setShowBox(true);
  };

  const getDescriptionsByFeatureSet = (treeData, featureSetList) => {
    // Helper function to recursively search the tree
    const traverseTree = (nodes) => {
      let descriptions = [];

      for (const node of nodes) {
        // If the node's id is in featureSetList, add its description to the result
        if (featureSetList.includes(node.id)) {
          descriptions.push(node.description);
        }
        // If the node has children, continue searching recursively
        if (node.children && node.children.length > 0) {
          descriptions = descriptions.concat(traverseTree(node.children));
        }
      }

      return descriptions;
    };

    // Start traversing the tree from the root nodes
    const descriptions = traverseTree(treeData);

    // Return descriptions as a comma-separated string
    return descriptions.join(", ");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    setFeatureSetDescription(
      getDescriptionsByFeatureSet(treeData, featureSetList)
    );
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <tr>
      <td>
        <ul className="action">
          <li className="job-actions-icon" style={{ padding: "0 0.3rem" }}>
            <img
              style={{ width: "1.25rem", height: "1.25rem" }}
              src={icon.accountIcon}
              alt="Edit Role"
            />
          </li>
          <li
            className="job-actions-icon"
            style={{ padding: "0 0.3rem" }}
            onClick={onEditRole}
          >
            <img
              style={{ width: "1.25rem", height: "1.25rem" }}
              src={icon.editBoxIcon}
              alt="Edit Role"
            />
          </li>
          <li className="job-actions-icon" style={{ padding: "0 0.3rem" }}>
            <EvuemeModalTrigger modalId={"confirmDeleteModal"}>
              <img
                style={{ width: "1.25rem", height: "1.25rem" }}
                src={icon.deleteIcon}
                alt="Delete Role"
                onClick={() => {
                  dispatch(selectDeleteRoleId(id));
                }}
              />
            </EvuemeModalTrigger>
          </li>
        </ul>
      </td>
      <td>{name}</td>
      <TableDataOverflowWrapper content={description} />
      <td>
        <div className="flex-start manage-masters-table-row role-permissions">
          <span onClick={showBoxHandler}>
            {featureSetDescription} <span className="more-actionbtn">View</span>
          </span>
          {showBox && (
            <div ref={boxRef} className="feature-tree-box ">
              <FeatureTree
                preTreeData={treeData}
                preCheckedNodes={featureSetList}
                roleId={id}
                setTableData={setTableData}
                tableData={tableData}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RoleTableRow;
