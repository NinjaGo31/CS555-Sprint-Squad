import HamburgerMenu from "./HamburgerMenu";

function MapContainer(props) {
  return (
    <div className="mapContainer">
      <nav>
        <p>User name</p>
        <p>Current scavenger hunt name</p>
        <HamburgerMenu/>
      </nav>
      {props.children}
    </div>
  );
}

export default MapContainer;
