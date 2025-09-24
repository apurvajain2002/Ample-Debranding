import DeviceCheckingStepper from "./components/DeviceCheckingStepper";
import internetSpeed from "../../resources/images/interview-rounds/image-table/internetspeed.svg";
import cameraIconCheck from "../../resources/images/interview-rounds/image-table/camera-icon-check.svg";
import soundCheck from "../../resources/images/invited-candidate/sound-check.svg";
import webBrowserIcon from "../../resources/images/interview-rounds/image-table/web-browser-icon.svg";
// import checkLight from "../../resources/images/invited-candidate/checklight.svg";

const DEVICE_CHECKING_STEPS = [
  {
    id: "camera",
    name: "Check camera",
    imgSrc: cameraIconCheck,
  },
  {
    id: "microphone",
    name: "Check mic",
    imgSrc: soundCheck,
  },
  {
    id: "browser",
    name: "Check browser",
    imgSrc: webBrowserIcon,
  },
  {
    id: "bandwidth" || "connection",
    name: "Check internet speed",
    imgSrc: internetSpeed,
  },
  // {
  //   name: "Check light",
  //   imgSrc: checkLight
  // }
];

const DeviceChecking = ({ onFinish = () => {} }) => {
  return (
    <DeviceCheckingStepper
      stepsConfig={DEVICE_CHECKING_STEPS}
      onFinish={onFinish}
    />
  );
};

export default DeviceChecking;
