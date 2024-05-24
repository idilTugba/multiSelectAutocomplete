import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif"
        alt="Loading..."
        className="loading-spinner"
      />
    </div>
  );
};

export default LoadingSpinner;
