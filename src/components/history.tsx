import "../styles/History.css";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";

interface LocationWithName {
  name: string;
  location: google.maps.LatLngLiteral;
}

export interface SavedRoute {
  startingPoint: LocationWithName;
  endingPoint: LocationWithName;
  stops: LocationWithName[];
}

interface HistoryProps {
  setIsCardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHistoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onRouteSelect: (
    newStartingPoint: LocationWithName,
    newEndingPoint: LocationWithName,
    newStops: LocationWithName[]
  ) => void;
}

function History({ onRouteSelect, setIsCardVisible, setIsHistoryVisible }: HistoryProps) {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>(
    getSavedRoutes()
  );

  const handleRouteSelect = (route: SavedRoute) => {
    onRouteSelect(route.startingPoint, route.endingPoint, route.stops);
    setIsCardVisible(true);
    setIsHistoryVisible(false)
  };

  const handleDelete = (index: number) => {
    const updatedRoutes = [...savedRoutes];
    updatedRoutes.splice(index, 1); // Remove the route at the given index
    setSavedRoutes(updatedRoutes); // Update state
    localStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes)); // Update localStorage
  };

  return (
    <div className="history-card">
      <h3>Your saved entries</h3>
      <div className="entries">
        {savedRoutes.length > 0 ? (
          savedRoutes.map((route, index) => (
            <div key={"history - " + index} className="saved-route">
              <div className="left">
                <span>{index + 1}. </span>
                <span className="route">
                  {route.startingPoint.name} - {route.endingPoint.name}
                </span>
              </div>
              <div className="right">
                <button onClick={() => handleRouteSelect(route)}>
                  <ArrowForwardIosOutlinedIcon />
                </button>
                <button onClick={() => handleDelete(index)} className="delete">
                  <DeleteOutlinedIcon />
                </button>
              </div>
            </div>
          ))
        ) : (
          <span>No entries found</span>
        )}
      </div>
    </div>
  );
}

function getSavedRoutes(): SavedRoute[] {
  const savedData = localStorage.getItem("savedRoutes");
  if (savedData) {
    // Check if the saved data is an array or a single object
    const parsedData = JSON.parse(savedData);
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else {
      // If it's a single object, wrap it in an array
      return [parsedData];
    }
  }
  return [];
}

export default History;
