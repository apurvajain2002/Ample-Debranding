import brandLogo from "../../../resources/images/interview-rounds/images/brand-logo.svg";
import phoneIcon from "../../../resources/images/interview-rounds/images/phone-icon-phone.svg";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import Tooltip from "../../miscellaneous/tooltip";
import { useGlobalContext } from "../../../context";

const AdminHeader2 = () => {
  const { rootColor } = useGlobalContext();
  return (
    <header className="int-header">
      <aside className="col xl8 l8 m6 s12">
        <div className="logo-brand">
          <EvuemeImageTag imgSrc={rootColor.logoUrl} altText="BrandLogo" />
        </div>
      </aside>
      <aside className="col xl4 l4 m6 s12">
        <ul className="suppor-ul">
          <li>Support</li>
          <li>
            <EvuemeImageTag imgSrc={phoneIcon} altText="Contact Support" />
          </li>
          <li>9341 555 666</li>
          <i className="show-details infermation-ico-black" style={{ padding: "0" }}>
            i
            <Tooltip divTagCssClasses={"infbox-click-header information-box-header"}>
              <p>
                If you face any technical issues during the process, feel free call us at 9341 555
                666 (8 AM - 9 PM)
              </p>
            </Tooltip>
          </i>
        </ul>
      </aside>
    </header>
  );
};

export default AdminHeader2;
