import { useEffect, useMemo, useState } from "react";
import { icon, image } from "./../../../components/assets/assets.jsx";
import { Link, useLocation } from "react-router-dom";
import NormalInputField from "../../../components/input-fields/normal-input-field.jsx";
import NormalButton from "../../../components/buttons/normal-button.jsx";
import { useGlobalContext } from "../../../context/index.jsx";
import DateInputField from "../../../components/input-fields/date-input-field.jsx";
import handleDate from "../../../utils/handleDate.js";
import { dateFormatter } from "../../../utils/dateFormatter.js";
import { saveUserProfile } from "../../../redux/actions/interview-responses-l1-dashboard-actions";
import { useDispatch,useSelector } from "react-redux";

const EditProfile2 = () => {
  const inputFieldCssClasses = "input-field col xl4 l4 m6 s12";
  const {
    rootColor,
    setUserEditProfilePageYN,
    userProfile,
    setUserProfile,
    userPhoto,
    setUserPhoto,
    userCV,
    setUserCV,
  } = useGlobalContext();
  const location = useLocation();
  const userData = location.state || {};
  const [currentCTC, setCurrentCTC] = useState(userData.currentCTC);
  const [fixedCTC, setFixedCTC] = useState(userData.FixedCTC);
  const [variableCTC, setVariableCTC] = useState(userData.variableCTC);
  const [dateOfBirth, setDateOfBirth] = useState(userData.dateOfBirth);
  const [noticePeriod, setNoticePeriod] = useState(userData.noticePeriod);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workStartDate, setWorkStartDate] = useState("");
  const [workEndDate, setWorkEndDate] = useState("");
  const dispatch = useDispatch();
  const { userDetailsInfo } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);
  // Helper function to convert date format from DD/MM/YYYY to YYYY-MM-DD
  const convertDateFormat = (dateString) => {
    if (!dateString) return "";
    // If the date is already in YYYY-MM-DD format, return as is
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      return dateString;
    }
    // If the date is in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (dateString.includes("/")) {
      return dateFormatter(dateString);
    }
    return dateString;
  };
  
  const handleCurrentCTC = (e) => {
    setCurrentCTC(e.target.value);
  };
  const handleFixedCTC = (e) => {
    setFixedCTC(e.target.value);
  };
  const handleVariableCTC = (e) => {
    setVariableCTC(e.target.value);
  };
  const handleDateOfBirth = (e) => {
    setDateOfBirth(e.target.value);
  };
  const handleNoticePeriod = (e) => {
    setNoticePeriod(e.target.value);
  };

  const handlDateInput = (inputId) => {
    const callback = (data) => {
      if (inputId === "startDate") {
        setStartDate(data.date);
      } else if (inputId === "endDate") {
        setEndDate(data.date);
      } else if (inputId === "workStartDate") {
        setWorkStartDate(data.date);
      } else if (inputId === "workEndDate") {
        setWorkEndDate(data.date);
      } else if (inputId === "dateOfBirth") {
        setUserProfile({ ...userProfile, dateOfBirth: data.date });
      }
    };
    handleDate(inputId, callback);
  };

  const handleWorkDateInput = (workIndex, inputId, fieldName) => {
    const callback = (data) => {
      const nextWorkExperience = [...(userProfile.workExperience || [])];
      nextWorkExperience[workIndex] = {
        ...(nextWorkExperience[workIndex] || {}),
        [fieldName]: data.date,
      };
      setUserProfile({ ...userProfile, workExperience: nextWorkExperience });
    };
    handleDate(inputId, callback);
  };

  const handleDateOfBirthInput = () => {
    const callback = (data) => {
      setUserProfile({
        ...userProfile,
        dateOfBirth: data.date,
      });
    };
    handleDate("dateOfBirth", callback);
  };
  const {id, username , totalExperience, higherEducation} = userDetailsInfo;
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('userProfileDTO', JSON.stringify({...userProfile, id, username , totalExperience, higherEducation}));
      formData.append('resumeFile',userCV );
      formData.append('photoFile', userPhoto);
      await dispatch(saveUserProfile(formData)).unwrap();
    } catch (err) {}
  };

  const handleWorkExperienceChange = (index, fieldName) => (e) => {
    const value = e.target.value;
    const nextWorkExperience = [...(userProfile.workExperience || [])];
    nextWorkExperience[index] = {
      ...(nextWorkExperience[index] || {}),
      [fieldName]: value,
    };
    setUserProfile({ ...userProfile, workExperience: nextWorkExperience });
  };

  const handleAddWorkExperience = () => {
    const emptyWorkExperience = {
      workExperienceId: 2,
      userId: userDetailsInfo.id,
      organizationName: "",
      designation: "",
      startDate: "",
      endDate: "",
      workLocation: "",
      description:"",
      currentOrganization: false,
    };
    const current = Array.isArray(userProfile.workExperience)
      ? userProfile.workExperience
      : [];
    setUserProfile({
      ...userProfile,
      workExperience: [...current, emptyWorkExperience],
    });
  };

  const handleRemoveWorkExperience = () => {
    const current = Array.isArray(userProfile.workExperience)
      ? userProfile.workExperience
      : [];

    if (current.length > 1) {
      current.pop();
      setUserProfile({
        ...userProfile,
        workExperience: current,
      });
    }
  };

  const handleProfileDateInput = (fieldName) => {
    const callback = (data) => {
      setUserProfile({ ...userProfile, [fieldName]: data.date });
    };
    handleDate(fieldName, callback);
  };

  // Academics handlers
  const handleAcademicsChange = (index, fieldName) => (e) => {
    const value = e.target.value;
    const nextUserAcademics = [...(userProfile.userAcademics || [])];
    nextUserAcademics[index] = {
      ...(nextUserAcademics[index] || {}),
      [fieldName]: value,
    };
    setUserProfile({ ...userProfile, userAcademics: nextUserAcademics });
  };

  const handleAcademicDateInput = (index, inputId, fieldName) => {
    const callback = (data) => {
      const nextUserAcademics = [...(userProfile.userAcademics || [])];
      nextUserAcademics[index] = {
        ...(nextUserAcademics[index] || {}),
        [fieldName]: data.date,
      };
      setUserProfile({ ...userProfile, userAcademics: nextUserAcademics });
    };
    handleDate(inputId, callback);
  };

  const handleAddAcademic = () => {
    const emptyAcademic = {
      userAcademicId: 10,
      userId: userDetailsInfo.id,
      universityName: "",
      degreeName: "",
      startDate: "",
      endDate: "",
      cgpa: "",
      levelOfEducation: "",
    };
    const current = Array.isArray(userProfile.userAcademics)
      ? userProfile.userAcademics
      : [];
      
    setUserProfile({
      ...userProfile,
      userAcademics: [...current, emptyAcademic],
    });
  };

  const handleRemoveAcademic = () => {
    const current = Array.isArray(userProfile.userAcademics)
      ? [...userProfile.userAcademics]
      : [];
    if (current.length > 1) {
      current.pop();
      setUserProfile({ ...userProfile, userAcademics: current });
    }
  };

  useEffect(() => {
    setUserEditProfilePageYN(true);
    return () => {
      setUserEditProfilePageYN(false);
    };
  }, []);

  const handleUserProfileFormChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const userProfileFormData1 = useMemo(
    () => [
      {
        divTagCssClasses: inputFieldCssClasses,
        inputTagCssClasses: "validate",
        inputTagIdAndName: "currentCTC",
        placeholder: "Current CTC",
        value: userDetailsInfo.currentCTC,
        onChange: (e) => handleUserProfileFormChange(e),
        required: true,
        labelText: "Current CTC",
      },
      {
        divTagCssClasses: inputFieldCssClasses,
        inputTagCssClasses: "validate",
        inputTagIdAndName: "fixedCTC",
        placeholder: "Fixed CTC",
        value: userDetailsInfo.fixedCTC,
        onChange: (e) => handleUserProfileFormChange(e),
        required: true,
        labelText: "Fixed CTC",
      },
      {
        divTagCssClasses: inputFieldCssClasses,
        inputTagCssClasses: "validate",
        inputTagIdAndName: "variableCTC",
        placeholder: "Variable CTC",
        value: userDetailsInfo.variableCTC,
        onChange: (e) => handleUserProfileFormChange(e),
        required: true,
        labelText: "Variable CTC",
      },
      {
        divTagCssClasses: inputFieldCssClasses,
        inputTagCssClasses: "validate",
        inputTagIdAndName: "noticePeriod",
        placeholder: "Notice Period",
        value: userDetailsInfo.noticePeriod,
        onChange: (e) => handleUserProfileFormChange(e),
        required: true,
        labelText: "Notice Period",
      },
      {
        divTagCssClasses: inputFieldCssClasses,
        inputTagCssClasses: "validate",
        inputTagIdAndName: "negotiableNoticePeriod",
        placeholder: "Negotiable Notice Period",
        value: userDetailsInfo.negotiableNoticePeriod,
        onChange: (e) => handleUserProfileFormChange(e),
        required: true,
        labelText: "Negotiable Notice Period",
      },
      
    ],
    [userProfile]
  );

  useEffect(() => {
    console.log(
      "userProfile",
      userProfile,
      "userPhoto",
      userPhoto,
      "userCV",
      userCV,
      'userDetailsInfo',
      userDetailsInfo
    );
   const workExperience =  userProfile.workExperience.map((item)=>{
        item.userId = id;
        return item;
    })
   const userAcademics =  userProfile.userAcademics.map((item)=>{
        item.userId = id;
        return item;
    })

    setUserProfile(prev => ({
      ...prev,
      workExperience,
      userAcademics,
      userSocialProfileDTO: {
        ...prev.userSocialProfileDTO,
        userId: id,
      },
    }));
    
  }, []);

  return (
    <div className="container full-height valign-wrapper row-relative">
      <div className="row">
        <div className="col xl4 l4 m4 s12">
          <header className="logo-bg login-left-header">
            <img src={rootColor.logoUrl} alt="" />
          </header>
          <div className="leftsidebar leftside-cand leftsideedituser-cand">
            <ul className="left-nav">
              <li className="job-position-icon">
                <Link to="/user">
                  <i>
                    <img src={image.dashboard} alt="" />
                  </i>{" "}
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/user/profile">
                  <i>
                    <img src={image.profile} alt="" />
                  </i>{" "}
                  Profile
                </Link>
              </li>
              <li className="job-position-icon">
                <Link to="/user/interviews">
                  <i>
                    <img src={image.interviewer} alt="" />
                  </i>{" "}
                  Interviews
                </Link>
              </li>
              <li className="job-position-icon">
                <Link to="/user/notification">
                  <i>
                    <img src={image.notification} alt="" />
                  </i>{" "}
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
          <figure className="ev-login-carector leftsideedituser-carector">
            <img src={icon.undrawJoinSVG} alt="" />
          </figure>
          <footer className="login-footer candidatelogin-footer">
            <ul className="valign-wrapper">
              <li>Strategic Partner:</li>
              <li>
                <img src={image.brandEvuemeStrategicPartnerLogo} alt="" />
              </li>
            </ul>
          </footer>
        </div>
        <div className="col xl8 l8 m8 s12 ent-rightboxbg">
          <div className="enity-registration-box">
            <h2>Edit User</h2>
            <div className="row">
              <div className="col xl12 l12 m12 s12">
                <h3 className="h3-title">Company Information</h3>
              </div>
              {userProfileFormData1.map((item) => {
                return (
                  <NormalInputField key={item.inputTagIdAndName} {...item} />
                );
              })}
              <DateInputField
                divTagCssClasses= {inputFieldCssClasses}
                inputTagCssClasses="input-white validate datepicker date-ico"
                inputTagIdAndName="dateOfBirth"
                placeholder="Date of Birth"
                value={convertDateFormat(userProfile.dateOfBirth)}
                required={true}
                onClick={() => handlDateInput("dateOfBirth")}
                onChange={(e) =>handleUserProfileFormChange(e)}
                labelText={"Date of Birth"}
              />
            </div>
            <div
              className="row valign-wrapper row-padding "
              style={{ display: "flex", alignItems: "stretch" }}
            >
              <div className="col xl6 l6 m6 s12" style={{ flex: 1 }}>
                <div className="experience-wrapper exminheight">
                  <header className="workex-header experienceh32">
                    <h3>Work Experience</h3>
                    <ul className="plus-minus-wr">
                      <li>
                        <a
                          href="#"
                          id="+"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddWorkExperience();
                          }}
                          style={{ backgroundColor: "#f00" }}
                        >
                          <img src={icon.plusIcon} alt="add" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          id="-"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveWorkExperience();
                          }}
                          style={{ backgroundColor: "#000" }}
                        >
                          <img src={icon.minusLogo} alt="remove" />
                        </a>
                      </li>
                    </ul>
                  </header>
                  {userProfile.workExperience?.map((item, workIndex) => {
                    return (
                      <div className="workex-body">
                        <NormalInputField
                          divTagCssClasses="input-field input-white col xl6 l6 m6 s12"
                          inputTagCssClasses="validate"
                          inputTagIdAndName={`designation_${workIndex}`}
                          placeholder="Current Designation"
                          value={item?.designation}
                          onChange={handleWorkExperienceChange(
                            workIndex,
                            "designation"
                          )}
                          required={true}
                          labelText="Current Designation"
                        />

                        <NormalInputField
                          divTagCssClasses="input-field input-white col xl6 l6 m6 s12"
                          inputTagCssClasses="validate"
                          inputTagIdAndName={`organizationName_${workIndex}`}
                          placeholder="Current Organization"
                          value={item?.organizationName}
                          onChange={handleWorkExperienceChange(
                            workIndex,
                            "organizationName"
                          )}
                          required={true}
                          labelText="Current Organization"
                        />

                        <DateInputField
                          divTagCssClasses="col xl6 l6 m6 s12"
                          inputTagCssClasses="input-white validate datepicker date-ico"
                          inputTagIdAndName={`workStartDate_${workIndex}`}
                          placeholder="Start Date"
                          value={convertDateFormat(item?.startDate)}
                          required={true}
                          onClick={() => handleWorkDateInput(workIndex, `workStartDate_${workIndex}`, "startDate")}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              workIndex,
                              "startDate"
                            )(e)
                          }
                          labelText={"Start Date"}
                        />

                        <DateInputField
                          divTagCssClasses="col xl6 l6 m6 s12"
                          inputTagCssClasses="input-white validate datepicker date-ico"
                          inputTagIdAndName={`workEndDate_${workIndex}`}
                          placeholder="End Date"
                          value={convertDateFormat(item?.endDate)}
                          required={true}
                          onClick={() => handleWorkDateInput(workIndex, `workEndDate_${workIndex}`, "endDate")}
                          onChange={(e) =>
                            handleWorkExperienceChange(workIndex, "endDate")(e)
                          }
                          labelText={"End Date"}
                        />
                        <NormalInputField
                          divTagCssClasses="input-field input-white col xl6 l6 m6 s12"
                          inputTagCssClasses="validate"
                          inputTagIdAndName={`workLocation_${workIndex}`}
                          placeholder="Work Location"
                          value={item?.workLocation}
                          onChange={handleWorkExperienceChange(
                            workIndex,
                            "workLocation"
                          )}
                          required={true}
                          labelText="Work Location"
                        />

                        <div className="col m12">
                          <h3 className="h3-title">Company Information</h3>
                        </div>
                        <div className="input-field input-white col xl2 l2 m2 s2">
                          <input
                            id="first_name"
                            placeholder="1"
                            type="text"
                            className="validate"
                          />
                        </div>
                        <div className="input-field input-white col xl8 l8 m8 s8">
                          <input
                            id="first_name"
                            placeholder="Upto 50 words..."
                            type="text"
                            className="validate"
                          />
                        </div>
                        <div className="input-field col xl2 l2 m2 s2">
                          <button
                            className="btn waves-effect waves-light btn-success btn-width"
                            style={{ width: "60px" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col xl6 l6 m6 s12" style={{ flex: 1 }}>
                <div className="experience-wrapper exminheight">
                  <header className="workex-header experienceh32">
                    <h3>Add Academic information</h3>
                    <ul className="plus-minus-wr">
                      <li>
                        <a
                          href="#"
                          style={{ backgroundColor: "#f00" }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddAcademic();
                          }}
                        >
                          <img src={icon.plusIcon} alt="add" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          style={{ backgroundColor: "#000" }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveAcademic();
                          }}
                        >
                          <img src={icon.minusLogo} alt="remove" />
                        </a>
                      </li>
                    </ul>
                  </header>
                  <div className="workex-body border-bottomdashed">
                    <h3 className="h3-title">Post Graduate</h3>
                    {userProfile.userAcademics?.map((item, acadIndex) => {
                      return (
                        <div className="workex-body">
                          <NormalInputField
                            divTagCssClasses="input-field input-white col xl6 l6 m6 s12"
                            inputTagCssClasses="validate"
                            inputTagIdAndName={`universityName_${acadIndex}`}
                            placeholder="University Name"
                            value={item?.universityName}
                            onChange={handleAcademicsChange(
                              acadIndex,
                              "universityName"
                            )}
                            required={true}
                            labelText="University Name"
                          />

                          <NormalInputField
                            divTagCssClasses="input-field input-white col xl6 l6 m6 s12"
                            inputTagCssClasses="validate"
                            inputTagIdAndName={`degreeName_${acadIndex}`}
                            placeholder="Degree"
                            value={item?.degreeName}
                            onChange={handleAcademicsChange(
                              acadIndex,
                              "degreeName"
                            )}
                            required={true}
                            labelText="Degree"
                          />

                          <DateInputField
                            divTagCssClasses="col xl6 l6 m6 s12"
                            inputTagCssClasses="input-white validate datepicker date-ico"
                            inputTagIdAndName={`acadStartDate_${acadIndex}`}
                            placeholder="Start Date"
                            value={convertDateFormat(item?.startDate)}
                            required={true}
                            onClick={() => handleAcademicDateInput(acadIndex, `acadStartDate_${acadIndex}`, "startDate")}
                            onChange={(e) =>
                              handleAcademicsChange(acadIndex, "startDate")(e)
                            }
                            labelText={"Start Date"}
                          />
                          <DateInputField
                            divTagCssClasses="col xl6 l6 m6 s12"
                            inputTagCssClasses="input-white validate datepicker date-ico"
                            inputTagIdAndName={`acadEndDate_${acadIndex}`}
                            placeholder="End Date"
                            value={convertDateFormat(item?.endDate)}
                            required={true}
                            onClick={() => handleAcademicDateInput(acadIndex, `acadEndDate_${acadIndex}`, "endDate")}
                            onChange={(e) =>
                              handleAcademicsChange(acadIndex, "endDate")(e)
                            }
                            labelText={"End Date"}
                          />
                          <NormalInputField
                            divTagCssClasses="input-field input-white col xl6 l6 m6 s12"
                            inputTagCssClasses="validate"
                            inputTagIdAndName={`cgpa_${acadIndex}`}
                            placeholder="Enter CGPA, Grade or % score"
                            value={item?.cgpa}
                            onChange={handleAcademicsChange(acadIndex, "cgpa")}
                            required={true}
                            labelText="Score"
                          />
                        </div>
                      );
                    })}
                    <div className="row" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col xl12 l12 m12 s12 center-align">
            <NormalButton
              buttonTagCssClasses="btn btn-clear btn-submit"
              buttonText="Save"
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfile2;
