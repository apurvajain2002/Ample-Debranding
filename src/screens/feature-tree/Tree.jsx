import TreeNode from "./TreeNode";

function Tree({ nodes = [], checkedNodes = [], onCheckboxChange = () => {} }) {
  return (
    <div className="tree-roots">
      {nodes.map((node) => (
        <div key={node.id}>
          <TreeNode
            node={node}
            checkedNodes={checkedNodes}
            onCheckboxChange={onCheckboxChange}
          />
        </div>
      ))}
    </div>
  );
}

export default Tree;
