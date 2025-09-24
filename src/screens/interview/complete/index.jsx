import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { icon } from "../../../components/assets/assets";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import { setLogout } from "../../../redux/slices/signin-slice";
import { clearInterviewSlice } from "../../../redux/slices/interview-slice";

const InterviewComplete = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent navigating back
    window.history.pushState(null, null, window.location.href);

    const handlePopState = (event) => {
      // Redirect user to login route
      navigate("/signin", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    dispatch(clearInterviewSlice());
    dispatch(setLogout());
  }, []);

  return (
    <div className="container vide-robo-wrapper">
      <div className="robo-outwrapper">
        <div className="ln-infog">
          {/* <img src="images/undraw_super_thank_you_re_f8bo-2.svg" alt="" /> */}
          <EvuemeImageTag imgSrc={icon.thankYouSvg} altText="thank you" />
        </div>
        <div className="robo-lang-wrapper thank-wr">
          <h3>Thank you. Your interview is now complete.</h3>
          <p>To stay updated on the status of this interview performance, </p>
          <h2>
            Please click this link{" "}
            <Link to="/signin" replace>
              https://ev.evueme.dev
            </Link>
          </h2>
          <p>and log in with your credentials</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete;
