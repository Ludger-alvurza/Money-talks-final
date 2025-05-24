import React from "react";

interface PredictionResult {
  className: string;
  probability: number;
  allProbabilities: {
    name: string;
    probability: number;
  }[];
}

interface ResultsComponentProps {
  prediction: PredictionResult | null;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ prediction }) => {
  if (!prediction) return null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Detection Result</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold mb-2">
            IDR {prediction.className}
          </div>
          <div className="text-gray-600">
            Confidence: {(prediction.probability * 100).toFixed(2)}%
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">All Probabilities:</h3>
          <div className="space-y-2">
            {prediction.allProbabilities
              .sort((a, b) => b.probability - a.probability)
              .map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>IDR {item.name}</div>
                  <div className="text-right">
                    <div className="h-4 w-40 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${item.probability * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {(item.probability * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
