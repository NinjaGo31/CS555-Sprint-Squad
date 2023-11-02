import { useState } from "react";
import axios from "axios";

const SignupForm = ({ onSignup , onLogin}) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({});

  function changeHandler(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function validateForm() {
    const errors = {};
    if (!formData.userName.trim()) {
      errors.userName = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      try {
        console.log(formData)
        const response = await axios.post(
          "http://127.0.0.1:3000/api/v1/users/signup",
          formData
        );
        console.log(response.data);
        if (response.data.status === "success") {
          onSignup();
          onLogin();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label id="userName">User Name</label>
      <input
        className="login-input"
        type="text"
        id="userName"
        name="userName"
        // placeholder="Username"
        value={formData.userName}
        onChange={(e) => {
          changeHandler(e);
        }}
        // className="form-input"
      />
      {errors.userName && <span className="error-message">{errors.userName}</span>}
      <label id="email">Email</label>
      <input
        className="login-input"
        type="text"
        id="email"
        name="email"
        // placeholder="Email"
        value={formData.email}
        onChange={(e) => {
          changeHandler(e);
        }}
        // className="form-input"
      />
      {errors.email && <span className="error-message">{errors.email}</span>}
      <label id="password">Password</label>
      <input
        className="login-input"
        type="password"
        id="password"
        name="password"
        // placeholder="Password"
        value={formData.password}
        onChange={(e) => {
          changeHandler(e);
        }}
      // className="form-input"
      />
      {errors.password && <span className="error-message">{errors.password}</span>}
      <label id="passwordConfirm">Confirm Password</label>
      <input
        type="password"
        id="passwordConfirm"
        name="passwordConfirm"
        // placeholder="Confirm Password"
        value={formData.passwordConfirm}
        onChange={(e) => {
          changeHandler(e);
        }}
        className="login-input"
      />
      {errors.passwordConfirm && (
        <span className="error-message">{errors.passwordConfirm}</span>
      )}
      <button className="submit-button">Sign Up</button>
    </form>

  );
};

export default SignupForm;
