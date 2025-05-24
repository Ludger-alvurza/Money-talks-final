import React from "react";

interface FileUploadProps {
  isModelLoaded: boolean;
  isProcessing: boolean;
  previewUrl: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  predictFromImage: () => void;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({
  isModelLoaded,
  isProcessing,
  previewUrl,
  handleFileChange,
  predictFromImage,
}) => {
  return (
    <div className="space-y-6">
      {/* File Input Section */}
      <div className="relative">
        <label
          htmlFor="file-upload"
          className={`group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isModelLoaded
              ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500"
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2 p-4">
            {/* Upload Icon */}
            <div
              className={`p-3 rounded-full transition-all duration-300 ${
                isModelLoaded
                  ? "bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isModelLoaded
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className={`text-sm font-medium ${
                  isModelLoaded
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {isModelLoaded
                  ? "Click to upload currency image"
                  : "Please wait for model to load"}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isModelLoaded
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!isModelLoaded}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Preview and Prediction */}
      {previewUrl && (
        <div className="space-y-4">
          {/* Preview Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={previewUrl}
                  alt="Currency Preview"
                  className="w-full h-auto max-h-80 object-contain mx-auto rounded-xl shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 rounded-xl"></div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  📷 Image uploaded successfully
                </p>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <div className="text-center">
            <button
              onClick={predictFromImage}
              disabled={isProcessing || !isModelLoaded}
              className={`group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden ${
                isProcessing || !isModelLoaded
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-200 dark:shadow-purple-900/50"
              }`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

              <div className="relative flex items-center space-x-3">
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                    <span>Analyzing Currency...</span>
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <span>🔍 Detect Currency</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                <div className="text-blue-700 dark:text-blue-300">
                  <p className="font-medium text-sm">
                    AI is analyzing your currency...
                  </p>
                  <p className="text-xs opacity-75">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
