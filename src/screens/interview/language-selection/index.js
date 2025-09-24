import { image } from "../../../components/assets/assets";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInterviewLanguagesQuery } from "../../../redux/slices/interview-responses-slice";
import CustomClockLoader from "../../../components/loaders/clock-loader";
import ErrorToast from "../../../components/toasts/error-toast";
import { useDispatch, useSelector } from "react-redux";
import { preferredLanguageChanged } from "../../../redux/slices/interview-slice";
import WarningToast from "../../../components/toasts/warning-toast";
import { useEffect } from "react";
import { useGlobalContext } from "../../../context";

const NATIVE_LANGUAGE_NAMES = {
  Hindi: "हिन्दी",
  Telugu: "తెలుగు",
  Tamil: "தமிழ்",
  Kannada: "ಕನ್ನಡ",
  Malayalam: "മലയാളം",
  Gujurati: "ગુજરાતી",
  Bengali: "বাঙ্গালী",
  Marathi: "मराठी",
  Oriya: "ଓଡିଆ",
};

const LanguageSelection = () => {
  const location = useLocation();
  const preferredLanguage = useSelector((state) => state.interviewSlice.preferredLanguage);
  const interviewId = useSelector((state) => state.interviewSlice.interviewId);
  const tenantId = useSelector((state) => state.interviewSlice.tenantId);
  const roundName = useSelector((state) => state.interviewSlice.roundName);
  const {
    data: languages,
    isFetching: isFetchingLanguages,
    isError: isErrorLanguages,
    error,
  } = useGetInterviewLanguagesQuery({ interviewId, tenantId: tenantId || "0" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (languages?.length === 1 && !isErrorLanguages) {
      dispatch(preferredLanguageChanged(languages.at(0)));
    }
  }, [languages]);

  if (isErrorLanguages) {
    ErrorToast(error?.data ?? "Something went wrong!");
    return null;
  }

  return (
    <>
      <div className="ln-infog">
        <EvuemeImageTag imgSrc={image.undrawContentTeamSVG} altText={"Content Team"} />
      </div>
      {isFetchingLanguages ? (
        <div
          style={{
            // position: 'fixed',
            top: "10%",
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomClockLoader size={40} />
          </div>
        </div>
      ) : (
        <div className="robo-lang-wrapper">
          {languages.length > 1 && (
            <>
              <h3>Please select your language</h3>
              <ul>
                <LanguageList languages={languages} />
              </ul>
            </>
          )
          }

          <button
            className="waves-effect waves-light btn btn-clear btn-submit"
            onClick={() => {
              if (!preferredLanguage) return WarningToast("Please select a language");
              navigate(`/interview/${roundName.includes("L1") ? "l1-round" : "recruiter-round"}`, {
                replace: true,
                state: {
                  link_access_type: location?.state?.link_access_type
                }
              });
            }}
          >
            {languages.length > 1 ? "NEXT" : "Let's Start"}
          </button>
        </div>
      )}
    </>
  );
};

const LanguageList = ({ languages }) => {
  const preferredLanguage = useSelector((state) => state.interviewSlice.preferredLanguage);
  const dispatch = useDispatch();
  const { rootColor } = useGlobalContext();
  return languages.map((language) => {
    let nativeLang = NATIVE_LANGUAGE_NAMES[language];
    let displayString = nativeLang ? `${nativeLang} - ` : "";
    return (
      <li key={language}>
        <a
          href="#"
          style={{
            background: language === preferredLanguage ? rootColor.secondary : "",
          }}
          onClick={() => dispatch(preferredLanguageChanged(language))}
        >
          {`${displayString}${language}`}
        </a>
      </li>
    );
  });
};

export default LanguageSelection;
