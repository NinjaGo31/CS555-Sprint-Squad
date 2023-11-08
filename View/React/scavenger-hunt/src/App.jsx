import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from './ResetPasswordForm';
import LandingPage from "./landingPage";
import Map from "./Map";
const App = () => {
  const [isValidLogin, setValidLogin] = useState(false);
  const [isValidSignUp, setValidSignup] = useState(false);

  function handleLogin() {
    setValidLogin(true);
  }
  function handleSignup() {
    setValidSignup(true);
  }

  if(isValidLogin || isValidSignUp){
    return    <Map />
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onLogin={handleLogin} onSignup={handleSignup} />} />
        <Route path="/map" element={<Map />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/forgotPassword" element={<ForgotPasswordForm />} />
        <Route path="/resetPassword/:token" element={<ResetPasswordForm />} />
      </Routes>
    </Router>
  );
};
export default App;
