import { useState } from "react";
import LoginSignupButton from "./components/LoginSignupButton";
import LoginForm from "./LoginForm";
import "./App.css";
import Modal from "./components/Modal";
import SignupForm from "./SignupForm";

const LandingPage = ({ onLogin , onSignup,setModalOpen,onForgotPassword,onResetPassword}) => {
  const [loginformShow, setLoginFormShow] = useState(false);
  const [signUpFormShow, signUpSetFormShow] = useState(false);
  return (
    <div className={`container`}>
      <h1 className="title">Scavenger Hunt</h1>
      <h2 className="subTitle">
        Unlock the Town Mysteries Scavenge, Solve, Succeed!
      </h2>
      <div className="login_signup">
        <LoginSignupButton btnText={"Log In"} clickHandler={setLoginFormShow} />
        <LoginSignupButton
          btnText={"Sign Up"}
          clickHandler={signUpSetFormShow}
        />
      </div>
      {loginformShow && (
        <Modal >
          <LoginForm onLogin={onLogin} onForgotPassword={onForgotPassword} onResetPassword ={onResetPassword}/>
        </Modal>
      )}
      {
        signUpFormShow && (
          <Modal>
            <SignupForm onSignup={onSignup} onLogin={onLogin}/>
          </Modal>
        )
      }
      <img className="landingImg" src="src\assets\landingPageImage.png" />
      {/* {loginformShow && <LoginForm />} */}
      {/* {formShow && <Form />} */}
    </div>
  );
};
export default LandingPage;
