import { useEffect, useState } from "react";
import NormalButton from "../../buttons/normal-button";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { icon } from "../../assets/assets";
import SelectInputField from "../../input-fields/select-input-field";
import { optionMapper } from "../../../utils/optionMapper";

const CustomSortRow = ({
  index,
  tableHeadValues,
  localCustomSortArray = [],
  setLocalCustomSortArray = () => {},
  columnName = "",
  sortByAsc = "",
}) => {
  const [localColumn, setLocalColumn] = useState(columnName);
  const [localSortByOrder, setLocalSortByOrder] = useState(sortByAsc);

  const handleOnClickRemoveLevel = () => {
    setLocalCustomSortArray(localCustomSortArray.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const newCustomSortArray = localCustomSortArray.map((customSort, i) => {
      if (i === index)
        return {
          columnName: localColumn,
          sortByAsc: localSortByOrder,
        };
      return customSort;
    });
    setLocalCustomSortArray(() => newCustomSortArray);
  }, [localColumn, localSortByOrder]);

  return (
    <div className="row valign-wrapper col s12">
      <aside className="col xl12 l12 m9 s7">
        {index === 0 && <h4>Column</h4>}
        <div className="row valign-wrapper">
          <label htmlFor="" className="col xl5 l4 m4">
            {index === 0 ? "Sort by" : "Then by"}
          </label>
          <SelectInputField
            divTagCssClasses="input-field col xl12 l10 m11"
            selectTagIdAndName="selectTableCustomColumn"
            options={optionMapper(
              tableHeadValues.filter((row) => row.allowFilter === true),
              "optionKey",
              "optionValue",
              "Select Column"
            )}
            value={localColumn}
            onChange={(e) => setLocalColumn(e.target.value)}
          />
        </div>
      </aside>
      <aside className="col xl6 l6 m5 s5">
        {index === 0 && <h4>Order</h4>}
        <div className="row flex-center">
          <SelectInputField
            divTagCssClasses={
              window.innerWidth <= 500
                ? `input-field margin-top-30px`
                : "input-field"
            }
            selectTagIdAndName="selectTableColumnSortingOrder"
            options={[
              { optionKey: "Sort By", optionValue: "" },
              { optionKey: "A to Z", optionValue: "true" },
              { optionKey: "Z to A", optionValue: "false" },
            ]}
            value={localSortByOrder}
            onChange={(e) => setLocalSortByOrder(e.target.value)}
          />
          <EvuemeImageTag
            className="cursor-pointer"
            style={{ marginLeft: "10px" }}
            imgSrc={icon.crossIcon}
            onClick={handleOnClickRemoveLevel}
          />
        </div>
      </aside>
    </div>
  );
};

const CustomSortContainer = ({
  tableHeadValues,
  setShowCustomSort,
  customSortArray,
  setCustomSortArray,
}) => {
  const [localCustomSortArray, setLocalCustomSortArray] = useState([]);

  useEffect(() => {
    if (customSortArray.length) {
      setLocalCustomSortArray(customSortArray);
    } else {
      setLocalCustomSortArray([{ columnName: "", sortByAsc: "" }]);
    }
  }, [customSortArray]);

  const handleOnClickAddLevel = () => {
    if (
      localCustomSortArray.length >=
      tableHeadValues.filter((row) => row.allowFilter).length
    )
      return;
    setLocalCustomSortArray([
      ...localCustomSortArray,
      { columnName: "", sortByAsc: "" },
    ]);
  };

  const handleOnClickOk = () => {
    setCustomSortArray(
      localCustomSortArray.filter(
        (row) => row.sortByAsc !== undefined && row.sortByAsc !== ""
      )
    );
    setShowCustomSort(false);
  };

  return (
    <div className="customshort-drop">
      <div className="btnwr-top">
        <a
          className="add-level-link cursor-pointer"
          onClick={handleOnClickAddLevel}
        >
          Add Level
        </a>
      </div>
      {localCustomSortArray.length ? (
        localCustomSortArray.map((columnSortObj, index) => (
          <CustomSortRow
            key={index}
            index={index}
            tableHeadValues={tableHeadValues}
            localCustomSortArray={localCustomSortArray}
            setLocalCustomSortArray={setLocalCustomSortArray}
            columnName={columnSortObj.columnName}
            sortByAsc={columnSortObj.sortByAsc}
          />
        ))
      ) : (
        <div>Click on Add Level</div>
      )}
      <footer className="customshort-footer right-align margin-top-15">
        <NormalButton
          buttonTagCssClasses="btn-success margin-right-5"
          buttonText="Ok"
          onClick={handleOnClickOk}
        />
        <NormalButton
          buttonTagCssClasses="btn-cancel margin-right-5"
          buttonText="Cancel"
          onClick={() => setShowCustomSort(false)}
        />
      </footer>
    </div>
  );
};

const CustomSort = ({
  tableHeadValues = [],
  customSortArray,
  setCustomSortArray,
  setShowFilter = () => {},
  showCustomSort = false,
  setShowCustomSort = () => {},
}) => {
  // Use internal state if external state is not provided
  const [internalShowCustomSort, setInternalShowCustomSort] = useState(false);
  const actualShowCustomSort = showCustomSort !== undefined ? showCustomSort : internalShowCustomSort;
  const actualSetShowCustomSort = setShowCustomSort !== (() => {}) ? setShowCustomSort : setInternalShowCustomSort;
  return (
    <div className="input-field col xl12 l12 m12 s12">
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn-customshort"
        buttonText="Custom Sort"
        leftIconSrc={icon.customSortIcon}
        leftIconCss="margin-right-5"
        leftIconAltText="Custom sort data"
        onClick={() => actualSetShowCustomSort((prev) => !prev)}
      />
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn-filter"
        buttonText="Filter"
        leftIconSrc={icon.filterIcon}
        leftIconCss="margin-right-5"
        leftIconAltText="Filter data"
        onClick={() => setShowFilter((prev) => !prev)}
      />
      {actualShowCustomSort && (
        <CustomSortContainer
          tableHeadValues={tableHeadValues}
          setShowCustomSort={actualSetShowCustomSort}
          customSortArray={customSortArray}
          setCustomSortArray={setCustomSortArray}
        />
      )}
    </div>
  );
};

export default CustomSort;
