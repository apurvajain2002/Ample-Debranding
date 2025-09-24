// Sample Table Body to use in UI-Reference page

import getUniqueId from "../../../utils/getUniqueId";


const ProductsTableBody = ({ tableData }) => {
  return (
    <>
      {tableData.map((product, index) => (
        <tr key={getUniqueId()}>
          <td>{product.id}</td>
          <td>{product.title}</td>
          <td>{product.rating}</td>
          <td>{product.price}</td>
          <td>{product.discountPercentage}</td>
        </tr>
      ))}
    </>
  );
};

export default ProductsTableBody;
