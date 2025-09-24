import { useEffect, useState } from "react";
import "./ui-reference-style.css";
import DateInputField from "../components/input-fields/date-input-field";
import SelectInputField from "../components/input-fields/select-input-field";
import NormalInputField from "../components/input-fields/normal-input-field";
import { icon } from "../components/assets/assets";
import RadioButtonInputField from "../components/input-fields/radio-button-input-field";
import CheckboxInputField from "../components/input-fields/checkbox-input-field";
import NormalButton from "../components/buttons/normal-button";
import TextEditor from "../components/input-fields/RichTextEditor/TextEditor";
import UseOfTableComp from "./use-of-table-comp";
import EvuemeModal from "../components/modals/evueme-modal";
import EvuemeModalTrigger from "../components/modals/evueme-modal-trigger";
import ViewCode from "../components/miscellaneous/view-code";
import NewTypeaheadInputField from "../components/input-fields/NewTypeaheadInputField";
import TempComp from "./TempComponent";
import MobileNumberInputField from "../components/input-fields/mobile-number-input-field";
import MobileNumberInputField2 from "../components/input-fields/mobile-number-input-field2";

export const cities = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Lucknow",
  "Jaipur",
  "Kanpur",
  "Mirzapur",
  "Nagpur",
  "Ghaziabad",
  "Supaul",
  "Vadodara",
  "Rajkot",
  "Vishakhapatnam",
  "Indore",
  "Thane",
  "Bhopal",
  "Pimpri-Chinchwad",
  "Patna",
  "Bilaspur",
  "Ludhiana",
  "Āgra",
  "Madurai",
  "Jamshedpur",
  "Prayagraj",
  "Nasik",
  "Faridabad",
  "Meerut",
  "Jabalpur",
  "Kalyan",
  "Vasai-Virar",
  "Najafgarh",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Aligarh",
  "Guwahati",
  "Haora",
  "Ranchi",
  "Gwalior",
  "Chandigarh",
  "Haldwani",
  "Vijayavada",
  "Jodhpur",
  "Raipur",
  "Kota",
  "Bhayandar",
  "Loni",
  "Ambattur",
  "Salt Lake City",
  "Bhatpara",
  "Kukatpalli",
  "Dasarhalli",
  "Muzaffarpur",
  "Oulgaret",
  "New Delhi",
  "Tiruvottiyur",
  "Puducherry",
  "Byatarayanpur",
  "Pallavaram",
  "Secunderabad",
  "Shimla",
  "Puri",
  "Murtazabad",
  "Shrirampur",
  "Chandannagar",
  "Sultanpur Mazra",
  "Krishnanagar",
  "Barakpur",
  "Bhalswa Jahangirpur",
  "Nangloi Jat",
  "Balasore",
  "Dalupura",
  "Yelahanka",
  "Titagarh",
  "Dam Dam",
  "Bansbaria",
  "Madhavaram",
  "Abbigeri",
  "Baj Baj",
  "Garhi",
  "Mirpeta",
  "Nerkunram",
  "Kendraparha",
  "Sijua",
  "Manali",
  "Kankuria",
  "Chakapara",
  "Pappakurichchi",
  "Herohalli",
  "Madipakkam",
  "Sabalpur",
  "Bauria",
  "Salua",
  "Chik Banavar",
  "Jalhalli",
  "Chinnasekkadu",
  "Jethuli",
  "Nagtala",
  "Pakri",
  "Hunasamaranhalli",
  "Hesarghatta",
  "Bommayapalaiyam",
  "Gundur",
  "Punadih",
  "Hariladih",
  "Alawalpur",
  "Madnaikanhalli",
  "Bagalur",
  "Kadiganahalli",
  "Khanpur Zabti",
  "Mahuli",
  "Zeyadah Kot",
  "Arshakunti",
  "Mirchi",
  "Sonudih",
  "Bayandhalli",
  "Sondekoppa",
  "Babura",
  "Madavar",
  "Kadabgeri",
  "Nanmangalam",
  "Taliganja",
  "Tarchha",
  "Belgharia",
  "Kammanhalli",
  "Ambapuram",
  "Sonnappanhalli",
  "Kedihati",
  "Doddajivanhalli",
  "Simli Murarpur",
  "Sonawan",
  "Devanandapur",
  "Tribeni",
  "Huttanhalli",
  "Nathupur",
  "Bali",
  "Vajarhalli",
  "Alija Kotla",
  "Saino",
  "Shekhpura",
  "Cachohalli",
  "Andheri",
  "Narayanpur Kola",
  "Gyan Chak",
  "Kasgatpur",
  "Kitanelli",
  "Harchandi",
  "Santoshpur",
  "Bendravadi",
  "Kodagihalli",
  "Harna Buzurg",
  "Mailanhalli",
  "Sultanpur",
  "Adakimaranhalli",
];

