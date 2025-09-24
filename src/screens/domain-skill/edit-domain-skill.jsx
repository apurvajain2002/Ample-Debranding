import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  editDomainSkill as editDomainSkills,
  getDomainSkillInfo,
} from "../../redux/actions/domain-skill-actions/domain-skill-actions";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../redux/slices/domain-skill-slice";

const EditDomainSkill = () => {
  const { domainSkillId } = useParams();
  const { state } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successMessage } = useSelector(
    (state) => state.domainSkillSliceReducer
  );
  const [editDomainSkill, setEditDomainSkill] = useState({
    newDomainSkillName: "",
    newDomainSkillDescription: "",
  });

  // Handle onChange
  const handleOnChange = (e) => {
    const inputValue = e.target.value;

    setEditDomainSkill((prevData) => ({
      ...prevData,
      [e.target.name]: inputValue,
    }));
  };

  // Handle Edit DomainSkill
  const handleEditDomainSkill = async () => {
    dispatch(
      editDomainSkills({
        domainSkillId,
        newDomainSkillName: editDomainSkill.newDomainSkillName,
        newDomainSkillDescription: editDomainSkill.newDomainSkillDescription,
      })
    );
  };

  // Handle cancel edit button
  const handleOnCancelButton = () => {
    setEditDomainSkill(() => ({
      newDomainSkillName: "",
      newDomainSkillDescription: "",
    }));
    return navigate("/admin/domain-skill");
  };

  // Handle if the domainSkill exists in DB
  const handleGetDomainSkillInfo = () => {
    dispatch(getDomainSkillInfo({ domainSkillId }));
  };

  //  Will run when we domainSkillId changes
  useEffect(() => {
    setEditDomainSkill((prevState) => ({
      ...prevState,
      newDomainSkillName: state?.name || "",
      newDomainSkillDescription: state?.description || "",
    }));
    if (!domainSkillId || domainSkillId === "") {
      navigate("/admin/domain-skill");
    } else {
      handleGetDomainSkillInfo();
    }
  }, [domainSkillId]);

  // Will run whenever we have a process successful
  useEffect(() => {
    if (successMessage) {
      setEditDomainSkill(() => ({
        newDomainSkillName: "",
        newDomainSkillDescription: "",
      }));
      dispatch(setSearchValue(""));
      navigate("/admin/domain-skill");
    }
  }, [successMessage]);

  return (
    <>
      <h3>Edit Domain Skills</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col xl12 l12 m12 s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m6 s12"
            type="text"
            inputTagIdAndName={"newDomainSkillName"}
            placeholder={"New DomainSkill name"}
            value={editDomainSkill.newDomainSkillName}
            onChange={(e) => handleOnChange(e)}
            labelText={"DomainSkill Name"}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl6 l6 m12 s12"
            type="text"
            inputTagIdAndName={"newDomainSkillDescription"}
            placeholder={"New DomainSkill Description"}
            value={editDomainSkill.newDomainSkillDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"DomainSkill Description"}
          />
          <div className="col xl3 l3 m12 s12 large-screen-start-small-screen-center ">
            <NormalButton
              buttonTagCssClasses={"btn-clear margin-right-5"}
              buttonText={"Update"}
              onClick={handleEditDomainSkill}
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

export default EditDomainSkill;
