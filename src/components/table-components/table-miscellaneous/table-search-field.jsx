import { useEffect } from "react";
import NormalInputField from "../../input-fields/normal-input-field";
import { icon } from "../../assets/assets";
import axiosInstance from "../../../interceptors/index";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import ErrorToast from "../../toasts/error-toast";

const TableSearchField = ({
  setTotalItems,
  setTableData,
  searchApiUrl,
  searchValue,
  setSearchValue,
  currentPage,
  showRows,
  selectColumn,
  sortByOption,
  loading,
  setLoading = "",
  tableName = "",
  filterArray = [],
  customSortArray = [],
}) => {
  const dispatch = useDispatch();

  // Fetchdata
  const handleSearch = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post(searchApiUrl, {
        tableName: tableName,
        filterList: filterArray,
        sortList: customSortArray,
        pagingNo: currentPage,
        pageSize: showRows,
        searchterm: searchValue,
      });
      const data = response.data;
      if (data.success) {
        dispatch(setTotalItems(data.recordsTotal));
        dispatch(setTableData(data.list));
      } else {
        ErrorToast(data.message);
      }
      dispatch(setLoading(false));
    } catch (error) {
      ErrorToast(error.message);
      dispatch(setLoading(false));
    }
  };

  const debounceHandleSearch = debounce(() => {
    if (searchValue && searchValue !== "") handleSearch(searchValue);
  }, 800);

  //  Clear search
  const handleOnClearSearch = () => {
    dispatch(setSearchValue(""));
  };

  // Cleanup of debounce function on unmounting of the function
  useEffect(() => {
    debounceHandleSearch(searchValue);

    return () => debounceHandleSearch.cancel();
  }, [searchValue, currentPage, showRows, selectColumn, sortByOption]);

  return (
    <li className="search">
      <NormalInputField
        inputTagCssClasses={
          searchValue
            ? "search-focus search-field-width-220px"
            : "search-focus search-field-width-33px"
        }
        type="search"
        inputTagIdAndName={"tableSearchField"}
        placeholder={"Search in table"}
        value={searchValue}
        onChange={(e) => {
          dispatch(setSearchValue(e.target.value));
        }}
        rightIconSrc={searchValue || searchValue !== "" ? icon.crossIcon : ""}
        rightIconAltText={
          searchValue ? "Clear the search value" : "Search in the table"
        }
        rightIconCss={
          searchValue || searchValue !== ""
            ? "search-field-cross-icon blackColorFilter cursor-pointer"
            : "search-field-search-icon cursor-pointer pointer-events-none"
        }
        onClickRightIcon={
          searchValue || searchValue !== "" ? handleOnClearSearch : () => {}
        }
      />
    </li>
  );
};

export default TableSearchField;
