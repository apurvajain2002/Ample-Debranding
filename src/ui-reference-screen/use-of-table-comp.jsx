import { useState } from "react";
import TableComponent from "../components/table-components/table-component";
import {
  selectColumnListProductsTable,
  sortByOptionProductsTable,
} from "../resources/constant-data/CreateNewPosition";
import ProductsTableBody from "../components/table-components/products-table-body/products-table-body";
import usePaginationFetchData from "../customHooks/use-pagination-fetch-data";

const tableHeadValues = ["Id", "Title", "Price", "Rating", "Discount"];

const searchApiUrl = "";

const UseOfTableComp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectColumn, setSelectColumn] = useState("");
  const [sortByOption, setSortByOption] = useState("");
  const [showRows, setShowRows] = useState(10);
  const [searchFieldValue, setSearchFieldValue] = useState("");

  const { data, error, loading, totalItems, setTotalItems } =
    usePaginationFetchData({
      urlPath: `https://dummyjson.com/products?limit=${showRows}&skip=${
        currentPage * showRows - showRows
      }`,
      dependencyArray: [currentPage, showRows],
    });

  if (error) {
    return <div>Sorry for the inconvenience, we ran into a problem!</div>;
  }

  if (loading) {
    return <div>Loader...</div>;
  }

  return (
    <TableComponent
      tableHeading={"Table Heading: Products Example"}
      selectColumnList={selectColumnListProductsTable}
      sortByOptionList={sortByOptionProductsTable}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalItems={totalItems}
      setTotalItems={setTotalItems}
      selectColumn={selectColumn}
      setSelectColumn={setSelectColumn}
      sortByOption={sortByOption}
      setSortByOption={setSortByOption}
      showRows={showRows}
      setShowRows={setShowRows}
      searchFieldValue={searchFieldValue}
      setSearchFieldValue={setSearchFieldValue}
      tableHeadValues={tableHeadValues}
      searchApiUrl={searchApiUrl}
    >
      {/* Example Table Body being passed as children */}
      <ProductsTableBody tableData={data} />
    </TableComponent>
  );
};

export default UseOfTableComp;
