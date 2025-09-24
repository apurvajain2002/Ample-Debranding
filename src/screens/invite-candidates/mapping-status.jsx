import { useEffect, useState } from "react";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import NormalButton from "../../components/buttons/normal-button";
import FileUploadStatus from "../../components/miscellaneous/file-upload-status";
import { useSelector } from "react-redux";
import WarningToast from "../../components/toasts/warning-toast";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import { useDispatch } from "react-redux";
import { revalidateBulkInvite } from "../../redux/actions/invite-candidates";

const formatCamelCase = (varName) => {
  let result = varName.charAt(0).toUpperCase();
  for (let i = 1; i < varName.length; i++) {
    if (varName[i] === varName[i].toUpperCase()) {
      result += " ";
    }
    result += varName[i];
  }
  return result;
};

const headersKey = [
  "index",
  "fullName",
  "primaryMailId",
  "secondaryMailId",
  "primaryPhoneNumber",
  "secondaryPhoneNumber",
  "whatsappNumber",
  "deleteRow",
];

const sanitizeValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "null" ||
    value === "undefined"
  ) {
    return "";
  }
  return value;
};

const DynamicTable = ({
  // headers,
  allRows = [],
  setAllRows,
  invalidRows = [],
}) => {
  const onRowUpdate = (e, rowIndex, header) => {
    const newValue = e.target.value;
    setAllRows((prevRows) => {
      const ind = prevRows.findIndex((row) => row.index === rowIndex);
      if (ind === -1) {
        return prevRows;
      }
      const updatedRows = [...prevRows];
      const rowToUpdate = { ...updatedRows[ind] };

      if (header in rowToUpdate) {
        rowToUpdate[header] = newValue;
        updatedRows[ind] = rowToUpdate;
      } else {
        WarningToast(
          `Header "${header}" does not map to a valid key in the row object`
        );
      }
      return updatedRows;
    });
  };

  const deleteRow = (rowIndex) => {
    if (rowIndex < 0) return;
    setAllRows((prev) => {
      return prev.filter((row) => row.index !== rowIndex);
    });
  };

  return (
    <div className="dynamic-table excel-validation-table-wrapper">
      <table>
        <thead>
          <tr>
            {headersKey.map((header, index) => (
              <th
                key={index}
                className={`${header === "index" ? "indexTd" : ""} ${
                  header === "deleteRow" ? "deleteTd" : ""
                }`}
              >
                {formatCamelCase(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allRows.map((row, rowIndex) => {
            if (!invalidRows.includes(row.index)) return null;
            return (
              <tr key={rowIndex}>
                {headersKey.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className={header === "deleteRow" ? "deleteTd" : ""}
                  >
                    {header === "deleteRow" ? (
                      <EvuemeModalTrigger
                        modalId={"confirmDeleteModal"}
                        onClick={() => {
                          const response = window.confirm(
                            "The selected candidate will be removed."
                          );
                          if (response) {
                            deleteRow(row["index"]);
                          }
                        }}
                      >
                        <EvuemeImageTag
                          imgSrc={icon.deleteIcon}
                          alt={"Delete Icon"}
                          className={"delete-icon"}
                        />
                      </EvuemeModalTrigger>
                    ) : (
                      <input
                        type="text"
                        value={sanitizeValue(row[header])}
                        onChange={(e) => onRowUpdate(e, row["index"], header)}
                        disabled={colIndex === 0}
                      />
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ConfirmDeleteModal onClickNo={() => {}} onClickYes={() => {}} />
    </div>
  );
};

const MappingStatus = ({
  // dataToMap,
  // rowData,
  // mapping,
  setInviteCandidate,
  onCancel,
  onEdit,
  mappingIndex,
  setIsBulkInvited,
}) => {
  const { candidates } = useSelector(
    (state) => state.inviteCandidatesSliceReducer
  );
  const {
    validData,
    InvalidMobileNumbers,
    duplicateEmails,
    duplicatePhoneNumbers,
    invalidEmails,
    // headers,
    // error,
  } = candidates;
  const [showTable, setShowTable] = useState(false);
  const [invalidCandidates, setInvalidCandidates] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const dispatch = useDispatch();

  const generatedData = [
    {
      status: true,
      count: 1,
      iconText: "File Uploaded",
      onClick: () => {},
    },
    {
      status: InvalidMobileNumbers.length === 0,
      count: InvalidMobileNumbers.length,
      iconText: "Invalid Mobile Numbers",
      onClick: () => {
        setShowTable(true);
        setInvalidCandidates(InvalidMobileNumbers);
      },
    },
    {
      status: duplicateEmails.length === 0,
      count: duplicateEmails.length,
      iconText: "Duplicate Emails",
      onClick: () => {
        setShowTable(true);
        setInvalidCandidates(duplicateEmails);
      },
    },
    {
      status: duplicatePhoneNumbers.length === 0,
      count: duplicatePhoneNumbers.length,
      iconText: "Duplicate Phone Numbers",
      onClick: () => {
        setShowTable(true);
        setInvalidCandidates(duplicatePhoneNumbers);
      },
    },
    {
      status: invalidEmails.length === 0,
      count: invalidEmails.length,
      iconText: "Invalid Emails",
      onClick: () => {
        setShowTable(true);
        setInvalidCandidates(invalidEmails);
      },
    },
  ];

  const handleContinue = async () => {
    if (showTable) setShowTable(!showTable);
    const res = await dispatch(revalidateBulkInvite({ allRows: allRows }));
    const response = res.payload.response;

    // Check if all arrays except 'validData' are empty
    const allArraysEmpty =
      response.duplicateEmails.length === 0 &&
      response.duplicatePhoneNumbers.length === 0 &&
      response.invalidEmails.length === 0 &&
      response.invalidMobileNumbers.length === 0;

    if (allArraysEmpty) {
      
      let result = allRows
        .map((obj) => {
          // Extract fullName, primaryMailId, and whatsappNumber without commas
          const fullName = obj.firstName || "";
          const primaryMailId = obj.primaryMailId || "";
          const whatsappNumber = obj.whatsappNumber || "";
          return `${fullName},${primaryMailId},${whatsappNumber}`.trim();
        })
        .join("\n");
  
      setIsBulkInvited(true);
      await setInviteCandidate({
        inviteType: "individual",
        candidateInfo: result,
      });
    }

  };

  const getMappedFileCount = () => {
    return Object.keys(mappingIndex).filter((key) => mappingIndex[key]).length;
  };

  useEffect(() => {
    // fill invalid candidates
    // const mergeUniqueObjects = (...arrays) => {
    //   const combinedArray = [];
    //   const seenIndexes = new Set();

    //   // Loop through each array provided
    //   arrays.forEach((array) => {
    //     array.forEach((obj) => {
    //       if (!seenIndexes.has(obj.index)) {
    //         combinedArray.push(obj);
    //         seenIndexes.add(obj.index);
    //       }
    //     });
    //   });
    //   return combinedArray;
    // };

    // setInvalidCandidates(() => {
    //   return mergeUniqueObjects(
    //     InvalidMobileNumbers,
    //     duplicateEmails,
    //     duplicatePhoneNumbers,
    //     invalidEmails
    //   );
    // });
    setAllRows(validData || []);
  }, [candidates]);

  console.log(invalidCandidates);
  return (
    <>
      <div className="fileupload-container text-center">
        <h3 className="upload-h3">Field Mapping</h3>
        <p className="inline-p">
          {getMappedFileCount() + " "}
          Field's mapped
        </p>
        <div className="upload-file">
          <i>
            <EvuemeImageTag
              imgSrc={icon.checkMarkicon}
              alt={icon.checkMarkicon}
              className={"primaryColorFilter2"}
              style={{ height: "40px" }}
            />
          </i>
        </div>
        <footer className="upload-footer">
          <NormalButton
            buttonTagCssClasses="btn waves-effect waves-light btn-success"
            buttonText=" Edit "
            onClick={onEdit}
          />
          <NormalButton
            buttonTagCssClasses="btn waves-effect waves-light btn-cancel"
            buttonText="Cancel"
            onClick={onCancel}
          />
        </footer>
      </div>
      <div>
        <div
          className="containerforStatus choosefileupload-container no-bg"
          style={{ margin: "auto" }}
        >
          <FileUploadStatus data={generatedData} />
        </div>
      </div>
      {showTable && (
        <DynamicTable
          invalidRows={invalidCandidates}
          // headers={headers}
          allRows={allRows}
          setAllRows={setAllRows}
        />
      )}
      <NormalButton
        onClick={handleContinue}
        buttonTagCssClasses={"btn btn-clear btn-submit right"}
        buttonText={"Continue"}
        style={{ marginLeft: "90%", marginTop: "8px" }}
      />
    </>
  );
};

export default MappingStatus;
