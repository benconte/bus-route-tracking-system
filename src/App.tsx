import React, { useState } from "react";
import { History, MapComponent } from "./components";
import MenuIcon from "@mui/icons-material/Menu";
import "./styles/App.css";
import Card from "./components/Card";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface LatLngLiteral extends google.maps.LatLngLiteral {}

interface LocationWithName {
  name: string;
  location: LatLngLiteral;
}

const App: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState<LocationWithName>({
    name: "Nyabugogo",
    location: { lat: -1.939826787816454, lng: 30.0445426438232 },
  });
  const [endingPoint, setEndingPoint] = useState<LocationWithName>({
    name: "Kimironko",
    location: { lat: -1.9365670876910166, lng: 30.13020167024439 },
  });
  const [stops, setStops] = useState<LocationWithName[]>([
    {
      name: "Remera",
      location: { lat: -1.9355377074007851, lng: 30.060163829002217 },
    },
    {
      name: "Gisimenti",
      location: { lat: -1.9358808342336546, lng: 30.08024820994666 },
    },
    {
      name: "Kacyiru",
      location: { lat: -1.9489196023037583, lng: 30.092607828989397 },
    },
    {
      name: "Gishushu",
      location: { lat: -1.9592132952818164, lng: 30.106684061788073 },
    },
    {
      name: "Kisementi",
      location: { lat: -1.9487480402200394, lng: 30.126596781356923 },
    },
  ]);

  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);

  // This function will be called from the new <Map> component to update the state
  const handlePointsChange = (
    newStartingPoint: LocationWithName,
    newEndingPoint: LocationWithName,
    newStops: LocationWithName[]
  ) => {
    setStartingPoint(newStartingPoint);
    setEndingPoint(newEndingPoint);
    setStops(newStops);
  };

  const toggleControls = () => {
    setIsCardVisible(!isCardVisible);
  };

  const toggleHistory = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  return (
    <>
      <div className="container">
        <div className="nav">
          <div className="burger-icon" onClick={toggleHistory}>
            <MenuIcon />
          </div>
          <button type="button" className="toggler" onClick={toggleControls}>
            <span>{isCardVisible ? "Hide" : "Show"} controls</span>
            {isCardVisible ? (
              <KeyboardArrowDownIcon className="" />
            ) : (
              <KeyboardArrowRightIcon className="" />
            )}
          </button>
          <h3>Startup</h3>
        </div>

        {isHistoryVisible && (
          <History
            onRouteSelect={handlePointsChange}
            setIsCardVisible={setIsCardVisible}
            setIsHistoryVisible={setIsHistoryVisible}
          />
        )}

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
        startingPoint={startingPoint.location}
        endingPoint={endingPoint.location}
        stops={stops.map((stop) => stop.location)}
      />
    </>
  );
};

export default App;
