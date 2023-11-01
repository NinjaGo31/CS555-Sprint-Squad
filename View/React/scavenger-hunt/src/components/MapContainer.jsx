function MapContainer(props) {
  return (
    <div className="mapContainer">
      <nav></nav>
      {props.children}
    </div>
  );
}

export default MapContainer;
