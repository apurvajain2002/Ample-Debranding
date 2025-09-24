import { image } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { useGlobalContext } from "../../context";

const EntitySignupScreenImage = () => {
  const { rootColor } = useGlobalContext();
  return (
    <div className="col xl4 l4 m4 s12">
      <header className="logo-bg login-left-header">
        <EvuemeImageTag
          imgSrc={rootColor.logoUrl}
          altText={'image'}
        />
      </header>
      <figure className="ev-login-carector">
        <EvuemeImageTag
          imgSrc={image.entitySignupPageImage}
          altText={image.entitySignupPageImage}
        />
      </figure>
      <footer className="login-footer">
        <ul className="valign-wrapper">
          <li>Strategic Partner:</li>
          <li>
            <EvuemeImageTag
              imgSrc={image.brandEvuemeStrategicPartnerLogo}
              altText={'image'}
            />
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default EntitySignupScreenImage;
