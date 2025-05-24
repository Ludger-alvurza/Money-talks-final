import React, { useEffect } from "react";

interface CameraComponentProps {
  isModelLoaded: boolean;
  isProcessing: boolean;
  cameraActive: boolean;
  toggleCamera: () => void;
  captureAndPredict: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  isModelLoaded,
  isProcessing,
  cameraActive,
  toggleCamera,
  captureAndPredict,
}) => {
  // Create local refs that will be used for camera and canvas
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Expose video and canvas refs to window for global access
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      window.videoElement = videoRef.current;
      window.canvasElement = canvasRef.current;
    }

    return () => {
      window.videoElement = null;
      window.canvasElement = null;
    };
  }, []);

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Use Camera</h2>

      <div className="mb-4 text-center">
        <button
          onClick={toggleCamera}
          disabled={!isModelLoaded}
          className={`${
            cameraActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50`}
        >
          {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>

      {/* Always render the video and canvas elements but hide them when not active */}
      <div className={cameraActive ? "mb-4" : "hidden"}>
        <div className="relative w-full max-w-md mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg shadow-md"
          />
          <canvas
            ref={canvasRef}
            className="hidden" // Hidden but used for processing
          />
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={captureAndPredict}
            disabled={isProcessing || !isModelLoaded}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Capture & Detect"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add global declarations
declare global {
  interface Window {
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
  }
}

export default CameraComponent;
