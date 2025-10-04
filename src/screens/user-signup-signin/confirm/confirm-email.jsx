import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuccessToast from "../../../components/toasts/success-toast";
import ErrorToast from "../../../components/toasts/error-toast";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import axiosInstance from "../../../interceptors";
import { baseUrl } from "../../config/config";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const urlParams = new URL(window.location.href).searchParams;
  const userId = urlParams.get("user");
  
  const verifyEmail = async () => {
    if (!userId) {
      setError(true);
      setMessage("User ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`${baseUrl}/verify-email/${userId}`);
      if (response.data.success) {
        setMessage("Email validated!");
        setError(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error("This link is invalid");
      }
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || "This link is invalid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  useEffect(()=>{
    if(error && message){
      ErrorToast(message);
    } 
    if(!error && message){
      SuccessToast(message);
    }
  },[error, message]);

  return (
    <div className="col xl6 l6 m6 s12 login-wrap login-centered">
      {loading && <EvuemeLoader />}
    </div>
  );
};

export default ConfirmEmail;
