import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import NextButton from "../../components/buttons/next-button";
import BackButton from "../../components/buttons/back-button";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { useDispatch, useSelector } from "react-redux";
import { saveEntity } from "../../redux/actions/sign-up-actions";
import NormalButton from "../../components/buttons/normal-button";
import WarningToast from "../../components/toasts/warning-toast";
import {
  isValidCin,
  isValidPan,
  isvalidGstin,
} from "../../utils/valdationRegex";
import CheckboxInputField from "../../components/input-fields/checkbox-input-field";
import { AnnotationEditorParamsType } from "pdfjs-dist";
import SuccessToast from "../../components/toasts/success-toast";

const billingAddressTemplate = {
  addressLine1: "",
  addressLine2: "",
  stateId: "",
  id: null,
  orgId: "",
  pincode: "",
  name: "",
  cinNumber: "",
  panNumber: "",
  gstinNumber: "",
  gstState: "",
  panMedia: "",
  gstinMedia: "",
  isDefault: false,
};

const INITIAL_ERROR_STATE = {
  name: false,
  addressLine1: false,
  gstState: false,
  stateId: false
}
// const [error, setError] = useState(INITIAL_ERROR_STATE);

const getFileNameFromPath = (filePath) => {
  return filePath ? filePath.split(/[/\\]/).pop() : "";
};

