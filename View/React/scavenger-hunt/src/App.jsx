import { useState } from "react";
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
<LandingPage onLogin={handleLogin} onSignup = {handleSignup}/>  );
};
export default App;
