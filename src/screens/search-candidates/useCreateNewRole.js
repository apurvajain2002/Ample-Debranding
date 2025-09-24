import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEntities, saveJobPosition, parseExcel } from "../../redux/actions/create-job-actions";
import { optionMapper } from "../../utils/optionMapper";
import WarningToast from "../../components/toasts/warning-toast";

const initialState = {
    domainSkill: '',
    softSkill: '',
    interviewRound: '',
};
const INITIAL_ERROR_STATE = {
    domainSkill: '',
    softSkill: '',
    interviewRound: '',
};

export const useCreateNewRole = () => {


    const { cities } = useSelector((state) => state.manageLocationsSliceReducer);
    const { userId } = useSelector((state) => state.signinSliceReducer);
    const [userRolesForm, setUserRolesForm] = useState(initialState);
    const { currentEntity } = useSelector((state) => state.entitySliceReducer);
    const entityId = currentEntity ? currentEntity.id : "";
    const [error, setError] = useState(INITIAL_ERROR_STATE);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllEntities());
    }, []);

    const handleReset = () => {
        setUserRolesForm(initialState);
    };

    const handleOnChange = (e) => {
        setUserRolesForm({ ...userRolesForm, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setError(INITIAL_ERROR_STATE);
        if (
            !userRolesForm.domainSkill ||
            !userRolesForm.softSkill ||
            !userRolesForm.interviewRound
        ) {
            let update = {};
            if (!userRolesForm.domainSkill) update["domainSkill"] = true;
            if (!userRolesForm.softSkill) update["softSkill"] = true;
            if (!userRolesForm.interviewRound) update["interviewRound"] = true;
            setError((prev) => ({ ...prev, ...update }));
            return WarningToast("Please fill required fields");
        }

        if (Object.values(userRolesForm).some((val) => !val || val[0] === "")) {
            return WarningToast("Please enter the required fields!");
        }

        /* dispatch(
            saveJobPosition({
                domainSkill: userRolesForm.domainSkill.trim(),
                softSkill: userRolesForm.softSkill.trim(),
                interviewRound: userRolesForm.interviewRound.trim(),
            })
        ); */

        handleReset();
    };

    const userDetailsForm = [
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.domainSkill,
            placeholder: "Domain Skill",
            type: "select",
            inputTagIdAndName: "domainSkill",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Domain Skill",
            missing: error.domainSkill,
            options: optionMapper(cities.slice(0, 200), "optionKey", "optionValue", "Select Role")
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.softSkill,
            placeholder: "Soft Skill",
            type: "select",
            inputTagIdAndName: "softSkill",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Soft Skill",
            missing: error.softSkill,
            options: optionMapper(cities.slice(0, 200), "optionKey", "optionValue", "Select Role")
        },
        {
            divTagCssClasses: "input-field col xl3 l3 m3 s3",
            value: userRolesForm.interviewRound,
            placeholder: "Interview Round",
            type: "select",
            inputTagIdAndName: "interviewRound",
            onChange: (e) => handleOnChange(e),
            required: true,
            labelText: "Interview Round",
            missing: error.interviewRound,
            options: optionMapper(cities.slice(0, 200), "optionKey", "optionValue", "Select Role")
        },
    ];

    return {
        userDetailsForm, handleReset, handleOnChange, handleSave,
        error, userRolesForm, setUserRolesForm, INITIAL_ERROR_STATE, setError, fileInputRef,
        dispatch, entityId, userId, cities, currentEntity,
    }
}