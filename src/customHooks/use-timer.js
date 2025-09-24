import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = ({ initVal }) => {
  const [timer, setTimer] = useState(initVal);
  const pauseRef = useRef(false);

  const pause = useCallback(() => {
    pauseRef.current = true;
  }, []);

  const unpause = useCallback(() => {
    pauseRef.current = false;
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      if (pause.current === true) return;
      setTimer((prev) => {
        if (prev <= 1) {
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    timer,
    setTimer,
    pauseTimer: pause,
    unpauseTimer: unpause,
  };
};
