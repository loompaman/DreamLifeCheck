import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/AuthForms.css';

const SignInForm = ({ onClose, switchToSignUp, onSuccessfulAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      onClose();
      onSuccessfulAuth();
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
        <h2>Welcome back</h2>
        <form onSubmit={handleSignIn}>
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
          Don't have an account? <button onClick={switchToSignUp}>Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
