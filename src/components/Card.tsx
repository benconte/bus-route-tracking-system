import "../styles/Card.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import useDriverLocation from "../hooks/useDriverLocation";
import { useMemo, useState } from "react";
import useEtaToNextStop from "../hooks/use-eta-next-stop";
import { formatDistance, formatDuration } from "../utils/format-utils";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

interface LatLngLiteral extends google.maps.LatLngLiteral {}

interface LocationWithName {
  name: string;
  location: LatLngLiteral;
}

interface NewComponentProps {
  startingPoint: LocationWithName;
  endingPoint: LocationWithName;
  stops: LocationWithName[];
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
}) => {
  const driverLocation = useDriverLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentStopIndex] = useState<number>(0);

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

  const handleStartingPointLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [lat, lng] = event.target.value.split(",").map(Number);
    onPointsChange(
      { ...startingPoint, location: { lat, lng } },
      endingPoint,
      stops
    );
  };

  const handleEndingPointLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [lat, lng] = event.target.value.split(",").map(Number);
    onPointsChange(
      startingPoint,
      { ...endingPoint, location: { lat, lng } },
      stops
    );
  };

  const handleStopChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    isLocationChange: boolean
  ) => {
    if (isLocationChange) {
      const [lat, lng] = event.target.value.split(",").map(Number);
      const newStop = { ...stops[index], location: { lat, lng } };
      const newStops = [
        ...stops.slice(0, index),
        newStop,
        ...stops.slice(index + 1),
      ];
      onPointsChange(startingPoint, endingPoint, newStops);
    } else {
      const newName = event.target.value;
      const newStop = { ...stops[index], name: newName };
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
    localStorage.setItem("savedRoutes", JSON.stringify(favorite));
    setIsFavorite(true);
  };

  return (
    <div className="card">
      <div className="left-card">
        <div className="start-end-position">
          <div className="position">
            <span>Start Position name</span>
            <input
              type="text"
              placeholder="enter starting position name"
              value={startingPoint.name}
              onChange={(event) => handleStopChange(-1, event, false)}
            />
            <span>Start Position (lat, long)</span>
            <input
              type="text"
              placeholder="enter starting position"
              value={`${startingPoint.location.lat},${startingPoint.location.lng}`}
              onChange={handleStartingPointLocationChange}
            />
          </div>
          <div className="position">
            <span>End Position name</span>
            <input
              type="text"
              placeholder="enter ending position name"
              value={`${endingPoint.location.lat},${endingPoint.location.lng}`}
              onChange={handleEndingPointLocationChange}
            />
            <span>End Position location</span>
            <input
              type="text"
              placeholder="enter ending position"
              value={`${endingPoint.location.lat},${endingPoint.location.lng}`}
              onChange={handleEndingPointLocationChange}
            />
          </div>
        </div>

        <div className="map-stops">
          <h3>Stops:</h3>
          <div className="stops">
            {stops.map((stop, index) => (
              <div key={stop.name + "-" + index} className="stop">
                <div className="details">
                  <label key={index}>
                    Stop {index + 1} name:
                    <input
                      type="text"
                      placeholder="enter starting position name"
                      value={stop.name}
                      onChange={(event) =>
                        handleStopChange(index, event, false)
                      }
                    />
                  </label>
                  <label key={index}>
                    Stop {index + 1} (lat, long):
                    <input
                      type="text"
                      placeholder="enter ending position name"
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
            {/* <span>ETA to next stop: {etaToNextStop ? formatDuration(etaToNextStop) : "0"} min</span> */}
            <span>
              Time: {etaToNextStop ? formatDuration(etaToNextStop) : "0"}{" "}
              minutes
            </span>
          </div>
        </div>
      </div>
      <div className="bottom-nav">
        <div className="icon" onClick={handleFavorite}>
          {isFavorite ? <FavoriteIcon className="active" /> : <FavoriteBorderIcon />}
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

export default Card;
