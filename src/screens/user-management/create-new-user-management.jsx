import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useCreateNewRole } from "./useCreateNewRole";

const CreateNewPosition = () => {

  const {
    userDetailsForm, handleReset, handleOnChange, handleSave, handleDownload, handleButtonClick,
    handleFileChange, userRolesForm, fileInputRef,
  } = useCreateNewRole()

  return (
      <>
        <div className="row createRole">
          <div>
            <header className="body-box-top">
              <div className="row">
                <aside className="xl-6 lg-6 md-6 s12">
                  <h3>
                    <i>
                      <EvuemeImageTag
                          src={icon.brandingLogo}
                          altText={"Brand logo"}
                          style={{
                            marginRight: "2px",
                          }}
                          alt=""
                      />
                    </i>
                    User Management
                  </h3>
                </aside>
                <aside className="xl-6 lg-6 md-6 s12">
                  <ul className="top-btn-wrap right  flex-center">
                    <li>
                      <a onClick={handleButtonClick} className="cursor-pointer">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{
                              display: "none",
                            }}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                        />

                        <p className="flex-center">
                          <EvuemeImageTag
                              className={"upload-csv-icon"}
                              imgSrc={icon.fileUploadIcon}
                              altText={"Upload CSV"}
                          />
                          Upload CSV
                        </p>
                      </a>
                    </li>
                    <span className="create-job-pipe-symbol">|</span>
                    <li>
                      <a href="#" onClick={handleDownload}>
                        <p className="flex-center">Download CSV format</p>
                      </a>
                    </li>
                  </ul>
                </aside>
              </div>
            </header>
            <div className=" col s12 padding-left-right-0 createRole-top">
              {userDetailsForm.map((form, index) => (
                  form.type === "text" ? <NormalInputField
                          key={index}
                          divTagCssClasses={form.divTagCssClasses}
                          value={form.value}
                          placeholder={form.placeholder}
                          type={form.type}
                          inputTagIdAndName={form.inputTagIdAndName}
                          onChange={form.onChange}
                          required={form.required}
                          labelText={form.labelText}
                          missing={form.missing}
                      />
                      :
                      <SelectInputField
                          key={index}
                          divTagCssClasses={form.divTagCssClasses}
                          selectTagIdAndName={form.inputTagIdAndName}
                          options={form.options}
                          selectedValues={userRolesForm[form.inputTagIdAndName]}
                          value={userRolesForm[form.inputTagIdAndName]}
                          required={true}
                          onChange={(e) => handleOnChange(e)}
                          labelText={form.labelText}
                      />
              ))}
              <div className="input-field col xl3 l3 m6 s12" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                <NormalButton
                    buttonTagCssClasses=" btn-clear left"
                    buttonText={"Clear"}
                    onClick={handleReset}
                />
                <NormalButton
                    buttonTagCssClasses=" btn-clear btn-submit right"
                    buttonText={"Submit"}
                    onClick={handleSave}
                />
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default CreateNewPosition;