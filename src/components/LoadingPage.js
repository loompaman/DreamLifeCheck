import React, { useState, useEffect } from 'react';
import '../styles/LoadingPage.css';
import FancyFrame from './FancyFrame';

const LoadingPage = ({ status }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer30s = setTimeout(() => setProgress(25), 30000);
    const timer1m = setTimeout(() => setProgress(50), 60000);
    const timer1m30s = setTimeout(() => setProgress(75), 90000);
    const timer2m = setTimeout(() => setProgress(100), 120000);

    return () => {
      clearTimeout(timer30s);
      clearTimeout(timer1m);
      clearTimeout(timer1m30s);
      clearTimeout(timer2m);
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
