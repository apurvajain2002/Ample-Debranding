import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import axiosInstance from "../../interceptors";
import { useDispatch } from "react-redux";
import {
  setUserState,
  setLogout,
  setUserId,
} from "../../redux/slices/signin-slice";
import ErrorToast from "../../components/toasts/error-toast";
import Popup from "../../components/errors";
import { dataFromLink } from "../../redux/slices/interview-slice";
import {
  setSelectedJobId,
  setSelectedRoundId,
  setReportLink,
} from "../../redux/slices/interview-responses-l1-dashboard-slice";
import { useGlobalContext } from "../../context";
import { baseUrl } from "../../config/config";

const NoRouteFound = ({ navigateToPath }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const { setInterviewJobName, setPrivateUserId, setInterviewSource } =
    useGlobalContext();

  const validateInterviewLink = async (url) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/interview-link-validation`,
        {
          interviewLink: url,
          // interviewLink: "https://app.evueme.live/vHqvidtLbmKSvUP4HaAVGRKt7Y744uPWnqOn+_qJM4j7JB4rfIzKyQ=="
        }
      );
      // console.log("validateInterviewLink respone is ::", data);
      // debugger;
      if (data.success || data.status) {
        setInterviewJobName(data?.jobName || "");
        // propagate source (e.g., 'login') to context so interview screens can adjust flow
        setInterviewSource((data?.source || "").toLowerCase());
        const user = data.user;
        if (user) {
          localStorage.setItem("link_access_type", "privateLink");
          localStorage.setItem("myUserId", user.id);
          dispatch(setUserId(user.id));
          setPrivateUserId(user.id);
        } else {
          localStorage.setItem("link_access_type", "publicLink");
        }
        if (data.valid) {
          if (!data.public && user) {
            dispatch(
              setUserState({
                userName: user.userName,
                userType: "candidate",
                tncStatus: user.tncStatus || false,
                userId: user.id,
                token: data.bearerToken,
              })
            );
          } /* else {
            dispatch(setLogout());
          } */
          dispatch(
            dataFromLink({
              interviewId: data.interviewId,
              tenantId: data.tenantId || "0",
              jobId: data.jobId,
              roundName: data.roundName,
              forceCameraOn: data.forceCameraOn,
            })
          );
          navigate("/interview/language-selection", {
            state: {
              link_access_type: data?.user ? "privateLink" : "publicLink",
            },
          });
          // navigate("/interview/language-selection"); //  Rishi Singh   4 months ago (January 21st, 2025 3:40 PM)
          return true;
        } else {
          ErrorToast("The link has expired or is invalid.");
          navigate(navigateToPath);
        }
      } else {
        ErrorToast("The link has expired or is invalid.");
        navigate(navigateToPath);
      }
    } catch (error) {
      ErrorToast(error.message);
    }
    return false;
  };

  const validateReportLink = async (url) => {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/report-link-validation`,
        {
          reportLink: url,
        }
      );
      console.log("resmponse from there is :", response);
      if (response.data?.success || response.data?.status) {
        // if (response.data?.valid) {
        dispatch(setSelectedJobId(response?.data?.["jobId"]));
        dispatch(setSelectedRoundId(response?.data?.["interviewRound"]));
        dispatch(setReportLink(response?.data?.["reportLink"]));
        navigate("/interview/report");
        return true;
        // }
      } else {
        ErrorToast("The link has expired or is invalid.");
        navigate(navigateToPath);
      }
    } catch (error) {
      ErrorToast(error.message);
    }
    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (pathname.trim() === "/") {
        setLoading(false);
        return navigate(navigateToPath);
      }

      const url = window.location.href;
      const interviewLinkValid = await validateInterviewLink(url);
      console.log("invalid interviewlink");
      if (!interviewLinkValid) {
        console.log("inside ...");
        await validateReportLink(url);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div
      className="center centered"
      style={{ minHeight: "100vh", width: "100%", background: "#fff" }}
    >
      {loading ? <EvuemeLoader /> : <Popup type="pagenotfound" />}
    </div>
  );
};

export default NoRouteFound;
