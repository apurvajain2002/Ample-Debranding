import NextButton from "../../buttons/next-button";
import BackButton from "../../buttons/back-button";
import SelectInputField from "../../input-fields/select-input-field";
import Pagination from "../../../features/pagination";
import NormalButton from "../../buttons/normal-button";

const TableFooter = ({
  showRowsList,
  showRows,
  setShowRows,
  currentPage,
  setCurrentPage,
  totalItems,
  selectPageHandler,
  itemName = "items",
  isCandidateTableRecruiter = false,
  candidateTableRecruiterFooter,
}) => {
  return (
    <div className="table-pag-footer">
      {isCandidateTableRecruiter && 
        candidateTableRecruiterFooter
    }
      <div className="row">
        {showRows && (
          <>
            <div className="col xl1 l1 m2 s2">
              Show rows
            </div>
            <SelectInputField
              divTagCssClasses={"col xl1 l1 m2 s2"}
              selectTagIdAndName={"showRows"}
              options={showRowsList}
              value={showRows}
              onChange={(e) => {
                const newValue = e.target.value !== "" ? parseInt(e.target.value, 10) : 10;
                setCurrentPage(1);
                setShowRows(newValue);
              }}
              labelText={null}
            />
            <div className="input-field col xl5 l5 m8 s8">
              <Pagination
                currentPage={currentPage}
                selectPageHandler={selectPageHandler}
                totalItems={totalItems}
                showRows={showRows}
              />
            </div>
            <div className="col xl5 l5 m8 s8">
              <span>
                {totalItems
                  ? `Showing ${currentPage * showRows - showRows + 1} to ${" "}
              ${Math.min(
                    currentPage * showRows,
                    totalItems
                  )} of ${totalItems}${" "}
              ${itemName}`
                  : `No values found`}
              </span>
              <div className="table-btn-right right">
                <a class="waves-effect waves-light btn btn-clear left" onClick={() => selectPageHandler(currentPage - 1)}><i class="material-icons dp48">arrow_back</i>
                  Back</a>
                <a class="waves-effect waves-light btn btn-clear btn-submit" onClick={() => selectPageHandler(currentPage + 1)}>Next
                  <i class="material-icons dp48">arrow_forward</i></a>
                {/* <NormalButton
                  buttonTagCssClasses={"waves-effect waves-light btn btn-clear left"}
                  buttonText={'Back'}
                  leftIconSrc={'material-icons'}
                  onClick={() => selectPageHandler(currentPage - 1)}
                />
                <NormalButton
                  buttonTagCssClasses={"waves-effect waves-light btn btn-clear btn-submit"}
                  buttonText={'Next'}
                  leftIconSrc={'material-icons'}
                  onClick={() => selectPageHandler(currentPage + 1)}
                /> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableFooter;