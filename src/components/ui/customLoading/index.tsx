import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  isLoading: boolean;
  size?: string;
};

const CustomLoading: React.FC<Props> = ({ isLoading, size = 50 }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <ClipLoader color={"#54CA70"} loading={isLoading} size={size} aria-label="Loading Spinner" data-testid="loader" />
    </div>
  );
};

export default CustomLoading;
