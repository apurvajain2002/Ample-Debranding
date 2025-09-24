import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icon } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import DateInputField from "../../components/input-fields/date-input-field";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import { saveJobPosition } from "../../redux/actions/create-job-actions";
import "../../styles/style.css";
import handleDate from "../../utils/handleDate";
import { useNavigate, useLocation } from "react-router-dom";
import { dateFormatterForTimeZone } from "../../utils/dateFormatter";
import { optionMapper, optionMapperFns } from "../../utils/optionMapper";
import WarningToast from "../../components/toasts/warning-toast";
import NewTypeaheadInputField from "../../components/input-fields/NewTypeaheadInputField";
import NewCityTypeaheadInputField from "../../components/input-fields/NewCityTypeaheadInputField";
import { current } from "@reduxjs/toolkit";
import { createUserManagement,getUserManagement } from "../../redux/actions/create-user-management-action";
import { setIsSaveOrUpdateSuccessful } from "../../redux/slices/create-new-user-management-slice";


const getDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const EditJob = () => {
  const { cities } = useSelector((state) => state.manageLocationsSliceReducer);
  const { userId } = useSelector((state) => state.signinSliceReducer);
  const location = useLocation();
  const { currentEntity } = useSelector((state) => state.entitySliceReducer);
  const entityId = currentEntity ? currentEntity.id : "";

  // Get the job data passed during navigation
  const currentUser = location.state?.user;
  
  

  const initialState = {
    ...currentUser,
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    userName: currentUser?.userName || "",
    mobileNumber1: currentUser?.mobileNumber1 || "",
    whatsappNumber: currentUser?.whatsappNumber || "",
    roleId: currentUser?.roleId || "",
  };

  const { isSaveOrUpdateSuccessful } = useSelector((state) => state.createUserManagementSliceReducer);

  const [jobDetails, setJobDetails] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roleList } = useSelector((state) => state.createUserManagementSliceReducer);

  useEffect(() => {
    setJobDetails(initialState);
  }, [currentUser]);

  // useEffect(() => {
  //   if (!currentUser) {
  //     navigate("admin/user-management");
  //   }
  // }, [currentUser, navigate]);

  const handleCancel = () => {
    
    navigate("/admin/user-management");
  };
  

  // Function to clear all fields
  const handleReset = () => {
    setJobDetails({
      firstName: "",
      lastName: "",
      emailId: "",
      mobileNumber: "",
      whatsappNumber: "",
      role: "",
    });
  };

  const handleSave = async () => {
    const requiredFields = {
      firstName: "",
      lastName: "",
      userName: "",
      mobileNumber1: "",
      whatsappNumber: "",
      roleId: "",
    };


    if (
      Object.entries(requiredFields).some(
        ([key]) =>
          !jobDetails[key] ||
          (Array.isArray(jobDetails[key]) && jobDetails[key].length === 0)
      )
    ) {
      return WarningToast("Please enter the required fields!");
    }

    if (+jobDetails.noOfPosition < 0) {
      return WarningToast("Number of positions must be 0 or greater!");
    }
    const data = {
      ...jobDetails,
      id: jobDetails.id,
      firstName: jobDetails.firstName.trim(),
      lastName: jobDetails.lastName.trim(),
      primaryEmailId: jobDetails.userName.trim(),
      mobileNumber1: jobDetails.mobileNumber1.trim(),
      whatsappNumber: jobDetails.whatsappNumber.trim(),
      roleId: jobDetails.roleId,
      orgId: entityId,
      userId: userId,
  }
  
    try {
      await dispatch(createUserManagement(data)).unwrap();
      await dispatch(getUserManagement({
        filterList: [],
        sortList: [],
        pagingNo: 1,
        pageSize: 10,
      })).unwrap();
      handleReset();
      navigate("/admin/user-management");
    } catch (err) {
      // Optionally handle error toast here
    }

  };


  // Removed effect-based refresh; handled inline after save

  const handleOnChange = (e) => {
      setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
  };
  
  return (
    <>
      <div className="row createRole col s12 createRole-top">
        <header className="body-box-top">
          <div className="row">
            <aside className="xl-6 lg-6 md-6 s12">
              <h3>
                <i>
                  <EvuemeImageTag
                    src={icon.brandingLogo}
                    altText={"Brand logo"}
                    style={{ marginRight: "2px" }}
                    alt=""
                  />
                </i>
                Edit User Management
              </h3>
            </aside>
          </div>
        </header>
        <div
          className="col s12 padding-left-right-0 createRole-top "
        >
          <NormalInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s3"}
            inputTagIdAndName={"firstName"}
            value={jobDetails.firstName}
            placeholder={"First Name"}
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"First Name"}
          />
          <NormalInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s3"}
            inputTagIdAndName={"lastName"}
            value={jobDetails.lastName}
            placeholder={"Last Name"}
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"Last Name"}
          />
          <NormalInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s3"}
            inputTagIdAndName={"userName"}
            value={jobDetails.userName}
            placeholder={"Email ID"}
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"Email ID"}
          />
          <NormalInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s3"}
            inputTagIdAndName={"mobileNumber1"}
            value={jobDetails.mobileNumber1}
            placeholder={"Mobile Number"}
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"Mobile Number"}
          />
          <NormalInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s3"}
            inputTagIdAndName={"whatsappNumber"}
            value={jobDetails.whatsappNumber}
            placeholder={"Whatsapp Number"}
            onChange={(e) => handleOnChange(e)}
            required
            labelText={"Whatsapp Number"}
          />
          <SelectInputField
            divTagCssClasses={"input-field col xl3 l3 m3 s3"}
            inputTagIdAndName={"roleId"}
            value={jobDetails.roleId}
            selectedValues={jobDetails.roleId}
            placeholder={"Role"}
            onChange={(e) => handleOnChange(e)}
            required
            options={optionMapper(
              roleList.slice(0, 200),
              "name",
              "id",
              "Select Role"
          )}
            labelText={"Role"}
          />
          <div
            className="input-field col xl3 l3 m6 s12"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              className="waves-effect waves-light btn btn-clear left"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="waves-effect waves-light btn btn-clear btn-submit right"
              onClick={handleSave}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJob;
