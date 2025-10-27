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

  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: "GET",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      console.log(response, "......api response");
      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 2000);
      if (!response.ok) {
        console.warn("Logout API failed:", response.status);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearClientSession();
      navigate("/signin", { replace: true });
    }
  };

  return { handleLogout };
};
