import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {

  return (
    <div className="home-page">
      <div className="content-wrapper">
        <div className="hero-section">
          <h1>Dream Life Storybook Generator</h1>
          <p>See what your dream life looks like in minutes.</p>
          <Link to="/storybook" className="create-dream-life-button">
            Create My Dream Life
          </Link>
        </div>
        <div className="stats-section">
          <div className="stat-item">
            <h2>80</h2>
            <p>Dreams Created</p>
          </div>
          <div className="stat-item">
            <h2>6,500</h2>
            <p>*Happy* Tears Shed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
