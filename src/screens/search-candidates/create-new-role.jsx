import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useCreateNewRole } from "./useCreateNewRole";

const CreateNewPosition = () => {

  const {
    userDetailsForm, handleReset, handleOnChange, handleSave,
    userRolesForm,
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
                  Search Candidates
                </h3>
              </aside>
            </div>
          </header>
          <div className=" col s12 padding-left-right-0 createRole-top">
            <SelectInputField
              divTagCssClasses={'input-field col xl3 l3 m3 s3'}
              selectTagIdAndName={'skillJudged'}
              options={[]}
              selectedValues={''}
              value={''}
              required={true}
              onChange={(e) => { }}
              labelText={'Skill Judged'}
            />
            <div className="position-input input-field col xl3 l3 m3 s12 job-position-city-input-wrapper">
              <label htmlFor="city" className="active labelCss">
                Yrs of Experience
              </label>
              <select
                name="positionCity"
                defaultValue={"default"}
                required
                onChange={(e) => { }}
              >
                <option value={"default"} disabled>
                  Min
                </option>
              </select>
              <select
                name="positionCity"
                defaultValue={"default"}
                required
                onChange={(e) => { }}
              >
                <option value={"default"} disabled>
                  Max
                </option>
              </select>
            </div>
            <div className="position-input input-field col xl3 l3 m3 s12 job-position-city-input-wrapper">
              <label htmlFor="city" className="active labelCss">
                CTC (Rs. Lacs)
              </label>
              <select
                name="positionCity"
                defaultValue={"default"}
                required
                onChange={(e) => { }}
              >
                <option value={"default"} disabled>
                  Min
                </option>
              </select>
              <select
                name="positionCity"
                defaultValue={"default"}
                required
                onChange={(e) => { }}
              >
                <option value={"default"} disabled>
                  Max
                </option>
              </select>
            </div>
            <SelectInputField
              divTagCssClasses={'input-field col xl3 l3 m3 s3'}
              selectTagIdAndName={'location'}
              options={[]}
              selectedValues={''}
              value={''}
              required={true}
              onChange={(e) => { }}
              labelText={'Location'}
            />
            <SelectInputField
              divTagCssClasses={'input-field col xl3 l3 m3 s3'}
              selectTagIdAndName={'interviewStatus'}
              options={[]}
              selectedValues={''}
              value={''}
              required={true}
              onChange={(e) => { }}
              labelText={'Interview Status'}
            />
            <SelectInputField
              divTagCssClasses={'input-field col xl3 l3 m3 s3'}
              selectTagIdAndName={'interviewedFor'}
              options={[]}
              selectedValues={''}
              value={''}
              required={true}
              onChange={(e) => { }}
              labelText={'Interviewed for'}
            />
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