import UserSignUpSignInImage from "..";
import SignupForm from "./signup-form";

const SignupPage = () => {
  return (
    <div className="container full-height valign-wrapper row-relative">
      <div className="row">
        <UserSignUpSignInImage />
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
