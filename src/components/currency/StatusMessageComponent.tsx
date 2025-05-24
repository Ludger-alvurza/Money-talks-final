import React from "react";

interface StatusMessageProps {
  isModelLoaded: boolean;
  errorMessage: string;
}

const StatusMessageComponent: React.FC<StatusMessageProps> = ({
  isModelLoaded,
  errorMessage,
}) => {
  return (
    <div className="mb-4 text-center">
      <p className="text-green-600">
        {isModelLoaded ? "Model loaded successfully!" : "Loading model..."}
      </p>
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default StatusMessageComponent;
