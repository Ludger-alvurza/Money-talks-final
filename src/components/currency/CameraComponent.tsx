import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
  useState,
} from "react";

interface CameraComponentProps {
  isModelLoaded: boolean;
  isProcessing: boolean;
  cameraActive: boolean;
  toggleCamera: () => void;
  captureAndPredict: () => void;
  audioEnabled: boolean; // Add this prop
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
      audioEnabled, // Add this
      onCameraReady,
    },
    ref
  ) => {
    // Create local refs that will be used for camera and canvas
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // Speech recognition refs and state
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isRecognitionActiveRef = useRef(false);
    const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastCommandTimeRef = useRef<number>(0);
    const [voiceStatus, setVoiceStatus] = useState<
      "active" | "inactive" | "error"
    >("inactive");

    const COMMAND_COOLDOWN_MS = 1500; // Reduced cooldown for better responsiveness

    // Audio utility function - centralized audio handler
    const speakText = useCallback(
      (text: string, priority: boolean = false) => {
        if (!audioEnabled) return;

        // Cancel previous speech if this is high priority
        if (priority) {
          window.speechSynthesis.cancel();
        }

        // Small delay to ensure previous cancel is processed
        setTimeout(
          () => {
            const utterance = new SpeechSynthesisUtterance(text);
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
          priority ? 100 : 0
        );
      },
      [audioEnabled]
    );

    // Camera stream management
    const startCameraStream = useCallback(async () => {
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

        // Give audio feedback when camera starts
        speakText("Kamera diaktifkan", true);
      } catch (error) {
        console.error("Error starting camera stream:", error);
        speakText("Gagal mengaktifkan kamera", true);
        throw error;
      }
    }, [speakText]);

    const stopCameraStream = useCallback(() => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        console.log("Camera stream stopped");

        // Give audio feedback when camera stops
        speakText("Kamera dimatikan", true);
      }
    }, [speakText]);

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current,
      getCanvasElement: () => canvasRef.current,
      startCameraStream,
      stopCameraStream,
    }));

    // Enhanced voice command processing
    const processVoiceCommand = useCallback(
      (transcript: string) => {
        const now = Date.now();
        if (now - lastCommandTimeRef.current < COMMAND_COOLDOWN_MS) {
          console.log("Voice command ignored: Too soon after last command");
          return;
        }

        console.log("Voice command detected:", transcript);

        // More flexible command patterns with variations
        const commands = [
          {
            patterns: [
              /\b(mulai\s+deteksi\s+uang|deteksi\s+uang|mulai\s+deteksi)\b/,
              /\b(detect\s+money|start\s+detection)\b/,
            ],
            action: "detect",
          },
          {
            patterns: [
              /\b(tutup\s+kamera|matikan\s+kamera|close\s+camera)\b/,
              /\b(turn\s+off\s+camera|stop\s+camera)\b/,
            ],
            action: "close_camera",
          },
          {
            patterns: [
              /\b(buka\s+kamera|nyalakan\s+kamera|open\s+camera)\b/,
              /\b(turn\s+on\s+camera|start\s+camera)\b/,
            ],
            action: "open_camera",
          },
          {
            patterns: [
              /\b(foto|capture|ambil\s+gambar|tangkap)\b/,
              /\b(take\s+photo|snap|shoot)\b/,
            ],
            action: "capture",
          },
        ];

        // Find matching command
        let executedCommand = false;
        for (const command of commands) {
          if (executedCommand) break;

          for (const pattern of command.patterns) {
            if (pattern.test(transcript)) {
              executedCommand = true;
              lastCommandTimeRef.current = now;

              switch (command.action) {
                case "open_camera":
                  if (!cameraActive) {
                    console.log("Voice command: Opening camera");
                    toggleCamera();
                  } else {
                    console.log("Voice command: Camera already active");
                    speakText("Kamera sudah aktif");
                  }
                  break;

                case "close_camera":
                  if (cameraActive) {
                    console.log("Voice command: Closing camera");
                    toggleCamera();
                  } else {
                    console.log("Voice command: Camera already inactive");
                    speakText("Kamera sudah mati");
                  }
                  break;

                case "detect":
                case "capture":
                  console.log(
                    `Voice command: ${
                      command.action === "detect"
                        ? "Starting money detection"
                        : "Capture image"
                    }`
                  );
                  if (cameraActive && isModelLoaded && !isProcessing) {
                    speakText("Memulai deteksi");
                    captureAndPredict();
                    // FIXED: Kamera tetap menyala setelah deteksi
                    // Tidak ada perintah untuk mematikan kamera di sini
                  } else {
                    const reasons = [];
                    if (!cameraActive) reasons.push("kamera tidak aktif");
                    if (!isModelLoaded) reasons.push("model belum siap");
                    if (isProcessing) reasons.push("sedang memproses");
                    console.log(
                      `Voice command: Cannot ${command.action} - ${reasons.join(
                        ", "
                      )}`
                    );
                    speakText(`Tidak dapat memproses: ${reasons.join(", ")}`);
                  }
                  break;
              }
              break;
            }
          }
        }

        if (!executedCommand) {
          console.log("Voice command: No recognized command found");
        }
      },
      [
        cameraActive,
        toggleCamera,
        captureAndPredict,
        isModelLoaded,
        isProcessing,
        speakText,
      ]
    );

    // Speech Recognition Setup with improved error handling
    const startSpeechRecognition = useCallback(() => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Speech Recognition API not supported in this browser.");
        setVoiceStatus("error");
        return;
      }

      // Don't start if already active
      if (isRecognitionActiveRef.current || recognitionRef.current) {
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        isRecognitionActiveRef.current = true;

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "id-ID";
        recognition.maxAlternatives = 3; // Increased for better accuracy

        recognition.onstart = () => {
          console.log("Voice recognition started.");
          setVoiceStatus("active");
        };

        recognition.onerror = (event) => {
          console.warn("Voice recognition error:", event.error);

          // Clean up state
          isRecognitionActiveRef.current = false;
          recognitionRef.current = null;
          setVoiceStatus("error");

          // Only restart for recoverable errors
          if (["network", "audio-capture", "no-speech"].includes(event.error)) {
            scheduleRecognitionRestart();
          }
        };

        recognition.onend = () => {
          console.log("Voice recognition ended.");
          isRecognitionActiveRef.current = false;
          recognitionRef.current = null;
          setVoiceStatus("inactive");

          // Always restart recognition automatically
          scheduleRecognitionRestart();
        };

        recognition.onresult = (event) => {
          // Process all results to catch the best match
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              // Try all alternatives for better command matching
              for (let j = 0; j < result.length; j++) {
                const transcript = result[j].transcript.toLowerCase().trim();
                if (transcript && transcript.length > 2) {
                  // Minimum length check
                  processVoiceCommand(transcript);
                  break; // Use first valid transcript
                }
              }
            }
          }
        };

        recognition.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        isRecognitionActiveRef.current = false;
        recognitionRef.current = null;
        setVoiceStatus("error");
      }
    }, [processVoiceCommand]);

    const scheduleRecognitionRestart = useCallback(() => {
      // Clear any existing timeout
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
        recognitionTimeoutRef.current = null;
      }

      // Only schedule restart if not already active
      if (!isRecognitionActiveRef.current && recognitionRef.current === null) {
        recognitionTimeoutRef.current = setTimeout(() => {
          if (
            !isRecognitionActiveRef.current &&
            recognitionRef.current === null
          ) {
            startSpeechRecognition();
          }
        }, 2000); // 2 second delay to prevent rapid restarts
      }
    }, [startSpeechRecognition]);

    const stopSpeechRecognition = useCallback(() => {
      console.log("Stopping speech recognition...");

      // Clear restart timeout
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
        recognitionTimeoutRef.current = null;
      }

      // Stop recognition if active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          console.log("Speech recognition aborted");
        } catch (error) {
          console.warn("Error aborting speech recognition:", error);
        }
      }

      // Clean up state
      isRecognitionActiveRef.current = false;
      recognitionRef.current = null;
      setVoiceStatus("inactive");
    }, []);

    // Initialize speech recognition
    useEffect(() => {
      const initTimeout = setTimeout(() => {
        startSpeechRecognition();
      }, 1000);

      return () => {
        clearTimeout(initTimeout);
        stopSpeechRecognition();
      };
    }, [startSpeechRecognition, stopSpeechRecognition]);

    // Initialize camera elements
    useEffect(() => {
      if (videoRef.current && canvasRef.current) {
        window.videoElement = videoRef.current;
        window.canvasElement = canvasRef.current;

        if (onCameraReady) {
          onCameraReady(videoRef.current, canvasRef.current);
        }
      }

      return () => {
        stopCameraStream();
        window.videoElement = null;
        window.canvasElement = null;
      };
    }, [stopCameraStream, onCameraReady]);

    // Handle camera activation
    useEffect(() => {
      if (cameraActive && videoRef.current) {
        startCameraStream().catch((error) => {
          console.error("Failed to start camera:", error);
        });
      } else if (!cameraActive) {
        stopCameraStream();
      }
    }, [cameraActive, startCameraStream, stopCameraStream]);

    const getVoiceStatusDisplay = () => {
      switch (voiceStatus) {
        case "active":
          return {
            color: "green",
            icon: "🎤",
            text: "Voice commands active",
            bgClass:
              "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
          };
        case "error":
          return {
            color: "red",
            icon: "🚫",
            text: "Voice recognition error",
            bgClass:
              "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
          };
        default:
          return {
            color: "yellow",
            icon: "⏳",
            text: "Voice recognition starting...",
            bgClass:
              "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
          };
      }
    };

    const voiceStatusInfo = getVoiceStatusDisplay();

    return (
      <div className="space-y-6">
        {/* Voice Recognition Status */}
        <div className="text-center">
          <div
            className={`inline-flex items-center space-x-2 ${voiceStatusInfo.bgClass} px-3 py-1 rounded-full text-xs`}
          >
            <div
              className={`w-2 h-2 bg-${
                voiceStatusInfo.color
              }-500 rounded-full ${
                voiceStatus === "active" ? "animate-pulse" : ""
              }`}
            ></div>
            <span>
              {voiceStatusInfo.icon} {voiceStatusInfo.text}
            </span>
          </div>
        </div>

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
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
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

        {/* Voice Commands Guide */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full flex-shrink-0">
              <span className="text-sm">🎤</span>
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              <p className="font-medium mb-2">
                Voice Commands (Indonesian/English):
              </p>
              <ul className="space-y-1 text-xs">
                <li>
                  • <strong>&quot;Buka kamera&quot;</strong> /{" "}
                  <strong>&quot;Open camera&quot;</strong> - Turn on camera
                </li>
                <li>
                  • <strong>&quot;Tutup kamera&quot;</strong> /{" "}
                  <strong>&quot;Close camera&quot;</strong> - Turn off camera
                </li>
                <li>
                  • <strong>&quot;Mulai deteksi uang&quot;</strong> /{" "}
                  <strong>&quot;Detect money&quot;</strong> - Start detection
                  (camera stays on)
                </li>
                <li>
                  • <strong>&quot;Foto&quot;</strong> /{" "}
                  <strong>&quot;Capture&quot;</strong> - Take photo (camera
                  stays on)
                </li>
              </ul>
            </div>
          </div>
        </div>

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
                  <li>
                    • Camera will stay active after detection for continuous use
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CameraComponent.displayName = "CameraComponent";

// Global declarations
declare global {
  interface Window {
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default CameraComponent;
