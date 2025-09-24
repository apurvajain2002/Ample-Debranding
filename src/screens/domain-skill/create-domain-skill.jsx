import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useDispatch, useSelector } from "react-redux";
import { createDomainSkill } from "../../redux/actions/domain-skill-actions/domain-skill-actions";
import { setSearchValue } from "../../redux/slices/domain-skill-slice";
import WarningToast from "../../components/toasts/warning-toast";

const intialDomainSkillObject = {
  domainSkillName: "",
  domainSkillDescription: "",
};

const CreateDomainSkill = ({ handleGetAllDomainSkills }) => {
  const [newDomainSkill, setNewDomainSkill] = useState(intialDomainSkillObject);

  const dispatch = useDispatch();
  const { successMessage } = useSelector(
    (state) => state.domainSkillSliceReducer
  );

  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setNewDomainSkill((prevData) => ({
      ...prevData,
      [e.target.name]: inputValue,
    }));
  };

  // Handle create domainSkill function
  const handleCreateDomainSkill = () => {
    if (
      !newDomainSkill.domainSkillName ||
      newDomainSkill.domainSkillName === ""
    ) {
      return WarningToast("Please enter the required fields!");
    }
    dispatch(
      createDomainSkill({
        domainSkillName: newDomainSkill.domainSkillName,
        domainSkillDescription: newDomainSkill.domainSkillDescription,
      })
    );
    dispatch(setSearchValue(""));
  };

  useEffect(() => {
    if (successMessage) {
      setNewDomainSkill(() => ({
        domainSkillName: "",
        domainSkillDescription: "",
      }));
    }
  }, [successMessage]);

  return (
    <>
      <h3>Create DomainSkill</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m3 s12"
            inputTagCssClasses="validate"
            type="text"
            inputTagIdAndName={"domainSkillName"}
            placeholder={"Domain Skill Name"}
            value={newDomainSkill.domainSkillName}
            onChange={(e) => handleOnChange(e)}
            labelText={"Domain Skill Name"}
            required={true}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl7 l7 m7 s12"
            type="text"
            inputTagIdAndName={"domainSkillDescription"}
            placeholder={"Domain Skill Description"}
            value={newDomainSkill.domainSkillDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"Domain Skill Description"}
          />
          <div className="col xl2 l2 m8 s12 large-screen-start-small-screen-center">
            <NormalButton
              buttonTagCssClasses={"btn-submit btn-clear "}
              buttonText={"Create"}
              onClick={handleCreateDomainSkill}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDomainSkill;
