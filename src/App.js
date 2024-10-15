import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './routes/HomePage';
import StorybookPage from './routes/StorybookPage';
import './App.css';
import ReactGA from 'react-ga';

function App() {
  useEffect(() => {
    ReactGA.initialize('G-23B2G0CQKQ'); // Replace with your Measurement ID
  }, []);

  return (
    <Router>
      <TrackPageView />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/storybook" element={<StorybookPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, [location]);

  return null;
};

export default App;
