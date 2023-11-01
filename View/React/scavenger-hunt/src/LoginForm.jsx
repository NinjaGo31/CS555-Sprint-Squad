import { useState } from "react";
import axios from "axios";
const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  function changeHandler(e) {
    console.log(e.target.value);
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/users/login",
        formData
      );
      console.log(response.data);
      if (response.data.status === "success") {
        onLogin();
      }
      // if (response.data.status === "success" && response.data.status === 200) {
      //   onLogin(() => {
      //     localStorage.setItem("userToken", `${response.data.token}`);
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label id="userName">User Name</label>
      <input
        className="login-input"
        type="text"
        placeholder="userName"
        value={formData.login}
        name="userName"
        onChange={(e) => {
          changeHandler(e);
        }}
      />
      <label id="password"> Password</label>
      <input
        type="password"
        className="login-input"
        placeholder="password"
        value={formData.password}
        name="password"
        onChange={(e) => {
          changeHandler(e);
        }}
      />
      <button>Submit</button>
    </form>
  );
};

export default LoginForm;
