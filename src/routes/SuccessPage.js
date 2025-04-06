import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPaymentAndGenerateStory = async () => {
      try {
        // Verify the payment session and get the form data
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        const { formData } = await response.json();
        
        // Redirect to StorybookPage with the form data
        navigate('/storybook', { 
          state: { 
            verified: true,
            formData: formData
          }
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to verify payment. Please contact support.');
      }
    };

    if (sessionId) {
      verifyPaymentAndGenerateStory();
    }
  }, [sessionId, navigate]);

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <LoadingPage status="Verifying payment...\nPreparing to generate your story" />;
};

export default SuccessPage; 