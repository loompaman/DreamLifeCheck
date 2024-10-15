import React, { useState, useEffect } from 'react';
import '../styles/LoadingPage.css';
import FancyFrame from './FancyFrame';

const LoadingPage = ({ status }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer10s = setTimeout(() => setProgress(25), 10000);
    const timer30s = setTimeout(() => setProgress(50), 30000);
    const timer45s = setTimeout(() => setProgress(75), 45000);
    const timer1m = setTimeout(() => setProgress(100), 60000);

    return () => {
      clearTimeout(timer10s);
      clearTimeout(timer30s);
      clearTimeout(timer45s);
      clearTimeout(timer1m);
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
