import { useState } from "react";
import { showRowsList } from "../../resources/constant-data/common";
import { icon } from "../assets/assets";
import TableHeader from "./table-header/table-header";
import TableBody from "./table-body/table-main";
import TableFooter from "./table-footer/table-footer";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import VCPLHeader from "../../screens/invited-candidates/vcl-table-header";

const ListIcon = ({
  listIconSrc = null,
  listIconAltText = "",
  listIconCss = "",
  text,
  spanText = null,
  spanStatusClass = null,
}) => {
  return (
    <li>
      {listIconSrc ? (
        <i>
          <EvuemeImageTag
            listIconSrc={listIconSrc}
            alt={listIconAltText}
            className={listIconCss}
          />
        </i>
      ) : (
        <></>
      )}
      {spanText ? (
        <>
          {text}
          <span className={`color-span`}>{spanText}</span>
        </>
      ) : (
        <>
          <span
            className={`box-color header-box-color ${spanStatusClass}`}
          ></span>
          {text}
        </>
      )}
    </li>
  );
};

const TableComponent = ({
  children = null,
  showTableComponentHeader = true,
  tableHeading = "",
  tableName = "",
  selectColumnList = null,
  sortByOptionList = null,
  currentPage,
  setCurrentPage = () => {},
  totalItems,
  setTotalItems = () => {},
  setTableData = () => {},
  setJobStatus = () => {},
  jobStatus,
  searchApiUrl = "",
  searchValue = "",
  setSearchValue = () => {},
  selectColumn = null,
  setSelectColumn = () => {},
  sortByOption = null,
  setSortByOption = () => {},
  showRows = null,
  setShowRows = () => {},
  listIcons = null,
  tableHeadValues = [],
  loading,
  setLoading,
  customSortArray = [],
  setCustomSortArray = () => {},
  filterArray = [],
  setFilterArray = () => {},
  getFilteredRows,
  itemName = "items",
  displayCandidateSummaryColorCodes = false,
  isCandidateTableRecruiter = false,
  candidateTableRecruiterFooter,
  selectedCandidates,
  setSelectedCandidates,
  getExcel,
  selectedJobId,
  isVCPLHeaderVisible,
  showPrintButton = true,
  showExcelButton = true,
  showPDFButton = true,
  showCustomFilter = true,
  showFilter = false,
  setShowFilter = () => {},
  showCustomSort = false,
  setShowCustomSort = () => {},
}) => {
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(totalItems / showRows) &&
      selectedPage !== currentPage
    )
      setCurrentPage(() => selectedPage);
  };

  return (
    <>
      <div className="table-header">
        {isVCPLHeaderVisible && (
          <VCPLHeader
            selectedCandidates={selectedCandidates}
            setSelectedCandidates={setSelectedCandidates}
          />
        )}

        {/* Table Component Header */}
        {showTableComponentHeader && (
          <TableHeader
            tableName={tableName}
            tableHeadValues={tableHeadValues}
            currentPage={currentPage}
            showRows={showRows}
            selectColumnList={selectColumnList}
            selectColumn={selectColumn}
            setSelectColumn={setSelectColumn}
            sortByOptionList={sortByOptionList}
            sortByOption={sortByOption}
            setSortByOption={setSortByOption}
            setTotalItems={setTotalItems}
            setTableData={setTableData}
            setCurrentPage={setCurrentPage}
            searchApiUrl={searchApiUrl}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            loading={loading}
            setLoading={setLoading}
            customSortArray={customSortArray}
            setCustomSortArray={setCustomSortArray}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            setJobStatus={setJobStatus}
            jobStatus={jobStatus}
            getFilteredRows={getFilteredRows}
            filterArray={filterArray}
            getExcel={getExcel}
            isCandidateTableRecruiter={isCandidateTableRecruiter}
            selectedJobId={selectedJobId}
            showPrintButton={showPrintButton}
            showExcelButton={showExcelButton}
            showPDFButton={showPDFButton}
            showCustomFilter={showCustomFilter}
            displayCandidateSummaryColorCodes={displayCandidateSummaryColorCodes}
            showCustomSort={showCustomSort}
            setShowCustomSort={setShowCustomSort}
          />
        )}
      </div>
      {/* <div className={tableHeading ? "bodybox-bodywr" : ""}>
        {tableHeading ? <h3>{tableHeading}</h3> : <></>}
        <div className={showTableComponentHeader ? "body-box-bodybg" : ""}>

          <div className="body-box-body table-body-box-body">
            <div className="row"> */}
      {/* List icons */}
      {/* {listIcons && (
                <aside className="col m12">
                  <ul className="box-color-ul box-color-head">
                    <ListIcon
                      listIconSrc={icon.officeChairIcon}
                      text={"Position Name: "}
                      spanText={"Laravel Developer"}
                    />
                    <ListIcon
                      text={"Available"}
                      spanStatusclassName={"available"}
                    />
                    <ListIcon
                      text={"Can Consider"}
                      spanStatusclassName={"can-consider"}
                    />
                    <ListIcon
                      text={"Rejected"}
                      spanStatusclassName={"rejected"}
                    />
                    <ListIcon
                      text={"Shortlisted"}
                      spanStatusclassName={"shortlisted"}
                    />
                    <ListIcon
                      text={"not-rated"}
                      spanStatusclassName={"not-rated"}
                    />
                  </ul>
                </aside>
              )} */}
      {
        <TableBody
          tableHeadValues={tableHeadValues}
          showFilter={showFilter}
          filterArray={filterArray}
          setFilterArray={setFilterArray}
          tableName={tableName}
          getFilteredRows={getFilteredRows}
          loading={loading}
          customSortArray={customSortArray}
        >
          {children}
        </TableBody>
      }

      {/* Table Componenet Footer */}
      {showRows && totalItems ? (
        <TableFooter
          showRowsList={showRowsList}
          showRows={showRows}
          setShowRows={setShowRows}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
          selectPageHandler={selectPageHandler}
          itemName={itemName}
          isCandidateTableRecruiter={isCandidateTableRecruiter}
          candidateTableRecruiterFooter={candidateTableRecruiterFooter}
        />
      ) : (
        <></>
      )}
      {/* </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default TableComponent;
