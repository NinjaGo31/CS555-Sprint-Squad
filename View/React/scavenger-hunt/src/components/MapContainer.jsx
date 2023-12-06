import FilterHuntFom from "./FilterHuntFom";
import { RandomAvatar } from "react-random-avatars";

function MapContainer(props) {
  return (
    <div className="mapContainer">
      <nav>
        <RandomAvatar name={props.charecterCreation.userName} size={25} />
        <p>{props.charecterCreation.userName}</p>
        <p
          onClick={() => {
            window.location.reload(false);
          }}
        >
          logout
        </p>
      </nav>
      {props.children}
      {props.newUser && (
        <FilterHuntFom
          charecterCreation={props.charecterCreation}
          dispatchFn={props.dispatchFn}
        />
      )}
    </div>
  );
}

export default MapContainer;
