// src/hooks/useLogout.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setLogout } from "../redux/slices/signin-slice";
import { getHostConfig } from "../utils/getHostConfig";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { AUTH_API_BASE_URL } = getHostConfig();

  const LOGOUT_URL = `${AUTH_API_BASE_URL}/exit`;

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
    clearClientSession();
    navigate("/signin", { replace: true });
    window.location.replace("/signin");
  };

  return { handleLogout };
};