const UiReference = () => {
  const [normalInputFieldVal, setNormalInputFieldVal] = useState("");
  const [selectInputFieldVal, setSelectInputFieldVal] = useState("");
  const [dateInputFieldVal, setDateInputFieldVal] = useState("");
  // const [textareaFieldVal, setTextareaFieldVal] = useState("");
  const [radioButtonVal, setRadioButtonVal] = useState("radioButton1");
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [mobileNumberVal, setMobileNumberVal] = useState("");

  return (
    <>
      <nav className="ui-ref-nav">
        <div className="logo">
          <a href="#pageStart">
            <h4>UI_Reference Page</h4>
          </a>
        </div>
        <div className="navMenu">
          <a className="dropdown-trigger btn" href="#!" data-target="dropdown1">
            Menu
          </a>

          <ul id="dropdown1" className="dropdown-content">
            <li>
              <a href="#customTags">CustomTags</a>
            </li>
            <li>
              <a href="#inputFieldComponents">InputFields</a>
            </li>
            <li className="divider" tabIndex="-1"></li>
            <li>
              <a href="#buttonComponents">ButtonComponents</a>
            </li>
            <li>
              <a href="#tableComponent">Table Component</a>
            </li>
            <li>
              <a href="#modalComponents">Modal Components</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="pageStart" className="ui-ref-page">
        <div className="ui-ref-header">
          <p>
            Here you can see how to use different components like Input fields,
            Button and etc. and how you can modify them accordingly. This is
            done so that there will be consistency regarding these components
            all across the application.
          </p>
        </div>

        {/* Evueme Custom HTML Tags or Wrapper Tags */}
        <section id="customTags" className="uiReferenceSection">
          <h2>Custom Tags</h2>

          {/* Custom Input Tag */}
          <div>
            <h4>1. EvuemeInputTag</h4>
            <div>
              <p>
                This is code for the component which defines our custom input
                tag which is indirectly being used by input fields in the
                project. This is not used directly but used inside in the
                Components like NormalInputField. If we make any changes in our
                this custom input tag component it will get refeclted in our all
                input fields like NormalInputField. It will get its attributes
                from its parent component like NormalInputField.
              </p>
              <ViewCode
                codeString={`export const EvuemeInputTag = ({
                className, // this prop defines input tag css classes
                  type = "text", // this prop defines the the type of input tag
                  id, this prop defines the id for the input tag
                  name, this prop defines the name for the input tag
                  placeholder, //  this prop defines the placeholder for the input tag
                  value, // this prop defines input tag value
                  onChange,  this prop defines onChange handler of input tag
                  required, //  this prop defines required attribute of input tag
                  disabled, //  this prop defines disabled attribute of input tag
                  ...props, // this props will be useful to use any other attributes of input tag in our component if we want to use in the future
                }) => {
                  return (
                    <input
                      className={className}
                      type={type}
                      id={id}
                      name={name}
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      required={required}
                      disabled={disabled}
                      {...props}
                    />
                  );
                };`}
              />
            </div>
          </div>

          {/* Custom Label Tag */}
          <div>
            <h4>2. EvuemeLabelTag</h4>
            <div>
              <p>
                This is code for the component which defines our custom label
                tag used by our input fields in the project. This is not used
                directly but used inside in our Components like
                NormalInputField. If we make any changes in our this custom
                label tag component it will get refeclted in our all input
                fields like NormalInputField. It will get its attributes from
                its parent component like NormalInputField.
              </p>
              <ViewCode
                codeString={`export const EvuemeLabelTag = ({
                  htmlFor, // this defines the htmlFor attribute of label tag
                  labelText, // this defines the text inside label tag
                  required = false, // this defines the required symbol(*) is to be put or not along with label text
                  labelIconSrc, // this defines the icon which is to be put or not along with label text
                }) => {
                  return (
                    EvuemeLabelTag
                      htmlFor={inputFieldId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                
                      onFocus={(e) => {
                        e.target.style.backgroundColor = "yellow";
                      }}
                    >
                      {labelText}
                      {required ? <span className={"required"}>*</span> : <></>}
                      {labelIconSrc ? (
                        <span style={{ marginLeft: "0.2rem" }}>
                          <i>
                            <EvuemeImageTag src={labelIconSrc} alt={labelIconSrc} />
                          </i>
                        </span>
                      ) : (
                        <></>
                      )}
                    </EvuemeLabelTag
                  );
                };`}
              />
            </div>
          </div>

          {/* Custom Select Tag */}
          <div>
            <h4>3. EvuemeSelectTag</h4>
            <div>
              <p>
                This is code for the component which defines our custom Select
                tag used by our input fields in the project. This is not used
                directly but used inside in our Components like
                SelectInputField. If we make any changes in our this custom
                label tag component it will get refeclted in our all input
                fields like SelectInputField. It will get its attributes from
                its parent component like SelectInputField.
              </p>
              <ViewCode
                codeString={`const EvuemeSelectTag = ( {
                id, // this prop defines the id of select tag
                name, // this prop defines the name of select tag
                options, // this prop defines the options of select tag
                value, // this prop will hold the value of select tag
                onChange, // this prop will handle the onChange attribute of the select tag
                multiple, // this prop will handle the multiple attribute of the select tag
                disabled, // this prop will handle the disabled attribute of the select tag
                required, // this prop will handle the require attribute of the select tag
                ...props // this props will be useful to use any other attributes of select tag in our component if we want to use in the future
              }) => {
                return (
                  <select
                    id={id} 
                    name={name}
                    value={value}
                    onChange={onChange}
                    multiple={multiple}
                    disabled={disabled}
                    style={{ backgroundColor: "blue" }}
                    className="custom-select"
                    required={required}
                    {...props}
                  >
                    {options?.map((curOption) => (
                      <option
                        key={curOption.optionValue}
                        value={curOption.optionValue}
                        style={{ color: "red" }}
                      >
                        {curOption.optionKey}
                      </option>
                    ))}
                  </select>
                );
              };
              `}
              />
            </div>
          </div>

          {/* Custom Label Tag */}
          <div>
            <h4>4. EvuemeTextareaTag</h4>
            <div>
              <p>
                This is code for the component which defines our custom Textarea
                tag used by our input fields in the project. This is not used
                directly but used inside in our Components like
                TextareaInputField. If we make any changes in our this custom
                label tag component it will get refeclted in our all input
                fields like TextareaInputField. It will get its attributes from
                its parent component like TextareaInputField.
              </p>
              <ViewCode
                codeString={`const EvuemeTextareaTag = ({ 
                inputFieldId, 
                value, 
                onChange 
              }) => {
                return (
                  <textarea id={inputFieldId} value={value} onChange={onChange}>
                    {" "}
                  </textarea>
                );
              };
              
              export default EvuemeTextareaTag;
              `}
              />
            </div>
          </div>
        </section>

        <hr />

        {/* Custom Input Fields */}
        <section id="inputFieldComponents" className="uiReferenceSection">
          <h2>Input Field Componenets</h2>

          {/* 1. Normal Input Field */}
          <div>
            <h4>1. Normal Input Box</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                input field box
              </p>
              <ViewCode
                codeString={`export const NormalInputField = ({
                  divTagCssClasses = "input-field col xl6 l6 m4 s12", // this prop defines the css classes given to the div which wraps our input tag and label tag for the input field
                  inputTagCssClasses = "validate", // this prop defines the css classes given to the input tag inside div tag
                  type = "text", // this prop defines the type of input tag
                  inputTagIdAndName, // this prop defines the name and id attribute of input tag and htmlFor attribute of label tag for the respected input field
                  placeholder, // this prop defines the placeholder of input field
                  value, // this prop defines the value of input tag
                  onChange, // this prop defines the onChange handler of input tag
                  required = false, // this prop defines if the input field is required or not
                  disabled = false, // this prop defines if the input field is disabled or not
                  leftIconSrc = null, // this helps in placing leftIcon in normal-input-field component,
                  leftIconAltText = "", // this helps in left icon alt text 
                  leftIconCss = null, // this is the css classes for leftIconSrc
                  onClickLeftIcon = () => {}, // this handles onClick event on left icon
                  rightIconSrc = null, // this helps in placing rightIcon in normal-input-field component,
                  rightIconAltText = "", // this helps in right icon alt text 
                  rightIconCss = "", // this is the css classes for leftIconSrc
                  onClickRightIcon = () => {}, // this handles onClick event on left icon
                  labelText, // this prop defines the text inside the label tag
                  labelIconSrc = null, // this prop hold the icon which can be used with the labelText prop inside label tagside input field
                  labelIconAltText = "", // this holds alt text for label icon
                  // labelIconCss = "", // this holds the css for left icon
                  ...props,  // you can send other input tag attributes through this rest operator variable for out input tag only which are not defined above
                }) => {
                  return (
                    <div className={divTagCssClasses}>
                      <EvuemeInputTag
                        className={'validate' "${"inputTagCssClasses"}"}
                        type={type}
                        id={inputTagIdAndName}
                        name={inputTagIdAndName}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        {...props}
                      />
                      {labelText ? (
                        <EvuemeLabelTag
                          htmlFor={inputTagIdAndName}
                          className={"active" "${"labelCss"}"}
                          labelText={labelText}
                          required={required}
                          labelIconSrc={labelIconSrc}
                          labelIconAltText={labelIconAltText}
                          labelIconCss={labelIconCss}
                        />
                      ) : (
                        <></>
                      )}
                      {leftIconSrc ? (
                        <i className={"place-icon-left carretColor-transparent"}>
                          <EvuemeImageTag
                            imgSrc={leftIconSrc}
                            altText={leftIconAltText}
                            className={leftIconCss}
                            onClick={onClickLeftIcon}
                          />
                        </i>
                      ) : (
                        <></>
                      )}
                      {rightIconSrc ? (
                        <i className={"place-icon-right carretColor-transparent"}>
                          <EvuemeImageTag
                            imgSrc={rightIconSrc}
                            altText={rightIconAltText}
                            className={rightIconCss}
                            onClick={onClickRightIcon}
                          />
                        </i>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                };`}
              />
              <div>
                <p className="pExample">Example 1-</p>
                <NormalInputField
                  divTagCssClasses="input-field col xl2 l2 m2 s1"
                  inputTagCssClasses="validate"
                  inputTagIdAndName={"normalInputFieldVal"}
                  value={normalInputFieldVal}
                  onChange={(e) => setNormalInputFieldVal(e.target.value)}
                  labelText={"NormalInputField labelText"}
                  labelIconSrc={icon.pdfFileIcon}
                />
              </div>
              <div>
                <p className="pExample">Example 2-</p>
                <NormalInputField
                  divTagCssClasses="input-field col xl2 l2 m2 s1"
                  inputTagIdAndName={"requiredInputFieldId"}
                  value={normalInputFieldVal}
                  onChange={(e) => setNormalInputFieldVal(e.target.value)}
                  placeholder={"Required input field"}
                  required={true}
                  labelText={"Required NormalInputField label text"}
                />
              </div>
            </div>
          </div>

          {/* 2. Select Input Field  */}
          <div>
            <h4>2. SelectInputField</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                select input field box
              </p>
              <ViewCode
                codeString={`export const SelectInputField = ({
                  divTagCssClasses, // given to the div which wraps our custom select tag and label tag for the custom select tag
                  selectTagIdAndName, // given to the id and name attributes of the select tag and htmlFor attribute of label tag
                  options, // As the props name suggest used to pass options
                  value, // stores value of select tag
                  onChange, //onChange Handler of select tag
                  multiple = false, // If multiple select is possible or not, by default it is set to false, can be over-written when passing as a prop 
                  disabled = false, // If disabled is set to true then the , by default it is set to false, can be over-written when passing as a prop 
                  required = false, // If input field is required or not, by default it is set to false and can be over-written when passing as a prop
                  selectedValues, //It stores the list of selected values from options list
                  labelText, // As the name suggests, text given to the label
                  labelIconSrc=null, // Icon to use with labelText
                  ...props,
                }) => {
                  return (
                    <div className={divTagCssClasses}>
                      <EvuemeSelectTag
                        id={selectTagIdAndName}
                        name={selectTagIdAndName}
                        options={options}
                        value={value}
                        onChange={onChange}
                        multiple={multiple}
                        disabled={disabled}
                        {...props}
                      />
                      <EvuemeLabelTag
                        htmlFor={selectTagIdAndName}
                        labelText={labelText}
                        required={required}
                        labelIconSrc={labelIconSrc},
                      />
                      {selectedValues ? (
                        selectedValues.map((curVal, index) => (
                          <SelectedIcon key={getUniqueId()} textValue={curVal} />
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  );`}
              />
              <div>
                <p className="pExample">Example-</p>
                <SelectInputField
                  divTagCssClasses="input-field col xl6 l6 m4 s13"
                  selectTagIdAndName={"selectInputFieldId"} // this value is given
                  labelText={"SelectInputField labelText"}
                  options={[
                    { optionKey: "Dsiabled Option", optionValue: "" },
                    { optionKey: "Option 1", optionValue: "1" },
                    { optionKey: "Option 2", optionValue: "2" },
                    { optionKey: "Option 3", optionValue: "3" },
                  ]}
                  value={selectInputFieldVal}
                  onChange={(e) => setSelectInputFieldVal(e.target.value)}
                  labelIconSrc={icon}
                  selectedValues={["Option 1", "Option 2"]}
                />
              </div>
            </div>
          </div>

          {/* 3 Date Input field */}
          <div>
            <h4>3. DateInputField</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                date input field box oijo
              </p>
              <ViewCode
                codeString={`export const DateInputField = ({
                  divTagCssClasses, // given to className of the div which wraps our input tag and label tag for the date input field
                  inputTagCssClasses, // given to className of input tag of type date
                  inputTagIdAndName,// given to the id and name attributes of the input tag and htmlFor attribute of label tag
                  value, // value for date input field
                  handleCreateJobPositionFormChange, // onChange handler
                  required={required}, // field required or not
                  labelText, // As the name suggests, text given to the label
                  ...props
                }) => {
                  return (
                    <div className={divTagCssClasses}>
                      <EvuemeInputTag
                        className={inputTagCssClasses}
                        type={'date'}
                        id={inputTagIdAndName}
                        name={inputTagIdAndName}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        {...props}
                      />
                      <EvuemeLabelTag
                        htmlFor={inputTagIdAndName}
                        labelText={labelText}
                        required={required}
                      />
                    </div>
                  );`}
              />
              <div>
                <p className="pExample">Example-</p>
                <p>Show Date here: {dateInputFieldVal}</p>
                <div>
                  <DateInputField
                    divTagCssClasses={"input-field col xl3 l3 m6 s12"}
                    inputTagIdAndName={"dateInputField"}
                    placeholder="Select Date: dd/mm/yy"
                    value={dateInputFieldVal}
                    onChange={(e) => setDateInputFieldVal(e.target.value)}
                    labelText={"Date Input Field Label text"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Mobile Number Input Field */}
          <div>
            <h4>4. Mobile Number Input Field</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                mobile number input field box
              </p>
              <ViewCode codeString={""} />
              <div className="row">
                <p className="pExample">Example 1-</p>
                <MobileNumberInputField
                  divTagCssClasses="col xl3 l5 m5 s12"
                  value={mobileNumberVal}
                  onChange={setMobileNumberVal}
                  labelText={"Enter Your Number"}
                  required={true}
                />
              </div>
            </div>
          </div>

          {/* 4. Mobile Number Input Field */}
          <div>
            <h4>4. Mobile Number Input Field 2</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                mobile number input field box
              </p>
              <ViewCode codeString={""} />
              <div className="row">
                <p className="pExample">Example 1-</p>
                <MobileNumberInputField2
                  divTagCssClasses="col xl3 l5 m5 s12"
                  value={mobileNumberVal}
                  onChange={setMobileNumberVal}
                  labelText={"Enter Your Number"}
                  required={true}
                />
              </div>
            </div>
          </div>
          {/* 4 Custom text area */}
          <div>
            <h4>4. CustomTextArea</h4>
            <div>
              <TextEditor />
            </div>
          </div>

          {/* Radio Btn */}
          <div>
            <h4>5. RadioButtonInputField</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                Radio Button Input Field in our code.
              </p>
              <ViewCode
                codeString={`const RadioButtonInputField = ({
                inputTagCssClasses, // this prop works as className tag for input tag of type radio
                groupName, // it is the name attribute of input tag of type radio button, every group of radio buttons are bound together by a name attribute
                radioButtonValue, // It will store the value of selected radioButton that we can use in our application
                value, // it defines value of the radio button
                onChange, // it handles the onChange and helps to select the one radio button from the group
                to = null, // if selecting the radio button navigates us to some url, it can be passes here
                labelText, // it defines the label text for our input field
                ...props, // if you want to pass any other attribute of input field it can be passed here, we do not need to make any change in the radio-field-component
              }) => {
                
                return (
                  EvuemeLabelTag>
                    <EvuemeInputTag
                      className={inputTagCssClasses}
                      name={groupName}
                      type={"radio"}
                      checked={radioButtonValue === value}
                      value={value}
                      onChange={onChange}
                      {...props}
                    />
                    {to ? (
                      <span>
                        <Link className="label-link" to={to}>
                          {labelText}
                        </Link>
                      </span>
                    ) : (
                      <span>{labelText + " "}</span>
                    )}
                  </EvuemeLabelTag
                );
              };`}
              />
              <div>
                <p className="pExample">Example-</p>

                <p>RadioButton value: {radioButtonVal}</p>
                <RadioButtonInputField
                  groupName={"ExampleRadioButton"}
                  radioButtonValue={radioButtonVal}
                  value={"radioButton1"}
                  labelText={"Radio Button 1"}
                  onChange={(e) => setRadioButtonVal(e.target.value)}
                />

                <RadioButtonInputField
                  groupName={"ExampleRadioButton"}
                  radioButtonValue={radioButtonVal}
                  value={"radioButton2"}
                  labelText={"Radio Button 2"}
                  onChange={(e) => setRadioButtonVal(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Checkbox Input Field */}
          <div>
            <h4>6. CheckboxInputField</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                Checkbox Input Field in our code.
              </p>
              <ViewCode
                codeString={`const CheckboxInputField = ({ 
                inputTagCssClasses = "filled-in", // works as className property of our input field of type checkbox, it has a default className(filled-in) which can be overwritten
                inputTagIdAndName, // id and name attribute of input tag of type checkbox and htmlFot attribute of label tag
                checked, // checks and uncheck our checbox
                onChange, //handles onChange our checkbox
                labelText, // label for the checkbox
                ...props
              }) => {
                return (
                  EvuemeLabelTag htmlFor={inputTagIdAndName}>
                    <EvuemeInputTag
                      className={inputTagCssClasses}
                      id={inputTagIdAndName}
                      name={inputTagIdAndName}
                      type={'checkbox'}
                      checked={checked}
                      onChange={onChange}
                      {...props}
                    />
                    <span style={{color: "black"}}>{labelText}</span>
                  </EvuemeLabelTag  
                );
              };`}
              />
              <div>
                <p className="pExample">Example-</p>

                <p>Checkbox is: {checkboxVal ? "True" : "False"}</p>
                <CheckboxInputField
                  inputTagIdAndName="demoCheckboxInputField"
                  checked={checkboxVal}
                  onChange={(e) => setCheckboxVal(e.target.checked)}
                  labelText={"Setting checkbox value"}
                />
              </div>
            </div>
          </div>

          {/* Searchable drop down */}
          <div>
            <h4>7. Typeahead Input Filed</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                Typeahead Input Field in our code.
              </p>
              <ViewCode codeString={``} />
              <div>
                <p className="pExample">Example-</p>

                <TempComp />
              </div>
            </div>
          </div>
        </section>

        <hr />

        {/* Custom Buttons */}
        <section id="buttonComponents" className="uiReferenceSection">
          <h2>Button Components</h2>

          <div>
            <h4>1. Normal Button</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                Normal Button. we can also put left and right icons in it.
              </p>
              <ViewCode
                codeString={`const NormalButton = ({
                buttonTagCssClasses, // we already designed our button but to change its color or other properties we can pass additional classes
                buttonText, // this is our button text
                onClick = null, // onclick handler of button
                to = "", // if clicking the button redirects us to some page, can be passed here
                leftIconSrc = null, // for left icon of button
                rightIconSrc = null, // for right icon of button
              }) => {
                return (
                  <button
                    className={"waves-effect waves-light btn ${"buttonTagCssClasses"}"}
                    onClick={onClick}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {leftIconSrc ? (
                      <EvuemeImageTag
                        src={leftIconSrc}
                        alt={leftIconSrc}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "red",
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    {buttonText}
                    {rightIconSrc ? <EvuemeImageTag src={rightIconSrc} alt={rightIconSrc} /> : <></>}
                  </button>
                );
              };`}
              />
              <div>
                <p className="pExample">Example 1-</p>
                <div style={{ width: "150px" }}>
                  <NormalButton
                    buttonTagCssClasses="btn-large fullwidth-btn graybtn" // we have passed custom
                    buttonText={"Normal Button"}
                    value={normalInputFieldVal}
                    onClick={() => alert("Normal Button is clicked!")}
                  />
                </div>
              </div>
              <div style={{ width: "240px" }}>
                <p className="pExample">Example 2-</p>
                <NormalButton
                  buttonTagCssClasses="fullwidth-btn" // We hav passes addition custom class fullwidth-btn
                  buttonText={"Button with leftIcon"}
                  value={normalInputFieldVal}
                  onClick={() => alert("Normal Button is clicked!")}
                  leftIconSrc={icon.demoIcon}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Table Component */}
        <section id="tableComponent" className="uiReferenceSection">
          <h2>Table Components</h2>

          <div>
            <h4>1. Table Component</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                Table Component.
              </p>
              <ViewCode codeString={``} />
              <div>
                <p className="pExample">Example-</p>
                <div>
                  <UseOfTableComp />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* View Code Component */}
        <section id="viewCode" className="uiReferenceSection">
          <h2>View Code Snippets</h2>

          <div>
            <h4>1. View Code Component</h4>
            <div>
              <p>
                This is code for the component which defines the structure of
                View Code.
              </p>
              <ViewCode
                codeString={`import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ViewCode = ({ codeString }) => {
  return (
    <SyntaxHighlighter language="javascript" style={dark}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default ViewCode;
`}
              />
              <div>
                <p className="pExample">Example-</p>
                <div>
                  <ViewCode
                    codeString={`
#include<bits/stdcpp.h>using namespace std;int main(){cout<<"Hello World!";}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Components */}
        <section id="modalComponents" className="uiReferenceSection">
          <h2>Custom Modal </h2>

          {/* Custom Input Tag */}
          <div>
            <h4>1. Evueme Modal Components</h4>
            <div>
              <p>
                This is code for the component which defines our custom Modal
                Component which is used to build modals. There are 2 things to
                build a modal. First is the EvuemeModal componet which defines
                our Modal and second is a Modal Trigger. Following below are the
                2 components, EvuemeModalTrigger and EvuemeModal respectively.
              </p>
              <ViewCode
                codeString={`const EvuemeModalTrigger = ({ 
                  children, // We can pass anything as a children for our trigger component. It can be a button, icon etc.
                  aTagCssClasses, // If you want to pass some style to <a></a> Tag 
                  modalId, //Every Modal has modalId and trigger needs to have a ModalId to help it know which modal to trigger
                  ...props, // If you want to pass any other attributes for <a></a> tag can be pass with the help of this
  }) => {
  return (
    <a href={"#{uiPageModal}}
      className={"modal-trigger {aTagCssClasses}"}
        {...props}
        >
        {children}
    </a>
    );
  };`}
              />
              <ViewCode
                codeString={`const EvuemeModal = ({ 
                  children, // We pass our designed modal which gets wrapped around inside our cutom Modal Wrapper
                  modalId, // Pass the id for out Mdoal which help triggers to identify which modal to pop-up
                  divTagClasses // Pass style classes for Modal content
  }) => {
  return (
    <div id={modalId} className="modal">
      <a
        href="#!"
        className="modal-close waves-effect waves-red btn-flat close-ixon"
      ></a>
      <div className={modal-content ${"divTagClasses"}}>{children}</div>
    </div>
  );
};`}
              />
              <div>
                <p className="pExample">
                  Example- Here we defined our Modal trigger which is button and
                  passed down as a children to Trigger component. We also
                  defined our modal component which is haveing a h4 and p tag
                  and these both are passed as a children to Modal compoenent.
                  Now when we click on the button the modal pops up.
                </p>
                <div>
                  <EvuemeModalTrigger modalId={"uiPageModal"}>
                    <NormalButton
                      buttonTagCssClasses={"btn-clear btn-submit"}
                      buttonText={"Trigger Modal"}
                    ></NormalButton>
                  </EvuemeModalTrigger>
                  <EvuemeModal
                    modalId={"uiPageModal"}
                    divTagClasses={"You can pass classes from here"}
                  >
                    <h4>Demo Modal</h4>
                    <p>
                      You can pass any structure for a modal from here as a
                      children
                    </p>
                  </EvuemeModal>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default UiReference;
