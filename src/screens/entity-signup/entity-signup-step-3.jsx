import { useEffect, useState } from "react";
import { icon } from "../../components/assets/assets";
import NormalInputField from "../../components/input-fields/normal-input-field";
import ColorPickerInputField from "../../components/input-fields/colorpicker-field";
import NextButton from "../../components/buttons/next-button";
import BackButton from "../../components/buttons/back-button";
import Tooltip from "../../components/miscellaneous/tooltip";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import EvuemeInputTag from "../../components/evueme-html-tags/evueme-input-tag";
import TextEditor from "../../components/input-fields/RichTextEditor/TextEditor";
import { useDispatch, useSelector } from "react-redux";
import { getCaptcha, saveEntity } from "../../redux/actions/sign-up-actions";
import CheckboxInputField from "../../components/input-fields/checkbox-input-field";
import { useNavigate } from "react-router-dom";
import WarningToast from "../../components/toasts/warning-toast";
import CustomClockLoader from "../../components/loaders/clock-loader";
import axiosInstance from "../../interceptors";
import { baseUrl } from "../../config/config";
import SuccessToast from "../../components/toasts/success-toast";

import { isValidHexCode, validateCompanyLinkedinUrlInput, isValidLinkedinUrl, isValidURL, isValidYoutubeUrl } from "../../utils/valdationRegex";

