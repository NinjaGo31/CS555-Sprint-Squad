import { useEffect, useState } from "react";
import axios from "axios";
const LoginForm = ({ onLogin,onForgotPassword }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [submit, setSubmit] = useState(false);
  function changeHandler(e) {
    console.log(e.target.value);
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  }
  useEffect(() => {
    if (submit) {
      (async () => {
        const response = await axios.post(
          "http://127.0.0.1:3000/api/v1/users/login",
          formData
        );
        console.log(response.data);
        if (response.data.status === "success") {
          onLogin();
        }
      })();
    }
  }, [submit]);
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmit((c) => !c);
  }
  return (
    <form onSubmit={handleSubmit}>
      <label id="userName">User Name</label>
      <input
        className="login-input"
        type="text"
        // id="userName"
        // placeholder="Username"
        value={formData.login}
        name="userName"
        onChange={(e) => {
          changeHandler(e);
        }}
      />
      <label id="password">Password</label>
      <input
        type="password"
        className="login-input"
        // id="password"
        // placeholder="Password"
        value={formData.password}
        name="password"
        onChange={changeHandler}
      />
      <button type="submit">Submit</button>
      <button type="button" className="forgot-password-link" onClick={onForgotPassword}>Forgot Password?</button>
    </form>
  );
};

export default LoginForm;
