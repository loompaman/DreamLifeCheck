import React from 'react';
import '../styles/FancyFrame.css';

const FancyFrame = ({ children }) => (
  <div className="fancyFrame">
    <div className="fancyFrameContainer">
      <div className="fancyFrameCorner top-left"></div>
      <div className="fancyFrameCorner top-right"></div>
      <div className="fancyFrameCorner bottom-left"></div>
      <div className="fancyFrameCorner bottom-right"></div>
      <div className="fancyFrameContents">
        {children}
      </div>
    </div>
  </div>
);

export default FancyFrame;
