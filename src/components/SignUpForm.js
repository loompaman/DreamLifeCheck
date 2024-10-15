import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/AuthForms.css';

const SignUpForm = ({ onClose, switchToSignIn, onSuccessfulAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      if (data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        alert('Check your email for the confirmation link!');
        onClose();
        onSuccessfulAuth();
      }
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-form-overlay" onClick={handleOverlayClick}>
      <div className="auth-form">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Create an account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label htmlFor="displayName">Display Name*</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email address*</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password*</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="continue-button">Continue</button>
        </form>
        <p className="auth-switch">
          Already have an account? <button onClick={switchToSignIn}>Login</button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
