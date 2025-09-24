import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import EntitySignupScreenImage from "./entity-signup-screen-image";
import EntitySignupStep1 from "./entity-signup-step-1";
import EntitySignupStep2 from "./entity-signup-step-2";
import EntitySignupStep3 from "./entity-signup-step-3";
import NoRouteFound from "../no-route-found/no-route-found";
import { useSelector } from "react-redux";
import ErrorToast from "../../components/toasts/error-toast";
import SuccessToast from "../../components/toasts/success-toast";
import EntitySignupSucess from "./entity-signup-sucess";
import axiosInstance from "../../interceptors";
import WarningToast from "../../components/toasts/warning-toast";
import axios from "axios";
import { baseUrl } from "../../config/config";

const EntitySignupScreen = () => {
  const { successMessage, failMessage } = useSelector(
    (state) => state.signUpReducer
  );

  const [newEntity, setNewEntity] = useState({
    entityType: "Employer/Corporate",
    businessName: "",
    businessShortName: "",
    hqstate: "",
    hqcity: "",
    pincode: "",
    country: "",
    webSite: "https://",
    noOfEmployees: "",
    contactPersonDetails: [
      {
        id: null,
        firstName: "",
        lastName: "",
        whatsappNumberCountryCode: "",
        whatsappNumber: "",
        whatsappNumberVerified: false,
        email: "",
        designation: "",
        linkdinUrl: "",
        mobileNumberCountryCode: "",
        mobileNumber: "",
        mobileNumberVerified: false,
        password: "",
        confirmPassword: "",
      },
    ],

    billingAddress: [
      {
        addressLine1: "",
        addressLine2: "",
        stateId: "",
        id: null,
        orgId: "",
        pincode: "",
        name: "",
        cinNumber: "",
        panNumber: "",
        gstinNumber: "",
        gstState: "",
        panMedia: null,
        gstinMedia: null,
      },
    ],

    linkedinUrl: "",
    youTubeURL: "",
    logoMedia: null,
    primaryColor: "",
    secondaryColor: "",
    about: "",
    tfStatus: false,
    captchaVerified: false,
  });

  function isNumeric(str) {
    return /^[0-9]+$/.test(str);
  }
  const checkUniqueBusinessName = async (e) => {
    const { name, value } = e.target;
    if (value === "") {
      return WarningToast("Business name cannot be empty!");
    }
    if (isNumeric(value)) {
      ErrorToast("Business Name must contain atleast one Character")
      // setNewEntity(() => ({
      //   ...newEntity,
      //   [name]: "",
      // }));
      return;
    }
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/check-unique-business-name`,
        {
          name: value,
          entityId: localStorage?.getItem("entityId")
        }
      );

      if (data.success || data.message) {
        if (data.message === "Name already exists") {
          ErrorToast(data.message || "Enter Unique Business Name");
          // setNewEntity(() => ({
          //   ...newEntity,
          //   [name]: "",
          // }));
        }
      }
    } catch (error) {
      ErrorToast(error.message || "Could not Verify Business Name");
    }
  };

  const checkUniqueWebsiteUrl = async (URL) => {
    if (URL === "") {
      return;
    }
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/validate-website`,
        {
          name: URL,
          entityId: localStorage?.getItem("entityId")
        }
      );

      if (data.success || data.message) {
        if (data.message !== "Website URL is valid and unique") {
          ErrorToast(data.message || "Enter Unique Business Name");
          // setNewEntity(() => ({
          //   ...newEntity,
          //   webSite: "https://",
          // }));
        }
      }
    } catch (error) {
      ErrorToast(error.message || "Could not Verify Business Name");
    }
  };
  const checkValidPinCode = async (e) => {
    const pincode = e.target.value;
    if (pincode === "") {
      return WarningToast("Pin code cannot be empty!");
    }
    try {
      const { data } = await axios.post(
        `${baseUrl}/common/city/validate-pincode`,
        {
          id: newEntity.hqcity,
          pincode: pincode
        }
      );

      // if (data.success || data.status) {
      // if (!data.success) {
        // ErrorToast("invalid pincode");
        // setNewEntity(() => ({
        //   ...newEntity,
        //   pincode: "",
        // }));
      // }
      // }
    } catch (error) {
      ErrorToast(error.message || "Could not validate Pin Code");
    }
  };



  const handleOnChangeEntityData = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewEntity(() => ({ ...newEntity, [name]: files[0] }));
    } else {
      setNewEntity(() => ({
        ...newEntity,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (failMessage) {
      ErrorToast(failMessage);
    } else if (successMessage) {
      SuccessToast(successMessage);
    }
  }, [successMessage, failMessage]);

  return (
    <div className="container full-height valign-wrapper row-relative">
      <div className="row">
        <EntitySignupScreenImage />
        <div className="col xl8 l8 m8 s12 ent-rightboxbg">
          <div className="enity-registration-box evm-register-header">
            <Routes>
              <Route
                path="/step-1"
                element={
                  <EntitySignupStep1
                    newEntity={newEntity}
                    setNewEntity={setNewEntity}
                    handleOnChangeEntityData={handleOnChangeEntityData}
                    checkUniqueBusinessName={checkUniqueBusinessName}
                    checkUniqueWebsiteUrl={checkUniqueWebsiteUrl}
                    checkValidPinCode={checkValidPinCode}
                  />
                }
              />
              <Route
                path="/step-2"
                element={
                  <EntitySignupStep2
                    newEntity={newEntity}
                    setNewEntity={setNewEntity}
                    handleOnChangeEntityData={handleOnChangeEntityData}
                  />
                }
              />
              <Route
                path="/step-3"
                element={
                  <EntitySignupStep3
                    newEntity={newEntity}
                    setNewEntity={setNewEntity}
                    handleOnChangeEntityData={handleOnChangeEntityData}
                  />
                }
              />
              <Route path="/success" element={<EntitySignupSucess />} />
              <Route
                path="/*"
                element={<NoRouteFound navigateToPath={"/"} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntitySignupScreen;
