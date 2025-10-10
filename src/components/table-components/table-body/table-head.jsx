import { useState } from "react";
// import getUniqueId from "../../../utils/getUniqueId";
import FilterDropdown from "../filter-dropdown/filter-dropdown";
import { useGlobalContext } from "../../../context";

const TableHead = ({
  tableHeadValues,
  showFilter = false,
  // setShowFilter = ()=>{},
  filterArray = [],
  setFilterArray = () => { },
  tableName = "",
  getFilteredRows = () => { },
  customSortArray = [],
  tableData = [],
}) => {
  const { isTableHeaderChecked, handleTableHeaderCheckbox } = useGlobalContext();
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState(null);
  return (
    <thead>
      <tr>
        {tableHeadValues.map((curTableHead, index) => {
          if (tableName === "jobdetails" &&
            curTableHead.optionKey === "Select Column")
            return null;
          if (curTableHead.optionKey === 'selectCheckbox') {
            // Extract candidate IDs from table data
            const candidateIds = tableData.map(candidate => candidate.candidateInviteId).filter(Boolean);
            
            return (
              <th style={{ width: '3%' }}>
                <label style={{ float: 'left' }}>
                  <input type="checkbox" className="filled-in"
                    checked={isTableHeaderChecked}
                    onChange={(event) => {
                      const { checked } = event.target;
                      handleTableHeaderCheckbox(checked, candidateIds);
                    }} />
                  <span>&nbsp;</span>
                </label>
              </th>
            )
          }
          return (
            <th
              key={index}
              className={
                filterArray.some(
                  (column) => column.columnName === curTableHead.optionValue
                ) ||
                  customSortArray.some(
                    (column) => column.columnName === curTableHead.optionValue
                  )
                  ? "filtered-column"
                  : ""
              }
            >
              {curTableHead.optionKey === "Select Column"
                ? "S. No."
                : curTableHead.optionKey}
              {showFilter && curTableHead.allowFilter && (
                <FilterDropdown
                  curTableHead={curTableHead.optionValue}
                  index={index}
                  currentOpenDropdown={currentOpenDropdown}
                  setCurrentOpenDropdown={setCurrentOpenDropdown}
                  setFilterArray={setFilterArray}
                  filterArray={filterArray}
                  columnName={curTableHead.optionValue}
                  tableName={tableName}
                  customTableName={curTableHead?.customTableName || ""}
                  customOptionValue={curTableHead?.customOptionValue || ""}
                />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
