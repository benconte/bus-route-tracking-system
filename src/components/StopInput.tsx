import { useState } from "react";

interface Stop {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface StopInputProps {
  stop: Stop;
  index: number;
  onStopChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    isLocationChange: boolean
  ) => void;
}

const StopInput: React.FC<StopInputProps> = ({ stop, index, onStopChange }) => {
  const [stopName, setStopName] = useState(stop.name);

  const handleStopNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStopName(event.target.value);
    onStopChange(index, event, false);
  };

  return (
    <input
      type="text"
      placeholder="Enter stop name"
      value={stopName}
      onChange={handleStopNameChange}
    />
  );
};

export default StopInput;