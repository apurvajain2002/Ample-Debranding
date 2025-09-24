import { useState, useRef } from 'react';

const useStreamCamera = ({ durationInMinutes = 1, timeBased = true }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsStreaming(true);

      const durationInMillis = durationInMinutes * 1000;
      if (timeBased) {
        timerRef.current = setTimeout(() => {
          stopStream();
        }, durationInMillis);
      }
    } catch (error) {
      console.error('Error accessing webcam: ', error);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsStreaming(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    videoRef,
    startStreaming,
    stopStream,
    isStreaming,
  };
};

export default useStreamCamera;