const EntitySignupStep3 = ({
  newEntity,
  setNewEntity,
  handleOnChangeEntityData,
}) => {
  const dispatch = useDispatch();
  const { captcha } = useSelector((state) => state.signUpReducer);
  console.log("newEntity--------------->",newEntity);
  
  const [captchaImageDataUrl, setCaptchaImageDataUrl] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [tfStatus, setTfStatus] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [logoFile, setLogoFile] = useState(null); // Store actual file object

  const navigate = useNavigate();

  useEffect(() => {
    // Generate a data URL for the captcha image
    const canvas = document.createElement("canvas");
    canvas.width = 100; // Set the desired width
    canvas.height = 50; // Set the desired height
    const ctx = canvas.getContext("2d");

    // Set background color
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text color and font
    ctx.fillStyle = "white";
    ctx.font = " 18px Valuta";
    // ctx.font = "18px Arial";
    // ctx.font = "italic 18px Arial";

    // ctx.fillText(captcha.captcha, 30, 30); // Adjust text position as needed

    const text = captcha.captcha;
    const textWidth = ctx.measureText(text).width;
    const textHeight = 10; // The font size is 30px

    // Calculate the position to center the text
    const x = (canvas.width - textWidth) / 2;
    const y = (canvas.height + textHeight) / 2; // Position vertically centered

    // Draw the text
    ctx.fillText(text, x, y);

    // Add border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const captchaImageDataUrl = canvas.toDataURL("image/png");
    setCaptchaImageDataUrl(captchaImageDataUrl);
  }, [captcha]);
  const INITIAL_ERROR_STATE = {
    userAnswer: false
  }
  const [error, setError] = useState(INITIAL_ERROR_STATE)
  const [captchaError, setCaptchaError] = useState(false);



  // Handle onclick done
  // const handleOnClickDone = async (e) => {
  //   e.preventDefault();
  //   const { logoMedia } = newEntity;
  //   setError(INITIAL_ERROR_STATE);

  //   if (
  //     !newEntity.userAnswer
  //   ) {
  //     let update = {}
  //     if (!newEntity.userAnswer) update["userAnswer"] = true;
  //     setError(prev => ({ ...prev, ...update }));
  //     return WarningToast("Please Fill required fields");
  //   }

  //   if (userAnswer !== captcha.ans) {
  //     WarningToast("Invalid Captcha");
  //   } else {
  //     const res = await dispatch(
  //       saveEntity({
  //         ...newEntity,
  //         id: localStorage.getItem("entityId"),
  //         tfStatus: tfStatus,
  //         captchaVerified: true,
  //       })
  //     );
  //     if (
  //       res.type === "saveEntity/fulfilled" &&
  //       res?.payload?.message === "Request Processed Successfully"
  //     ) {
  //       // localStorage.removeItem("entityId")
  //       localStorage.clear();
  //       navigate("/entity-signup/success");
  //     }
  //   }
  // };

  const handleOnClickDone = async (e) => {
    e.preventDefault();
    setError(INITIAL_ERROR_STATE);
    setCaptchaError(false); // Reset captcha error state

    // Check if captcha input is empty
    if (!userAnswer) {
      setCaptchaError(true);
      return WarningToast("Captcha is required.");
    }

    // Validate captcha answer
    if (userAnswer !== captcha.ans) {
      setCaptchaError(true);
      return WarningToast("Invalid Captcha");
    }

    try {
      // Create FormData for the API call
      const formData = new FormData();
      const billingAddress = newEntity.billingAddress[0];
      // Add text fields to FormData
      formData.append('organizationId', newEntity.billingAddress[0].orgId || '');
      formData.append('linkedinUrl', newEntity.linkedInURL || '');
      formData.append('youTubeURL', newEntity.youTubeURL || '');
      formData.append('primaryColor', newEntity.primaryColor || '');
      formData.append('secondaryColor', newEntity.secondaryColor || '');
      formData.append('about', newEntity.about || '');
      formData.append('tfaStatus', newEntity.tfStatus || false);
      
      // Add logo file to FormData if it exists
      if (logoFile) {
        formData.append('logoFile', logoFile);
      }

      console.log('Company branding FormData being sent:', formData);

      const response = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/save-company-branding`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 && response.data) {
        SuccessToast("Company branding saved successfully!");
        localStorage.clear();
        navigate("/entity-signup/success");
      } else {
        WarningToast("Failed to save company branding. Please try again.");
      }
    } catch (error) {
      console.error('Error saving company branding:', error);
      WarningToast("Failed to save company branding. Please try again.");
    }
  };



  useEffect(() => {
    dispatch(getCaptcha());
  }, []);

  const handleRichEditor = (e) => {
    setNewEntity({ ...newEntity, about: e.target.value });
  };

  const handleData = (data) => {
    setNewEntity({ ...newEntity, about: data });
  };

  // const handleLogo = (e) => {
  //   if (e.target.name === "logoMedia") {
  //     const reader = new FileReader();
  //     const file = e.target.files[0];

  //     if (file) {
  //       reader.onloadend = () => {
  //         setNewEntity((prevEntity) => {
  //           prevEntity["logoMedia"] = reader.result?.split(",")[1];
  //           return { ...prevEntity };
  //         });
  //       };

  //       reader.readAsDataURL(file);
  //     }
  //   }
  // };

  const handleLogo = (e) => {
    if (e.target.name === "logoMedia") {
      const file = e.target.files[0];

      if (file) {
        const validFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
        if (!validFileTypes.includes(file.type)) {
          WarningToast("Invalid image file. Please upload a PNG, JPEG, JPG, or SVG file.");
          e.target.value = "";
          return;
        }

        if (file.size > 150 * 1024) {
          WarningToast("File size exceeds limit of 150kb");
          e.target.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.src = reader.result;

          img.onload = () => {
            const { width, height } = img;
            console.log("width and height------>",width,height);
            
            if (width != 144 || height != 48) {
              WarningToast("Please upload logo in size Width: 144px and Height: 48px");
              e.target.value = "";
              return;
            }


            setLoading(true);
            // Store the actual file object
            setLogoFile(file);
            setNewEntity((prevEntity) => {
              prevEntity["logoMedia"] = reader.result?.split(",")[1];
              return { ...prevEntity };
            });
            setLoading(false);
          };
        };

        reader.readAsDataURL(file);
      }
    }
  };


  return (
    <>
      <div className="rgs-wrap">
        <h2>New Corporate Registration</h2>
        <div className="steps-right">
          Steps <span>3</span> - 3
        </div>
      </div>
      <section className="signup-steps-wr">
        <ul className="progress-bar">
          <li className="ent-step-1 ent-success">
            <EvuemeImageTag
              className={"whiteColorFilter"}
              imgSrc={icon.accountIcon}
              altText={"Entity signup step 1"}
            />
          </li>
          <li className="ent-step-2 primaryColorHex">
            <EvuemeImageTag
              className={"whiteColorFilter"}
              imgSrc={icon.idCardIcon}
              altText={"Entity signup step 2"}
            />
          </li>
          <li className="ent-step-3 primaryColorHex">
            <EvuemeImageTag
              className={"whiteColorFilter"}
              imgSrc={icon.penToolIcon}
              altText={"Entity signup step 3"}
            />
          </li>
        </ul>
      </section>
      <div className="row">
        <NormalInputField
          divTagCssClasses="input-field col xl4 l4 m6 s12"
          inputTagIdAndName={"linkedInURL"}
          placeholder={"Company Linkedin Page"}
          value={newEntity.linkedInURL}
          onChange={handleOnChangeEntityData}
          labelText={"Company Linkedin Page"}
          // onBlur={() => {
          //   if (!isValidLinkedinUrl(newEntity.linkedInURL)) {
          //     return WarningToast("Invalid Url");
          //   }
          // }}
          onBlur={(e) => validateCompanyLinkedinUrlInput(e, WarningToast)}
        />
        {newEntity.entityType !== "College/University" &&
          newEntity.entityType !== "Campus" && (
            <NormalInputField
              divTagCssClasses="input-field col xl4 l4 m6 s12"
              inputTagIdAndName={"youTubeURL"}
              placeholder={"YouTube Video link for candidates to see"}
              value={newEntity.youTubeURL}
              onChange={handleOnChangeEntityData}
              labelText={"Company YouTube video link"}
              onBlur={() => {
                if (!isValidYoutubeUrl(newEntity.youTubeURL)) {
                  return WarningToast("Invalid Url");
                }
              }}
            />
          )}
      </div>
      <div className="row">
        <div className="file-field input-field col xl4 l4 m6 s12">
          <div
            className="file-path-wrapper uploadlogo"
            style={{
              background: newEntity.logoMedia
                ? `url(${`data:image/png;base64,${newEntity.logoMedia}`}) no-repeat center center`
                : `url(${icon.uploadImageIcon}) no-repeat 97% center`,
            }}
          >
            <EvuemeInputTag
              type="file"
              id="logoMedia"
              name="logoMedia"
              onChange={(e) => handleLogo(e)}
            />
            <EvuemeInputTag
              className="file-path validate"
              type="text"
              placeholder={
                newEntity.logoMedia ? "" : "Upload Company Logo in PNG/SVG format"
              }
            />
            <EvuemeLabelTag
              htmlFor="logoMedia"
              className="active"
              // labelText=""
              labelText={"Upload Logo"}
            // required={true}
            >
              <i className="show-details infermation-ico-black"
                style={{ padding: '0' }}>

                i
                <Tooltip divTagCssClasses={"infbox-click"}>
                  {/* <header>
                      <h3>New Entity Sign up</h3>                      
                    </header> */}
                  <p>
                    1. File size should be less than 150kb
                    <br />
                    2. Logo format should be PNG/SVG/JPEG/JPG
                    <br />
                    3. Logo's Aspect-Ratio should be 3:1
                  </p>
                </Tooltip>
              </i>
            </EvuemeLabelTag>
          </div>
          {/* {loading && <CustomClockLoader />} */}
          {loading && (
            <div style={{
              position: 'absolute', // Adjust as needed
              // left: '50%', // Center horizontally
              // top: '100%', // Position below the logo input
              bottom: '105%',
              left: '94%',
              transform: 'translate(-50%, 0)', // Center it
              zIndex: 100, // Ensure it appears above other content
            }}>
              <CustomClockLoader size={16} />
            </div>
          )}
        </div>
        <ColorPickerInputField
          divTagCssClasses={"input-field col xl4 l4 m6 s12"}
          inputTagIdAndName={"primaryColor"}
          placeholder={"Color Hexcode here"}
          value={newEntity.primaryColor}
          onChange={handleOnChangeEntityData}
          labelText={"Brand Primary Color"}
          onBlur={() => {
            if (!isValidHexCode(newEntity.primaryColor)) {
              return WarningToast("Invalid HexCode");
            }
          }}
        />
        <ColorPickerInputField
          divTagCssClasses={"input-field col xl4 l4 m6 s12"}
          inputTagIdAndName={"secondaryColor"}
          placeholder={"Color Hexcode here"}
          value={newEntity.secondaryColor}
          onChange={handleOnChangeEntityData}
          labelText={"Brand Secondary Color"}
          onBlur={() => {
            if (!isValidHexCode(newEntity.secondaryColor)) {
              return WarningToast("Invalid HexCode");
            }
          }}
        />
      </div>
      <div className="row">
        <div className="col xl12 l12 m12 s12 center-align center-button">
          <TextEditor
            label="About Company"
            value={newEntity.about}
            onChange={(e) => handleRichEditor(e)}
            handleData={handleData}
            style={{
              border: "1px solid #ccc",
              margin: "0 10px",
              width: "100%",
              minHeight: "300px",
            }}
          />
        </div>
      </div>
      <div className="row" style={{ margin: "10px 0px" }}>
        <p>Captcha</p>
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <img
            src={captchaImageDataUrl}
            alt="Captcha"
            style={{ height: "40px", width: "100px" }}
          />
          <NormalInputField
            divTagCssClasses=""
            inputTagIdAndName={"userAnswer"}
            placeholder={"Enter Code"}
            value={userAnswer}
            style={{ height: "40px", width: "100px" }}
            onChange={(e) => setUserAnswer(e.target.value)}
            missing={error.userAnswer}
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', marginLeft: '10px' }}>
            <img
              src={icon.refreshIcon}
              onClick={() => {
                dispatch(getCaptcha());
                setUserAnswer('');
              }}
              style={{ cursor: "pointer", paddingBottom: "35px" }}
              width={"20px"}
              alt="Captcha"
            />
          </div>
        </div>
      </div>
      <div className="col xl13 l12 m12 s12">
        <CheckboxInputField
          inputTagIdAndName="tfStatus"
          checked={tfStatus}
          onChange={() => setTfStatus(!tfStatus)}
          labelText={"Enable Two Factor Authentication"}
        />
      </div>
      <div className="col xl12 l12 m12 s12 center-align center-button">
        <div style={{ marginTop: "10px" }}>
          <BackButton buttonText={"Back"} to="/entity-signup/step-2" />
          <NextButton
            buttonTagCssClasses={"btn-submit"}
            buttonText={"Done"}
            onClick={handleOnClickDone}
          />
        </div>
      </div>
    </>
  );
};


export default EntitySignupStep3;