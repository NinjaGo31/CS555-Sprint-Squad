import { useState ,useEffect} from "react";
import LandingPage from "./landingPage";
import Map from "./Map";
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
const App = () => {
  const [isValidLogin, setValidLogin] = useState(false);
  const [isValidSignUp, setValidSignup] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [resetToken, setResetToken] = useState(null);
  // Effect to check for the reset password token in the URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/resetPassword/')) {
      const token = path.split('/resetPassword/')[1];
      if (token) {
        setResetToken(token);
        setCurrentPage('resetPassword');
      }else {
        setCurrentPage('landing');
        window.history.pushState({}, '', '/');
      }
    }
  }, []);

  function handleLogin() {
    setValidLogin(true);
  }
  function handleSignup() {
    setValidSignup(true);
  }
  function handleForgotPassword() {
    setCurrentPage('forgotPassword');
  }

  function handleResetPassword(token) {
    setCurrentPage('resetPassword');
  }
  function onResetSuccess() {
    setCurrentPage('landing');
    window.history.pushState({}, '', '/');
  }
  if(isValidLogin || isValidSignUp){
    return    <Map />
  }
  switch (currentPage) {
    case 'landing':
      return (
        <LandingPage
          onLogin={handleLogin}
          onSignup={handleSignup}
          onForgotPassword={handleForgotPassword}
          /*onResetPassword={handleResetPassword}*/
        />
      );
    case 'forgotPassword':
      return <ForgotPasswordForm />;
      case 'resetPassword':
        return resetToken ? (
          <ResetPasswordForm token={resetToken} onResetSuccess={onResetSuccess} />
        ) : (
          <div>Loading...</div>
        );
    default:
      return <LandingPage onLogin={handleLogin} onSignup={handleSignup} />;
  }
};
export default App;
