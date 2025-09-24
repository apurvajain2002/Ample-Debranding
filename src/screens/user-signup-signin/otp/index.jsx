import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useEffect } from "react";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import { OAUTH } from "../../../config/config";
import { useGlobalContext } from "../../../context";

const OtpPage = () => {
  const navigate = useNavigate();
  const { hostname } = useGlobalContext();
  console.log('hostname otp page ::: ', hostname);
  const AUTH_API_URL = process.env.REACT_APP_APP_AUTH_URL;

  const { accessToken, isLogout } = useSelector(
    (state) => state.signinSliceReducer
  );

  console.log('accessToken ::: ', accessToken);

  useEffect(() => {
    const token =
      localStorage.getItem("e_access_token") ||
      Cookies.get("e_access_token") ||
      accessToken;
    console.log('token ::: ', token);
    if (!token) {
      // Skip OAuth API call if user is logging out
      if (isLogout) {
        return;
      }
      
      const authBase = `https://${hostname}${AUTH_API_URL}/oauth2/authorize`;
      const params = new URLSearchParams();
      params.append("redirect_uri", OAUTH.REDIRECT_URI);
      params.append("response_type", "code");
      params.append("client_id", OAUTH.CLIENT_ID);
      params.append("scope", "openid");

      let targetUrl = `${authBase}?${params.toString()}`;

      window.location.href = targetUrl;
    } else {
      navigate("/admin/scores-by-interview-round");
    }
  }, [accessToken, isLogout]);

  return <EvuemeLoader />;
};

export default OtpPage;
