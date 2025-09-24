import { useState, useEffect } from "react";
import axiosInstance from "../../interceptors/index.js";
import Tree from "./Tree";
import NormalButton from "../../components/buttons/normal-button.jsx";
import WarningToast from "../../components/toasts/warning-toast.jsx";
import ErrorToast from "../../components/toasts/error-toast.jsx";
import SuccessToast from "../../components/toasts/success-toast.jsx";
import { useDispatch } from "react-redux";
import { baseUrl } from "../../config/config";

const POST_MAPPED_ROLE_FEATURES_ENDPOINT =
  `${baseUrl}/common/base/role-feature/add`;

function FeatureTree({
  preTreeData = [],
  preCheckedNodes = [],
  roleId = "",
  setTableData,
  tableData,
}) {
  const treeData = preTreeData;
  const role = roleId;
  const [checkedNodes, setCheckedNodes] = useState(preCheckedNodes);
  const dispatch = useDispatch();

  // Updates the node as ticked and all its children
  const updateCheckedNodes = (nodeId, isChecked) => {
    const updateChecked = (node, isChecked) => {
      if (isChecked) {
        setCheckedNodes((prevCheckedNodes) => [...prevCheckedNodes, node.id]);
      } else {
        setCheckedNodes((prevCheckedNodes) =>
          prevCheckedNodes.filter((id) => id !== node.id)
        );
      }

      if (node.children) {
        node.children.forEach((child) => updateChecked(child, isChecked));
      }
    };

    // Find the node with the given id in the treeData
    const findNodeAndUpdate = (nodes, id) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
          return updateChecked(node, isChecked);
        }
        if (node.children) {
          findNodeAndUpdate(node.children, id);
        }
      }
    };

    findNodeAndUpdate(treeData, nodeId);
  };

  // Sends the updated role feature ids
  const postMappedRoleFeatureIds = async (
    featureIdsArr = checkedNodes,
    roleId = role
  ) => {
    if (!roleId) {
      return WarningToast("Please select a role");
    }
    try {
      await axiosInstance.post(POST_MAPPED_ROLE_FEATURES_ENDPOINT, {
        roleId: roleId,
        featureIds: featureIdsArr,
      });
      const newData = tableData.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            featureSetList: checkedNodes,
          };
        }
        return role;
      });
      dispatch(setTableData(newData));
      return SuccessToast("Features added successfully!");
    } catch (error) {
      console.error(error);
      return ErrorToast(error.message);
    }
  };

  // Save feature handler
  const handleSave = () => {
    postMappedRoleFeatureIds(checkedNodes, role);
  };

  return (
    <>
      <div id="tree-app">
        <Tree
          nodes={treeData}
          checkedNodes={checkedNodes}
          onCheckboxChange={updateCheckedNodes}
        />
        <NormalButton
          onClick={handleSave}
          buttonText={"Save Features"}
          buttonTagCssClasses={"btn-clear btn-submit save-feature-tree"}
          style={{ padding: "0 1rem" }}
        />
      </div>
    </>
  );
}

export default FeatureTree;
