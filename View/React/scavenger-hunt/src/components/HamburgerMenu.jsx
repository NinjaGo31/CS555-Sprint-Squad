import { useState } from "react";

function HamburgerMenu(props) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  function toggleHamburger() {}
  return (
    <div class="container" onclick={setHamburgerOpen((s) => !s)}>
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div>
  );
}

export default HamburgerMenu;
