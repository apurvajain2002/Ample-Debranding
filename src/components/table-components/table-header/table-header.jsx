import SelectInputField from "../../input-fields/select-input-field";
import TableButton from "../table-miscellaneous/table-button";
import TableSearchField from "../table-miscellaneous/table-search-field";
import { icon } from "../../assets/assets";
import CustomFilter from "../table-miscellaneous/custom-filter";
import axiosInstance from "../../../interceptors";
import { baseUrl } from "../../config/config";
import downloadExcelPdfFile from "../../../utils/download-excel-pdf-file";
import ErrorToast from "../../toasts/error-toast";
import { useSelector } from "react-redux";
import EvuemeSelectTag from "../../evueme-html-tags/evueme-select-tag";
import CandidateSummaryColorCodes from "../../../screens/summary-scores/CandidateSummaryColorCodes";

const downloadExcelPdfUrl = `${baseUrl}/common/base/download/generate`;

const TableHeader = ({
  tableName = "",
  tableHeadValues = [],
  currentPage = 0,
  showRows = 10,
  selectColumn,
  sortByOption,
  setTotalItems = () => {},
  setTableData = () => {},
  setJobStatus = () => {},
  setCurrentPage = () => {},
  jobStatus,
  searchApiUrl = "",
  searchValue = "",
  setSearchValue = () => {},
  loading,
  setLoading,
  customSortArray = [],
  setCustomSortArray = () => {},
  showFilter = false,
  setShowFilter = () => {},
  filterArray = [],
  getExcel,
  isCandidateTableRecruiter = false,
  selectedJobId,
  showPrintButton = true,
  showExcelButton = true,
  showPDFButton = true,
  showCustomFilter = true,
  displayCandidateSummaryColorCodes = false,
  showCustomSort = false,
  setShowCustomSort = () => {},
}) => {
  const recDashboardCommonAction = [
    { optionKey: "Status", optionValue: "Status" },
    { optionKey: "Joined", optionValue: "Joined" },
    { optionKey: "Offered", optionValue: "Offered" },
    { optionKey: "L3 Shortlisted", optionValue: "L3 Shortlisted" },
    { optionKey: "FilterReject", optionValue: "FilterReject" },
  ];
  const { userId } = useSelector((state) => state.signinSliceReducer);
  // HandleOnclickPrint
  const handleOnClickPrint = async () => {
    try {
      const { data } = await axiosInstance.post(
        downloadExcelPdfUrl,
        {
          dataType: "pdf",
          dataName: tableName,
          userId: userId,
        },
        {
          responseType: "blob",
        }
      );

      if (data) {
        const url = URL.createObjectURL(data);
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }
    } catch (error) {
      ErrorToast("Failed to download!");
    }
  };

  // HandleOnClickExcel
  const handleOnClickExcel = async () => {
    if (getExcel) return getExcel();
    try {
      const { data } = await axiosInstance.post(
        downloadExcelPdfUrl,
        {
          dataType: "excel",
          dataName: tableName,
          userId: userId,
        },
        {
          responseType: "blob",
        }
      );
      downloadExcelPdfFile(data, tableName, "xlsx");
    } catch (error) {
      ErrorToast("Failed to download excel!");
    }
  };

  // HandleOnClickPDF
  const handleOnClickPDF = async () => {
    try {
      const { data } = await axiosInstance.post(
        downloadExcelPdfUrl,
        {
          dataType: "pdf",
          dataName: tableName,
          userId: userId,
        },
        {
          responseType: "blob",
        }
      );
      downloadExcelPdfFile(data, tableName, "pdf");
    } catch (error) {
      ErrorToast("Failed to download pdf!");
    }
  };

  const handleOnClickExcelRecruiterDashboard = async () => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/report/download`,
        { jobId: Number(selectedJobId), 
          dataType:'excel'
        },
        {
          responseType: "blob",
        }
      );
      downloadExcelPdfFile(data, tableName, "xlsx");
    } catch (error) {
      ErrorToast("Failed to download excel!");
    }
  };
  const handleOnClickPdfRecruiterDashboard = async () => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/report/download`,
        { jobId: Number(selectedJobId),
          dataType: "pdf"
         },
        {
          responseType: "blob",
        }
      );
      downloadExcelPdfFile(data, tableName, "pdf");
    } catch (error) {
      ErrorToast("Failed to download excel!");
    }
  };

  return (
    <div className="row row-margin">
      <div className="input-field col xl6 l6 m6 s12">
        <div className="row row-margin">
          {showCustomFilter && (
            <div className="col xl8 l8 m8 s12">
            <CustomFilter
              tableHeadValues={tableHeadValues}
              customSortArray={customSortArray}
              setCustomSortArray={setCustomSortArray}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              showCustomSort={showCustomSort}
              setShowCustomSort={setShowCustomSort}
            />
            </div>
          )}
          {jobStatus && (
            <SelectInputField
              divTagCssClasses={"input-field col xl4 l4 m4 s12"}
              selectTagIdAndName={"selectColumn"}
              options={[
                { optionKey: "All", optionValue: "All" },
                { optionKey: "Active", optionValue: "Active" },
                { optionKey: "Not Active", optionValue: "Not Active" },
              ]}
              value={jobStatus}
              onChange={(e) => {
                setJobStatus(() => e.target.value);
                // Reset pages
                setCurrentPage(1);
              }}
              firstOptionDisabled={false}
              labelText={"Select Active/Not Active Job"}
            />
          )}
        </div>
      </div>
      <div
        className="col xl6 l6 m6 s12"
        style={
          displayCandidateSummaryColorCodes
            ? { display: "flex", width: "100%", flexDirection: "row" }
            : {}
        }
      >
        <ul className="table-btnwr right valign-wrapper padding-left-right-7">
          {displayCandidateSummaryColorCodes && <CandidateSummaryColorCodes />}
          <TableSearchField
            setTotalItems={setTotalItems}
            setTableData={setTableData}
            searchApiUrl={searchApiUrl}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            currentPage={currentPage}
            showRows={showRows}
            selectColumn={selectColumn}
            sortByOption={sortByOption}
            loading={loading}
            setLoading={setLoading}
            tableName={tableName}
            filterArray={filterArray}
            customSortArray={customSortArray}
          />
          {showPrintButton && (
            <TableButton
              buttonText={"Print"}
              buttonIconSrc={icon.printerIcon}
              buttonIconAltText={"Print"}
              onClick={handleOnClickPrint}
            />
          )}
          {showExcelButton && (
            <TableButton
              buttonText={"Excel"}
              buttonIconSrc={icon.csvFileIcon}
              buttonIconAltText={"Generate excel file"}
              onClick={
                isCandidateTableRecruiter
                  ? handleOnClickExcelRecruiterDashboard
                  : handleOnClickExcel
              }
            />
          )}
          {showPDFButton && (
            <TableButton
              buttonText={"PDF"}
              buttonIconSrc={icon.pdfFileIcon}
              buttonIconAltText={"Generate PDF file"}
              onClick={
                isCandidateTableRecruiter
                  ? handleOnClickPdfRecruiterDashboard
                  : handleOnClickPDF
              }
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default TableHeader;
