import React, { useState } from "react";
import { History, MapComponent } from "./components";
import MenuIcon from "@mui/icons-material/Menu";
import "./styles/App.css";
import Card from "./components/Card";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface LatLngLiteral extends google.maps.LatLngLiteral {}

const App: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState<LatLngLiteral>({
    lat: -1.939826787816454,
    lng: 30.0445426438232,
  });
  const [endingPoint, setEndingPoint] = useState<LatLngLiteral>({
    lat: -1.9365670876910166,
    lng: 30.13020167024439,
  });
  const [stops, setStops] = useState<LatLngLiteral[]>([
    { lat: -1.9355377074007851, lng: 30.060163829002217 },
    { lat: -1.9358808342336546, lng: 30.08024820994666 },
    { lat: -1.9489196023037583, lng: 30.092607828989397 },
    { lat: -1.9592132952818164, lng: 30.106684061788073 },
    { lat: -1.9487480402200394, lng: 30.126596781356923 },
  ]);

  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);

  // This function will be called from the new <Map> component to update the state
  const handlePointsChange = (
    newStartingPoint: LatLngLiteral,
    newEndingPoint: LatLngLiteral,
    newStops: LatLngLiteral[]
  ) => {
    setStartingPoint(newStartingPoint);
    setEndingPoint(newEndingPoint);
    setStops(newStops);
  };

  const toggleControls = () => {
    setIsCardVisible(!isCardVisible);
  }

  return (
    <>
      <div className="container">
        <div className="nav">
          <div className="burger-icon">
            <MenuIcon style={{ fontSize: "30px", color: "white" }} />
          </div>
          <button type="button" className="toggler" onClick={toggleControls}>
            <span>
              {isCardVisible ? "Hide" : "Show"} controls
            </span>
            {isCardVisible ? (
              <KeyboardArrowDownIcon className="" />
            ) : (
              <KeyboardArrowRightIcon className="" />
            )}
          </button>
          <h3>Startup</h3>
        </div>

        {isCardVisible && (
          <Card
            onPointsChange={handlePointsChange}
            startingPoint={startingPoint}
            endingPoint={endingPoint}
            stops={stops}
          />
        )}
      </div>
      <MapComponent
        startingPoint={startingPoint}
        stops={stops}
        endingPoint={endingPoint}
      />
    </>
  );
};

export default App;
