import getUniqueId from "../../../utils/getUniqueId.js";
import { icon } from "./../../../components/assets/assets.jsx";

const ShowAcademicInfo = ({ academicInfo }) => {
  return (
    <div className="exbox-wr exbox-wr-border">
      <div className="exbox-wr-img">
        <i className="univercity-round">
          <img src={icon.homeSchoolingIcon} alt="" />
        </i>
      </div>
      <div className="exbox-wr-right">
        <h3>{academicInfo.universityName}</h3>
        <p>{academicInfo.degreeName}</p>
        <span className="date-span">
          <i>
            <img src={icon.calendarCheckMarkIcon} alt="" />
          </i>{" "}
          2020 - 2022
        </span>
        <span className="date-span">{academicInfo.cgpa}</span>
      </div>
    </div>
  );
};

const UserAcademicExpirence = ({ academicInformation }) => {
  return (
    <div className="col xl6 l6 m6 s6">
      <div className="experience-wrapper">
        <header className="workex-header">
          <h3>Academic Information</h3>
          <a href="#">
            <img src={icon.mathPlusIcon} alt="" /> Add More
          </a>
        </header>
        <div className="workex-body">
          {academicInformation.map((val, index) => {
            return <ShowAcademicInfo key={getUniqueId()} academicInfo={val} />;
          })}
        </div>
      </div>
    </div>
  );
};
export default UserAcademicExpirence;
