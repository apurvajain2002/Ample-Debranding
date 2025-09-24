import { useState } from 'react';

const useCaptureImage = () => {

  const [imageFile, setImageFile] = useState(null);

  const clickPicture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Convert to File
      const file = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const file = new File([blob], 'snapshot.png', { type: 'image/png' });
          resolve(file);
        }, 'image/png');
      });
      setImageFile(file);
      // Clean up stream
      stream.getTracks().forEach((track) => track.stop());
      return file;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  };

  return {
    imageFile: imageFile ? URL.createObjectURL(imageFile) : null,
    clickPicture,
  };
};

export default useCaptureImage;