import React from 'react';
import '../styles/LoadingPage.css';
import FancyFrame from './FancyFrame';

const LoadingPage = ({ status }) => {
  return (
    <div className="loading-container">
      <FancyFrame>
        <div className="loading-content">
          <h1>Creating Your Dream Life Story</h1>
          <p>{status}</p>
          <div className="loading-wheel"></div>
        </div>
      </FancyFrame>
    </div>
  );
};

export default LoadingPage;
