import { useCallback, useEffect, useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPause, setIsPause] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  

  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      setAudioUrl('');
      setAudioBlob(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        recorderRef.current = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/mp3',
          recorderType: RecordRTC.StereoAudioRecorder,
          desiredSampRate: 16000,
        });
        recorderRef.current.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing audio devices:', error);
      }
    }
  };


  const pauseRecording = () =>{
    if(!isPause && recorderRef.current){
      recorderRef.current.pauseRecording();
      setIsPause(true);
    }
  };

  const resumeRecording = () =>{
    if(isPause && recorderRef.current) {
      recorderRef.current.resumeRecording();
      setIsPause(false);
    }
  }

  const stopRecording = (cb = () => {}) => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        let blob = recorderRef.current.getBlob();
        let url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        if(typeof cb==='function') {
          cb(blob, url);
        }
  
      });
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsPause(false);
      setIsRecording(false);
    }
  };

  const discardAudio = () => {
      setAudioUrl('');
      setAudioBlob(null);
  }
  return {
    audioUrl,
    audioBlob,
    isRecording,
    startRecording,
    pauseRecording,
    resumeRecording,
    isPause,
    discardAudio,
    streamRef,
    stopRecording
  };
}
export default useAudioRecorder;
