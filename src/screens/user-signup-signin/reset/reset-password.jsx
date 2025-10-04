import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { icon } from "../../../components/assets/assets";
import PasswordInputField from "../../../components/input-fields/password-input-field";
import NormalButton from "../../../components/buttons/normal-button";
import WarningToast from "../../../components/toasts/warning-toast";
import SuccessToast from "../../../components/toasts/success-toast";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import ErrorToast from "../../../components/toasts/error-toast";
import axiosInstance from "../../../interceptors";
import { baseUrl } from "../../config/config";

const ResetPassword = () => {
  const urlParams = new URL(window.location.href).searchParams;
  const userId = urlParams.get("user");
  const navigate = useNavigate();

  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChangeuser = (e) => {
    setUser(() => ({
      ...user,
      [e.target.name]: e.target.value,
    }));
  };

  const checkPasswordStrength = () => {
    if (user.password.length < 8) {
      // Check password length
      return "Password is short!";
    } else if (!/[a-zA-Z]/.test(user.password)) {
      // Check for at least 1 letter
      return "Please use a alphabet!";
    } else if (!/[a-z]/.test(user.password) || !/[A-Z]/.test(user.password)) {
      // Check for both uppercase and lowercase characters
      return "Use both uppercase and lowercase alphabets!";
    } else if (/(\w)\1{3,}/.test(user.password)) {
      // Check for consecutive characters (e.g., "11111", "12345")
      return "No consecutive characters please!";
    }
  };

  const handleConfirmPassword = () => {
    if (user.password !== user.confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    if (isLoading) return;
    e.preventDefault();
    // Check password strength
    let passwordStrength = await checkPasswordStrength();
    if (passwordStrength !== null && passwordStrength !== undefined) {
      return alert(passwordStrength);
    }

    // Check if confirm password are same or not
    if (!handleConfirmPassword()) {
      return WarningToast("Confirm password not same as password");
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/otp/reset-password`,
        {
          userId: userId,
          password: user.password,
        }
      );
      SuccessToast(data.message || "Password updated successfully!");
      navigate("/signin");
    } catch (error) {
      ErrorToast(error.message || "Couldn't reset password!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col xl6 l6 m6 s12 login-wrap login-centered">
      {isLoading && <EvuemeLoader />}
      <div className="login-wrap-box login-form-centered">
        <h3 className="carretColor-transparent">Reset your password</h3>
        <form onSubmit={handleSubmit} className="loginform ">
          <PasswordInputField
            inputTagIdAndName={"password"}
            value={user.password}
            onChange={(e) => handleOnChangeuser(e)}
            placeholder={"Password"}
            leftIconSrc={icon.lockIcon}
            labelText={"Password"}
          />
          <PasswordInputField
            inputTagIdAndName={"confirmPassword"}
            placeholder={"Confirm Pssword"}
            value={user.confirmPassword}
            onChange={(e) => handleOnChangeuser(e)}
            leftIconSrc={icon.lockIcon}
            labelText={"Confirm Password"}
          />
          <NormalButton
            buttonTagCssClasses={"btn-large fullwidth-btn"}
            buttonText={"Update Password"}
            onClick={handleSubmit}
          />
          <div className="loginfooter">
            <p>
              Already a User? <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
