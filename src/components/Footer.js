import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer custom-footer">
      <div className="footer-content custom-footer-content">
        <div className="footer-left custom-footer-left">
          <p>© 2025 Dream Life Check. All rights reserved.</p>
        </div>
        <div className="footer-right custom-footer-right">
        <p>Enquiries: studylyfe99@gmail.com</p>
          {/* <a href="/" className="footer-link custom-footer-link">Privacy Policy</a>
          <a href="/" className="footer-link custom-footer-link">Terms of Service</a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
