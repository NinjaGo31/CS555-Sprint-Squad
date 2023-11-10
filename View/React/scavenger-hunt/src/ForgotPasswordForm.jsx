import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSuccess(false); // Reset success state on new submission
    setErrorMessage(''); // Reset error state on new submission
    // Make API call to backend for sending reset password email
    try {
      const response = await axios.post(
        'http://127.0.0.1:3000/api/v1/users/forgotPassword', 
        { email }
      );
      console.log(response.data);
      // Further actions like notifying the user can be done here
      if (response.data.status === 'success') {
        setIsSuccess(true);
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      //console.error(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        setErrorMessage(error.response.data.message);
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage('No response was received from the server.');
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage(error.message);
        console.error('Error', error.message);
      }
      console.error(error.config);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <div className="form-container">
      {isSuccess ? (
        <div className="success-message">
          {successMessage}
        </div>
      ) : (
        <>
        <form onSubmit={handleSubmit} className="form-box">
          <label htmlFor="email">Email</label>
          {errorMessage && <div className="error-message">{errorMessage}</div>} 
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            /*onChange={(e) => setEmail(e.target.value)}*/
            required
            className="form-input"
          />
          <button type="submit" className="form-button">Send Reset Link</button>
        </form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;