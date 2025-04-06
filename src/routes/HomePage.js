import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {

  return (
    <div className="home-page">
      <div className="content-wrapper">
        <div className="hero-section">
          <h1>See Your Dream Life, Today</h1>
          <p>AI generated storybook about your dream life</p>
          <Link to="/storybook" className="create-dream-life-button">
            Create My Dream Life
          </Link>
        </div>
        <div className="stats-section">
          <div className="stat-item">
            <h2>802+</h2>
            <p>Storybooks Created</p>
          </div>
          <div className="stat-item">
            <h2>countless</h2>
            <p>*Happy* Tears Shed</p>
          </div>
        </div>
        <div className="showcase-section">
          <div className="high-volume-banner">
            <p>🔥 We're experiencing <span>high volume</span> right now! 🔥</p>
          </div>
          <h2>What others have created:</h2>
          <div className="showcase-container">
            <div className="showcase-item">
              <img src="/first.png" alt="Example 1" className="showcase-image" />
              <p>A day in the life of a successful entrepreneur</p>
            </div>
            <div className="showcase-item">
              <img src="/second.png" alt="Example 2" className="showcase-image" />
              <p>Living the dream in a beachfront villa</p>
            </div>
            <div className="showcase-item">
              <img src="/third.png" alt="Example 3" className="showcase-image" />
              <p>Building a legacy through philanthropy</p>
            </div>
            <div className="showcase-item">
              <img src="/fourth.png" alt="Example 4" className="showcase-image" />
              <p>Creating innovative solutions for tomorrow</p>
            </div>
            <div className="showcase-item">
              <img src="/fifth.png" alt="Example 5" className="showcase-image" />
              <p>Exploring the world with loved ones</p>
            </div>
            <div className="showcase-item">
              <img src="/first.png" alt="Example 1" className="showcase-image" />
              <p>A day in the life of a successful entrepreneur</p>
            </div>
            <div className="showcase-item">
              <img src="/second.png" alt="Example 2" className="showcase-image" />
              <p>Living the dream in a beachfront villa</p>
            </div>
            <div className="showcase-item">
              <img src="/third.png" alt="Example 3" className="showcase-image" />
              <p>Building a legacy through philanthropy</p>
            </div>
            <div className="showcase-item">
              <img src="/fourth.png" alt="Example 4" className="showcase-image" />
              <p>Creating innovative solutions for tomorrow</p>
            </div>
            <div className="showcase-item">
              <img src="/fifth.png" alt="Example 5" className="showcase-image" />
              <p>Exploring the world with loved ones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