const BillingAddress = ({
  handleBillingAddress,
  handleCheckboxChange,
  index,
  newEntity,
  val,
  fileInputRef2,
  states,
  handleClick2,
  getFileNameFromPath,
  fileInputRef,
  onReset,
  handleClick,
  handleRemove,
  panFile,
  gstFile,
  error
}) => {
  return (
    <>
      <div className="row row-padding">
        <div
          className="col xl6 l6 m6 s12"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h3 className="h3-title">
            <i>
              <EvuemeImageTag
                imgSrc={icon.billingAddressIcon}
                altText="Billing Address"
              />
            </i>{" "}
            Billing Address
          </h3>
          {newEntity?.billingAddress?.length > 1 && (
            <CheckboxInputField
              checked={val?.isDefault === true}
              inputTagIdAndName={`isDefaultChecked${index}`}
              onClick={() => handleCheckboxChange(index)}
              labelText="is Default"
            />
          )}
        </div>
      </div>
      <div className="row">
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"name"}
          placeholder={"Legal Name"}
          value={newEntity?.businessName || val.name}
          onChange={(e) => handleBillingAddress(e, index)}
          labelText={"Legal Name"}
          required={true}
          missing={error.name}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"addressLine1"}
          placeholder={"Complete Billing Address"}
          value={newEntity?.billingAddress?.addressLine1 || val.addressLine1}
          onChange={(e) => handleBillingAddress(e, index)}
          required={true}
          labelText={"Address"}
          missing={error.addressLine1}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"addressLine2"}
          placeholder={"Address"}
          value={newEntity?.billingAddress?.addressLine2 || val.addressLine2}
          onChange={(e) => handleBillingAddress(e, index)}
          labelText={"Address Line 2"}
        />
        <SelectInputField
          divTagCssClasses={"input-field col xl4 l4 m6 s12"}
          selectTagIdAndName={"stateId"}
          options={states}
          value={newEntity?.billingAddress?.stateId || val.stateId}
          onChange={(e) => handleBillingAddress(e, index)}
          required={false}
          labelText={"Billing Address State"}
          missing={error.stateId}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"pincode"}
          placeholder={"PIN Code"}
          value={newEntity?.billingAddress?.pincode || val.pincode}
          onChange={(e) => handleBillingAddress(e, index)}
          labelText={"PIN Code"}
        />
      </div>
      <h6 className="contact-person-details-icon-wrapper">
        <EvuemeImageTag
          className={"secondaryColorFilter billing-address-icon"}
          imgSrc={icon.billingAddressIcon}
          altText={"Business Identification Information"}
        />{" "}
        Business Identification Information
      </h6>
      <div className="row">
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"cinNumber"}
          placeholder={"CIN Number"}
          value={val.cinNumber}
          onChange={(e) => handleBillingAddress(e, index)}
          onBlur={(e) => {
            const CIN = (e.target.value || "").toUpperCase();
            if (CIN === "") {
              return
            }
            if (!isValidCin(CIN)) {
              return WarningToast("Not a Valid CIN Number!");
            }
          }}
          labelText={"CIN"}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"panNumber"}
          placeholder={"PAN Number"}
          value={val.panNumber}
          onChange={(e) => handleBillingAddress(e, index)}
          // onKeyPress={(e) => validatePan(e, val.panNumber)}
          onBlur={(e) => {
            const PAN = (e.target.value || "").toUpperCase();
            if (PAN === "") {
              return
            }
            if (!isValidPan(PAN)) {
              return WarningToast("Not a Valid PAN Number!");
            }
          }}
          labelText={"PAN "}
          required={false}
        />
        <input
          name="panFile"
          ref={(element)=>{ fileInputRef2.current[index]=element;}}
          type="file"
          hidden
          onChange={(e) => handleBillingAddress(e, index)}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          onClick={(e) => {handleClick2(e,index);}}
          inputTagCssClasses="validate upload-data"
          inputTagIdAndName={"panFile"}
          placeholder={"Upload File: PDF JPEG"}
          value={getFileNameFromPath(val.panFile || val.panMedia)} // Show only the file name here, not the base64 data
          onChange={(e) => handleBillingAddress(e, index)}
          leftIconSrc={icon.pdfFileIcon}
          leftIconCss="upload-PDF redColorFilter"
          labelText={"Upload PAN"}
          required={false}
          onResetFile={() => onReset("panFile", index)}
          fileAddress={panFile}
        />
        <SelectInputField
          divTagCssClasses={"input-field col xl4 l4 m6 s12"}
          selectTagIdAndName={"gstState"}
          options={states}
          value={val.gstState}
          onChange={(e) => handleBillingAddress(e, index)}
          required={true}
          labelText={"GST State"}
          missing={error.gstState}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagCssClasses="validate"
          inputTagIdAndName={"gstinNumber"}
          placeholder={"GSTIN Number"}
          value={val.gstinNumber}
          onChange={(e) => handleBillingAddress(e, index)}
          onBlur={(e) => {
            const GSTIN = (e.target.value || "").toUpperCase();
            if (GSTIN === "") {
              return
            }
            if (!isvalidGstin(GSTIN)) {
              return WarningToast("Not a Valid GSTIN Number!");
            }
          }}
          labelText={"GSTIN"}
          required={false}
        />
        <input
          name="gstFile"
          ref={(element)=>{fileInputRef.current[index]=element;}}
          type="file"
          hidden
          onChange={(e) => handleBillingAddress(e, index)}
        />
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          onClick={(e)=>{handleClick(e,index)}}
          inputTagCssClasses="validate upload-data"
          onResetFile={() => onReset("gstFile", index)}
          inputTagIdAndName={"gstFile"}
          placeholder={"Upload File: PDF JPEG"}
          value={getFileNameFromPath(val.gstFile || val.gstinMedia)}
          leftIconSrc={icon.pdfFileIcon}
          leftIconCss="upload-PDF redColorFilter"
          onChange={handleBillingAddress}
          labelText={"Upload GSTIN"}
          required={false}
          fileAddress={gstFile}
        />
        {newEntity?.billingAddress.length - 1 !== 0 && (
          <NormalButton
            buttonTagCssClasses={"btn btn-clear btn-submit"}
            buttonText={"Remove"}
            o
            onClick={() => handleRemove(index)}
          />
        )}
      </div>
    </>
  );
};

