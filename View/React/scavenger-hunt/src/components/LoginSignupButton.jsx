import "./button.css";
const LoginSignupButton = ({ btnText, clickHandler ,setModalOpen}) => {
  return (
    <>
      <button
        onClick={() => {
          clickHandler((s) => !s);
          // setModalOpen((s)=>!s)
        }}
      >
        {btnText}
      </button>
    </>
  );
};
export default LoginSignupButton;
