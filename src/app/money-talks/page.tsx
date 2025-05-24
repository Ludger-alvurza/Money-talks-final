"use client";

import React, { useEffect, useState, useRef } from "react";
import { PredictionResult } from "@/components/currency/types";
import StatusMessageComponent from "@/components/currency/StatusMessageComponent";
import FileUploadComponent from "@/components/currency/FileUploadComponent";
import CameraComponent from "@/components/currency/CameraComponent";
import ResultsComponent from "@/components/currency/ResultsComponent";

const CurrencyDetector: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modelHandler, setModelHandler] = useState<any>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Audio utility functions
  const speakResult = (prediction: PredictionResult) => {
    if (!audioEnabled || !prediction) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    let textToSpeak = "";

    // Map denomination to Indonesian text
    const denominationMap: { [key: string]: string } = {
      "1000": "seribu rupiah",
      "2000": "dua ribu rupiah",
      "5000": "lima ribu rupiah",
      "10000": "sepuluh ribu rupiah",
      "20000": "dua puluh ribu rupiah",
      "50000": "lima puluh ribu rupiah",
      "100000": "seratus ribu rupiah",
    };

    // Get probability from PredictionResult
    const confidence = prediction.probability;

    if (confidence > 0.9) {
      // Above 90% - just say the denomination
      const denomination =
        denominationMap[prediction.className] || prediction.className;
      textToSpeak = denomination;
    } else {
      // Below 90% - say it's not money
      textToSpeak = "Bukan uang";
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Set language to Indonesian if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (voice) => voice.lang.includes("id") || voice.lang.includes("ID")
    );

    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    utterance.lang = "id-ID";
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      // Test audio when enabling
      const testUtterance = new SpeechSynthesisUtterance("Audio diaktifkan");
      testUtterance.lang = "id-ID";
      testUtterance.rate = 0.9;
      window.speechSynthesis.speak(testUtterance);
    } else {
      // Stop any ongoing speech when disabling
      window.speechSynthesis.cancel();
    }
  };

  // Load TensorFlow and initialize modelHandler
  useEffect(() => {
    const loadTensorFlowAndModel = async () => {
      try {
        // Dynamic import TensorFlow.js
        const tfjs = await import("@tensorflow/tfjs");
        window.tf = tfjs;
        console.log("TensorFlow.js loaded dynamically");

        // Import modelHandler
        const modelModule = await import("../../../utils/loadModel.js");
        console.log("modelHandler module imported");

        // Wait for initialization
        if (
          modelModule.default &&
          typeof modelModule.default.init === "function"
        ) {
          await modelModule.default.init();
          setModelHandler(modelModule.default);
          setIsModelLoaded(true);
          setErrorMessage("");
        } else {
          throw new Error(
            "modelHandler or init method not found in the imported module"
          );
        }
      } catch (error) {
        setErrorMessage(`Error loading model: ${(error as Error).message}`);
        console.error("Error loading model:", error);
      }
    };

    loadTensorFlowAndModel();

    // Clean up resources when component unmounts
    return () => {
      stopCamera();
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      if (modelHandler && typeof modelHandler.dispose === "function") {
        modelHandler.dispose();
      }
    };
  }, []);

  // Load voices when speech synthesis is ready
  useEffect(() => {
    const loadVoices = () => {
      // This helps ensure voices are loaded
      window.speechSynthesis.getVoices();
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  // Effect to speak result when prediction changes
  useEffect(() => {
    if (prediction && audioEnabled) {
      // Small delay to ensure the UI has updated before speaking
      setTimeout(() => {
        speakResult(prediction);
      }, 500);
    }
  }, [prediction, audioEnabled]);

  // Start the camera feed
  const startCamera = async () => {
    try {
      // First set camera as active - this will cause CameraComponent to render the video element
      setCameraActive(true);
      console.log("Camera set active, rendering component...");

      // Wait for the video element to be available
      let attempts = 0;
      const maxAttempts = 50; // Try for about 5 seconds (50 * 100ms)

      const waitForVideoElement = () => {
        return new Promise<void>((resolve, reject) => {
          const checkElement = () => {
            console.log(
              `Checking for video element, attempt ${
                attempts + 1
              }/${maxAttempts}`
            );
            if (window.videoElement) {
              console.log("Video element found!", window.videoElement);
              resolve();
            } else if (attempts >= maxAttempts) {
              console.error("Video element not found after maximum attempts");
              reject(
                new Error("Video element not available after multiple attempts")
              );
            } else {
              attempts++;
              setTimeout(checkElement, 100);
            }
          };

          // Start checking after a short initial delay
          setTimeout(checkElement, 300);
        });
      };

      // Wait for video element to be created
      await waitForVideoElement();
      console.log("Video element available, requesting camera access...");

      // Now that we have the video element, get the camera stream
      const constraints = {
        video: {
          facingMode: "environment", // Use back camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera stream obtained:", stream);

      if (window.videoElement) {
        window.videoElement.srcObject = stream;
        setErrorMessage("");
        console.log("Stream set to video element successfully");
      }
    } catch (error) {
      setCameraActive(false);
      setErrorMessage(`Camera access error: ${(error as Error).message}`);
      console.error("Error accessing camera:", error);
    }
  };

  // Stop the camera feed
  const stopCamera = () => {
    if (!window.videoElement || !window.videoElement.srcObject) return;

    const stream = window.videoElement.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    if (window.videoElement) {
      window.videoElement.srcObject = null;
    }
    setCameraActive(false);
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up previous URL when component unmounts or when new file is selected
    return () => URL.revokeObjectURL(objectUrl);
  };

  // Capture image and make prediction from camera
  const captureAndPredict = async () => {
    if (
      !isModelLoaded ||
      !window.videoElement ||
      !window.canvasElement ||
      !modelHandler
    )
      return;

    try {
      setIsProcessing(true);
      setPrediction(null);

      const video = window.videoElement;
      const canvas = window.canvasElement;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Make prediction using the ensemble method for better accuracy
      const result = await modelHandler.predictWithEnsemble(canvas);
      setPrediction(result);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Prediction error: ${(error as Error).message}`);
      console.error("Error during prediction:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Make prediction from uploaded image
  const predictFromImage = async () => {
    if (!isModelLoaded || !previewUrl || !modelHandler) return;

    try {
      setIsProcessing(true);
      setPrediction(null);

      // Create an image element from the preview URL
      const img = new Image();
      img.src = previewUrl;

      // Wait for the image to load
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      // Make prediction using the ensemble method for better accuracy
      const result = await modelHandler.predictWithEnsemble(img);
      setPrediction(result);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Prediction error: ${(error as Error).message}`);
      console.error("Error during prediction:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IDR Currency Detector
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  AI-Powered Indonesian Rupiah Recognition
                </p>
              </div>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={toggleAudio}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                audioEnabled
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200"
                  : "bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white shadow-gray-200"
              }`}
              title={
                audioEnabled
                  ? "Audio: ON (Click to disable)"
                  : "Audio: OFF (Click to enable)"
              }
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔊</span>
                <span>{audioEnabled ? "ON" : "OFF"}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Audio Status Indicator */}
        {audioEnabled && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-center space-x-3 text-blue-700">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-lg">🔊</span>
              </div>
              <span className="font-medium">
                Audio output aktif - Hasil deteksi akan diumumkan secara
                otomatis
              </span>
            </div>
          </div>
        )}

        {/* Status messages */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <StatusMessageComponent
            isModelLoaded={isModelLoaded}
            errorMessage={errorMessage}
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Camera */}
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                  <span className="text-white text-lg">📁</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Upload Image
                </h2>
              </div>
              <FileUploadComponent
                isModelLoaded={isModelLoaded}
                isProcessing={isProcessing}
                previewUrl={previewUrl}
                handleFileChange={handleFileChange}
                predictFromImage={predictFromImage}
              />
            </div>

            {/* Camera Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
                  <span className="text-white text-lg">📷</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Live Camera</h2>
              </div>
              <CameraComponent
                isModelLoaded={isModelLoaded}
                isProcessing={isProcessing}
                cameraActive={cameraActive}
                toggleCamera={toggleCamera}
                captureAndPredict={captureAndPredict}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Results Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Detection Results
                </h2>
              </div>
              <ResultsComponent prediction={prediction} />
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-800 mb-2">
                    How to Use
                  </h3>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• Upload an image or use live camera</li>
                    <li>• Ensure good lighting and clear view</li>
                    <li>• Place currency note flat and centered</li>
                    <li>• Results above 90% confidence are considered valid</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Supported Currency */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-200/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-lg">💵</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Supported Denominations
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                    <div>• Rp 1.000</div>
                    <div>• Rp 2.000</div>
                    <div>• Rp 5.000</div>
                    <div>• Rp 10.000</div>
                    <div>• Rp 20.000</div>
                    <div>• Rp 50.000</div>
                    <div>• Rp 100.000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by TensorFlow.js & AI • Made with ❤️ for Indonesian
              Currency Detection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetector;
