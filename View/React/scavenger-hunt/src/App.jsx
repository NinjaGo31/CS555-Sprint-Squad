import { useState } from "react";
import LandingPage from "./landingPage";
import Map from "./Map";
const App = () => {
  const [isValidLogin, setValidLogin] = useState(false);
  const [isValidSignUp, setValidSignup] = useState(false);

  console.log(isValidSignUp);
  function handleLogin() {
    setValidLogin(true);
  }
  function handleSignup() {
    setValidSignup(true);
  }
  return (
    <>

      {(!isValidLogin ||  !isValidSignUp) && <LandingPage onLogin={handleLogin} onSignup = {handleSignup}/>}

      {isValidLogin && <Map />}
      {isValidSignUp && <Map />}


    </>
  );
};
export default App;
