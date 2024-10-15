import React, { useState, useEffect } from 'react';
import '../styles/LoadingPage.css';
import FancyFrame from './FancyFrame';

const LoadingPage = ({ status }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer20s = setTimeout(() => setProgress(25), 20000);
    const timer40s = setTimeout(() => setProgress(50), 40000);
    const timer1m = setTimeout(() => setProgress(75), 60000);
    const timer1m20s = setTimeout(() => setProgress(100), 80000);

    return () => {
      clearTimeout(timer20s);
      clearTimeout(timer40s);
      clearTimeout(timer1m);
      clearTimeout(timer1m20s);
    };
  }, []);

  return (
    <div className="loading-container">
      <FancyFrame>
        <div className="loading-content">
          <h1>Creating Your Dream Life Story</h1>
          <p className="loading-status">{status}</p>
          <div className="loading-wheel"></div>
          <p className="progress-text">{progress}% Complete</p>
        </div>
      </FancyFrame>
    </div>
  );
};

export default LoadingPage;
