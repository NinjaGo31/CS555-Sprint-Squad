import { useState } from "react";
import LandingPage from "./landingPage";
import Map from "./Map";
const App = () => {
  const [isValidLogin, setValidLogin] = useState(false);
  console.log(isValidLogin);
  function handleLogin() {
    setValidLogin(true);
  }
  console.log(isValidLogin);
  return (
    <>
      {!isValidLogin && <LandingPage onLogin={handleLogin} />}
      {isValidLogin && <Map />}
    </>
  );
};
export default App;
