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
    <div className="p-6">
      {/* Loading/Success Status */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="relative">
          {!isModelLoaded ? (
            // Loading animation
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                Loading AI model...
              </div>
            </div>
          ) : (
            // Success state
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-green-600 dark:text-green-400 font-medium">
                ✨ AI Model loaded successfully!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator for loading */}
      {!isModelLoaded && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
            style={{ width: "70%" }}
          ></div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full flex-shrink-0">
              <svg
                className="w-4 h-4 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-red-800 dark:text-red-300 font-medium text-sm mb-1">
                Error Loading Model
              </h4>
              <p className="text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Model Status Info */}
      {isModelLoaded && !errorMessage && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
              <span className="text-sm">🤖</span>
            </div>
            <div className="text-blue-700 dark:text-blue-300 text-sm">
              <span className="font-medium">Ready for detection!</span> You can
              now upload images or use the camera.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusMessageComponent;
