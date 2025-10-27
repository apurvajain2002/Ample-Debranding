// Don't change the order of imports for these stylesheets
import "./styles/style.css";
import "./styles/interview-rounds.css";

import { Route, Routes } from "react-router-dom";
import UiReference from "./ui-reference-screen/index";
import SigninPage from "./screens/user-signup-signin/signin/index";
import SignupPage from "./screens/user-signup-signin/signup/index";
import Admin from "./screens/admin/index";
import NoRouteFound from "./screens/no-route-found/no-route-found";
import EntitySignupScreen from "./screens/entity-signup";
import User from "./screens/UserDashboard";
import AuthComponent from "./components/auth-component/auth-component";
import ResetPassword from "./screens/user-signup-signin/reset/index";
import Confirm from "./screens/user-signup-signin/confirm/index";
import Interview from "./screens/interview";
import DeviceChecking from "./screens/device-checking";
import L1Round from "./screens/interview/l1-round";
import OtherRecRound from "./screens/interview/rec-round";
import BrowserErrorBoundary from "./components/errors/BrowserErrorBoundary";
// import PositionPage1 from "./components/candidate-video-answers-summary/positionReport/positionPage1"
// import PositionPage2 from "./components/candidate-video-answers-summary/positionReport/positionPage2";
// import PositionPage3 from "./components/candidate-video-answers-summary/positionReport/positionPage3";
// import PositionPage4 from "./components/candidate-video-answers-summary/positionReport/positionPage4";
// import PositionPageAll from "./components/candidate-video-answers-summary";
import AuthCallback from "./components/auth-component/auth-callback";
import PositionReport from "./components/interview-responses/positionReport";
import ReportPage1 from "./screens/candidate-report/report-page-1";
import OtpPage from "./screens/user-signup-signin/otp";
import { useEffect } from "react";
import { useGlobalContext } from "./context";
import { useDispatch } from "react-redux";
import { getBranding } from "./redux/actions/root-actions";

function App() {
  const dispatch = useDispatch();
  const { setRootColor, dynamicColorPage } = useGlobalContext();
  const hostname = window.location.hostname?.split(".")[0];

  useEffect(() => {
    const getBrandingApiCall = async () => {
      const response = await dispatch(getBranding({ hostname }));
      const { primaryColor, secondaryColor, logoURL } =
        response?.payload?.organizationBrandingDTO || {};
      const root = document.documentElement;
      root.style.setProperty(
        "--primary-color",
        primaryColor || dynamicColorPage.primary
      );
      root.style.setProperty(
        "--secondary-color",
        secondaryColor || dynamicColorPage.secondary
      );
      setRootColor({
        primary: primaryColor || dynamicColorPage.primary,
        secondary: secondaryColor || dynamicColorPage.secondary,
        logoUrl: logoURL || dynamicColorPage.logoUrl,
      });
    };
    getBrandingApiCall();

    //clean up while going back
    const handlePageShow = (event) => {
      if (event.persisted) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // If user navigated back to a cached page after logout, force reload to signin
          window.location.replace("/signin");
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <BrowserErrorBoundary>
      <Routes>
        <Route path="/ui-reference" element={<UiReference />} />
        <Route path="/signin/*" element={<SigninPage />} />
        <Route path="/otp/*" element={<OtpPage />} />
        <Route path="/interview/l1-round" element={<L1Round />} />
        {/* <Route path="/interview" element={<L1Round />} /> */}
        <Route path="/interview/recruiter-round" element={<OtherRecRound />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/entity-signup/*" element={<EntitySignupScreen />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
        <Route path="/confirm-email/*" element={<Confirm />} />
        <Route path="/device-check/*" element={<DeviceChecking />} />
        <Route path="/candidate-report" element={<ReportPage1 />} />
        <Route path="/position-report" element={<PositionReport />} />
        <Route
          path="/user/*"
          element={
            <>
              <AuthComponent>
                <User />
              </AuthComponent>
            </>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AuthComponent>
              <Admin />
            </AuthComponent>
          }
        />
        <Route path="/interview/*" element={<Interview />} />
        <Route path="/oauth2/callback" element={<AuthCallback />} />
        {/* <Route path="/no-route" element={<NoRouteFound navigateToPath={"/signin"} />} /> */}{" "}
        {/* manas added for testing */}
        <Route
          path="/*"
          element={<NoRouteFound navigateToPath={"/signin"} />}
        />
      </Routes>
    </BrowserErrorBoundary>
  );
}

export default App;
