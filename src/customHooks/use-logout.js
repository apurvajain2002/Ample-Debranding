// src/hooks/useLogout.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setLogout } from "../redux/slices/signin-slice";
import { getHostConfig } from "../utils/getHostConfig";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearClientSession = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
      Cookies.remove(cookieName, {
        path: "/",
        domain: window.location.hostname,
      });
    });

    localStorage.clear();
    sessionStorage.clear();

    dispatch(setLogout());
  };

  const handleLogout = () => {
    const { AUTH_API_BASE_URL } = getHostConfig();
    console.log("AUTH_API_BASE_URL:", AUTH_API_BASE_URL);
    console.log("window.location.hostname:", window.location.hostname);

    clearClientSession();
    const currentHost = window.location.hostname;
    const redirectAfterLogout = encodeURIComponent(
      `https://${currentHost}/signin?loggedout=true`
    );
    const logOutURL = `${AUTH_API_BASE_URL}/logout?redirect=${redirectAfterLogout}`;
    console.log("Redirecting to:", logOutURL);

    window.location.replace(logOutURL);
  };

  // const handleLogout = () => {
  //   clearClientSession();
  //   // navigate("/signin", { replace: true });
  //   // window.location.replace("/signin");
  //   // //window.location.href = "/signin";
  //   const { AUTH_API_BASE_URL } = getHostConfig();
  //   const logOutURL = `${AUTH_API_BASE_URL}/login?loggedout=true`;
  //   window.location.href = logOutURL;
  // };

  return { handleLogout };
};
