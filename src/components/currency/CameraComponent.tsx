import React, { useEffect, useImperativeHandle, forwardRef } from "react";

interface CameraComponentProps {
  isModelLoaded: boolean;
  isProcessing: boolean;
  cameraActive: boolean;
  toggleCamera: () => void;
  captureAndPredict: () => void;
  onCameraReady?: (
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ) => void;
}

export interface CameraComponentRef {
  getVideoElement: () => HTMLVideoElement | null;
  getCanvasElement: () => HTMLCanvasElement | null;
  startCameraStream: () => Promise<void>;
  stopCameraStream: () => void;
}

const CameraComponent = forwardRef<CameraComponentRef, CameraComponentProps>(
  (
    {
      isModelLoaded,
      isProcessing,
      cameraActive,
      toggleCamera,
      captureAndPredict,
      onCameraReady,
    },
    ref
  ) => {
    // Create local refs that will be used for camera and canvas
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // Camera stream management
    const startCameraStream = async () => {
      if (!videoRef.current) {
        throw new Error("Video element not available");
      }

      try {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        console.log("Camera stream started successfully");
      } catch (error) {
        console.error("Error starting camera stream:", error);
        throw error;
      }
    };

    const stopCameraStream = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        console.log("Camera stream stopped");
      }
    };

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current,
      getCanvasElement: () => canvasRef.current,
      startCameraStream,
      stopCameraStream,
    }));

    // Expose video and canvas refs to window for global access and notify parent
    useEffect(() => {
      if (videoRef.current && canvasRef.current) {
        window.videoElement = videoRef.current;
        window.canvasElement = canvasRef.current;

        // Notify parent that camera elements are ready
        if (onCameraReady) {
          onCameraReady(videoRef.current, canvasRef.current);
        }
      }

      return () => {
        // Clean up on unmount
        stopCameraStream();
        window.videoElement = null;
        window.canvasElement = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle camera activation
    useEffect(() => {
      if (cameraActive && videoRef.current) {
        startCameraStream().catch((error) => {
          console.error("Failed to start camera:", error);
        });
      } else if (!cameraActive) {
        stopCameraStream();
      }
    }, [cameraActive]);

    return (
      <div className="space-y-6">
        {/* Camera Toggle Button */}
        <div className="text-center">
          <button
            onClick={toggleCamera}
            disabled={!isModelLoaded}
            className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden ${
              !isModelLoaded
                ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                : cameraActive
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-200 dark:shadow-red-900/50"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200 dark:shadow-green-900/50"
            }`}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

            <div className="relative flex items-center space-x-3">
              <div className="text-xl">{cameraActive ? "📴" : "📷"}</div>
              <span>
                {!isModelLoaded
                  ? "Loading..."
                  : cameraActive
                  ? "Turn Off Camera"
                  : "Turn On Camera"}
              </span>
            </div>
          </button>
        </div>

        {/* Camera Feed */}
        {cameraActive && (
          <div className="space-y-4">
            {/* Video Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl">
                <div className="relative overflow-hidden rounded-xl bg-gray-900">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto max-h-80 rounded-xl shadow-lg"
                  />

                  {/* Camera overlay UI */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corner indicators */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/70 rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/70 rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/70 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/70 rounded-br-lg"></div>

                    {/* Center crosshair */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Loading overlay when processing */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 flex items-center space-x-4">
                        <div className="w-8 h-8 border-3 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                          Analyzing currency...
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera info */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    📹 Camera is active - Position currency note in frame
                  </p>
                </div>
              </div>
            </div>

            {/* Capture Button */}
            <div className="text-center">
              <button
                onClick={captureAndPredict}
                disabled={isProcessing || !isModelLoaded}
                className={`group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden ${
                  isProcessing || !isModelLoaded
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200 dark:shadow-blue-900/50"
                }`}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <div className="relative flex items-center space-x-3">
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>📸 Capture & Detect</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                  <div className="text-blue-700 dark:text-blue-300">
                    <p className="font-medium text-sm">
                      Capturing and analyzing image...
                    </p>
                    <p className="text-xs opacity-75">
                      Please keep the camera steady
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Instructions */}
        {!cameraActive && isModelLoaded && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full flex-shrink-0">
                <span className="text-sm">💡</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium mb-2">Camera Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Ensure good lighting conditions</li>
                  <li>• Place currency note flat and centered</li>
                  <li>• Keep camera steady when capturing</li>
                  <li>• Use rear camera for better quality</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Add display name for debugging
CameraComponent.displayName = "CameraComponent";

// Add global declarations
declare global {
  interface Window {
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
  }
}

export default CameraComponent;
