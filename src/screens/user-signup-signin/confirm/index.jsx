import SinginPageImage from "..";
import ConfirmEmail from "./confirm-email";

const Confirm = () => {
  return (
    <div className="container full-height valign-wrapper row-relative">
      <div className="row">
        <SinginPageImage />
        <ConfirmEmail />
      </div>
    </div>
  );
};

export default Confirm;
