import { useState, useEffect } from "react";
import NormalButton from "../../components/buttons/normal-button";
import SelectInputField from "../../components/input-fields/select-input-field";
import { useDispatch } from "react-redux";
import { mapIndex } from "../../redux/actions/invite-candidates";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import WarningToast from "../../components/toasts/warning-toast";

const FormField = ({
  options,
  mappingIndex,
  handleChange,
  elementTagName,
  value,
  fieldName,
  required,
  autoFilled,
  index,
}) => {
  return (
    <div className="row valign-wrapper">
      <aside className="col xl6 l6 m6 s12 mapfield-p">
        <p>
          <span>{required ? "*" : ""}</span> {fieldName}(Col: {index + 1})
        </p>
      </aside>
      <aside className="input-field col xl5 l5 m5 s12">
        <SelectInputField
          name={elementTagName}
          options={options}
          value={value}
          onChange={handleChange}
          firstOptionDisabled={false}
        />
      </aside>

      <aside className="col xl1 l1 m1 s12">
        {(autoFilled || ['0', 0].includes(autoFilled)) && (
          <EvuemeImageTag
            imgSrc={icon.checkMarkicon}
            altText={"Checkmark icon"}
          />
        )}
      </aside>
    </div>
  );
};

const MappingFields = ({
  dataToMap,
  onSave,
  fileInfo,
  onCancel,
  mappingIndex,
  setMappingIndex,
}) => {
  const dispatch = useDispatch();
  const autoMapOptions = [];

  const fieldsArray = [
    // {
    //   name: "index",
    //   required: false,
    //   autoFilled: mappingIndex["index"],
    //   fieldName: "S. No.",
    // },
    {
      name: "firstName",
      required: false,
      autoFilled: mappingIndex["firstName"],
      fieldName: "First Name",
    },
    {
      name: "lastName",
      required: false,
      autoFilled: mappingIndex["lastName"],
      fieldName: "Last Name",
    },
    {
      name: "primaryMailId",
      required: true,
      autoFilled: mappingIndex["primaryMailId"],
      fieldName: "Email 1",
    },
    {
      name: "secondaryMailId",
      required: false,
      autoFilled: mappingIndex["secondaryMailId"],
      fieldName: "Email 2",
    },
    {
      name: "whatsappNumber",
      required: true,
      autoFilled: mappingIndex["whatsappNumber"],
      fieldName: "Whatsapp Number",
    },
    {
      name: "primaryPhoneNumber",
      required: false,
      autoFilled: mappingIndex["primaryPhoneNumber"],
      fieldName: "Mobile 1",
    },
    {
      name: "secondaryPhoneNumber",
      required: false,
      autoFilled: mappingIndex["secondaryPhoneNumber"],
      fieldName: "Mobile 2",
    },
  ];

  const options = [
    {
      optionKey: "Select Column",
      optionValue: "Select Column",
    },
    ...dataToMap?.map((value, index) => ({
      optionKey: value,
      optionValue: index,
    })),
  ];

  const handleSave = () => {
    console.log('mappingIndex :: ', mappingIndex);
    const prevMapped = [];
    /* const isValid = !fieldsArray.some((field) => {
      console.log('field :: ',field);
      console.log('mappingIndex[field.name] :: ',mappingIndex[field.name]);
      if (
        field.required &&
        (!mappingIndex[field.name] || ![0,'0'].includes(mappingIndex[field.name]) ||
          mappingIndex[field.name] === "Select Column")
      ) {
        WarningToast(`${field.name} not selected`);
        return true;
      }
      if (mappingIndex[field.name]) {
        if (prevMapped.includes(mappingIndex[field.name])) {
          return true;
        }
        prevMapped.push(mappingIndex[field.name]);
      }
      return false;
    }); */

    const isValid = !fieldsArray.some((field) => {
      console.log('field :: ', field);
      console.log('mappingIndex[field.name] :: ', mappingIndex[field.name]);

      // Check if the field is required and the value is invalid
      if (
        field.required &&
        (mappingIndex[field.name] === undefined ||
          mappingIndex[field.name] === null ||
          mappingIndex[field.name] === "Select Column" ||
          mappingIndex[field.name] === "")
      ) {
        WarningToast(`${field.fieldName} not selected`);
        return true;
      }

      // Check for duplicate mappings
      if (mappingIndex[field.name] !== undefined && 
          mappingIndex[field.name] !== null && 
          mappingIndex[field.name] !== "Select Column" && 
          mappingIndex[field.name] !== "") {
        if (prevMapped.includes(mappingIndex[field.name])) {
          WarningToast(`Column already selected for another field`);
          return true;
        }
        prevMapped.push(mappingIndex[field.name]);
      }

      return false;
    });

    if (!isValid) return;

    const formData = new FormData();
    const {
      index,
      firstName,
      lastName,
      primaryMailId,
      secondaryMailId,
      whatsappNumber,
      primaryPhoneNumber,
      secondaryPhoneNumber,
    } = mappingIndex;

    const values = [
      (index === "Select Column" || !index) ? -1 : index,
      (firstName === "Select Column" || !firstName) ? -1 : firstName,
      (lastName === "Select Column" || !lastName) ? -1 : lastName,
      (primaryMailId === "Select Column" || !primaryMailId) ? -1 : primaryMailId,
      (secondaryMailId === "Select Column" || !secondaryMailId) ? -1 : secondaryMailId,
      (whatsappNumber === "Select Column" || !whatsappNumber) ? -1 : whatsappNumber,
      (primaryPhoneNumber === "Select Column" || !primaryPhoneNumber) ? -1 : primaryPhoneNumber,
      (secondaryPhoneNumber === "Select Column" || !secondaryPhoneNumber) ? -1 : secondaryPhoneNumber,
    ];

    const valuesString = values.join(",");
    formData.append("file", fileInfo);
    formData.append("columnIndex", valuesString);
    // console.log('columnIndex :: ', valuesString);
    // return;
    dispatch(mapIndex({ formData: formData }));
    onSave(true, valuesString);
  };

  const handleChange = (e) => {
    const currCol = e.target.name;
    const currInd = e.target.value;
    const mappedColumn = Object.entries(mappingIndex).find((key, val) => {
      return key[0] !== currCol && Number(key[1]) === Number(currInd);
    });
    if (mappedColumn && mappedColumn[0] !== currCol) {
      WarningToast(`Value already selected !`);
      setMappingIndex((prev) => ({
        ...mappingIndex,
        [currCol]: prev[currCol],
      }));
      return;
    }
    setMappingIndex((prev) => ({ ...mappingIndex, [currCol]: currInd }));
  };

  /* const getOptionValue = (key, alternateKey) => {
    const foundIndex = options.findIndex((val, index) => {
      if (autoMapOptions.includes(index)) return false;
      return val.optionKey.toLowerCase().includes(alternateKey);
    });

    const op =
      mappingIndex[key] ||
      (foundIndex !== -1 ? options[foundIndex].optionValue : null);

    if (foundIndex !== -1) {
      autoMapOptions.push(foundIndex);
    }
    return Number(op) || null;
  }; */

  const getOptionValue = (key) => {


    const foundIndex = options.findIndex((val) => val.optionKey.toLowerCase() === key.toLowerCase());

    const op = mappingIndex[key] || (foundIndex !== -1 ? options[foundIndex].optionValue : null);

    if (foundIndex !== -1) {
      autoMapOptions.push(foundIndex);
    }
    if (key === 'First Name') {
      console.log(op)
    }
    if ([0, '0'].includes(op)) return 0;
    return Number(op) || null;
  };

  /* useEffect(() => {
    // const index = getOptionValue("index", "S.no");
    const firstName = getOptionValue("firstName", "name");
    const lastName = getOptionValue("lastName", "name");
    const primaryMailId = getOptionValue("primaryMailId", "mail");
    const secondaryMailId = getOptionValue("secondaryMailId", "mail");
    const whatsappNumber =
      getOptionValue("whatsappNumber", "whatsapp") ||
      getOptionValue("phone", "phone") ||
      getOptionValue("mobile", "mobile") ||
      getOptionValue("contact", "contact");
    const primaryPhoneNumber =
      getOptionValue("primaryPhoneNumber", "phone") ||
      getOptionValue("mobile", "mobile") ||
      getOptionValue("contact", "contact");
    const secondaryPhoneNumber =
      getOptionValue("secondaryPhoneNumber", "secondary mobile number") ||
      getOptionValue("secondaryPhoneNumber", "secondary mobile") ||
      getOptionValue("secondaryPhoneNumber", "phone2") ||
      getOptionValue("mobile2", "mobile2") ||
      getOptionValue("contact2", "contact2");

    setMappingIndex({
      ...mappingIndex,
      // index:index,
      firstName: firstName,
      lastName: lastName,
      primaryMailId: primaryMailId,
      secondaryMailId: secondaryMailId,
      whatsappNumber: whatsappNumber,
      primaryPhoneNumber: primaryPhoneNumber,
      secondaryPhoneNumber: secondaryPhoneNumber,
    });
  }, []); */

  useEffect(() => {
    const firstName = getOptionValue("First Name");
    const lastName = getOptionValue("Last Name");
    const primaryMailId = getOptionValue("Primary Email ID");
    const secondaryMailId = getOptionValue("Secondary Email ID");
    const whatsappNumber = getOptionValue("WhatsApp Number");
    const primaryPhoneNumber = getOptionValue("Primary Mobile Number");
    const secondaryPhoneNumber = getOptionValue("Secondary Mobile Number");

    setMappingIndex({
      ...mappingIndex,
      firstName: firstName,
      lastName: lastName,
      primaryMailId: primaryMailId,
      secondaryMailId: secondaryMailId,
      whatsappNumber: whatsappNumber,
      primaryPhoneNumber: primaryPhoneNumber,
      secondaryPhoneNumber: secondaryPhoneNumber,
    });
  }, []);

  return (
    <div className="flex-center margin-top-15">
      <div className="choosefileupload-container">
        <header className="mapfile-header">
          <h3>Map field of uploaded file</h3>
          <p>Uploaded File field</p>
        </header>
        {fieldsArray.map((field, index) => (
          <FormField
            key={index}
            options={options}
            mappingIndex={mappingIndex}
            handleChange={handleChange}
            elementTagName={field.name}
            value={mappingIndex[field.name]}
            required={field.required}
            autoFilled={field.autoFilled}
            fieldName={field.fieldName}
            index={index}
          />
        ))}
        <footer className="upload-footer">
          <NormalButton
            buttonTagCssClasses="btn waves-effect waves-light btn-success"
            buttonText={"Save"}
            onClick={handleSave}
          />
          &nbsp;
          <NormalButton
            buttonTagCssClasses="btn waves-effect waves-light btn-cancel"
            buttonText={"Cancel"}
            onClick={onCancel}
          />
          <p>
            <span>
              <i style={{ paddingRight: "0.5rem" }}>
                <EvuemeImageTag
                  imgSrc={icon.checkMarkicon}
                  altText={"Checkmark icon"}
                />
              </i>
              Denotes auto field mapping
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MappingFields;
