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
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
        />
      </div>

      {previewUrl && (
        <div className="mb-4">
          <div className="relative w-full max-w-md mx-auto">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={predictFromImage}
              disabled={isProcessing || !isModelLoaded}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Detect Currency"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
