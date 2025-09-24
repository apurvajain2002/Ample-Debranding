import { useEffect, useState } from "react";

const CountdownTimer = ({ timer, setTimer, onTimerDone }) => {
	const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    switch (timer) {
			case 50:
				setShowWarning(true);
				setTimeout(() => setShowWarning(false), 3000);
				break;
			case 20:
				setShowWarning(true);
				break;
      case 0:
        setTimer(0);
        setShowWarning(false);
        onTimerDone();
    }
  }, [timer]);

  return (
    <div className="time-container">
      <div className="time-circle-out">
        <span>{timer}</span> Sec
      </div>
      {showWarning ? (
        <>
          <p>Auto-submit</p>
          <p>will happen</p>
        </>
      ) : null}
    </div>
  );
};

export default CountdownTimer;
