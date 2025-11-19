import UserAcademicExpirence from "./UserAcademicExpirence";
import UserWorkExpirence from "./UserWorkExpierence";
import UserInfo from "./UserInfo.jsx";
import UserSkills from "./UserSkills.jsx";
import { useGlobalContext } from "../../../context";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedCandidateInfo } from "../../../redux/actions/interview-responses-l1-dashboard-actions";
const userData = {
  name: "Preeti Sharma",
  email: "preetisarma@gmail.com",
  mobileNo: "987654312",
  whatsappNo: "1234567890",
  currentLocation: "Gurgaon",
  noticePeriod: "60 days",
  dateOfBirth: "01-06-1987",
  currentCTC: "10 LPA",
  highestDegree: "MBA",
  FixedCTC: "2LPA",
  variableCTC: "8LPA",
  workExpiernce: [
    {
      currentDesignation: "Marketing Manager",
      currentOrganization: "Infosys ltd.",
      startDate: "01-10-2023",
      endDate: "",
      workLocation: "Gurgaon",
      companyInformation: "Working as a backend Developer",
    },
  ],
  academicInformation: [
    {
      universityName: "KR Mangalam University",
      degreeName: "B.Tech Computer Science",
      StartDate: "2018",
      EndDate: "2022",
      cgpa: "7.6",
    },
  ],
};

const UserProfile = () => {

  const { rootColor } = useGlobalContext();
  const dispatch = useDispatch();
  const userid = useSelector((state)=>state.signinSliceReducer.userId);

  const { userDetailsInfo } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);

  useEffect(() => {
    dispatch(fetchSelectedCandidateInfo({ id: userid }));
  }, []);

  console.log('userDetailsInfo ', userDetailsInfo)

  return (
    <>
      <div className="right-sidebar candidate-rightwrapper">
        <div className="container" style={{ background: "#fff" }}>
          <UserInfo userData={userDetailsInfo} />
          <UserSkills />
          <div className="row row-margin">
            <UserWorkExpirence workExpiernce={userDetailsInfo?.workExperience || []} />
            <UserAcademicExpirence
              academicInformation={userDetailsInfo?.userAcademics || []}
            />
            {/* <AdminFooter /> */}
          </div>
        </div>
        <footer className="main-footer">
          <div className="container">
            <div className="footer-right right">
              <span>Strategic Partner</span>
              <a href="#" className="logo-main">Hi...<img src={rootColor.logoUrl} alt="" width="80px" /></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
export default UserProfile;
