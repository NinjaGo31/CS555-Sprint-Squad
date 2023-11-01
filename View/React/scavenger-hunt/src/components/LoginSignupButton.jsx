import "./button.css";
const LoginSignupButton = ({ btnText, clickHandler }) => {
  return (
    <>
      <button
        onClick={() => {
          clickHandler((s) => !s);
        }}
      >
        {btnText}
      </button>
    </>
  );
};
export default LoginSignupButton;
