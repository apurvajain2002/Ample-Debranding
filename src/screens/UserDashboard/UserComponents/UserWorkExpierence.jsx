import getUniqueId from "../../../utils/getUniqueId.js";
import { icon, image } from "./../../../components/assets/assets.jsx";

const formatWorkExperienceDates = (startDate, endDate) => {
  if (!startDate) return "No start date";
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(); // Use current date if no end date
  
  // Format month and year
  const formatDate = (date) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  const startFormatted = formatDate(start);
  const endFormatted = endDate ? formatDate(end) : "Present";
  
  // Calculate duration in months
  const calculateDuration = (start, end) => {
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    
    if (totalMonths === 0) return "Less than 1 mo";
    if (totalMonths === 1) return "1 mo";
    if (totalMonths < 12) return `${totalMonths} mos`;
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (months === 0) return `${years} yr${years > 1 ? 's' : ''}`;
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  };
  
  const duration = calculateDuration(start, end);
  
  return `${startFormatted} - ${endFormatted} · ${duration}`;
};

const DefineWorkExpiernce = ({ workEx }) => {
  return (
    <div className="workex-body">
      <div className="exbox-wr">
        <div className="univercity-round">
          <img src={icon.homeSchoolingIcon} alt="" />
        </div>
        <div className="exbox-wr-right">
        <h3>{workEx.designation}</h3>
          <p>{workEx.organizationName}</p>
          <p>{formatWorkExperienceDates(workEx.startDate, workEx.endDate)}</p>
          <h3 className="golden-h3">{workEx.designation}</h3>
          <p>{workEx.description}</p>
          {/* <ul>
            <li>1. There are many variations of passages</li>
            <li>2. Lorem Ipsum is not simply random text</li>
            <li>3. from a Lorem Ipsum</li>
            <li>4. The first line of Lorem</li>
            <li>5. generated Lorem Ipsum is therefore</li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

const UserWorkExpirence = ({ workExpiernce }) => {
  return (
    <div className="col xl6 l6 m6 s6" style={{flex: 1}}>
      <div className="experience-wrapper " style={{height:"full"}}>
        <header className="workex-header">
          <h3>Work Experience</h3>
          <a href="#">
            <img src={icon.mathPlusIcon} alt="" /> Add Experience
          </a>
        </header>
        {workExpiernce && workExpiernce.length > 0 ? workExpiernce.map((val, index) => {
          return <DefineWorkExpiernce key={getUniqueId()} workEx={val} />;
        })
      : (
        <div className="workex-body">
          <p>No work experience data available</p>
        </div>
      )}
      
      </div>
    </div>
  );
};

export default UserWorkExpirence;
