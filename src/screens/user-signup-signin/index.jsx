import { image } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { useGlobalContext } from "../../context";

const UserSignUpSignInImage = () => {

  const { rootColor } = useGlobalContext()

  return (
    <div className="col s12 xl6 l6 m6">
      <header className="logo-bg login-left-header">
        <EvuemeImageTag
          imgSrc={rootColor?.logoUrl}
          altText={"brand-logo"}
        />
      </header>
      <figure className="ev-login-carector">
        <EvuemeImageTag
          imgSrc={image.userSignupSigninPageImage}
          altText={"signin-page-image"}
        />
      </figure>
      <footer className="login-footer">
        <ul className="valign-wrapper">
          <li>Strategic Partner:</li>
          <li>
            <EvuemeImageTag
              imgSrc={image.brandEvuemeStrategicPartnerLogo}
              altText={"brand-logo"}
            />
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default UserSignUpSignInImage;
