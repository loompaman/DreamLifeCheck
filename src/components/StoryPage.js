import React, { useState, useEffect } from 'react';
import '../styles/StoryPage.css';

const StoryPage = ({ chapters, userName }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    // Preload images
    chapters.forEach((chapter, index) => {
      const img = new Image();
      img.src = chapter.imageUrl;
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
      };
    });

    // Load Tally script
    const script = document.createElement('script');
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [chapters]);

  useEffect(() => {
    if (typeof window.Tally !== 'undefined') {
      window.Tally.loadEmbeds();
    }
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < chapters.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleButtonClick = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  if (!chapters || chapters.length === 0) {
    return <div>Loading story...</div>;
  }

  const currentChapter = chapters[currentPage] || { title: '', content: '' };

  const popupContents = {
    steps: (
      <>
        <h2>Actionable Steps to Achieve Your Dream Life</h2>
        <p>Here are some example actionable steps:</p>
        <ul>
          <li>Career: Apply to 3 job positions in your dream field within the next 30 days.</li>
          <li>Finance: Save 15% of your monthly income for the next 6 months towards your dream home down payment.</li>
          <li>Health: Exercise for 30 minutes, 5 days a week for 2 months, tracking progress with a fitness app.</li>
        </ul>
        <p><strong>We'll provide tailored actionable steps for you based on your goals. If you are interested, please fill in the form at the bottom of the page.</strong> </p>
      </>
    ),
    affirmations: (
      <>
        <h2>Daily Affirmations</h2>
        <p>Here are 3 example affirmations to help you achieve your dream life:</p>
        <ol>
          <li>I am capable of creating the life of my dreams, and I take action every day to make it a reality.</li>
          <li>I embrace challenges as opportunities for growth and learning on my path to success.</li>
          <li>My potential is limitless, and I have the power to achieve anything I set my mind to.</li>
        </ol>
        <p><strong>If you are interested in getting tailored affirmations to help you achieve your goals, please fill in the form at the bottom of the page.</strong></p>
      </>
    ),
    reminders: (
      <>
        <h2>Daily Motivation and Goal Reminders</h2>
        <p>Stay on track with personalized daily reminders:</p>
        <ul>
          <li>Motivational messages tailored to your goals</li>
          <li>Daily task reminders to track progress</li>
          <li>Choose email or text notifications</li>
          <li>Customize reminder time and frequency</li>
        </ul>
        <p>These reminders will help you stay focused, break down goals, maintain motivation, and celebrate progress.</p>
        <p><strong>Coming soon!</strong> Fill out the form below to be notified when this feature launches.</p>
      </>
    ),
    video: (
      <>
        <h2>Turn Your Dream Life into a Video</h2>
        <p>We'll create a personalized video showcasing your dream life based on your goals:</p>
        <ul>
          <li>Custom visuals of your dream life</li>
          <li>Narration highlighting your aspirations</li>
          <li>Inspiring background music</li>
        </ul>
        <p>Use the video to stay motivated, share your vision, and visualize your goals daily.</p>
        <p><strong>Coming soon!</strong> Fill out the form below to be notified when this feature launches.</p>
      </>
    ),
    talkToFutureSelf: (
      <>
        <h2>Letter from Your Future Dream Self</h2>
        <p>Receive a personalized letter from your future self who has achieved all your dreams. This letter will provide motivation, guidance, and insights on your journey.</p>
        <p>The letter may include:</p>
        <ul>
          <li>Reflections on achieving your dreams</li>
          <li>Advice for your present self</li>
          <li>Challenges overcome and lessons learned</li>
          <li>Values and priorities that guided your success</li>
        </ul>
        <p><strong>Coming soon!</strong> Fill out the form below to be notified when this feature launches.</p>
      </>
    ),
  };

  return (
    <div className="story-container">
      <h1 className="story-title">{userName}'s Dream Life Story</h1>
      <div className="story-book">
        <div className="pages-container">
          <div className="page image-page">
            <div className="page-content image-content">
              {currentPage < chapters.length ? (
                loadedImages[currentPage] ? (
                  <img 
                    src={currentChapter.imageUrl} 
                    alt={`Chapter`} 
                  />
                ) : (
                  <div className="loading-image">Loading image...</div>
                )
              ) : (
                <div className="empty-page">
                  <p>Now that you've seen what your dream life looks like, it's time to make it a reality.</p>
                  <p>Thank you for reading!</p>
                </div>
              )}
            </div>
          </div>
          <div className="page text-page">
            <div className="page-content">
              {currentPage < chapters.length ? (
                <>
                  <h2 className="chapter-title">
                    Chapter {currentPage + 1}: {currentChapter.title || 'Untitled'}
                  </h2>
                  <div className="chapter-content">
                    {currentChapter.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-page final-page">
                  <h3 className="future-features">More features coming soon:</h3>
                  <div className="final-page-buttons">
                    <button className="final-page-button" onClick={() => handleButtonClick('steps')}>
                      🎯 Actionable Steps
                    </button>
                    <button className="final-page-button" onClick={() => handleButtonClick('affirmations')}>
                      🌟 Daily Affirmations
                    </button>
                    <button className="final-page-button" onClick={() => handleButtonClick('talkToFutureSelf')}>
                      ✉️ Letter from Future Self
                    </button>
                    <button className="final-page-button" onClick={() => handleButtonClick('reminders')}>
                      ⏰ Daily Goal Reminders
                    </button>
                    <button className="final-page-button" onClick={() => handleButtonClick('video')}>
                      🎥 Create My Dream Life Video
                    </button>
                  </div>
                  <h4 className="get-access-text">Get first access to these features:</h4>
                  <div className="tally-form-container">
                    <iframe 
                      data-tally-src="https://tally.so/embed/3qKeQd?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
                      loading="lazy" 
                      width="100%" 
                      height="300" 
                      frameBorder="0" 
                      marginHeight="0" 
                      marginWidth="0" 
                      title="DreamLifeCheck"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="navigation-buttons">
        <button onClick={prevPage} disabled={currentPage === 0}>Previous</button>
        <span>Page {currentPage + 1} of {chapters.length + 1}</span>
        <button onClick={nextPage} disabled={currentPage === chapters.length}>Next</button>
      </div>
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>&times;</button>
            {popupContent && popupContents[popupContent]}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPage;
