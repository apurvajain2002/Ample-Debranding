import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { icon } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";

function capitalizeFLetter(string) {
  let res = string
    ?.split("-")
    .reduce(
      (acc, cur) => (acc += " " + cur[0].toUpperCase() + cur.slice(1)),
      ""
    );
  return res;
}

const BreadCrome = () => {
  const location = useLocation();

  const breadcromeValuesArray = location.pathname.split("/").slice(2);
  const breadcromeValue = breadcromeValuesArray.reduce((acc, cur, index) => {
    if (index === 0) {
      acc += capitalizeFLetter(cur);
    } else {
      acc += " > " + capitalizeFLetter(cur);
    }
    return acc;
  }, "");

  return (
    <ul className="breadcrome-wr ">
      <li>
        <Link to={`/admin`}>
          <i>
            <EvuemeImageTag
              className={"margin-right-5"}
              imgSrc={icon.homeIcon}
              altText={"go to home page"}
            />
          </i>{" "}
          Home
        </Link>
      </li>
      <li>{breadcromeValue}</li>
    </ul>
  );
};

export default BreadCrome;
