import "../styles/Card.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LatLngLiteral extends google.maps.LatLngLiteral {}

interface NewComponentProps {
  startingPoint: LatLngLiteral;
  endingPoint: LatLngLiteral;
  stops: LatLngLiteral[];
  onPointsChange: (
    newStartingPoint: LatLngLiteral,
    newEndingPoint: LatLngLiteral,
    newStops: LatLngLiteral[]
  ) => void;
}

const Card: React.FC<NewComponentProps> = ({
  startingPoint,
  endingPoint,
  stops,
  onPointsChange,
}) => {
  const handleStartingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [lat, lng] = event.target.value.split(",").map(Number);
    onPointsChange({ lat, lng }, endingPoint, stops);
  };

  const handleEndingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [lat, lng] = event.target.value.split(",").map(Number);
    onPointsChange(startingPoint, { lat, lng }, stops);
  };

  const handleStopChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [lat, lng] = event.target.value.split(",").map(Number);
    const newStop = { lat, lng };
    const newStops = [
      ...stops.slice(0, index),
      newStop,
      ...stops.slice(index + 1),
    ];
    onPointsChange(startingPoint, endingPoint, newStops);
  };

  const handleAddStop = () => {
    const newStops = [...stops, { lat: 0, lng: 0 }];
    onPointsChange(startingPoint, endingPoint, newStops);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = [...stops.slice(0, index), ...stops.slice(index + 1)];
    onPointsChange(startingPoint, endingPoint, newStops);
  };

  return (
    <div className="card">
      <div className="left-card">
        <div className="start-end-position">
          <div className="position">
            <span>Start Position (lat, long)</span>
            <input
              type="text"
              placeholder="enter starting position"
              value={`${startingPoint.lat},${startingPoint.lng}`}
              onChange={handleStartingPointChange}
            />
          </div>
          <div className="position">
            <span>End Position (lat, long)</span>
            <input
              type="text"
              placeholder="enter ending position"
              value={`${endingPoint.lat},${endingPoint.lng}`}
              onChange={handleEndingPointChange}
            />
          </div>
        </div>

        <div className="map-stops">
          <h3>Stops:</h3>
          <div className="stops">
            {stops.map((stop, index) => (
              <div key={index} className="stop">
                <label key={index}>
                  Stop {index + 1} (lat, long):
                  <input
                    type="text"
                    value={`${stop.lat},${stop.lng}`}
                    onChange={(event) => handleStopChange(index, event)}
                  />
                </label>
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
          <h4 className="location">Nyabugogo - Kimironko</h4>
          <span className="stop">Next stop: kacyiru Bus Park</span>
          <div className="distance">
            <span>Distance: 23km</span>
            <span>Time: 23 minutes</span>
          </div>
        </div>
      </div>
      <div className="bottom-nav">
          <div className="icon">
            <FavoriteBorderIcon />
          </div>
          <div className="icon">
            <FavoriteBorderIcon />
          </div>
          <div className="icon">
            <FavoriteBorderIcon />
          </div>
      </div>
    </div>
  );
};

export default Card;
