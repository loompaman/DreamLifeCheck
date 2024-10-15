import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSeeMyDreamLife = () => {
    navigate('/storybook');
  };

  return (
    <div className="home-page">
      <div className="content-wrapper">
        <div className="hero-section">
          <h1>See what your Dream Life<br />looks like in Minutes</h1>
          <p>Transform your goals into a reality.</p>
          <button className="cta-button" onClick={handleSeeMyDreamLife}>Create my Dream Life</button>
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
