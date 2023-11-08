import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State for error message
  const { token } = useParams();
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (setter) => (e) => {
    setErrorMessage(''); // Clear error message when user starts typing
    setter(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords don't match");
      return;
    }
    if (password.trim().length < 8 || passwordConfirm.trim().length<8) {
        setErrorMessage("Password must be at least 8 characters and without spaces");
        return;
      }
    setErrorMessage('');
    
    try {
      const response = await axios.patch(`http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`, {
        password,
        passwordConfirm
      });
      console.log(response.data);
      if (response.data.status === 'success') {
        navigate('/login');
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : error.message);
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange(setPassword)}
          required
          className="form-input"
        />
        <label htmlFor="passwordConfirm">Confirm New Password</label>
        <div className="password-input-container">
          <input
            type={isRevealPassword ? "text" : "password"}
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={handlePasswordChange(setPasswordConfirm)}
            required
            className="form-input"
          />
          <button
            type="button"
            className="toggle-password-visibility"
            onClick={() => setIsRevealPassword(prevState => !prevState)}
          >
            {isRevealPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button type="submit" className="form-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
