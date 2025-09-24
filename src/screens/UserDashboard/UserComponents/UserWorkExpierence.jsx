import getUniqueId from "../../../utils/getUniqueId.js";
import { icon, image } from "./../../../components/assets/assets.jsx";

const DefineWorkExpiernce = ({ workEx }) => {
  return (
    <div className="workex-body">
      <div className="exbox-wr">
        <div className="exbox-wr-img">
          <img src={image.infosysLogo} alt="" />
        </div>
        <div className="exbox-wr-right">
          <h3>{workEx.currentDesignation}</h3>
          <p>{workEx.currentOrganization}</p>
          <p>Aug 2017 - Mar 2018 · 8 mos</p>
          <h3 className="golden-h3">{workEx.currentDesignation}</h3>
          <ul>
            <li>1. There are many variations of passages</li>
            <li>2. Lorem Ipsum is not simply random text</li>
            <li>3. from a Lorem Ipsum</li>
            <li>4. The first line of Lorem</li>
            <li>5. generated Lorem Ipsum is therefore</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const UserWorkExpirence = ({ workExpiernce }) => {
  return (
    <div className="col xl6 l6 m6 s6">
      <div className="experience-wrapper exminheight">
        <header className="workex-header">
          <h3>Work Experience</h3>
          <a href="#">
            <img src={icon.mathPlusIcon} alt="" /> Add Experience
          </a>
        </header>
        {workExpiernce.map((val, index) => {
          return <DefineWorkExpiernce key={getUniqueId()} workEx={val} />;
        })}
      </div>
    </div>
  );
};

export default UserWorkExpirence;
