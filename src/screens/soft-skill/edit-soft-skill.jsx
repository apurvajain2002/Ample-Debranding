import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  editSoftSkill as editSoftSkills,
  getSoftSkillInfo,
} from "../../redux/actions/soft-skill-actions/soft-skill-actions";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../redux/slices/soft-skill-slice";

const EditSoftSkill = () => {
  const { softSkillId } = useParams();
  const { state } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successMessage } = useSelector(
    (state) => state.softSkillSliceReducer
  );
  const [editSoftSkill, setEditSoftSkill] = useState({
    newSoftSkillName: "",
    newSoftSkillDescription: "",
  });

  // Handle onChange
  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setEditSoftSkill((prevData) => ({
      ...prevData,
      [e.target.name]: inputValue,
    }));
  };

  // Handle Edit SoftSkill
  const handleEditSoftSkill = async () => {
    dispatch(
      editSoftSkills({
        softSkillId,
        newSoftSkillName: editSoftSkill.newSoftSkillName,
        newSoftSkillDescription: editSoftSkill.newSoftSkillDescription,
      })
    );
  };

  // Handle cancel edit button
  const handleOnCancelButton = () => {
    setEditSoftSkill(() => ({
      newSoftSkillName: "",
      newSoftSkillDescription: "",
    }));
    return navigate("/admin/soft-skill");
  };

  const handleGetSoftSkillInfo = () => {
    dispatch(getSoftSkillInfo({ softSkillId }));
  };

  //  Will run when we softSkillId changes
  useEffect(() => {
    setEditSoftSkill((prevState) => ({
      ...prevState,
      newSoftSkillName: state?.name || "",
      newSoftSkillDescription: state?.description || "",
    }));
    if (!softSkillId || softSkillId === "") {
      navigate("/admin/soft-skill");
    } else {
      handleGetSoftSkillInfo();
    }
  }, [softSkillId]);

  // Will run whenever we have a process successful
  useEffect(() => {
    if (successMessage) {
      setEditSoftSkill(() => ({
        newSoftSkillName: "",
        newSoftSkillDescription: "",
      }));
      dispatch(setSearchValue(""));
      navigate("/admin/soft-skill");
    }
  }, [successMessage]);

  return (
    <>
      <h3>Edit Soft Skills</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col xl12 l12 m12 s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m6 s12"
            type="text"
            inputTagIdAndName={"newSoftSkillName"}
            placeholder={"New SoftSkill name"}
            value={editSoftSkill.newSoftSkillName}
            onChange={(e) => handleOnChange(e)}
            labelText={"SoftSkill Name"}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl6 l6 m12 s12"
            type="text"
            inputTagIdAndName={"newSoftSkillDescription"}
            placeholder={"New SoftSkill Description"}
            value={editSoftSkill.newSoftSkillDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"SoftSkill Description"}
          />
          <div className="col xl3 l3 m12 s12 large-screen-start-small-screen-center ">
            <NormalButton
              buttonTagCssClasses={"btn-clear margin-right-5"}
              buttonText={"Update"}
              onClick={handleEditSoftSkill}
            />
            <NormalButton
              buttonTagCssClasses={"btn-submit btn-clear "}
              buttonText={"Cancel"}
              onClick={handleOnCancelButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSoftSkill;
