"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { PredictionResult } from "@/components/currency/types";
import StatusMessageComponent from "@/components/currency/StatusMessageComponent";
import FileUploadComponent from "@/components/currency/FileUploadComponent";
import CameraComponent, {
  CameraComponentRef,
} from "@/components/currency/CameraComponent";
import ResultsComponent from "@/components/currency/ResultsComponent";
import { ModeToggle } from "@/components/theme/toggle-mode";

const CurrencyDetector: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modelHandler, setModelHandler] = useState<{
    init: () => Promise<boolean>;
    predict: (
      image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    ) => Promise<{
      className: string;
      probability: number;
    }>;
    predictWithEnsemble: (
      image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    ) => Promise<{
      className: string;
      probability: number;
    }>;
    dispose: () => void;
  } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Voice Recognition States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceRecognition, setVoiceRecognition] =
    useState<SpeechRecognition | null>(null);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);

  // Ref to access CameraComponent methods
  const cameraRef = useRef<CameraComponentRef>(null);

  // Welcome message and voice setup
  const speakWelcomeMessage = useCallback(() => {
    if (!audioEnabled) return;

    window.speechSynthesis.cancel();

    const welcomeText =
      "Selamat datang di halaman deteksi uang rupiah Indonesia. " +
      "Katakan 'buka kamera' untuk membuka kamera, " +
      "'tutup kamera' untuk menutup kamera, " +
      "'mulai deteksi' untuk memulai deteksi uang, " +
      "atau 'matikan suara' untuk mematikan audio.";

    const utterance = new SpeechSynthesisUtterance(welcomeText);
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (voice) => voice.lang.includes("id") || voice.lang.includes("ID")
    );

    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    utterance.lang = "id-ID";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, [audioEnabled]);

  // Audio utility functions - using useCallback to stabilize the function reference
  const speakResult = useCallback(
    (prediction: PredictionResult) => {
      if (!audioEnabled || !prediction) return;

      window.speechSynthesis.cancel();

      let textToSpeak = "";

      const denominationMap: { [key: string]: string } = {
        "1000": "seribu rupiah",
        "2000": "dua ribu rupiah",
        "5000": "lima ribu rupiah",
        "10000": "sepuluh ribu rupiah",
        "20000": "dua puluh ribu rupiah",
        "50000": "lima puluh ribu rupiah",
        "100000": "seratus ribu rupiah",
      };

      const confidence = prediction.probability;

      if (confidence > 0.9) {
        const denomination =
          denominationMap[prediction.className] || prediction.className;
        textToSpeak = `Terdeteksi uang ${denomination} dengan tingkat kepercayaan ${Math.round(
          confidence * 100
        )} persen`;
      } else {
        textToSpeak =
          "Bukan uang atau gambar tidak jelas, mohon coba dekatkan uang dengan baik. lalu tutup kamera dan coba lagi.";
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoice = voices.find(
        (voice) => voice.lang.includes("id") || voice.lang.includes("ID")
      );

      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
      }

      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    },
    [audioEnabled]
  );

  const speakFeedback = useCallback(
    (message: string) => {
      if (!audioEnabled) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoice = voices.find(
        (voice) => voice.lang.includes("id") || voice.lang.includes("ID")
      );

      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
      }

      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    },
    [audioEnabled]
  );

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "id-ID";

        recognition.onstart = () => {
          setIsListening(true);
          console.log("Voice recognition started");
        };

        recognition.onend = () => {
          setIsListening(false);
          console.log("Voice recognition ended");
          // Auto restart if audio is enabled
          if (audioEnabled && voiceSupported) {
            setTimeout(() => {
              try {
                recognition.start();
              } catch (error) {
                console.log("Recognition restart failed:", error);
              }
            }, 1000);
          }
        };

        recognition.onerror = (event) => {
          console.log("Voice recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onresult = (event) => {
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript
            .toLowerCase()
            .trim();
          setLastCommand(command);
          console.log("Voice command received:", command);

          handleVoiceCommand(command);
        };

        setVoiceRecognition(recognition);
      } else {
        setVoiceSupported(false);
        console.log("Speech recognition not supported");
      }
    }
  }, []);

  // Handle voice commands
  const handleVoiceCommand = useCallback(
    (command: string) => {
      console.log("Processing command:", command);

      if (
        command.includes("buka kamera") ||
        command.includes("nyalakan kamera")
      ) {
        if (!cameraActive) {
          startCamera();
          speakFeedback("Kamera dibuka");
        } else {
          speakFeedback("Kamera sudah aktif");
        }
      } else if (
        command.includes("tutup kamera") ||
        command.includes("matikan kamera")
      ) {
        if (cameraActive) {
          stopCamera();
          speakFeedback("Kamera ditutup");
        } else {
          speakFeedback("Kamera sudah tidak aktif");
        }
      } else if (
        command.includes("mulai deteksi") ||
        command.includes("deteksi uang") ||
        command.includes("foto")
      ) {
        if (cameraActive && isModelLoaded && !isProcessing) {
          captureAndPredict();
          speakFeedback("Memulai deteksi uang");
        } else if (!cameraActive) {
          speakFeedback("Silakan buka kamera terlebih dahulu");
        } else if (!isModelLoaded) {
          speakFeedback("Model masih dalam proses loading");
        } else if (isProcessing) {
          speakFeedback("Sedang memproses, tunggu sebentar");
        }
      } else if (
        command.includes("matikan suara") ||
        command.includes("diam")
      ) {
        toggleAudio();
      } else if (
        command.includes("nyalakan suara") ||
        command.includes("aktifkan suara")
      ) {
        if (!audioEnabled) {
          toggleAudio();
        }
      } else if (command.includes("bantuan") || command.includes("help")) {
        const helpText =
          "Perintah yang tersedia: buka kamera, tutup kamera, mulai deteksi, matikan suara, nyalakan suara";
        speakFeedback(helpText);
      }
    },
    [cameraActive, isModelLoaded, isProcessing, audioEnabled]
  );

  // Start/Stop Voice Recognition
  const toggleVoiceRecognition = useCallback(() => {
    if (!voiceSupported || !voiceRecognition) return;

    if (isListening) {
      voiceRecognition.stop();
      speakFeedback("Pengenalan suara dihentikan");
    } else {
      try {
        voiceRecognition.start();
        speakFeedback("Pengenalan suara dimulai");
      } catch (error) {
        console.log("Failed to start voice recognition:", error);
        speakFeedback("Gagal memulai pengenalan suara");
      }
    }
  }, [voiceSupported, voiceRecognition, isListening, speakFeedback]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      const testUtterance = new SpeechSynthesisUtterance("Audio diaktifkan");
      testUtterance.lang = "id-ID";
      testUtterance.rate = 0.9;
      window.speechSynthesis.speak(testUtterance);

      // Start voice recognition when audio is enabled
      if (voiceSupported && voiceRecognition && !isListening) {
        setTimeout(() => {
          try {
            voiceRecognition.start();
          } catch (error) {
            console.log("Failed to start voice recognition:", error);
          }
        }, 2000);
      }
    } else {
      window.speechSynthesis.cancel();
      // Stop voice recognition when audio is disabled
      if (voiceRecognition && isListening) {
        voiceRecognition.stop();
      }
    }
  };

  // Load TensorFlow and initialize modelHandler
  useEffect(() => {
    const loadTensorFlowAndModel = async () => {
      try {
        const tfjs = await import("@tensorflow/tfjs");
        window.tf = tfjs;
        console.log("TensorFlow.js loaded dynamically");

        const modelModule = await import("../../../utils/loadModel.js");
        console.log("modelHandler module imported");

        if (
          modelModule.default &&
          typeof modelModule.default.init === "function"
        ) {
          await modelModule.default.init();
          setModelHandler(modelModule.default);
          setIsModelLoaded(true);
          setErrorMessage("");

          // Speak welcome message after model is loaded
          setTimeout(() => {
            speakWelcomeMessage();
          }, 1000); // Delay to ensure model is ready

          // Start voice recognition after welcome message
          if (voiceSupported && voiceRecognition && audioEnabled) {
            setTimeout(() => {
              try {
                voiceRecognition.start();
              } catch (error) {
                console.log("Failed to start voice recognition:", error);
              }
            }, 8000); // Start after welcome message finishes
          }
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

    return () => {
      stopCamera();
      window.speechSynthesis.cancel();
      if (voiceRecognition) {
        voiceRecognition.stop();
      }
      // modelHandler cleanup is handled here, no need to include it in dependencies
      if (modelHandler && typeof modelHandler.dispose === "function") {
        modelHandler.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed modelHandler from dependency array as it's handled in cleanup

  // Load voices when speech synthesis is ready
  useEffect(() => {
    const loadVoices = () => {
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

  // Effect to speak result when prediction changes - now includes speakResult in dependencies
  useEffect(() => {
    if (prediction && audioEnabled) {
      setTimeout(() => {
        speakResult(prediction);
      }, 500);
    }
  }, [prediction, audioEnabled, speakResult]);

  // Camera functions - now using the ref
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setErrorMessage("");

      // The CameraComponent will handle the actual camera stream
      // We just need to set the state here
      console.log("Camera activation requested");
    } catch (error) {
      setCameraActive(false);
      setErrorMessage(`Camera access error: ${(error as Error).message}`);
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stopCameraStream();
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
      speakFeedback("Kamera ditutup");
    } else {
      startCamera();
      speakFeedback("Kamera dibuka");
    }
  };

  // File handling functions
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setPreviewUrl(null);
      return;
    }

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  // Prediction functions - updated to use camera ref
  const captureAndPredict = async () => {
    if (!isModelLoaded || !modelHandler || !cameraRef.current) {
      console.error("Prerequisites not met for prediction");
      return;
    }

    try {
      setIsProcessing(true);
      setPrediction(null);

      const videoElement = cameraRef.current.getVideoElement();
      const canvasElement = cameraRef.current.getCanvasElement();

      if (!videoElement || !canvasElement) {
        throw new Error("Video or canvas element not available");
      }

      const context = canvasElement.getContext("2d");
      if (!context) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas dimensions to match video
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Draw the current video frame to canvas
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Run prediction on the canvas
      const result = await modelHandler.predictWithEnsemble(canvasElement);
      // Convert the result to match PredictionResult interface
      const predictionResult: PredictionResult = {
        className: result.className,
        probability: result.probability,
        allProbabilities: [], // Initialize empty array since model doesn't provide this
      };
      setPrediction(predictionResult);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Prediction error: ${(error as Error).message}`);
      console.error("Error during prediction:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const predictFromImage = async () => {
    if (!isModelLoaded || !previewUrl || !modelHandler) return;

    try {
      setIsProcessing(true);
      setPrediction(null);

      const img = new Image();
      img.src = previewUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const result = await modelHandler.predictWithEnsemble(img);
      // Convert the result to match PredictionResult interface
      const predictionResult: PredictionResult = {
        className: result.className,
        probability: result.probability,
        allProbabilities: [], // Initialize empty array since model doesn't provide this
      };
      setPrediction(predictionResult);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Prediction error: ${(error as Error).message}`);
      console.error("Error during prediction:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle camera ready callback
  const handleCameraReady = (
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ) => {
    console.log("Camera elements ready:", { videoElement, canvasElement });
    // Camera elements are now available for use
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl filter drop-shadow-sm">💰</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  IDR Currency Detector
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 font-medium">
                  AI-Powered Indonesian Rupiah Recognition with Voice Control
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ModeToggle />

              {/* Voice Recognition Toggle */}
              {voiceSupported && (
                <button
                  onClick={toggleVoiceRecognition}
                  className={`group relative px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-200 dark:shadow-red-900/50"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-blue-200 dark:shadow-blue-900/50"
                  }`}
                  title={
                    isListening
                      ? "Voice Recognition: ON (Click to disable)"
                      : "Voice Recognition: OFF (Click to enable)"
                  }
                >
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="relative flex items-center space-x-2">
                    <span className="text-lg">{isListening ? "🎤" : "🎙️"}</span>
                    <span className="hidden sm:inline">
                      {isListening ? "LISTENING" : "VOICE"}
                    </span>
                  </div>
                </button>
              )}

              <button
                onClick={toggleAudio}
                className={`group relative px-3 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden ${
                  audioEnabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200 dark:shadow-green-900/50"
                    : "bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white shadow-gray-200 dark:shadow-gray-900/50"
                }`}
                title={
                  audioEnabled
                    ? "Audio: ON (Click to disable)"
                    : "Audio: OFF (Click to enable)"
                }
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="relative flex items-center space-x-2">
                  <span className="text-lg">🔊</span>
                  <span>{audioEnabled ? "ON" : "OFF"}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8 space-y-8">
        {/* Voice Control Status */}
        {audioEnabled && (
          <div className="space-y-4">
            <div className="group relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-blue-700 dark:text-blue-300">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full shadow-inner">
                    <span className="text-lg animate-pulse">🔊</span>
                  </div>
                  <div>
                    <span className="font-medium block">
                      Audio & Voice Control Aktif
                    </span>
                    <span className="text-sm opacity-75">
                      Hasil deteksi akan diumumkan secara otomatis
                    </span>
                  </div>
                </div>

                {voiceSupported && (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      {isListening ? "Mendengarkan..." : "Voice Standby"}
                    </span>
                  </div>
                )}
              </div>

              {lastCommand && (
                <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Perintah terakhir:{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      "{lastCommand}"
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status messages with dark mode */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300">
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
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative group/icon">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover/icon:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg shadow-lg">
                    <span className="text-white text-lg filter drop-shadow-sm">
                      📁
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Upload Image
                </h2>
              </div>
              <div className="relative z-10">
                <FileUploadComponent
                  isModelLoaded={isModelLoaded}
                  isProcessing={isProcessing}
                  previewUrl={previewUrl}
                  handleFileChange={handleFileChange}
                  predictFromImage={predictFromImage}
                />
              </div>
            </div>

            {/* Camera Section */}
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative group/icon">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg blur opacity-75 group-hover/icon:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg shadow-lg">
                    <span className="text-white text-lg filter drop-shadow-sm">
                      📷
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Live Camera
                </h2>
              </div>
              <div className="relative z-10">
                <CameraComponent
                  ref={cameraRef}
                  isModelLoaded={isModelLoaded}
                  isProcessing={isProcessing}
                  cameraActive={cameraActive}
                  toggleCamera={toggleCamera}
                  captureAndPredict={captureAndPredict}
                  audioEnabled={audioEnabled} // Pass audioEnabled prop
                  onCameraReady={handleCameraReady}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Results Section */}
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative group/icon">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-75 group-hover/icon:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg shadow-lg">
                    <span className="text-white text-lg filter drop-shadow-sm">
                      🎯
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Detection Results
                </h2>
              </div>
              <div className="relative z-10">
                <ResultsComponent prediction={prediction} />
              </div>
            </div>

            {/* Info Card */}
            <div className="group relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full flex-shrink-0 shadow-inner">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3 text-lg">
                    How to Use
                  </h3>
                  <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      <span>Upload an image or use live camera</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      <span>Ensure good lighting and clear view</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      <span>Place currency note flat and centered</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      <span>
                        Results above 90% confidence are considered valid
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      <span>Use voice commands for hands-free operation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Supported Currency */}
            <div className="group relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full flex-shrink-0 shadow-inner">
                  <span className="text-lg">💵</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 text-lg">
                    Supported Denominations
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-green-700 dark:text-green-300">
                    {[
                      "Rp 1.000",
                      "Rp 2.000",
                      "Rp 5.000",
                      "Rp 10.000",
                      "Rp 20.000",
                      "Rp 50.000",
                      "Rp 100.000",
                    ].map((denom, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/30 rounded-lg p-2 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-200"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">{denom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-lg">🚀</span>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Powered by TensorFlow.js & AI with Voice Control
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Made with ❤️ for Indonesian Currency Detection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetector;
