import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useDispatch, useSelector } from "react-redux";
import { createSoftSkill } from "../../redux/actions/soft-skill-actions/soft-skill-actions";
import { setSearchValue } from "../../redux/slices/soft-skill-slice";
import WarningToast from "../../components/toasts/warning-toast";

const intialSoftSkillObject = {
  softSkillName: "",
  softSkillDescription: "",
};

const CreateSoftSkill = ({ handleGetAllSoftSkills }) => {
  const [newSoftSkill, setNewSoftSkill] = useState(intialSoftSkillObject);

  const dispatch = useDispatch();
  const { successMessage } = useSelector(
    (state) => state.softSkillSliceReducer
  );

  const handleOnChange = (e) => {
    const inputValue = e.target.value;

    setNewSoftSkill((prevData) => ({
      ...prevData,
      [e.target.name]: inputValue,
    }));
  };

  // Handle create softSkill function
  const handleCreateSoftSkill = () => {
    if (!newSoftSkill.softSkillName || newSoftSkill.softSkillName === "") {
      return WarningToast("Please enter the required fields!");
    }
    dispatch(
      createSoftSkill({
        softSkillName: newSoftSkill.softSkillName,
        softSkillDescription: newSoftSkill.softSkillDescription,
      })
    );
    dispatch(setSearchValue(""));
  };

  useEffect(() => {
    if (successMessage) {
      setNewSoftSkill(() => ({
        softSkillName: "",
        softSkillDescription: "",
      }));
    }
  }, [successMessage]);

  return (
    <>
      <h3>Create SoftSkill</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m3 s12"
            inputTagCssClasses="validate"
            type="text"
            inputTagIdAndName={"softSkillName"}
            placeholder={"Soft Skill Name"}
            value={newSoftSkill.softSkillName}
            onChange={(e) => handleOnChange(e)}
            labelText={"Soft Skill Name"}
            required={true}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl7 l7 m7 s12"
            type="text"
            inputTagIdAndName={"softSkillDescription"}
            placeholder={"Soft Skill Description"}
            value={newSoftSkill.softSkillDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"Soft Skill Description"}
          />
          <div className="col xl2 l2 m8 s12 large-screen-start-small-screen-center">
            <NormalButton
              buttonTagCssClasses={"btn-submit btn-clear "}
              buttonText={"Create"}
              onClick={handleCreateSoftSkill}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSoftSkill;
