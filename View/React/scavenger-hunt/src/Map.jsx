import {
  GoogleMap,
  useLoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import axios from 'axios';
import MapContainer from "./components/MapContainer";
function Map(props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
  });
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <MapContainer>
      <RenderMap />
    </MapContainer>
  );
}

function RenderMap(props) {
  const [scavengerHunts, setScavengerHunts] = useState([]);
  const [loc, setLoc] = useState({
    coords: { latitude: 40.744838, longitude: -74.025683 },
  });
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };

  const dummyLocations = [
    { latitude: 40.745255, longitude: -74.034775 },
    { latitude: 41.745255, longitude: -74.034775 },
    { latitude: 39.745255, longitude: -74.034775 },
  ];

  useEffect(() => {
    const successCallback = (position) => {
      console.log(position)
      setLoc(position);
    };

    const errorCallback = (error) => {
      // console.log(error);
    };

    const geoWatcher = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(geoWatcher);
    };
  }, []);
  const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2),
  });
  dummyLocations.forEach((dummy) => {
    if (
      dummy.latitude === loc.coords.latitude &&
      dummy.longitude === loc.coords.longitude
    ) {
      console.log("reached the hunting ground");
    }
  });
/*Adding  ode to fetch the scavenger data */
async function fetchScavengerHunts() {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/v1/scavengerHunt');
    setScavengerHunts(response.data.data.users);
  } catch (error) {
    console.error("Failed to fetch scavenger hunts", error);
  }
}

fetchScavengerHunts();
  return (
    <div style={{ position: "relative" }}>
      <GoogleMap
        zoom={16.8}
        center={{ lat: loc.coords.latitude, lng: loc.coords.longitude }}
        mapContainerClassName="display-map"
        options={{
          mapId: "c6341e5cd2c8ccc4",
          disableDefaultUI: true,
          tilt: 60,
          heading: 15,
          minZoom: 16.9,
          maxZoom: 16.9,
        }}
      >
        <Marker
          position={{ lat: loc.coords.latitude, lng: loc.coords.longitude }}
        />
        <OverlayView
          position={{ lat: loc.coords.latitude, lng: loc.coords.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={getPixelPositionOffset}
        >
          <div className="testing"><p>User icon to be implmented</p></div>
        </OverlayView>
      </GoogleMap>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Legend</h3>
        {
          scavengerHunts.map(hunt => (
            <p key={hunt._id}>{hunt.scavengerName}</p>
          ))
        }
      </div>
    </div>
  );
}

export default Map;
