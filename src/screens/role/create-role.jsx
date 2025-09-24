import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useDispatch, useSelector } from "react-redux";
import { createRole } from "../../redux/actions/role-actions/role-actions";
import { setSearchValue } from "../../redux/slices/role-slice";
import WarningToast from "../../components/toasts/warning-toast";

const intialRoleObject = {
  roleName: "",
  roleDescription: "",
};

const CreateRole = ({ handleGetAllRoles }) => {
  const [newRole, setNewRole] = useState(intialRoleObject);

  const dispatch = useDispatch();
  const { successMessage } = useSelector((state) => state.roleSliceReducer);

  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setNewRole((prevData) => ({ ...prevData, [e.target.name]: inputValue }));
  };

  // Handle create role function
  const handleCreateRole = () => {
    if (!newRole.roleName || newRole.roleName === "") {
      return WarningToast("Please enter the required fields!");
    }

    dispatch(
      createRole({
        roleName: newRole.roleName,
        roleDescription: newRole.roleDescription,
      })
    );
    dispatch(setSearchValue(""));
  };

  useEffect(() => {
    if (successMessage) {
      setNewRole(() => ({
        roleName: "",
        roleDescription: "",
      }));
    }
  }, [successMessage]);

  return (
    <>
      <h3>Create Role</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m3 s12"
            inputTagCssClasses="validate"
            type="text"
            inputTagIdAndName={"roleName"}
            placeholder={"Role Name"}
            value={newRole.roleName}
            onChange={(e) => handleOnChange(e)}
            labelText={"Role Name"}
            required={true}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl7 l7 m7 s12"
            type="text"
            inputTagIdAndName={"roleDescription"}
            placeholder={"Role Description"}
            value={newRole.roleDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"Role Description"}
          />
          <div className="col xl2 l2 m8 s12 large-screen-start-small-screen-center">
            <NormalButton
              buttonTagCssClasses={"btn-submit btn-clear "}
              buttonText={"Create"}
              onClick={handleCreateRole}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRole;
