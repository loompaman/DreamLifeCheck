import React, { useState } from 'react';
import '../styles/StorybookPage.css';
import FancyFrame from '../components/FancyFrame';
import LoadingPage from '../components/LoadingPage';
import StoryPage from '../components/StoryPage';

const StorybookPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [storyGenerated, setStoryGenerated] = useState(false);
  const [storyChapters, setStoryChapters] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [inputType, setInputType] = useState('questions');
  const [formData, setFormData] = useState({
    appearance: '',
    career: '',
    work_environment: '',
    home: '',
    morning_routine: '',
    hobbies: '',
    relationships: '',
    travel: '',
    personal_growth: '',
    impact: '',
    evening_routine: '',
    freeform_appearance: '',
    freeform_goals: '',
    full_name: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine which fields to check based on the input type
    const fieldsToCheck = inputType === 'questions'
      ? ['appearance', 'career', 'work_environment', 'home', 'morning_routine', 'hobbies', 'relationships', 'travel', 'personal_growth', 'impact', 'evening_routine', 'full_name', 'email']
      : ['freeform_appearance', 'freeform_goals', 'full_name', 'email'];

    // Check if all required fields are filled
    const emptyFields = fieldsToCheck.filter(field => !formData[field].trim());
    if (emptyFields.length > 0) {
      alert(`Please fill in all fields for the ${inputType === 'questions' ? 'Answer Questions' : 'Freeform Input'} section.`);
      return;
    }

    setIsLoading(true);
    setLoadingStatus('Generating your dream life story...');

    const dataToSend = { 
      answers: fieldsToCheck.reduce((obj, key) => ({ ...obj, [key]: formData[key] }), {}),
      inputType 
    };

    try {
      const response = await fetch('https://dreamlifecheck-backend.vercel.app/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { story, images } = await response.json();

      if (Array.isArray(story)) {
        setStoryChapters(story.map((chapter, index) => ({
          ...chapter,
          imageUrl: images[index] || 'https://example.com/placeholder-image.jpg'
        })));
        setStoryGenerated(true);
      } else {
        throw new Error('Generated story is not an array');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      alert(`An error occurred while generating the story: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage status={loadingStatus} />;
  }

  if (storyGenerated) {
    return <StoryPage chapters={storyChapters} userName={formData.full_name} />;
  }

  return (
    <div className="page-background">
      <div className="content-wrapper">
        <FancyFrame>
          <div className="storybook-content">
            <h1>Dream Life Storybook</h1>
            <p className="storybook-description">
              Create your dream life story. Choose how you'd like to describe your goals:
            </p>
            <div className="input-type-selector">
              <button 
                className={`input-type-button ${inputType === 'questions' ? 'active' : ''}`}
                onClick={() => setInputType('questions')}
              >
                Answer Questions
              </button>
              <button 
                className={`input-type-button ${inputType === 'freeform' ? 'active' : ''}`}
                onClick={() => setInputType('freeform')}
              >
                Freeform Input
              </button>
            </div>
            <form onSubmit={handleSubmit} className="story-form">
              {inputType === 'questions' ? (
                <>
                  <h2>Your Appearance</h2>
                  <div className="form-group">
                    <label htmlFor="appearance">Describe your race and gender (this will be used for image generation):</label>
                    <textarea 
                      id="appearance" 
                      name="appearance" 
                      rows="2" 
                      value={formData.appearance}
                      onChange={handleInputChange}
                      placeholder="e.g., I'm an Asian female, or I'm a Black male."
                      required
                    ></textarea>
                  </div>
                  <h2>Your Dream Life</h2>
                  <div className="form-group">
                    <label htmlFor="career">What's your dream career?</label>
                    <input 
                      type="text" 
                      id="career" 
                      name="career" 
                      value={formData.career}
                      onChange={handleInputChange}
                      placeholder="e.g., Successful entrepreneur" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="work_environment">Describe your ideal work environment:</label>
                    <textarea 
                      id="work_environment" 
                      name="work_environment" 
                      rows="3" 
                      value={formData.work_environment}
                      onChange={handleInputChange}
                      placeholder="e.g., Modern office with a view, or working from exotic locations"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="home">What does your dream home look like?</label>
                    <textarea 
                      id="home" 
                      name="home" 
                      rows="3" 
                      value={formData.home}
                      onChange={handleInputChange}
                      placeholder="e.g., Spacious beachfront villa with a garden"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="morning_routine">Describe your ideal morning routine:</label>
                    <textarea 
                      id="morning_routine" 
                      name="morning_routine" 
                      rows="3" 
                      value={formData.morning_routine}
                      onChange={handleInputChange}
                      placeholder="e.g., Early yoga session, healthy breakfast, reading"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="hobbies">What hobbies or activities do you enjoy in your free time?</label>
                    <textarea 
                      id="hobbies" 
                      name="hobbies" 
                      rows="3" 
                      value={formData.hobbies}
                      onChange={handleInputChange}
                      placeholder="e.g., Painting, playing guitar, scuba diving"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="relationships">What do your ideal relationships look like?</label>
                    <textarea 
                      id="relationships" 
                      name="relationships" 
                      rows="3" 
                      value={formData.relationships}
                      onChange={handleInputChange}
                      placeholder="e.g., Happily married with a supportive family and close friends"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="travel">Where do you travel and how often?</label>
                    <textarea 
                      id="travel" 
                      name="travel" 
                      rows="3" 
                      value={formData.travel}
                      onChange={handleInputChange}
                      placeholder="e.g., Exploring a new country every month, annual family vacations"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="personal_growth">What are your personal growth goals?</label>
                    <textarea 
                      id="personal_growth" 
                      name="personal_growth" 
                      rows="3" 
                      value={formData.personal_growth}
                      onChange={handleInputChange}
                      placeholder="e.g., Learning a new language, mastering meditation"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="impact">How do you make a positive impact on the world?</label>
                    <textarea 
                      id="impact" 
                      name="impact" 
                      rows="3" 
                      value={formData.impact}
                      onChange={handleInputChange}
                      placeholder="e.g., Running a charitable foundation, mentoring young entrepreneurs"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="evening_routine">Describe your ideal evening routine:</label>
                    <textarea 
                      id="evening_routine" 
                      name="evening_routine" 
                      rows="3" 
                      value={formData.evening_routine}
                      onChange={handleInputChange}
                      placeholder="e.g., Family dinner, relaxing with a book, stargazing"
                      required
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="freeform_appearance">Describe your race and gender (this will be used for image generation):</label>
                    <textarea 
                      id="freeform_appearance" 
                      name="freeform_appearance" 
                      rows="2" 
                      value={formData.freeform_appearance}
                      onChange={handleInputChange}
                      placeholder="Describe your race and gender, e.g., I'm a Hispanic female, or I'm a White male."
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="freeform_goals">What goals do you want to achieve in your dream life?</label>
                    <textarea 
                      id="freeform_goals" 
                      name="freeform_goals" 
                      rows="15" 
                      value={formData.freeform_goals}
                      onChange={handleInputChange}
                      placeholder="List all the goals you want to achieve in your dream life. These can include career aspirations, personal development, relationships, lifestyle changes, travel plans, impact on society, etc. Separate each goal with a new line."
                      required
                    ></textarea>
                  </div>
                </>
              )}
              <h2>Your Information</h2>
              <div className="form-group">
                <label htmlFor="full_name">Full Name:</label>
                <input 
                  type="text" 
                  id="full_name" 
                  name="full_name" 
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="submit-container">
                <button type="submit" className="submit-button">Create My Dream Life</button>
              </div>
            </form>
          </div>
        </FancyFrame>
      </div>
    </div>
  );
};

export default StorybookPage;