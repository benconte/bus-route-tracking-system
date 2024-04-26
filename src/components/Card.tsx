import "../styles/Card.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import useDriverLocation from "../hooks/useDriverLocation";
import { useEffect, useMemo, useState } from "react";
import useEtaToNextStop from "../hooks/use-eta-next-stop";
import { formatDistance, formatDuration } from "../utils/format-utils";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { SavedRoute } from "./history";
import StopInput from "./StopInput";

interface LatLngLiteral extends google.maps.LatLngLiteral {}

interface LocationWithName {
  name: string;
  location: LatLngLiteral;
}

interface NewComponentProps {
  startingPoint: LocationWithName;
  endingPoint: LocationWithName;
  stops: LocationWithName[];
  currentStopIndex: number;
  onPointsChange: (
    newStartingPoint: LocationWithName,
    newEndingPoint: LocationWithName,
    newStops: LocationWithName[]
  ) => void;
}

const Card: React.FC<NewComponentProps> = ({
  startingPoint,
  endingPoint,
  stops,
  onPointsChange,
  currentStopIndex,
}) => {
  const driverLocation = useDriverLocation();

  const nextStop = useMemo(
    () => stops[currentStopIndex],
    [stops, currentStopIndex]
  );
  const memoizedDriverLocation = useMemo(
    () => driverLocation,
    [driverLocation]
  );

  const etaToNextStop = useEtaToNextStop(
    memoizedDriverLocation,
    nextStop.location
  );

  const distanceToNextStop = useMemo(() => {
    if (memoizedDriverLocation && nextStop) {
      return (
        google.maps.geometry.spherical.computeDistanceBetween(
          memoizedDriverLocation,
          nextStop.location
        ) / 1000
      );
    }
    return null;
  }, [memoizedDriverLocation, nextStop]);

  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const savedRoutes = getSavedRoutes();
    const currentRoute = {
      startingPoint,
      endingPoint,
      stops,
    };
    setIsFavorite(
      savedRoutes.some((route) => isRouteEqual(route, currentRoute))
    );
  }, [startingPoint, endingPoint, stops]);

  const handleStartingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isLocation: boolean
  ) => {
    if (isLocation) {
      const [lat, lng] = event.target.value.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        onPointsChange(
          { ...startingPoint, location: { lat, lng } },
          endingPoint,
          stops
        );
      }
    } else {
      const newName = event.target.value;
      onPointsChange({ ...startingPoint, name: newName }, endingPoint, stops);
    }
  };

  const handleEndingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isLocation: boolean
  ) => {
    if (isLocation) {
      const [lat, lng] = event.target.value.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        onPointsChange(
          startingPoint,
          { ...endingPoint, location: { lat, lng } },
          stops
        );
      }
    } else {
      const newName = event.target.value;
      onPointsChange(startingPoint, { ...endingPoint, name: newName }, stops);
    }
  };

  const handleStopChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    isLocationChange: boolean
  ) => {
    event.persist();
    if (isLocationChange) {
      const [lat, lng] = event.target.value.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        const newStop = { ...stops[index], location: { lat, lng } };
        const newStops = [
          ...stops.slice(0, index),
          newStop,
          ...stops.slice(index + 1),
        ];
        onPointsChange(startingPoint, endingPoint, newStops);
      }
    } else {
      const newName = event.target.value;
      const newStop = { ...stops[index], name: newName };
      console.log(newStop)
      const newStops = [
        ...stops.slice(0, index),
        newStop,
        ...stops.slice(index + 1),
      ];
      onPointsChange(startingPoint, endingPoint, newStops);
    }
  };

  const handleAddStop = () => {
    const newStops = [...stops, { name: "", location: { lat: 0, lng: 0 } }];
    onPointsChange(startingPoint, endingPoint, newStops);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = [...stops.slice(0, index), ...stops.slice(index + 1)];
    onPointsChange(startingPoint, endingPoint, newStops);
  };

  const handleFavorite = () => {
    const favorite = {
      startingPoint,
      endingPoint,
      stops,
    };
    const savedRoutes = getSavedRoutes();
    if (!savedRoutes.some((route) => isRouteEqual(route, favorite))) {
      savedRoutes.push(favorite);
      localStorage.setItem("savedRoutes", JSON.stringify(savedRoutes));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="card">
      <div className="left-card">
        <div className="start-end-position">
          <div className="position">
            <span>Start Position name</span>
            <input
              type="text"
              placeholder="Enter starting position name"
              value={startingPoint.name}
              onChange={(event) => handleStartingPointChange(event, false)}
            />
            <span>Start Position (lat, long)</span>
            <input
              type="text"
              placeholder="Enter starting position"
              value={`${startingPoint.location.lat},${startingPoint.location.lng}`}
              onChange={(event) => handleStartingPointChange(event, true)}
            />
          </div>
          <div className="position">
            <span>End Position name</span>
            <input
              type="text"
              placeholder="Enter ending position name"
              value={endingPoint.name}
              onChange={(event) => handleEndingPointChange(event, false)}
            />
            <span>End Position location</span>
            <input
              type="text"
              placeholder="Enter ending position"
              value={`${endingPoint.location.lat},${endingPoint.location.lng}`}
              onChange={(event) => handleEndingPointChange(event, true)}
            />
          </div>
        </div>

        <div className="map-stops">
          <h3>Stops:</h3>
          <div className="stops">
            {stops.map((stop, index) => (
              <div key={index} className="stop">
                <div className="details">
                  <label>
                    Stop {index + 1} name:
                    <StopInput
                      stop={stop}
                      index={index}
                      onStopChange={handleStopChange}
                    />
                  </label>
                  <label>
                    Stop {index + 1} (lat, long):
                    <input
                      type="text"
                      placeholder="Enter stop location"
                      value={`${stop.location.lat},${stop.location.lng}`}
                      onChange={(event) => handleStopChange(index, event, true)}
                    />
                  </label>
                </div>
                <button onClick={() => handleRemoveStop(index)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* handle stops */}
        <button type="button" className="add-btn" onClick={handleAddStop}>
          <AddIcon />
          <span>Add stops</span>
        </button>

        <div className="card-info">
          <h4 className="location">
            {startingPoint.name} - {endingPoint.name}
          </h4>
          <span className="stop">Next stop: {nextStop.name}</span>
          <div className="distance">
            <span>
              Distance:{" "}
              {distanceToNextStop ? formatDistance(distanceToNextStop) : "0"}
            </span>
            <span>
              Time: {etaToNextStop ? formatDuration(etaToNextStop) : "0"}{" "}
              minutes
            </span>
          </div>
        </div>
      </div>
      <div className="bottom-nav">
        <div className="icon" onClick={handleFavorite}>
          {isFavorite ? (
            <FavoriteIcon className="active" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </div>
        <div className="icon">
          <InfoOutlinedIcon />
        </div>
        <div className="icon">
          <NotificationsNoneIcon />
        </div>
      </div>
    </div>
  );
};

function getSavedRoutes(): SavedRoute[] {
  const savedData = localStorage.getItem("savedRoutes");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else {
      return [parsedData];
    }
  }
  return [];
}

function isRouteEqual(route1: SavedRoute, route2: SavedRoute): boolean {
  const areStartPointsEqual =
    route1.startingPoint.name === route2.startingPoint.name &&
    route1.startingPoint.location.lat === route2.startingPoint.location.lat &&
    route1.startingPoint.location.lng === route2.startingPoint.location.lng;

  const areEndPointsEqual =
    route1.endingPoint.name === route2.endingPoint.name &&
    route1.endingPoint.location.lat === route2.endingPoint.location.lat &&
    route1.endingPoint.location.lng === route2.endingPoint.location.lng;

  const areStopsEqual =
    route1.stops.length === route2.stops.length &&
    route1.stops.every(
      (stop, index) =>
        stop.name === route2.stops[index].name &&
        stop.location.lat === route2.stops[index].location.lat &&
        stop.location.lng === route2.stops[index].location.lng
    );

  return areStartPointsEqual && areEndPointsEqual && areStopsEqual;
}

export default Card;
