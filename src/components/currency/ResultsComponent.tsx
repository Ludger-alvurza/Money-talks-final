import React, { useState, useEffect } from "react";
import { CheckCircle, Activity, BarChart3, TrendingUp } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProbability, setAnimatedProbability] = useState(0);
  const [showAllProbabilities, setShowAllProbabilities] = useState(false);

  useEffect(() => {
    if (prediction) {
      setIsVisible(true);
      // Animate the main probability
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedProbability((prev) => {
            const target = prediction.probability * 100;
            const step = target / 30; // Animation duration control
            if (prev >= target - step) {
              clearInterval(interval);
              return target;
            }
            return prev + step;
          });
        }, 50);
        return () => clearInterval(interval);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [prediction]);

  if (!prediction) return null;

  const getConfidenceColor = (prob: number) => {
    if (prob >= 0.8) return "from-emerald-500 to-green-600";
    if (prob >= 0.6) return "from-blue-500 to-indigo-600";
    if (prob >= 0.4) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getConfidenceText = (prob: number) => {
    if (prob >= 0.8) return "High Confidence";
    if (prob >= 0.6) return "Good Confidence";
    if (prob >= 0.4) return "Moderate Confidence";
    return "Low Confidence";
  };

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Main Result Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl border border-purple-500/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Detection Result
              </h2>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <span className="text-sm text-purple-200">AI Analysis</span>
            </div>
          </div>

          {/* Main Result */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getConfidenceColor(
                  prediction.probability
                )} rounded-3xl blur-lg opacity-50 animate-pulse`}
              ></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mr-3" />
                  <div className="text-4xl font-black text-white">
                    IDR {prediction.className}
                  </div>
                </div>

                {/* Animated Confidence Meter */}
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-4">
                    <TrendingUp className="w-5 h-5 text-purple-300" />
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      {animatedProbability.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-purple-300 font-semibold mt-2">
                    {getConfidenceText(prediction.probability)}
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getConfidenceColor(
                      prediction.probability
                    )} transition-all duration-2000 ease-out rounded-full relative`}
                    style={{ width: `${animatedProbability}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Button for All Probabilities */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAllProbabilities(!showAllProbabilities)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <BarChart3 className="w-5 h-5" />
              <span>
                {showAllProbabilities ? "Hide" : "Show"} All Probabilities
              </span>
            </button>
          </div>

          {/* All Probabilities Section */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              showAllProbabilities
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
                All Detection Probabilities
              </h3>
              <div className="space-y-4">
                {prediction.allProbabilities
                  .sort((a, b) => b.probability - a.probability)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`transform transition-all duration-500 delay-${
                        index * 100
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white font-semibold">
                          IDR {item.name}
                        </div>
                        <div className="text-purple-300 font-bold">
                          {(item.probability * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getConfidenceColor(
                              item.probability
                            )} transition-all duration-1000 ease-out rounded-full relative`}
                            style={{
                              width: `${item.probability * 100}%`,
                              animationDelay: `${index * 0.2}s`,
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Accuracy</div>
              <div className="text-2xl font-bold">
                {(prediction.probability * 100).toFixed(1)}%
              </div>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Total Classes</div>
              <div className="text-2xl font-bold">
                {prediction.allProbabilities.length}
              </div>
            </div>
            <BarChart3 className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Status</div>
              <div className="text-lg font-bold">Detected</div>
            </div>
            <Activity className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
