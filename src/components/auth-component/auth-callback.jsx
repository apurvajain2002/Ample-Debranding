import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OAUTH } from "../../config/config";
import EvuemeLoader from "../loaders/evueme-loader";
import { useDispatch } from "react-redux";
import { setUserState, resetLogoutFlag } from "../../redux/slices/signin-slice";
import Cookies from "js-cookie";
import { parseJwt } from "../../utils/parseJwt";
import { useGlobalContext } from "../../context";
const AUTH_API_BASE_URL = process.env.REACT_APP_APP_AUTH_BASE_URL;
const AUTH_API_URL = process.env.REACT_APP_APP_AUTH_URL;

const USER_TYPE_MAP = {
  1: "org_person",
  2: "candidate",
  3: "campus",
  4: "admin",
  5: "org_admin",
  6: "recruiter",
  7: "manpower",
}

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { hostname } = useGlobalContext();
  console.log('hostname auth callback page ::: ', hostname);

  useEffect(() => {
    const auth = async () => {
      setLoading(true);

      // Run on auth callback
      let url = new URL(window.location.href);
      let code = url.searchParams.get("code");
      if (!code) {
        return navigate("/", { replace: true });
      }

      let data = new URLSearchParams();
      data.append("grant_type", OAUTH.GRANT_TYPE);
      data.append("code", code);
      data.append("redirect_uri", OAUTH.REDIRECT_URI);

      // Authorization header
      const basicAuth = btoa(`${OAUTH.CLIENT_ID}:${OAUTH.CLIENT_SECRET}`);
      const contenType = "application/x-www-form-urlencoded";

      try {
        let res = await axios.post(
          `https://${hostname}${AUTH_API_URL}/oauth2/token`,
          data.toString(),
          {
            headers: {
              "Content-Type": contenType,
              Authorization: `Basic ${basicAuth}`,
            },
          }
        );

        if (res.status !== 200) {
          console.error("code <-> token failed:", res.status, res.data);
          return navigate("/", { replace: true });
        }

        let accessToken = res.data.access_token;
        let { userinfo } = parseJwt(accessToken);

        dispatch(
          setUserState({
            userName: `${userinfo?.firstName}${userinfo?.lastName ? ' ' + userinfo.lastName : ''}`,
            tncStatus: userinfo?.tncStatus,
            userId: userinfo?.id,
            userType: USER_TYPE_MAP[userinfo?.evUserType ?? -1] ?? "",
            token: accessToken,
          })
        );
        
        // Reset logout flag on successful authentication
        dispatch(resetLogoutFlag());
        
        Cookies.set("e_access_token", accessToken, {
          expires: 1,
        });

        navigate("/", { replace: true });
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("AxiosError code <-> token:", error);
        }
        console.error("Unknown error code <-> token:", error);
      } finally {
        setLoading(false);
      }
    };

    auth();
  }, []);

  return loading ? <EvuemeLoader /> : null;
};

export default AuthCallback;