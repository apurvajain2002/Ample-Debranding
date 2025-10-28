import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useEffect } from "react";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import { OAUTH } from "../../../config/config";
import { useGlobalContext } from "../../../context";
import { useDispatch } from "react-redux";
import { setLogout } from "../../../redux/slices/signin-slice";
import { getHostConfig } from "../../../utils/getHostConfig";
import { usePreventBackAfterLogout } from "../../../utils/preventBFCacheLogout";

const SigninPage = () => {
  usePreventBackAfterLogout();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, isLogout } = useSelector(
    (state) => state.signinSliceReducer
  );
  //   const { hostname } = useGlobalContext();
  //   console.log('hostname sign in page ::: ', hostname);
  // const AUTH_API_URL = process.env.REACT_APP_APP_AUTH_URL;

  useEffect(() => {
    const { AUTH_API_BASE_URL } = getHostConfig();
    const hostname = window.location.hostname;
    const token =
      localStorage.getItem("e_access_token") ||
      Cookies.get("e_access_token") ||
      accessToken;

    if (!token) {
      // Skip OAuth API call if user is logging out
      if (isLogout) {
        // window.location.href = `https://${hostname}${AUTH_API_URL}/login`;
        window.location.href = `${AUTH_API_BASE_URL}/login`;
        // clear all cookies
        Cookies.remove("e_access_token");
        localStorage.clear();
        dispatch(setLogout());
        return;
      }

      // const authBase = `https://${hostname}${AUTH_API_URL}/oauth2/authorize`;
      const authBase = `${AUTH_API_BASE_URL}/oauth2/authorize`;
      const params = new URLSearchParams();
      params.append("redirect_uri", OAUTH.REDIRECT_URI);
      params.append("response_type", "code");
      params.append("client_id", OAUTH.CLIENT_ID);
      params.append("scope", "openid");

      // let targetUrl = `${authBase}?${params.toString()}`;
      // window.location.href = targetUrl;
      window.location.href = `${authBase}?${params.toString()}`;
    } else {
      navigate("/admin/scores-by-interview-round");
    }
  }, [accessToken, isLogout]);

  return <EvuemeLoader />;

  // return (
  //   <div className="container full-height valign-wrapper row-relative">
  //     <div className="row">
  //       <UserSignupSinginPageImage />
  //       <Siginform />
  //     </div>
  //   </div>
  // );
};

export default SigninPage;

// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Cookies from "js-cookie";
// import { useEffect } from "react";
// import EvuemeLoader from "../../../components/loaders/evueme-loader";
// import { OAUTH } from "../../../config/config";
// import { useGlobalContext } from "../../../context";
// import { useDispatch } from "react-redux";
// import { setLogout } from "../../../redux/slices/signin-slice";
// import { APP_AUTH_URL, baseUrl } from "../../../config/config";
// const SigninPage = () => {
//   const navigate = useNavigate();
//   const { hostname } = useGlobalContext();
//   console.log('hostname sign in page ::: ', hostname);
// const AUTH_API_URL = process.env.REACT_APP_APP_AUTH_URL;
//   const { accessToken, isLogout } = useSelector(
//     (state) => state.signinSliceReducer
//   );

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token =
//       localStorage.getItem("e_access_token") ||
//       Cookies.get("e_access_token") ||
//       accessToken;

//     if (!token) {
//       // Skip OAuth API call if user is logging out
//       if (isLogout) {
//         window.location.href = `https://${hostname}${AUTH_API_URL}/login`;
//         // window.location.href = `${APP_AUTH_URL}/login`;

//         // clear all cookies
//         Cookies.remove("e_access_token");
//         localStorage.clear();
//         dispatch(setLogout());
//         return;
//       }

//       const authBase = `https://${hostname}${AUTH_API_URL}/oauth2/authorize`;
//       // const authBase = `${APP_AUTH_URL}/oauth2/authorize`;

//       const params = new URLSearchParams();
//       params.append("redirect_uri", OAUTH.REDIRECT_URI);
//       params.append("response_type", "code");
//       params.append("client_id", OAUTH.CLIENT_ID);
//       params.append("scope", "openid");

//       let targetUrl = `${authBase}?${params.toString()}`;

//       window.location.href = targetUrl;
//     } else {
//       navigate("/admin/scores-by-interview-round");
//     }
//   }, [accessToken, isLogout]);

//   return <EvuemeLoader />;

//   // return (
//   //   <div className="container full-height valign-wrapper row-relative">
//   //     <div className="row">
//   //       <UserSignupSinginPageImage />
//   //       <Siginform />
//   //     </div>
//   //   </div>
//   // );
// };

// export default SigninPage;
