import { image } from "../../components/assets/assets";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EntitySignupSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    if (countdown === 0) {
      navigate('/signin');
      localStorage.clear();
    }

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="registration-su-wr">
      <h3>Registration Completed</h3>
      <div className="img-rewr">
        <EvuemeImageTag
          imgSrc={image.entitySignupSuccess}
          altText={"Image representing, entity signup is successful!"}
        />
      </div>
      <p className="succ-text">You have successfully completed the process.</p>
      <p>A company representative will soon get in touch with you.</p>
      <p className="redirect-message">Redirecting to Sign-in Page in {countdown} seconds...</p>
    </div>
  );
};

export default EntitySignupSuccess;
