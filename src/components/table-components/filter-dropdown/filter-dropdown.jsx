import { useEffect, useState } from "react";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { icon } from "../../assets/assets";
import EvuemeInputTag from "../../evueme-html-tags/evueme-input-tag";
import CheckboxInputField from "../../input-fields/checkbox-input-field";
import NormalButton from "../../buttons/normal-button";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../../config/config";
import ErrorToast from "../../toasts/error-toast";
import { formatDateToDDMMYYYY } from "../../../utils/dateFormatter";
import { useSelector } from "react-redux";
// import getUniqueId from "../../../utils/getUniqueId";

const EVUEME_UNIQUE_COLUMN_API = `${baseUrl}/common/base/tables/unique-values`;
const EVUEME_UNIQUE_COLUMN_API_RECRUITER = `${baseUrl}/common/base/tables/candidate-names`;

const FilterDropdown = ({
  curTableHead,
  index,
  setCurrentOpenDropdown = () => { },
  currentOpenDropdown,
  filterArray = [],
  setFilterArray = () => { },
  tableName,
  columnName,
  customTableName = "",
  customOptionValue = ""
}) => {
  const { selectedJobId } = useSelector((state) => state.interviewResponsesRecruiterDashboardSliceReducer);
  const [localFilterValues, setLocalFilterValues] = useState([]);
  const [uniqueColumnValues, setUniqueColumnValues] = useState([]);
  const [UniqueColumnValuesCopy, setUniqueColumnValuesCopy] = useState([]);
  const [filterString, setFilterString] = useState("");

  const handleSelectFilterValue = (selectedValue) => {
    const isValueSelected = localFilterValues.includes(selectedValue);

    if (isValueSelected) {
      const updatedFilterValues = localFilterValues.filter(
        (value) => value !== selectedValue
      );
      setLocalFilterValues(updatedFilterValues);
    } else {
      setLocalFilterValues((prevValues) => [...prevValues, selectedValue]);
    }
  };

  const handleSelectAll = () => {
    if (localFilterValues.length === UniqueColumnValuesCopy.length) {
      setLocalFilterValues([]);
    } else {
      setLocalFilterValues(uniqueColumnValues);
    }
  };

  // updates filterArray
  const handleOnSelectOk = () => {
    setFilterArray((prevArray) => {
      if (localFilterValues.length === 0) {
        return prevArray.filter(
          (filterObj) => filterObj.columnName !== columnName
        );
      }
      const index = prevArray.findIndex((obj) => obj.columnName === columnName);
      if (index !== -1) {
        const updatedArray = [...prevArray];
        updatedArray[index] = {
          ...updatedArray[index],
          values: localFilterValues,
        };
        return updatedArray;
      } else {
        return [
          ...prevArray,
          { columnName: columnName, values: localFilterValues },
        ];
      }
    });
    // Close the dropdown after applying filter
    setCurrentOpenDropdown(null);
  };

  // get snake cased columnName for jobDetails
  const getSnakeCasedString = (string) => {
    return string.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  };

  // function to get unique values from current column of table
  const getUniqueColumnValues = async () => {
    try {
      if (tableName === "" || columnName === "")
        throw new Error("TableName or ColumnName cannot be empty !");
      if (tableName === "RecruiterRoundScores") {
        console.log('response.data ::: ', columnName);
        const response = await axiosInstance.get(EVUEME_UNIQUE_COLUMN_API_RECRUITER, {
          params: {
            roundName: customTableName || tableName,
            jobId: selectedJobId,
          },
        });
        setUniqueColumnValuesCopy(response.data);
        setUniqueColumnValues(response.data);
        return;
      }

      if (tableName === "jobdetails" || tableName === "inviteCandidates" || tableName === "users")
        columnName = getSnakeCasedString(columnName);
      
      const response = await axiosInstance.get(EVUEME_UNIQUE_COLUMN_API, {
        params: {
          tableName: customTableName || tableName,
          columnName: customOptionValue || columnName,
        },
      });
      setUniqueColumnValuesCopy(response.data);
      setUniqueColumnValues(response.data);
    } catch (error) {
      ErrorToast(error);
      console.error(error);
    }
  };

  // populate localFilterValues with filterArray if columnName matches
  const populateLocalFilterarray = () => {
    const currFilterArrayObj = filterArray.find(
      (filterObj) => filterObj.columnName === columnName
    );
    if (!currFilterArrayObj) {
      return;
    }
    setLocalFilterValues(() => currFilterArrayObj.values);
  };

  // search handler to select unique column value
  const searchUniqueValueHandler = (e) => {
    const inputString = e.target.value;
    if (!inputString) {
      return setUniqueColumnValues(() => UniqueColumnValuesCopy);
    }
    setUniqueColumnValues(() => {
      const filteredValues = UniqueColumnValuesCopy.filter((value) => {
        if (typeof value === "string") {
          if (columnName.includes("Date")) {
            return formatDateToDDMMYYYY(value).startsWith(inputString.toLowerCase());
          }
          return value.toLowerCase().startsWith(inputString.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.some(
            (val) =>
              typeof val === "string" &&
              val.toLowerCase().startsWith(inputString.toLowerCase())
          );
        } else if (!isNaN(value)) {
          return value
            .toString()
            .toLowerCase()
            .startsWith(inputString.toLowerCase());
        }
        return false;
      });

      return filteredValues;
    });
  };

  const closeDropdownHandler = () => {
    setCurrentOpenDropdown((prev) => {
      if (prev === index) {
        return null;
      }
      return index;
    });
  };

  useEffect(() => {
    const filterColumn = filterArray.find(
      (col) => col.columnName === curTableHead
    );
    if (!filterColumn) return;
    setLocalFilterValues(filterColumn.values || []);
  }, [filterArray]);

  useEffect(() => {
    getUniqueColumnValues();
    populateLocalFilterarray();
  }, []);

  return (
    <div className="filterdropdown">
      <i>
        <EvuemeImageTag
          imgSrc={icon.tableFilterDropdownIcon}
          altText="Choose filter from table."
          onClick={closeDropdownHandler}
        />
      </i>
      {currentOpenDropdown === index && (
        <div className="filterdrwrap">
          <EvuemeInputTag
            type="search"
            className="search-focus"
            placeholder="Search..."
            value={filterString}
            onChange={e => {
              setFilterString(e.target.value);
              searchUniqueValueHandler(e);
            }}
          />
          <div className="question-slide-wrap scrollwrap scrollwrapFilter">
            <CheckboxInputField
              key="Select all"
              inputTagIdAndName="Select all"
              checked={
                localFilterValues.length === UniqueColumnValuesCopy.length
              }
              onChange={handleSelectAll}
              labelText="Select all"
            />
            {uniqueColumnValues.map((uniqueValue, index) => (
              <CheckboxInputField
                key={index}
                inputTagIdAndName={uniqueValue}
                checked={localFilterValues.includes(uniqueValue)}
                onChange={() => handleSelectFilterValue(uniqueValue)}
                labelText={columnName.includes("Date") ? formatDateToDDMMYYYY(uniqueValue) : uniqueValue}
              />
            ))}
          </div>
          <footer className="customshort-footer right-align footer-dropdown">
            <NormalButton
              buttonTagCssClasses={"btn-success"}
              buttonText={"Ok"}
              onClick={handleOnSelectOk}
            />
            <NormalButton
              buttonTagCssClasses={"btn-cancel"}
              buttonText={"Cancel"}
              onClick={closeDropdownHandler}
            />
          </footer>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
