import { image } from "./../../../components/assets/assets.jsx";
import "../../../styles/style.css";

import { useNavigate } from "react-router-dom";
const UserInfo = ({ userData }) => {

  const navigate = useNavigate();
  const handleEditButton = () => {
    navigate("/user/editProfile", { state: userData });
  };

  const {
    firstName, lastName, primaryEmailId, username,
    mobileNumber1, mobileNumber2, whatsappNumber,
    currentLocation, noticePeriod, dateOfBirth,
    currentCTC, higherEducation,
  } = userData || {}

  return (
    <div className="row row-margin">
      <aside className="col xl2 l2 m2 s12">
        <div className="candnamewr">
          <div className="img-cand">
            <img src={image.candImage} alt="" />
          </div>
          <h3>{`${firstName} ${lastName}` || 'N/A'}</h3>
          <p>{primaryEmailId || username || 'N/A'}</p>
        </div>
      </aside>
      <aside className="col xl7 l7 m7q s12">
        <div className="row">
          <div className="leftside-det col xl-10 l10 m10 s12">
            <ul>
              <li>
                <span>Mobile No</span>
                <p>{mobileNumber1 || mobileNumber2 || 'N/A'}</p>
              </li>
              <li>
                <span>WhatsApp No</span>
                <p>{whatsappNumber || 'N/A'}</p>
              </li>
              <li>
                <span>Highest Degree</span>
                <p>{higherEducation || 'N/A'}</p>
              </li>
              <li>
                <span>Current Org.</span>
                <p>{currentLocation || 'N/A'}</p>
              </li>
            </ul>
            <ul>
              <li>
                <span>Notice Period</span>
                <p>{noticePeriod || 'N/A'}</p>
              </li>
              <li>
                <span>Date of birth</span>
                <p>{dateOfBirth || 'N/A'}</p>
              </li>
              <li>
                <span>Current Designation</span>
                <p>{higherEducation || 'N/A'}</p>
              </li>
              <li>
                <span>Current CTC</span>
                <p>{currentCTC || 'N/A'}</p>
              </li>
            </ul>
            <ul className="socialbox-ul">
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="22"
                    viewBox="0 0 18 22"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_64_101)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.19759 2.29481H4.0691V4.17469H2.83075C2.27759 4.17469 1.81953 4.63907 1.81953 5.19891V19.2408C1.81953 19.8015 2.27505 20.265 2.83075 20.265H15.1692C15.725 20.265 16.1805 19.8028 16.1805 19.2408V5.19891C16.1805 4.63649 15.7224 4.17469 15.1692 4.17469H13.9309V2.29481H16.8024C17.4613 2.29481 18 2.8439 18 3.50779V20.787C18 21.4518 17.4587 22 16.8024 22H1.19759C0.541274 22 0 21.4544 0 20.787V3.50779C0 2.84046 0.538726 2.29481 1.19759 2.29481ZM9 16.3156H4.72288C4.65325 16.3156 4.59637 16.2585 4.59637 16.1875C4.59637 16.151 4.60146 16.1153 4.61038 16.0792C4.81288 14.453 5.64283 14.4242 6.53604 14.1881C6.80307 14.1172 7.29 13.9671 7.57358 13.7155C7.72896 13.5767 7.82406 13.4073 7.78627 13.203C7.57019 13.0005 7.40462 12.7816 7.36684 12.3637L7.34137 12.3641C7.28108 12.3633 7.22335 12.3495 7.16943 12.3185C7.05057 12.2502 6.98519 12.1186 6.95377 11.9685C6.91387 11.7789 6.92703 11.554 6.94656 11.4113L6.95377 11.3838C6.99538 11.2664 7.04675 11.2027 7.11212 11.1752L7.11382 11.1744C7.0841 10.6098 7.17835 9.71543 6.60566 9.54C7.73575 8.12536 9.03906 7.35612 10.0172 8.61425C11.1074 8.6723 11.5934 10.2998 10.9167 11.1752H10.8879C10.9533 11.2027 11.0046 11.2664 11.0462 11.3838L11.0534 11.4113C11.073 11.554 11.0861 11.7789 11.0462 11.9685C11.0148 12.1186 10.9494 12.2502 10.8306 12.3185C10.7767 12.3495 10.7189 12.3633 10.6586 12.3641L10.6332 12.3637C10.5954 12.7816 10.4298 13.0005 10.2137 13.203C10.1759 13.4073 10.271 13.5767 10.4264 13.7155C10.71 13.9671 11.1969 14.1172 11.464 14.1881C12.3572 14.4242 13.1871 14.453 13.3896 16.0792C13.3985 16.1153 13.4036 16.151 13.4036 16.1875C13.4036 16.2585 13.3467 16.3156 13.2771 16.3156H9ZM5.72816 1.69413H7.08538C7.2 0.738708 7.96118 0 8.88453 0C9.80151 0 10.5589 0.728819 10.6816 1.67392L12.2701 1.69413C12.3814 1.69413 12.4701 1.78399 12.4701 1.89622V4.64122C12.4701 4.75301 12.3814 4.84331 12.2701 4.84331H5.72986C5.62118 4.84331 5.53033 4.75301 5.53033 4.64122V1.89622C5.52821 1.78399 5.61736 1.69413 5.72816 1.69413ZM8.14118 2.52528C8.26387 2.69555 8.43962 2.86325 8.62557 2.94967C8.77755 2.99568 8.94354 2.99998 9.09807 2.95741C9.3392 2.84519 9.5608 2.57516 9.66311 2.34899C9.67542 2.28492 9.68349 2.2187 9.68349 2.14647C9.68349 1.6679 9.32137 1.27962 8.87434 1.27962C8.42774 1.27962 8.06604 1.6679 8.06604 2.14647C8.06816 2.29094 8.09363 2.41908 8.14118 2.52528Z"
                        fill="#B99750"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_64_101">
                        <rect width="18" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_64_110)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.35728 4.82145H8.32124V6.34095H8.36413C8.77688 5.60044 9.7862 4.82145 11.2913 4.82145C14.4211 4.82145 14.9999 6.76918 14.9999 9.30296V14.4643H11.9089V9.88899C11.9089 8.7983 11.8861 7.39425 10.3016 7.39425C8.69216 7.39425 8.4455 8.58155 8.4455 9.80954V14.4643H5.35726V4.82145H5.35728ZM3.21439 2.14289C3.21439 3.03012 2.49437 3.75014 1.60714 3.75014C0.719915 3.75014 -0.000366211 3.03012 -0.000366211 2.14289C-0.000366211 1.25567 0.719915 0.535645 1.60714 0.535645C2.49437 0.535645 3.21439 1.25567 3.21439 2.14289ZM-0.000366211 4.82145H3.21439V14.4643H-0.000366211V4.82145Z"
                        fill="#B99750"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_64_110">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_64_112)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.49972 0.186857C3.35843 0.186857 0 3.54472 0 7.68655C0 11.0004 2.1487 13.8107 5.12873 14.8029C5.50383 14.8724 5.64169 14.6398 5.64169 14.4416C5.64169 14.2628 5.63421 13.672 5.63116 13.0459C3.54448 13.4996 3.1046 12.1606 3.1046 12.1606C2.76354 11.2936 2.27189 11.063 2.27189 11.063C1.59145 10.5971 2.32366 10.6073 2.32366 10.6073C3.07662 10.6599 3.47304 11.3797 3.47304 11.3797C4.14241 12.5263 5.22811 12.1944 5.6558 12.0031C5.72334 11.5184 5.91712 11.1873 6.13193 10.9999C4.46599 10.8108 2.71481 10.1675 2.71481 7.29346C2.71481 6.47488 3.00825 5.80553 3.48743 5.28065C3.40938 5.09132 3.15248 4.32894 3.55969 3.2961C3.55969 3.2961 4.18945 3.0943 5.62287 4.06485C6.2208 3.89903 6.8622 3.81543 7.49918 3.81266C8.13668 3.81543 8.7792 3.89875 9.37798 4.06485C10.8094 3.09487 11.4386 3.2961 11.4386 3.2961C11.8464 4.32923 11.5906 5.09214 11.5126 5.28067C11.9934 5.80553 12.2844 6.47488 12.2844 7.29346C12.2844 10.1741 10.5293 10.8074 8.85975 10.9932C9.12884 11.2257 9.36912 11.6822 9.36912 12.3815C9.36912 13.3844 9.36054 14.1927 9.36054 14.4394C9.36054 14.639 9.49563 14.8724 9.87598 14.7992C12.8543 13.8066 15.0003 10.996 15.0003 7.68405C15.0003 3.54276 11.6424 0.184326 7.50028 0.184326L7.49974 0.186834L7.49972 0.186857Z"
                        fill="#B99750"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_64_112">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_64_114)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.7333 10.3226H13.2V16H0V10.3226H1.46667V14.5807H11.7333V10.3226Z"
                        fill="#B99750"
                      />
                      <path
                        d="M3.06507 9.90065L10.2684 11.3658L10.5712 9.97227L3.36787 8.50646L3.06507 9.90065ZM4.01827 6.56272L10.6911 9.5702L11.3127 8.27872L4.63973 5.27123L4.01827 6.56272ZM5.86467 3.39459L11.5217 7.95343L12.4639 6.85859L6.8068 2.29988L5.86467 3.39459ZM9.51627 0.0247803L8.33493 0.875103L12.728 6.59123L13.9093 5.74104L9.51627 0.0247803ZM2.93335 13.1613H10.2667V11.7419H2.93335V13.1613Z"
                        fill="#B99750"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_64_114">
                        <rect width="14" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_64_118)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.90626 2.81252H11.2498V0H8.90626C7.09721 0 5.62533 1.47187 5.62533 3.28092V4.68717H3.75012V7.5H5.62477V15H8.43758V7.5H10.7812L11.2498 4.6872H8.43758V3.28092C8.43758 3.02679 8.65212 2.81227 8.90623 2.81227V2.81255L8.90626 2.81252Z"
                        fill="#B99750"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_64_118">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <div className="col xl2 l2 m2 s12">
            <div className="barcode-wr">
              <img src={image.vectorImage} alt="" />
            </div>
          </div>
        </div>
      </aside>
      <aside className="col xl3 l3 m3 s12">
        <div className="scoregraph-wr cand-statusround">
          <div className="multigraph problemsolvergraph">
            <span className="graph">40%</span>
            <span className="scorepoint"></span>
          </div>
        </div>
        <div className="combox-right">
          <h4>Complete Your Profile</h4>
          <button
            className="btn btn-porpel btn-golden waves-effect waves-light"
            onClick={handleEditButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
            >
              <g clip-path="url(#clip0_134_242)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.03627 0.179076C7.91227 0.0573314 7.76958 -0.0080169 7.60991 0.000934927C7.45024 0.000934927 7.30755 0.0662832 7.19204 0.197875L6.25013 1.22823L8.889 3.91646L9.8394 2.86731C9.95491 2.74556 9.99907 2.58622 9.99907 2.41793C9.99907 2.24963 9.93707 2.09029 9.82156 1.9775L8.03627 0.179076ZM3.51954 9.80945C3.17302 9.93119 2.818 10.044 2.47062 10.1657C2.12409 10.2875 1.77757 10.4092 1.4217 10.531C0.595302 10.8121 0.14176 10.9714 0.0440876 10.9991C-0.0535853 11.0269 0.00841575 10.625 0.213104 9.7817L0.870485 7.13106L0.924842 7.07198L3.52039 9.80766L3.51954 9.80945ZM1.88543 6.02014L5.5367 2.00793L8.17556 4.68632L4.48013 8.75492L1.88543 6.02014Z"
                  fill="#C8C8C8"
                />
              </g>
              <defs>
                <clipPath id="clip0_134_242">
                  <rect width="10" height="11" fill="white" />
                </clipPath>
              </defs>
            </svg>{" "}
            Edit Here
          </button>
        </div>
      </aside>
    </div>
  );
};
export default UserInfo;