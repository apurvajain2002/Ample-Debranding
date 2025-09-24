import { useGlobalContext } from "../../context";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import { image } from "../assets/assets";

const InterviewFooter = () => {
  return (
    <footer className="int-main-footer">
      <div className="container">
        <div className="footer-right right">
          <span>Strategic Partner</span>
          <a href="#" className="logo-main">
            <EvuemeImageTag
              imgSrc={image.brandEvuemeStrategicPartnerLogo}
              altText="brand-logo"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default InterviewFooter;
