import { PulseLoader } from "react-spinners";
import { useGlobalContext } from "../../context";

const EvuemeTextLoader = ({ text, loaderClassName = "" }) => {
  const { rootColor } = useGlobalContext();
  return (
    <div className="text-loader-overlay">
      <div className={`text-loader ${loaderClassName}`}>
        <p>{text}</p>
        <PulseLoader
          color={rootColor.primary}
          loading={true}
          size={5}
          aria-label="Pulsing text loader"
        />
      </div>
    </div>
  );
};

export default EvuemeTextLoader;
