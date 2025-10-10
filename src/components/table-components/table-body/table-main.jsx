import TableHead from "./table-head";
import EvuemeTableLoader from "../../loaders/evueme-table-loader";

const TableBody = ({
  children,
  tableHeadValues,
  showFilter = false,
  filterArray,
  setFilterArray,
  tableName,
  getFilteredRows,
  loading,
  customSortArray = [],
  tableData = [],
}) => {
  return (
    <div className="table-bodywr table-responsive">
      {loading ? (
        <EvuemeTableLoader />
      ) : (
        <table className="striped responsive-table topalign-table">
          <TableHead
            tableHeadValues={tableHeadValues}
            showFilter={showFilter}
            filterArray={filterArray}
            setFilterArray={setFilterArray}
            tableName={tableName}
            getFilteredRows={getFilteredRows}
            customSortArray={customSortArray}
            tableData={tableData}
          />
          <tbody>{children}</tbody>
        </table>
      )}
    </div>
  );
};

export default TableBody;
