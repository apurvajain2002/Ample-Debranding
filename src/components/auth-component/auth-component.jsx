import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EvuemeLoader from "../loaders/evueme-loader";
import { useSelector, useDispatch } from "react-redux";
import ErrorToast from "../toasts/error-toast";
import Cookies from "js-cookie";
import { syncStateWithStorage } from "../../redux/slices/signin-slice";

const AuthComponent = ({ children }) => {
  const dispatch = useDispatch();
  const { accessToken, tncStatus, userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      setLoading(true);
      dispatch(syncStateWithStorage());

      const token =
        localStorage.getItem("e_access_token") ||
        Cookies.get("e_access_token") ||
        accessToken;

      const isLoggingOut = localStorage.getItem("isLoggingOut") === "true";

      if (!token) {
        // //navigate("/signin", { replace: true });
        // window.location.replace("/signin");
        // return;
        // if (!window.location.search.includes("loggedout=true")) {
        //   window.location.replace("/signin");
        // }
        // return;
        if (!isLoggingOut) {
          window.location.replace("/signin");
        } else {
          localStorage.removeItem("isLoggingOut");
        }
        return;
      }

      if (tncStatus === false) {
        navigate("/admin/terms-of-use");
        return;
      }

      if (
        userType &&
        userType === "candidate" &&
        !location.pathname.startsWith("/user")
      ) {
        navigate("/user", { replace: true });
        return;
      }
      /* if ((userType && userType === "manpower") && !location.pathname.startsWith("/manpower")) {
        navigate("/manpower", { replace: true });
      } */
    } catch (error) {
      console.error("Auth component error:", error);
      ErrorToast(error.message);
      navigate("/signin", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [accessToken, navigate, tncStatus, userType, location.pathname, dispatch]);

  return !loading ? <>{children}</> : <EvuemeLoader />;
};

export default AuthComponent;
