import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminFooter from "../../components/admin/admin-footer/admin-footer";
import AdminHeader from "../../components/admin/admin-header/admin-header";
import AdminLeftNavigationMenu from "../../components/admin/admin-left-navigation-menu/admin-left-navigation-menu";
import ConfirmDeleteModal from "../../components/admin/admin-modals/confirm-delete-modal";
import SearchModal from "../../components/admin/admin-modals/search-modal";
import ViewMoreInformationModal from "../../components/admin/admin-modals/view-more-information-modal";
import AddQuestions from "../add-questions";
import CandidateScoreSummary from "../candidate-score-summary";
import CandidateVideoAnswerSummary from "../candidate-video-answer-summary";
import CreateJob from "../create-new-job";
import DefineInterview from "../define-interview";
import DomainSkill from "../domain-skill/index";
import FeatureTree from "../feature-tree/index";
import Industry from "../industry/index";
import InterviewResponses from "../interview-responses";
import InterviewResponseRecruiter from "../interview-responses-recruiter";
import InviteCandidates from "../invite-candidates";
import MappingFields from "../invite-candidates/mapping-fields";
import InviteLink from "../invite-link";
import ValidityModal from "../invite-link/validityModal";
import InvitedCandidates from "../invited-candidates";
import CreateJobDetails from "../job-details/index";
import Location from "../location";
import NoRouteFound from "../no-route-found/no-route-found";
import ManageRoles from "../role/index";
import SearchCandidates from "../search-candidates";
import SearchInterviews from "../search-interviews";
import ShuffleQuestions from "../shuffle-questions/index";
import SoftSkill from "../soft-skill/index";
import SummaryScores from "../summary-scores/index";
import UserManagement from "../user-management";
import TermsOfUse from "../user-signup-signin/terms-of-use";

const Admin = () => {
  const [leftNavigationPathname, setLeftNavigationPathname] = useState("");
  const [isSidebarToggled, setSidebarToggled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(true);

  const toggleSidebar = () => {
    setSidebarToggled((prev) => !prev);
  };

  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  console.log(userType)

  // To redirect to first menu option and set same in side nav
  useEffect(() => {
    const targetPath = getRolesBasedSideMenusPath(userType);

    // Only navigate if we're not already there
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
    setLeftNavigationPathname(targetPath);
    setRedirecting(false);
  }, []);


  const getRolesBasedSideMenusPath = (userType) => {
    switch (userType) {
      case 'manpower': return "/admin/dashboard"
      case 'campus': return "/admin/search-interviews"
      case 'organization recruiter': return "/admin/invite-link"
      case 'l1 interviewer':
      case 'l2 interviewer':
        return "/admin/scores-by-interview-round"
      case 'l3 interviewer': return "/admin/candidates-scores-summary"
      case 'organization admin': return "/admin/user-management"
      case 'placement agency admin':
      case 'placement agency recruiter':
        return "/admin/invited-candidates"
      case 'evueMe support': return "/admin/invited-candidates"
      case 'campus student coordinator':
      case 'campus tpo':
      case 'campus admin':
        return "/admin/invited-candidates"
      default: return "/admin/scores-by-interview-round"
    }
  }

  if (redirecting) return null;

  return (
    <>
      <Routes>
        <Route path="/terms-of-use/*" element={<TermsOfUse />} />
        <Route
          path="/*"
          element={
            <>
              <AdminHeader onToggleSidebar={toggleSidebar} />
              <div className="main-section">
                <AdminLeftNavigationMenu
                  leftBarToggle={isSidebarToggled}
                  setLeftNavigationPathname={setLeftNavigationPathname}
                />
                <div className={`right-sidebar ${isSidebarToggled ? "righside-slide" : ""}`}>
                  {/* <div className="right-sidebar-main"> */}
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={<>Dashboard</>}
                    />
                    <Route
                      path="/candidate-video-answers"
                      element={<InterviewResponses />}
                    />
                    <Route path="/role/*" element={<ManageRoles />} />
                    <Route path="/feature-tree" element={<FeatureTree />} />
                    <Route path="/industry/*" element={<Industry />} />
                    <Route path="/domain-skill/*" element={<DomainSkill />} />
                    <Route path="/soft-skill/*" element={<SoftSkill />} />
                    <Route path="/location/*" element={<Location />} />
                    <Route path="/create-job/*" element={<CreateJob />} />
                    <Route path="/user-management/*" element={<UserManagement />} />
                    <Route
                      path="/job-details/job-position-details/*"
                      element={<CreateJobDetails />}
                    />
                    <Route
                      path="/define-interview"
                      element={<DefineInterview />}
                    />
                    <Route
                      path="/scores-by-interview-round"
                      element={<InterviewResponseRecruiter />}
                    />

                    <Route
                      path="/candidate-video-answer-summary"
                      element={<CandidateVideoAnswerSummary />}
                    />
                    <Route
                      path="/candidates-scores-summary"
                      element={<CandidateScoreSummary />}
                    />
                    <Route
                      path="/add-questions/*"
                      element={<AddQuestions />}
                    />
                    <Route path="/test" element={<MappingFields />} />
                    <Route
                      path="/shuffle-questions/:jobId"
                      element={<ShuffleQuestions />}
                    />
                    <Route path="/invite-link" element={<InviteLink />} />
                    <Route path="/search-candidates" element={<SearchCandidates />} />
                    <Route path="/search-interviews" element={<SearchInterviews />} />
                    <Route path="/invite-link" element={<InviteLink />} />
                    <Route
                      path="/invite-candidates"
                      element={<InviteCandidates />}
                    />
                    <Route path="/invite-modal" element={<ValidityModal />} />
                    <Route
                      path="/invited-candidates"
                      element={<InvitedCandidates />}
                    />
                    <Route
                      path="/"
                      element={<NoRouteFound navigateToPath={"/"} />}
                    />
                    <Route
                      path="/summary-by-position"
                      element={<SummaryScores />}
                    />
                  </Routes>
                  {/* </div> */}
                  <AdminFooter />

                  <SearchModal />
                  <ConfirmDeleteModal />
                </div>
              </div>
            </>
          }
        />
      </Routes>
      <ViewMoreInformationModal />
    </>
  );
};

export default Admin;