const EntitySignupStep2 = ({ newEntity, setNewEntity }) => {

  const [panFile, setPanFile] = useState([]);
  const [gstFile, setGstFile] = useState([]);
  const [error, setError] = useState(INITIAL_ERROR_STATE);
  const navigate = useNavigate("");
  const dispatch = useDispatch();
  const fileInputRef = useRef([null]);
  const fileInputRef2 = useRef([null]);

  const { states } = useSelector((state) => state.manageLocationsSliceReducer);

  // const handleOnClickNextButton = async () => {
  //   const isBillingAddressValid = (billingAddresses) => {
  //     return billingAddresses.every((address) => {
  //       const {
  //         addressLine1,
  //         stateId,
  //         name,
  //         panNumber,
  //         gstinNumber,
  //         gstState,
  //         panMedia,
  //         gstinMedia,
  //       } = address;
  //       return (
  //         addressLine1 &&
  //         // stateId &&
  //         // name &&
  //         // panNumber &&
  //         // gstinNumber &&
  //         gstState
  //         // panMedia &&
  //         // gstinMedia
  //       );
  //     });
  //   };
  //   if (!isBillingAddressValid(newEntity.billingAddress)) {
  //     return WarningToast("Fill all the required fields!");
  //   } else {
  //     const res = await dispatch(
  //       saveEntity({ ...newEntity, id: localStorage.getItem("entityId") })
  //     );

  //     if (
  //       res.type === "saveEntity/fulfilled" &&
  //       res?.payload?.message === "Request Processed Successfully"
  //     ) {
  //       navigate("/entity-signup/step-3");
  //     }
  //   }
  // };
  // const [error, setError] = useState(INITIAL_ERROR_STATE)

  const handleOnClickNextButton = async () => {
    // setError(INITIAL_ERROR_STATE);

    // if (
    //   !newEntity.name ||
    //   !newEntity.addressLine1 ||
    //   !newEntity.gstState
    // ) {
    //   let update = {}
    //   if (!newEntity.name) update["name"] = true;
    //   if (!newEntity.addressLine1) update["addressLine1"] = true;
    //   if (!newEntity.gstState) update["gstState"] = true;
    //   setError(prev => ({ ...prev, ...update }));
    //   return WarningToast("Please Enter All fields");
    // }
    const currentError = { ...INITIAL_ERROR_STATE };
    // Add your validation logic here
    if (!newEntity.businessName) currentError.name = true;
    if (!newEntity.billingAddress.some((addr) => addr.addressLine1)) currentError.addressLine1 = true;
    if (!newEntity.billingAddress.some((addr) => addr.gstState)) currentError.gstState = true;
    if (!newEntity.billingAddress.some((addr) => addr.stateId)) currentError.stateId = true;

    // WarningToast("Please fill required fields");

    if (Object.values(currentError).some((error) => error)) {
      setError(currentError);
      return WarningToast("Please fill required fields");
      return;
    }
    const invalidFields = [];

    const isBillingAddressValid = (billingAddresses) => {
      return billingAddresses.every((address) => {
        const {
          addressLine1,
          stateId,
          name,
          panNumber,
          gstinNumber,
          gstState,
          cinNumber,
        } = address;

        if (!addressLine1 || !stateId || !name || !gstState) {
          return false;
        }

        if (panNumber && !isValidPan(panNumber)) invalidFields.push("PAN Number");
        if (gstinNumber && !isvalidGstin(gstinNumber)) invalidFields.push("GSTIN Number");
        if (cinNumber && !isValidCin(cinNumber)) invalidFields.push("CIN Number");

        return true;
      });
    };

    const isValid = isBillingAddressValid(newEntity.billingAddress);

    if (!isValid) {
      return WarningToast("Fill all the required fields!");
    }

    if (invalidFields.length > 0) {
      return WarningToast(`Invalid entries: ${invalidFields.join(", ")}`);
    }

    const res = await dispatch(
      saveEntity({ ...newEntity, id: localStorage.getItem("entityId") })
    );

    if (
      res.type === "saveEntity/fulfilled" &&
      res?.payload?.message === "Request processed successfully!"
    ) {
      // Earlier It is not showing success Toast!
      SuccessToast("Request Processed Successfully")
      navigate("/entity-signup/step-3");
    }
  };

  const handleRemoveFile = (name, index) => {
    if (name === "panFile") {
      const newPanFile = [...panFile];
      newPanFile[index] = "";
      setPanFile(newPanFile);
      fileInputRef2.current[index].value = '';
    }
    if (name === "gstFile") {
      const newGstFile = [...gstFile];
      newGstFile[index] = "";
      setGstFile(newGstFile);
      fileInputRef.current[index].value = '';
    }
    setNewEntity((prevEntity) => {
      const mediaKey = name === "panFile" ? "panMedia" : "gstinMedia";
      prevEntity.billingAddress[index][mediaKey] = "";
      prevEntity.billingAddress[index][name] = "";
      return { ...prevEntity };
    });
  }

  const handleAdd = () => {
    const addBilling = [...newEntity.billingAddress];
    addBilling.push({
      addressLine1: "",
      addressLine2: "",
      stateId: newEntity?.hqstate,
      id: null,
      orgId: "",
      pincode: newEntity?.pincode,
      name: newEntity?.businessName,
      cinNumber: "",
      panNumber: "",
      gstinNumber: "",
      gstState: newEntity?.hqstate,
      panMedia: "",
      gstinMedia: "",
      isDefault: false,
    });

    setNewEntity({
      ...newEntity,
      billingAddress: addBilling,
    });

    fileInputRef2.current = [...fileInputRef2.current,null];
    fileInputRef.current = [...fileInputRef.current,null];
  };

  const handleRemove = (index) => {
    const currentBillingAddress = [...newEntity.billingAddress];
    currentBillingAddress.splice(index, 1);
    fileInputRef.current = fileInputRef.current.filter((item,i)=>i!==index);
    fileInputRef2.current = fileInputRef2.current.filter((item,i)=>i!==index);
    setPanFile(panFile.filter((item,i)=>i!==index));
    setGstFile(gstFile.filter((item,i)=>i!==index));
    setNewEntity({ ...newEntity, billingAddress: currentBillingAddress });
  };
  const handleCheckboxChange = (index) => {
    setNewEntity((prevEntity) => {
      const updatedBillingAddress = [...prevEntity.billingAddress];
      const updatedAddress = { ...updatedBillingAddress[index] };
      updatedAddress.isDefault = !updatedAddress.isDefault;
      updatedBillingAddress[index] = updatedAddress;
      prevEntity.billingAddress[index]["orgId"] =
        localStorage.getItem("entityId");
      return {
        ...prevEntity,
        billingAddress: updatedBillingAddress,
      };
    });

    setNewEntity((prevEntity) => {
      // Assuming 'index' is the index of the billing address you want to set as default
      const updatedBillingAddress = prevEntity.billingAddress.map((address, i) => {
        return {
          ...address,
          isDefault: i === index,  // Set true only for the address at the specified index, false for others
        };
      });

      // Return the updated entity with the modified billingAddress array
      return {
        ...prevEntity,
        billingAddress: updatedBillingAddress,
      };
    });
  };

  const handleBillingAddress = (e, index) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    const { name,value } = e.target;
    
    if(value==='') return;
    if (name === "panFile") {
      setPanFile(prevFiles => {
        if (index > panFile.length) {
          const newArray = Array.from({ length: index + 1 }, (_, idx) => {
            return idx < prevFiles.length ? prevFiles[idx] : "";
          });
          newArray[index] = e.target.files[0];
          return newArray;
        }
        else if (index === panFile.length) {
          return [...prevFiles, e.target.files[0]];
        }
        else {
          return prevFiles.map((file, idx) =>
            idx === index ? e.target.files[0] : file
          );
        }
      });
    }
    if (name === "gstFile") {
      setGstFile(prevFiles => {
        if (index > gstFile.length) {
          const newArray = Array.from({ length: index + 1 }, (_, idx) => {
            return idx < prevFiles.length ? prevFiles[idx] : "";
          });
          newArray[index] = e.target.files[0];
          return newArray;
        }

        else if (index === gstFile.length) {

          return [...prevFiles, e.target.files[0]];
        }

        else {
          return prevFiles.map((file, idx) =>
            idx === index ? e.target.files[0] : file
          );
        }
      });
    }
    setNewEntity((prevEntity) => {
      const file = e.target.files ? e.target.files[0] : null;

      // Handle file upload if it's a file input
      if (file && (name === "panFile" || name === "gstFile")) {
        if (file.size > maxSize) {
          WarningToast("File size exceeds the limit of 5 MB.");
          return prevEntity; // Return previous state without updates
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const mediaKey = name === "panFile" ? "panMedia" : "gstinMedia";
          prevEntity.billingAddress[index][mediaKey] =
            reader.result.split(",")[1];
          prevEntity.billingAddress[index][name] = e.target.value;
          return ({ ...prevEntity });
        };
      }

      // Update other fields
      prevEntity.billingAddress[index][name] = e.target.value;
      prevEntity.billingAddress[index]["orgId"] =
        localStorage.getItem("entityId");

      return { ...prevEntity };
    });
  };

  const handleClick = (e,index) => {
    fileInputRef.current[index].click();
  };
  const handleClick2 = (e,index) => {
    fileInputRef2.current[index].click();
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("organizationDTO"))?.billingAddress) {
      setNewEntity(JSON.parse(localStorage.getItem("organizationDTO")));
    } else {
      setNewEntity({
        ...newEntity,
        billingAddress: [
          {
            addressLine1: "",
            addressLine2: "",
            stateId: newEntity?.hqstate,
            id: null,
            orgId: "",
            pincode: newEntity?.pincode,
            name: newEntity?.businessName,
            cinNumber: "",
            panNumber: "",
            gstinNumber: "",
            gstState: newEntity?.hqstate,
            panMedia: "",
            gstinMedia: "",
            isDefault: true,
          },
        ],
      });
    }
  }, []);

  return (
    <>
      <div className="rgs-wrap">
        <h2>Corporate Registration</h2>
        <div className="steps-right">
          Steps <span>2</span> - 3
        </div>
      </div>
      <section className="signup-steps-wr">
        <ul className="progress-bar">
          <li className="ent-step-1 ent-success">
            <EvuemeImageTag
              className={"whiteColorFilter"}
              imgSrc={icon.accountIcon}
              altText={"Entity signup step 1"}
            />
          </li>
          <li className="ent-step-2 primaryColorHex">
            <EvuemeImageTag
              className={"whiteColorFilter"}
              imgSrc={icon.idCardIcon}
              altText={"Entity signup step 2"}
            />
          </li>
          <li className="ent-step-3">
            <EvuemeImageTag
              imgSrc={icon.penToolIcon}
              altText={"Entity signup step 3"}
            />
          </li>
        </ul>
      </section>
      {newEntity?.billingAddress?.map((val, index) => {
        return (
          <BillingAddress
            handleBillingAddress={handleBillingAddress}
            handleCheckboxChange={() => handleCheckboxChange(index)}
            index={index}
            key={index}
            newEntity={newEntity}
            val={val}
            fileInputRef2={fileInputRef2}
            states={states}
            handleClick2={handleClick2}
            getFileNameFromPath={getFileNameFromPath}
            fileInputRef={fileInputRef}
            handleClick={handleClick}
            handleRemove={handleRemove}
            panFile={panFile[index]}
            gstFile={gstFile[index]}
            onReset={handleRemoveFile}
            error={error}
          />
        );
      })}
      <div className="col xl12 l12 m12 s12 center-align center-button">
        <NormalButton
          buttonTagCssClasses={"btn btn-clear btn-submit"}
          buttonText={"+ Add Billing Address"}
          onClick={handleAdd}
        />
        &nbsp;
      </div>
      &nbsp;
      <div className="col xl12 l12 m12 s12 center-align center-button">
        <BackButton
          buttonTagCssClasses={"btn-submit"}
          buttonText={"Back"}
          to={"/entity-signup/step-1"}
        />
        <NextButton
          buttonTagCssClasses={"btn-submit"}
          buttonText={"Next"}
          onClick={handleOnClickNextButton}
        />
      </div>
    </>
  );
};

export default EntitySignupStep2;
