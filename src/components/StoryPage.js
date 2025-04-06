import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import '../styles/StoryPage.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const openStripeLink = () => {
    window.open('https://buy.stripe.com/cN25mY2Rn7dj6hW6ov', '_blank', 'noopener,noreferrer');
  };

  const openFutureSelfLink = () => {
    window.open('https://buy.stripe.com/28odTu4Zvapv9u8cMV', '_blank', 'noopener,noreferrer');
  };

  const openActionableStepsLink = () => {
    window.open('https://buy.stripe.com/dR6aHieA5btzgWA6ow', '_blank', 'noopener,noreferrer');
  };

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
        <button 
          onClick={openActionableStepsLink} 
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: 'linear-gradient(145deg, #51b354, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(76, 175, 80, 0.2)'
          }}
        >
          Get Personalized Steps →
        </button>
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
        <button 
          onClick={openFutureSelfLink} 
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: 'linear-gradient(145deg, #51b354, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(76, 175, 80, 0.2)'
          }}
        >
          Get a Letter from your Future Self →
        </button>
      </>
    ),
  };

  const downloadPDF = async () => {
    try {
      // Configure PDF options
      const opt = {
        margin: 0,
        filename: `${userName}'s_Dream_Life_Story.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 1200,
          windowHeight: 800
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape'
        }
      };

      // Create a new PDF document
      const pdf = new jsPDF(opt.jsPDF);
      
      // Function to add a page to the PDF
      const addPageToPDF = async (element) => {
        const canvas = await html2canvas(element, opt.html2canvas);
        const imgData = canvas.toDataURL('image/jpeg', opt.image.quality);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      };

      // Create a temporary container for pages
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      try {
        // Add title page
        const titlePage = document.createElement('div');
        titlePage.style.width = '1200px';
        titlePage.style.height = '800px';
        titlePage.style.background = 'white';
        titlePage.style.display = 'flex';
        titlePage.style.justifyContent = 'center';
        titlePage.style.alignItems = 'center';
        
        const titleContent = document.createElement('h1');
        titleContent.style.fontSize = '48px';
        titleContent.style.color = '#00244c';
        titleContent.style.textAlign = 'center';
        titleContent.textContent = `${userName}'s Dream Life Story`;
        
        titlePage.appendChild(titleContent);
        container.appendChild(titlePage);
        await addPageToPDF(titlePage);
        container.innerHTML = '';

        // Add each chapter page
        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];
          
          // Create a story book page
          const storyBook = document.createElement('div');
          storyBook.className = 'story-book';
          storyBook.style.width = '1200px';
          storyBook.style.height = '800px';
          storyBook.style.background = '#00244c';
          storyBook.style.padding = '12px';
          storyBook.style.borderRadius = '15px';
          storyBook.style.display = 'flex';

          const pagesContainer = document.createElement('div');
          pagesContainer.className = 'pages-container';
          pagesContainer.style.display = 'flex';
          pagesContainer.style.flex = '1';
          pagesContainer.style.gap = '20px';

          // Image page
          const imagePage = document.createElement('div');
          imagePage.className = 'page image-page';
          imagePage.style.flex = '1';
          imagePage.style.background = 'white';
          imagePage.style.borderRadius = '5px';
          imagePage.style.display = 'flex';
          imagePage.style.justifyContent = 'center';
          imagePage.style.alignItems = 'center';
          imagePage.style.padding = '15px';

          const img = document.createElement('img');
          img.src = chapter.imageUrl;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          img.style.objectFit = 'contain';
          imagePage.appendChild(img);

          // Text page
          const textPage = document.createElement('div');
          textPage.className = 'page text-page';
          textPage.style.flex = '1';
          textPage.style.background = 'white';
          textPage.style.borderRadius = '5px';
          textPage.style.padding = '15px';

          const chapterTitle = document.createElement('h2');
          chapterTitle.className = 'chapter-title';
          chapterTitle.style.textAlign = 'center';
          chapterTitle.style.color = '#00244c';
          chapterTitle.style.fontSize = '22px';
          chapterTitle.style.marginBottom = '15px';
          chapterTitle.textContent = `Chapter ${i + 1}: ${chapter.title}`;
          textPage.appendChild(chapterTitle);

          const content = document.createElement('div');
          content.className = 'chapter-content';
          chapter.content.split('\n').forEach(paragraph => {
            if (paragraph.trim()) {
              const p = document.createElement('p');
              p.style.fontSize = '16px';
              p.style.color = '#5a3e2b';
              p.style.lineHeight = '1.5';
              p.style.marginBottom = '15px';
              p.textContent = paragraph.trim();
              content.appendChild(p);
            }
          });
          textPage.appendChild(content);

          pagesContainer.appendChild(imagePage);
          pagesContainer.appendChild(textPage);
          storyBook.appendChild(pagesContainer);
          container.appendChild(storyBook);

          await addPageToPDF(storyBook);
          if (i < chapters.length - 1) {
            pdf.addPage();
          }
          container.innerHTML = '';
        }

        // Add final page
        const finalStoryBook = document.createElement('div');
        finalStoryBook.className = 'story-book';
        finalStoryBook.style.width = '1200px';
        finalStoryBook.style.height = '800px';
        finalStoryBook.style.background = '#00244c';
        finalStoryBook.style.padding = '12px';
        finalStoryBook.style.borderRadius = '15px';
        finalStoryBook.style.display = 'flex';

        const finalContent = document.createElement('div');
        finalContent.style.flex = '1';
        finalContent.style.background = 'white';
        finalContent.style.borderRadius = '5px';
        finalContent.style.padding = '40px';
        finalContent.style.display = 'flex';
        finalContent.style.flexDirection = 'column';
        finalContent.style.alignItems = 'center';
        finalContent.style.justifyContent = 'center';
        finalContent.style.textAlign = 'center';

        const finalMessage = document.createElement('p');
        finalMessage.style.fontSize = '20px';
        finalMessage.style.color = '#4CAF50';
        finalMessage.style.marginBottom = '20px';
        finalMessage.textContent = "Now that you've seen what your dream life looks like, it's time to make it real.";

        const thankYou = document.createElement('p');
        thankYou.style.fontSize = '18px';
        thankYou.style.color = '#333';
        thankYou.textContent = "Thank you for reading!";

        finalContent.appendChild(finalMessage);
        finalContent.appendChild(thankYou);
        finalStoryBook.appendChild(finalContent);
        
        container.appendChild(finalStoryBook);
        pdf.addPage();
        await addPageToPDF(finalStoryBook);

        // Save the PDF
        pdf.save(`${userName}'s_Dream_Life_Story.pdf`);
      } finally {
        // Clean up
        document.body.removeChild(container);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    }
  };

  return (
    <div className="story-container">
      <h1 className="story-title">{userName}'s Dream Life Story</h1>
      <button onClick={downloadPDF} className="download-pdf-button">
        Download as PDF 📄
      </button>
      <div className="story-book">
        <div className="pages-container">
          <div className="page image-page">
            <div className="page-content image-content">
              {currentPage < chapters.length ? (
                loadedImages[currentPage] ? (
                  <img 
                    src={currentChapter.imageUrl} 
                    alt="Chapter"
                  />
                ) : (
                  <div className="loading-image">Loading image...</div>
                )
              ) : (
                <div className="empty-page">
                  <p>Now that you've seen what your dream life looks like, it's time to make it real.</p>
                  <p>Thank you for reading!</p>
                  <br></br>
                  <button className="final-page-button" onClick={openStripeLink}>
                    📖 Create a more detailed Storybook
                    </button>
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
                  <h3 className="future-features">Other features:</h3>
                  <div className="final-page-buttons">
                    <button className="final-page-button" onClick={() => handleButtonClick('steps')}>
                      <div>
                        🎯 Actionable Steps
                        <div style={{ 
                          fontSize: '0.85em', 
                          fontWeight: 'normal',
                          fontStyle: 'italic',
                          marginTop: '5px',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                          Get specific actionable steps based on your goals.
                        </div>
                      </div>
                    </button>
                    <button className="final-page-button" onClick={() => handleButtonClick('talkToFutureSelf')}>
                      <div>
                        ✉️ Letter from Future Self
                        <div style={{ 
                          fontSize: '0.85em', 
                          fontWeight: 'normal',
                          fontStyle: 'italic',
                          marginTop: '5px',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                          Receive a personalized letter from your future self who has achieved all your dreams.
                        </div>
                      </div>
                    </button>
                  </div>
                  <h4 className="get-access-text">More features coming soon...</h4>
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
