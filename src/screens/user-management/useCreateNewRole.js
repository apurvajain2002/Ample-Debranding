import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserManagement,getUserManagement } from "../../redux/actions/create-user-management-action";
import { optionMapper } from "../../utils/optionMapper";
import WarningToast from "../../components/toasts/warning-toast";

const initialState = {
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    whatsappNumber: "",
    role: "",
};
const INITIAL_ERROR_STATE = {
    firstName: false,
    lastName: false,
    emailId: false,
    mobileNumber: false,
    whatsappNumber: false,
    role: false,
};

export const useCreateNewRole = () => {


    const { roleList } = useSelector((state) => state.createUserManagementSliceReducer);
    const { userId } = useSelector((state) => state.signinSliceReducer);
    const [userRolesForm, setUserRolesForm] = useState(initialState);
    const { currentEntity } = useSelector((state) => state.entitySliceReducer);
    const entityId = currentEntity ? currentEntity.id : "";
    const [error, setError] = useState(INITIAL_ERROR_STATE);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(getAllEntities());
    // }, []);

    const handleReset = () => {
        setUserRolesForm(initialState);
    };

    const handleOnChange = (e) => {        
        setUserRolesForm({ ...userRolesForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        
        setError(INITIAL_ERROR_STATE);
        if (
            !userRolesForm.firstName ||
            !userRolesForm.lastName ||
            !userRolesForm.emailId ||
            !userRolesForm.mobileNumber ||
            !userRolesForm.whatsappNumber ||
            !userRolesForm.role
        ) {
            let update = {};
            if (!userRolesForm.firstName) update["firstName"] = true;
            if (!userRolesForm.lastName) update["lastName"] = true;
            if (!userRolesForm.emailId) update["emailId"] = true;
            if (!userRolesForm.mobileNumber) update["mobileNumber"] = true;
            if (!userRolesForm.whatsappNumber) update["whatsappNumber"] = true;
            if (!userRolesForm.role) update["role"] = true;
            setError((prev) => ({ ...prev, ...update }));
            return WarningToast("Please fill required fields");
        }

        if (Object.values(userRolesForm).some((val) => !val || val[0] === "")) {
            return WarningToast("Please enter the required fields!");
        }
        try{
           await dispatch(
                createUserManagement({
                    firstName: userRolesForm.firstName.trim(),
                    lastName: userRolesForm.lastName.trim(),
                    primaryEmailId: userRolesForm.emailId.trim(),
                    mobileNumber1: userRolesForm.mobileNumber.trim(),
                    whatsappNumber: userRolesForm.whatsappNumber.trim(),
                    roleId: userRolesForm.role.trim(),
                    orgId: entityId,
                    userId: userId,
                })
            ).unwrap();
            await dispatch(getUserManagement({
                filterList: [],
                sortList: [],
                pagingNo: 1,
                pageSize: 10,
              })).unwrap();
            handleReset();
        }catch(err){

        }
        
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href =
            "https://evueme-templates.s3.ap-south-1.amazonaws.com/job-position-template.xlsx";
        link.download = "JobTemplate.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleButtonClick = (event) => {
        fileInputRef.current.click();
    };

    // const handleFileChange = async (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         if (
    //             file.type ===
    //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //         ) {
    //             await dispatch(parseExcel(file));
    //             window.location.reload();
    //         } else {
    //             alert("Please select a valid Excel file (XLSX format).");
    //         }
    //     }
    // };

    const userDetailsForm = [
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.firstName,
            placeholder: "First Name",
            type: "text",
            inputTagIdAndName: "firstName",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "First Name",
            missing: error.firstName,
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.lastName,
            placeholder: "Last Name",
            type: "text",
            inputTagIdAndName: "lastName",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Last Name",
            missing: error.lastName,
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.emailId,
            placeholder: "Email ID",
            type: "text",
            inputTagIdAndName: "emailId",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Email ID",
            missing: error.emailId,
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.mobileNumber,
            placeholder: "Mobile Number",
            type: "text",
            inputTagIdAndName: "mobileNumber",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Mobile Number",
            missing: error.mobileNumber,
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.whatsappNumber,
            placeholder: "Whatsapp Number",
            type: "text",
            inputTagIdAndName: "whatsappNumber",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Whatsapp Number",
            missing: error.whatsappNumber,
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.role,
            placeholder: "Role",
            type: "select",
            inputTagIdAndName: "role",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Role",
            missing: error.role,
            options: optionMapper(
                (roleList || []).slice(0, 200),
                "name",
                "id",
                "Select Role"
            )
        },
    ];

    return {
        userDetailsForm, handleReset, handleOnChange, handleSave, handleDownload, handleButtonClick,
        error, userRolesForm, setUserRolesForm, INITIAL_ERROR_STATE, setError, fileInputRef,
        dispatch, entityId, userId, roleList, currentEntity,
    }
}