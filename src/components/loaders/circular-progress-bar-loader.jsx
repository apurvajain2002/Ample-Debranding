import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useGlobalContext } from "../../context";

const CircularProgressBarLoader = ({ className = "", value = "" }) => {
  const { rootColor } = useGlobalContext();
  return (
    <div className={`circluar-progress-bar ${className}`}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathTransitionDuration: 0.5,
          pathColor: rootColor.primary,
          textColor: "black",
          textSize: "1rem",
        })}
      />
    </div>
  );
};

export default CircularProgressBarLoader;
