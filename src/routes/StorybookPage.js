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
      const response = await fetch('https://dreamlifecheck.pages.dev/api/generate-story', {
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
    <div className="storybook-page">
      <div className="content-wrapper">
        <FancyFrame>
          <div className="storybook-content">
            <h1>Dream Life Storybook</h1>
            <p>Create your dream life story. Choose how you'd like to describe your goals:</p>
            {/* Input type selector buttons */}
            <form onSubmit={handleSubmit} className="story-form">
              {/* Your form fields */}
            </form>
          </div>
        </FancyFrame>
      </div>
    </div>
  );
};

export default StorybookPage;
