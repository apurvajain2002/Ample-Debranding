import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  editRole as editRoles,
  getRoleInfo,
} from "../../redux/actions/role-actions/role-actions";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../redux/slices/role-slice";

const EditRole = () => {
  const { roleId } = useParams();
  const { state } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successMessage } = useSelector((state) => state.roleSliceReducer);
  const [editRole, setEditRole] = useState({
    newRoleName: "",
    newRoleDescription: "",
  });

  // Handle onChange
  const handleOnChange = (e) => {
    const inputValue = e.target.value;

    setEditRole((prevData) => ({ ...prevData, [e.target.name]: inputValue }));
  };

  // Handle Edit Role
  const handleEditRole = async () => {
    dispatch(
      editRoles({
        roleId,
        newRoleName: editRole.newRoleName,
        newRoleDescription: editRole.newRoleDescription,
      })
    );
  };

  // Handle cancel edit button
  const handleOnCancelButton = () => {
    setEditRole(() => ({
      newRoleName: "",
      newRoleDescription: "",
    }));
    return navigate("/admin/role");
  };

  const handleGetRoleInfo = () => {
    dispatch(getRoleInfo({ roleId }));
  };

  useEffect(() => {
    setEditRole((prevState) => ({
      ...prevState,
      newRoleName: state?.name || "",
      newRoleDescription: state?.description || "",
    }));
    if (!roleId || roleId === "") {
      navigate("/admin/role");
    } else {
      handleGetRoleInfo();
    }
  }, [roleId]);

  useEffect(() => {
    if (successMessage) {
      setEditRole(() => ({
        newRoleName: "",
        newRoleDescription: "",
      }));
      dispatch(setSearchValue(""));
      navigate("/admin/role");
    }
  }, [successMessage]);

  return (
    <>
      <h3>Edit Role</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col xl12 l12 m12 s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m6 s12"
            type="text"
            inputTagIdAndName={"newRoleName"}
            placeholder={"New Role name"}
            value={editRole.newRoleName}
            onChange={(e) => handleOnChange(e)}
            labelText={"Role Name"}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl6 l6 m12 s12"
            type="text"
            inputTagIdAndName={"newRoleDescription"}
            placeholder={"New Role Description"}
            value={editRole.newRoleDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"Role Description"}
          />
          <div className="col xl3 l3 m12 s12 large-screen-start-small-screen-center ">
            <NormalButton
              buttonTagCssClasses={"btn-clear margin-right-5"}
              buttonText={"Update"}
              onClick={handleEditRole}
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

export default EditRole;
