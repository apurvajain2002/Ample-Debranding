import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export const usePreventBackAfterLogout = () => {
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const loggedOut = query.get("loggedout");

    if (loggedOut) {
      Cookies.remove("e_access_token");
      localStorage.clear();
      sessionStorage.clear();

      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [location]);
};
