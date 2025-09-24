import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../context";
import { image } from "../../assets/assets";

const AdminFooter = () => {
  const [footerHeight, setFooterHeight] = useState(0);
  const { rootColor } = useGlobalContext()
  const calculateFooterHeight = async () => {
    const windowHeight = window.innerHeight;
    const htmlHeight = document.documentElement.scrollHeight;
    const newHeight = windowHeight - htmlHeight;
    await setFooterHeight(newHeight > 0 ? newHeight : 72);
  };

  useEffect(() => {
    // Calculate footer height on mount and window resize
    calculateFooterHeight();
    window.addEventListener("resize", calculateFooterHeight);

    return () => {
      window.removeEventListener("resize", calculateFooterHeight); // Cleanup listener
    };
  }, []);

  return (
    <footer className="main-footer">
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

export default AdminFooter;
