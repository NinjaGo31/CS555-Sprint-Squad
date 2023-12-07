import React, { useState, useEffect } from "react";
import FilterHuntFom from "./FilterHuntFom";
import { RandomAvatar } from "react-random-avatars";

function MapContainer(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoggedIn(true);
    };

    fetchUserStatus();
  }, []);

  return (
    <div className="mapContainer">
      <nav>
        {isLoggedIn && <RandomAvatar name={props.charecterCreation.userName} size={25} />}
        <p>{props.charecterCreation.userName}</p>
        <p
          onClick={() => {
            setIsLoggedIn(false);
          }}
          // NOSONAR
        >
          {isLoggedIn ? "logout" : "Login"}
        </p>
      </nav>
      {props.children}
      {props.newUser && (
        <FilterHuntFom
          charecterCreation={props.charecterCreation}
          dispatchFn={props.dispatchFn}
        />
      )}
      <div>
        <h2>Recent Activities</h2>
        <ul>
          <li>Added new filters</li>
          <li>Improved map rendering</li>
          <li>Optimized code for better performance</li>
        </ul>
      </div>
      {props.showAdditionalContent && <div>Additional Content</div>}
    </div>
  );
}

export default MapContainer;
