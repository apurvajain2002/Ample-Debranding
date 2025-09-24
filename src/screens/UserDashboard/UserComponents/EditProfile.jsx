import { useEffect, useMemo, useState } from "react";
import { icon, image } from "./../../../components/assets/assets.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NormalInputField from "../../../components/input-fields/normal-input-field.jsx";
import NextButton from "../../../components/buttons/next-button.jsx";
import { useGlobalContext } from "../../../context/index.jsx";
import { useSelector } from "react-redux";
const inputFieldCssClasses = "input-field col xl4 l4 m6 s12";

const EditProfile = () => {
  const { userDetailsInfo } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);
  const { setUserEditProfilePageYN, userProfile, setUserProfile,
    userPhoto,
    setUserPhoto,
    userCV,
    setUserCV, } = useGlobalContext();
  const navigate = useNavigate();

  const { rootColor } = useGlobalContext();
  const [cvError, setCvError] = useState("");
  const [photoError, setPhotoError] = useState("");

  const handleCvChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (!file) {
      setUserCV(null);
      setCvError("");
      return;
    }
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isWithinSize = file.size <= 200 * 1024;
    if (!isPdf) {
      setCvError("Only PDF files are allowed.");
      setUserCV(null);
      return;
    }
    if (!isWithinSize) {
      setCvError("File must be ≤ 200 KB.");
      setUserCV(null);
      return;
    }
    setCvError("");
    setUserCV(file);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (!file) {
      setUserPhoto(null);
      setPhotoError("");
      return;
    }
    const isImage = file.type.startsWith("image/");
    const isWithinSize = file.size <= 200 * 1024;
    if (!isImage) {
      setPhotoError("Only image files are allowed.");
      setUserPhoto(null);
      return;
    }
    if (!isWithinSize) {
      setPhotoError("File must be ≤ 200 KB.");
      setUserPhoto(null);
      return;
    }
    setPhotoError("");
    setUserPhoto(file);
  };

  const handleNextbutton = () => {
    // console.log('userProfile ::::: ', userProfile);
    // return;
    navigate("/user/editWorkExperience");
  };

  useEffect(() => {
    setUserProfile({...userDetailsInfo, workExperience : userProfile.workExperience, 
      userAcademics:userProfile.userAcademics })
      console.log(userProfile);
      
    setUserEditProfilePageYN(true);
    return () => {
      setUserEditProfilePageYN(false);
    };
  }, []);

  

  const handleUserProfileFormChange = (e) => {
    const { name, value } = e.target;
    // console.log('e ::::: ', name, value);
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleUserProfileSocialFormChange = (e) => {
    const { name, value } = e.target;
    // console.log('e ::::: ', e, name, value);
    setUserProfile({ ...userProfile, userSocialProfileDTO: {...userProfile.userSocialProfileDTO, [name]: value } });
  };

  const userProfileFormData1 = useMemo(() => [
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "firstName",
      placeholder: "First Name",
      value: userProfile.firstName,
      onChange: (e) => handleUserProfileFormChange(e),
      required: true,
      labelText: "First Name"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "lastName",
      placeholder: "Last Name",
      value: userProfile.lastName,
      onChange: (e) => handleUserProfileFormChange(e),
      required: true,
      labelText: "Last Name"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "whatsappNumber",
      placeholder: "Whatsapp No",
      type: "tel",
      inputMode: "numeric",
      pattern: "\\d{10}",
      maxLength: 10,
      title: "Enter 10-digit number",
      value: userProfile.whatsappNumber,
      onChange: (e) => handleUserProfileFormChange(e),
      required: true,
      labelText: "Whatsapp No"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "mobileNumber1",
      placeholder: "Mobile Number 1",
      type: "tel",
      inputMode: "numeric",
      pattern: "\\d{10}",
      maxLength: 10,
      title: "Enter 10-digit number",
      value: userProfile.mobileNumber1,
      onChange: (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
        console.log("ee---->",e.target.name);
        
        setUserProfile({ ...userProfile, mobileNumber1: digitsOnly });},
      required: true,
      labelText: "Mobile Number 1"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "mobileNumber2",
      placeholder: "Mobile Number 2",
      type: "tel",
      inputMode: "numeric",
      pattern: "\\d{10}",
      maxLength: 10,
      title: "Enter 10-digit number",
      value: userProfile.mobileNumber2,
      onChange: (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
        setUserProfile({ ...userProfile, mobileNumber2: digitsOnly });
      },
      required: true,
      labelText: "Mobile Number 2"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "currentLocation",
      placeholder: "Current Location",
      value: userProfile.currentLocation,
      onChange: (e) => handleUserProfileFormChange(e),
      required: true,
      labelText: "Current Location"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "primaryEmailId",
      placeholder: "Email ID 1",
      value: userProfile.primaryEmailId,
      onChange: (e) => handleUserProfileFormChange(e),
      required: true,
      labelText: "Email ID 1"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "secondaryEmailId",
      placeholder: "Email ID 2",
      value: userProfile.secondaryEmailId,
      onChange: (e) => handleUserProfileFormChange(e),
      required: true,
      labelText: "Email ID 2"
    }
  ], [userProfile]);

  const userProfileFormData2 = useMemo(() => [
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "linkedInProfile",
      placeholder: "LinkedIn Profile",
      value: userProfile?.userSocialProfileDTO?.linkedInProfile,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "LinkedIn Profile"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "stackOverflowProfile",
      placeholder: "Stack Overflow Profile",
      value: userProfile?.userSocialProfileDTO?.stackOverflowProfile,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "Stack Overflow Profile"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "facebookProfile",
      placeholder: "Facebook Profile",
      value: userProfile?.userSocialProfileDTO?.facebookProfile,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "Facebook Profile"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "twitterProfile",
      placeholder: "Twitter Profile",
      value: userProfile?.userSocialProfileDTO?.twitterProfile,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "Twitter Profile"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "githubUsername",
      placeholder: "Github Username",
      value: userProfile?.userSocialProfileDTO?.githubUsername,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "Github Username"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "personalWebsite",
      placeholder: "Personal Website",
      value: userProfile?.userSocialProfileDTO?.personalWebsite,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "Personal Website"
    },
    {
      divTagCssClasses: inputFieldCssClasses,
      inputTagCssClasses: "validate",
      inputTagIdAndName: "blogUrl",
      placeholder: "Blog Url",
      value: userProfile?.userSocialProfileDTO?.blogUrl,
      onChange: (e) => handleUserProfileSocialFormChange(e),
      required: true,
      labelText: "Blog Url"
    },
  ], [userProfile]);

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
                <img
                  src={image.brandEvuemeStrategicPartnerLogo}
                  alt=""
                />
              </li>
            </ul>
          </footer>
        </div>
        <div className="col xl8 l8 m8 s12 ent-rightboxbg">
          <div className="enity-registration-box">
            <h2>Edit User</h2>
            <div className="row">
              <div className="col xl12 l12 m12 s12">
                <h3 className="h3-title">Profile Information</h3>
              </div>
              {userProfileFormData1.map((item) => (
                <NormalInputField
                  key={item.inputTagIdAndName}
                  {...item}
                />
              ))}
            </div>
            <hr />
            <div className="row valign-wrapper row-padding">
              <div className="col xl12 l12 m12 s12">
                <h3 className="h3-title">Social Media Profile</h3>
              </div>
            </div>
            <div className="row optionBox">
              <div className="addmore-container">
                {userProfileFormData2.map((item) => (
                  <NormalInputField
                    key={item.inputTagIdAndName}
                    {...item}
                  />
                ))}
                <div className="file-field input-field col xl4 l4 m6 s12">
                  <div className="file-path-wrapper">
                    <input type="file" accept="application/pdf" onChange={handleCvChange} />
                    <input
                    id="cv"
                      className={`file-path ${cvError ? 'invalid' : (userCV ? 'valid' : '')}`}
                      type="text"
                      placeholder="Choose File"
                      value={userCV ? userCV.name : ""}
                      readOnly
                    />
                    <label htmlFor="cv">Upload CV </label>
                    <span
                      className="helper-text"
                      data-error={cvError || "Invalid file"}
                      data-success="Looks good"
                    >
                      {cvError ? cvError : "PDF format, Max size 200 Kb"}
                    </span>
                  </div>
                </div>
                <div className="file-field input-field col xl4 l4 m6 s12">
                  <div className="file-path-wrapper">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    <input
                      id="photo"
                      className={`file-path ${photoError ? 'invalid' : (userPhoto ? 'valid' : '')}`}
                      type="text"
                      placeholder="Choose File"
                      value={userPhoto ? (userPhoto.name || "") : ""}
                      readOnly
                    />
                    <label htmlFor="photo">Upload Photo </label>
                    <span
                      className="helper-text"
                      data-error={photoError || "Invalid file"}
                      data-success="Looks good"
                    >
                      {photoError ? photoError : "Image format, Max size 200 Kb"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col xl12 l12 m12 s12 center-align">
                <NextButton
                  buttonTagCssClasses="btn btn-clear btn-submit"
                  buttonText="Next"
                  onClick={handleNextbutton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;