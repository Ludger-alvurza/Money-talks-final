"use client";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [recognitionStatus, setRecognitionStatus] = useState("Initializing...");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isProcessingCommand = useRef(false);
  const hasSpokenWelcome = useRef(false);
  const welcomeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add debug message
  const addDebug = useCallback((message: string) => {
    console.log(`[Speech Debug] ${message}`);
    setDebugInfo((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  }, []);

  // Text-to-speech function with speech recognition management
  const speak = useCallback(
    (text: string) => {
      addDebug(`Speaking: "${text}"`);
      if ("speechSynthesis" in window) {
        // Stop speech recognition before speaking
        if (recognitionRef.current && isListening) {
          addDebug("🛑 Stopping recognition before TTS");
          try {
            recognitionRef.current.stop();
          } catch (e) {
            addDebug(`Error stopping recognition: ${e}`);
          }
        }

        // Stop any current speech
        speechSynthesis.cancel();
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 0.9;
        utterance.volume = 0.8;

        utterance.onstart = () => {
          addDebug("🔊 Speech started");
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          addDebug("🔇 Speech ended - restarting recognition");
          setIsSpeaking(false);

          // Restart recognition after TTS finishes
          setTimeout(() => {
            if (recognitionRef.current && !isProcessingCommand.current) {
              try {
                addDebug("🔄 Restarting recognition after TTS");
                recognitionRef.current.start();
              } catch (error) {
                addDebug(`❌ Failed to restart after TTS: ${error}`);
              }
            }
          }, 500);
        };

        utterance.onerror = (e) => {
          addDebug(`❌ Speech error: ${e.error}`);
          setIsSpeaking(false);

          // Try to restart recognition even if TTS failed
          setTimeout(() => {
            if (recognitionRef.current && !isProcessingCommand.current) {
              try {
                addDebug("🔄 Restarting recognition after TTS error");
                recognitionRef.current.start();
              } catch (error) {
                addDebug(`❌ Failed to restart after TTS error: ${error}`);
              }
            }
          }, 500);
        };

        speechSynthesis.speak(utterance);
      } else {
        addDebug("❌ Speech synthesis not supported");
      }
    },
    [addDebug, isListening]
  );

  // Handle voice commands with better matching
  const handleVoiceCommand = useCallback(
    (command: string) => {
      if (isProcessingCommand.current) {
        addDebug("Already processing a command, skipping...");
        return;
      }

      isProcessingCommand.current = true;
      addDebug(`Processing command: "${command}"`);

      const normalizedCommand = command.toLowerCase().trim();

      // Define command patterns with more flexible matching
      const commandPatterns = [
        // Main navigation commands
        /(?:buka|mulai|jalankan).*(?:halaman|page).*(?:deteksi|detection).*(?:uang|money)/i,
        /(?:buka|mulai|jalankan).*(?:deteksi|detection).*(?:uang|money)/i,
        /(?:mulai|start).*(?:deteksi|detection)/i,
        /(?:deteksi|detection).*(?:uang|money)/i,
        /(?:scan|periksa|cek).*(?:uang|money)/i,
        /(?:buka|open).*(?:deteksi|detection)/i,
        /(?:halaman|page).*(?:deteksi|detection)/i,
        // Simple commands
        /^(?:deteksi|detection)$/i,
        /^(?:mulai|start)$/i,
        /^(?:scan|periksa|cek)$/i,
        // Additional patterns for better recognition
        /(?:buka).*(?:deteksi)/i,
        /(?:mulai).*(?:uang)/i,
        /(?:deteksi).*(?:mata)/i, // "deteksi mata uang"
      ];

      const isCommandMatch = commandPatterns.some((pattern) =>
        pattern.test(normalizedCommand)
      );

      if (isCommandMatch) {
        addDebug(`✅ Command matched! Navigating to detection page...`);
        speak("Membuka halaman deteksi uang");

        // Navigate after a short delay
        setTimeout(() => {
          addDebug("Executing navigation to /money-talks");
          router.push("/money-talks");
          isProcessingCommand.current = false;
        }, 1500);
      } else {
        addDebug(`❌ No command match found for: "${normalizedCommand}"`);
        isProcessingCommand.current = false;
      }
    },
    [addDebug, router, speak]
  );

  // Request microphone permission
  const requestMicrophonePermission = useCallback(async () => {
    try {
      addDebug("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately
      setPermissionGranted(true);
      addDebug("✅ Microphone permission granted");
      return true;
    } catch (error) {
      addDebug(`❌ Microphone permission denied: ${error}`);
      setPermissionGranted(false);
      return false;
    }
  }, [addDebug]);

  // Start speech recognition
  const startRecognition = useCallback(() => {
    if (!recognitionRef.current || isListening || isSpeaking) {
      addDebug(
        `Cannot start recognition - listening: ${isListening}, speaking: ${isSpeaking}`
      );
      return;
    }

    try {
      addDebug("🎤 Starting speech recognition...");
      recognitionRef.current.start();
    } catch (error) {
      addDebug(`❌ Failed to start recognition: ${error}`);

      // Try to restart after a short delay
      setTimeout(() => {
        if (recognitionRef.current && !isListening && !isSpeaking) {
          try {
            addDebug("🔄 Attempting to restart recognition...");
            recognitionRef.current.start();
          } catch (e) {
            addDebug(`❌ Restart failed: ${e}`);
          }
        }
      }, 2000);
    }
  }, [addDebug, isListening, isSpeaking]);

  // Trigger welcome message
  const triggerWelcomeMessage = useCallback(() => {
    if (hasSpokenWelcome.current) {
      addDebug("Welcome already spoken, skipping...");
      return;
    }

    if (!speechSupported) {
      addDebug("Speech not supported, skipping welcome");
      return;
    }

    if (!permissionGranted) {
      addDebug("Permission not granted, skipping welcome");
      return;
    }

    addDebug("🎉 Triggering welcome message");
    hasSpokenWelcome.current = true;

    const welcomeText =
      "Selamat datang di aplikasi Money Detector. Deteksi keaslian uang dengan AI. Katakan 'buka halaman deteksi uang' untuk memulai atau tekan tombol mulai deteksi.";

    // Small delay to ensure everything is ready
    setTimeout(() => {
      speak(welcomeText);
    }, 500);
  }, [speechSupported, permissionGranted, speak, addDebug]);

  // Initialize speech recognition - only once
  useEffect(() => {
    if (typeof window === "undefined" || recognitionRef.current) return;

    addDebug("🚀 Initializing speech recognition...");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addDebug("❌ Speech recognition not supported in this browser");
      setSpeechSupported(false);
      setRecognitionStatus("Not supported");
      setIsInitialized(true);
      return;
    }

    addDebug("✅ Speech recognition supported!");
    setSpeechSupported(true);
    setRecognitionStatus("Setting up...");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configuration
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.maxAlternatives = 1;

    // Event handlers
    recognition.onstart = () => {
      addDebug("🎤 Recognition started successfully");
      setIsListening(true);
      setRecognitionStatus("Listening...");
    };

    recognition.onend = () => {
      addDebug("🔇 Recognition ended");
      setIsListening(false);
      setRecognitionStatus("Restarting...");

      // Auto-restart with delay, but only if not processing command or speaking
      setTimeout(() => {
        if (
          recognitionRef.current &&
          !isProcessingCommand.current &&
          !isSpeaking
        ) {
          try {
            addDebug("🔄 Auto-restarting recognition...");
            recognitionRef.current.start();
          } catch (error) {
            addDebug(`❌ Auto-restart failed: ${error}`);
            setRecognitionStatus("Ready - Click to restart");
          }
        }
      }, 1000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      addDebug(
        `❌ Recognition error: ${event.error} - ${
          event.message || "No message"
        }`
      );
      setRecognitionStatus(`Error: ${event.error}`);

      if (event.error === "not-allowed") {
        addDebug("❌ Permission denied. Please allow microphone access.");
        setRecognitionStatus("Permission denied");
        setPermissionGranted(false);
      } else if (event.error === "aborted") {
        addDebug("⚠️ Recognition aborted - likely due to TTS interference");
        setRecognitionStatus("Paused for TTS...");
      } else if (event.error === "no-speech") {
        addDebug("⚠️ No speech detected. Will restart...");
        setRecognitionStatus("No speech - restarting...");
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          final += transcript;
          addDebug(
            `📝 Final result: "${transcript}" (confidence: ${
              result[0].confidence?.toFixed(2) || "N/A"
            })`
          );
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
        addDebug(`👂 Interim: "${interim}"`);
      }

      if (final) {
        const finalTranscript = final.toLowerCase().trim();
        setTranscript(finalTranscript);
        setInterimTranscript("");
        addDebug(`✅ Final transcript: "${finalTranscript}"`);

        // Process the command
        handleVoiceCommand(finalTranscript);
      }
    };

    recognition.onsoundstart = () => {
      addDebug("🔊 Sound detected");
    };

    recognition.onspeechstart = () => {
      addDebug("🗣️ Speech detected");
    };

    recognition.onnomatch = () => {
      addDebug("❓ No match found for speech");
    };

    // Mark as initialized
    setIsInitialized(true);
    addDebug("🎯 Speech recognition initialization complete");

    return () => {
      if (recognition) {
        addDebug("🛑 Stopping recognition on cleanup");
        try {
          recognition.stop();
        } catch (e) {
          addDebug(`Cleanup error: ${e}`);
        }
      }
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  // Request permission and start recognition after component mounts
  useEffect(() => {
    const initializeVoiceRecognition = async () => {
      if (!isInitialized || !speechSupported) {
        addDebug("Not ready for voice initialization yet");
        return;
      }

      if (!permissionGranted) {
        addDebug("Requesting microphone permission...");
        const granted = await requestMicrophonePermission();
        if (granted) {
          addDebug("Permission granted, starting recognition...");
          // Start recognition after permission is granted
          setTimeout(() => {
            startRecognition();
          }, 1000);
        }
      } else {
        addDebug("Permission already granted, starting recognition...");
        setTimeout(() => {
          startRecognition();
        }, 500);
      }
    };

    initializeVoiceRecognition();
  }, [
    isInitialized,
    speechSupported,
    permissionGranted,
    requestMicrophonePermission,
    startRecognition,
    addDebug,
  ]);

  // Welcome message effect - separate from recognition initialization
  useEffect(() => {
    if (!isInitialized || !speechSupported || !permissionGranted) {
      addDebug("Not ready for welcome message yet");
      return;
    }

    if (hasSpokenWelcome.current) {
      addDebug("Welcome already spoken");
      return;
    }

    addDebug("Setting up welcome message timer...");

    // Set up welcome message with longer delay to ensure everything is ready
    welcomeTimeoutRef.current = setTimeout(() => {
      addDebug("Welcome timer triggered");
      triggerWelcomeMessage();
    }, 4000); // Increased delay to 4 seconds

    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
        welcomeTimeoutRef.current = null;
      }
    };
  }, [
    isInitialized,
    speechSupported,
    permissionGranted,
    triggerWelcomeMessage,
    addDebug,
  ]);

  const handleStartDetection = () => {
    speak("Membuka halaman deteksi uang");
    setTimeout(() => {
      router.push("/money-talks");
    }, 1000);
  };

  // Manual restart function for debugging
  const handleRestartRecognition = async () => {
    if (recognitionRef.current) {
      addDebug("🔄 Manual restart requested");

      // Stop current recognition
      try {
        recognitionRef.current.stop();
      } catch (e) {
        addDebug(`Error stopping: ${e}`);
      }

      // Stop any TTS
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      // Request permission again if needed
      if (!permissionGranted) {
        await requestMicrophonePermission();
      }

      // Start after delay
      setTimeout(() => {
        startRecognition();
      }, 1000);
    }
  };

  // Manual trigger for welcome message (for testing)
  // const handleTriggerWelcome = () => {
  //   addDebug("🎯 Manual welcome trigger");
  //   hasSpokenWelcome.current = false; // Reset flag
  //   triggerWelcomeMessage();
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-green-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-emerald-300 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-green-300 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header with Mode Toggle and Voice Status */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          {speechSupported && (
            <div
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
              onClick={handleRestartRecognition}
              title="Click to restart voice recognition"
            >
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  isListening
                    ? "bg-red-500 animate-pulse"
                    : isSpeaking
                    ? "bg-blue-500 animate-pulse"
                    : permissionGranted
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isSpeaking ? "Speaking..." : recognitionStatus}
              </span>
            </div>
          )}
          <ModeToggle />
        </div>

        {/* Debug Panel - Show more info */}
        {debugInfo.length > 0 && (
          // <div className="absolute top-20 left-6 max-w-md bg-black/80 text-white text-xs p-4 rounded-lg font-mono max-h-40 overflow-y-auto">
          //   <div className="mb-2 font-bold flex justify-between items-center">
          //     <span>Debug Info:</span>
          //     <button
          //       onClick={handleTriggerWelcome}
          //       className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          //       title="Test welcome message"
          //     >
          //       🎵 Test Welcome
          //     </button>
          //   </div>
          //   {debugInfo.map((info, index) => (
          //     <div key={index} className="mb-1">
          //       {info}
          //     </div>
          //   ))}
          // </div>
          <div></div>
        )}

        {/* Main Content */}
        <main className="text-center max-w-4xl mx-auto">
          {/* Voice Command Instructions */}
          {speechSupported && (
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2V4c0-1.103.897-2 2-2zM19 7v2c0 3.859-3.141 7-7 7s-7-3.141-7-7V7c0-.552-.448-1-1-1s-1 .448-1 1v2c0 4.879 3.519 8.926 8 9.86V21H8c-.552 0-1-.448-1 1s.448 1 1 1h8c.552 0 1-.448 1-1s-.448-1-1-1h-3v-2.14c4.481-.934 8-4.981 8-9.86V7c0-.552-.448-1-1-1s-1 .448-1 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Kontrol Suara{" "}
                  {isListening
                    ? "🟢 Mendengarkan"
                    : isSpeaking
                    ? "🔵 Berbicara"
                    : permissionGranted
                    ? "🟡 Siap"
                    : "🔴 Tidak Aktif"}
                </h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed mb-3">
                Perintah yang bisa digunakan:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-600 dark:text-blue-400 mb-3">
                <div>&quot;membuka halaman deteksi uang&quot;</div>
                <div>&quot;mulai deteksi&quot;</div>
                <div>&quot;deteksi uang&quot;</div>
                <div>&quot;scan uang&quot;</div>
                <div>&quot;periksa uang&quot;</div>
                <div>&quot;cek uang&quot;</div>
                <div>&quot;buka deteksi&quot;</div>
                <div>&quot;deteksi&quot;</div>
              </div>

              {!permissionGranted && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded border-l-4 border-red-400 mb-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    ⚠️ Izin mikrofon diperlukan untuk kontrol suara.
                    <button
                      onClick={requestMicrophonePermission}
                      className="ml-2 underline hover:no-underline"
                    >
                      Klik untuk mengizinkan
                    </button>
                  </p>
                </div>
              )}

              {/* Current transcript display */}
              <div className="space-y-2">
                {interimTranscript && (
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border-l-4 border-yellow-400">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      👂 Mendengarkan:{" "}
                      <span className="italic">
                        &quot;{interimTranscript}&quot;
                      </span>
                    </p>
                  </div>
                )}

                {transcript && (
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border-l-4 border-green-400">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      ✅ Terakhir didengar:{" "}
                      <span className="font-medium">
                        &quot;{transcript}&quot;
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Money Icon Animation */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-300 rounded-full animate-pulse"></div>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent mb-6 animate-fade-in">
            Money Detector
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
            Deteksi Keaslian Uang dengan AI
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Aplikasi canggih untuk mendeteksi keaslian uang kertas menggunakan
            teknologi
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {" "}
              Artificial Intelligence
            </span>
            . Cukup foto, dan dapatkan hasil instan!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Akurasi Tinggi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI dengan tingkat akurasi hingga 99.5%
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Hasil Instan
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deteksi dalam hitungan detik
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Aman & Privat
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Data tidak disimpan atau dibagikan
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleStartDetection}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Mulai Deteksi
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>

            <button className="border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
              Cara Penggunaan
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                99.5%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Akurasi
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                2s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Waktu Proses
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                10k+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pengguna
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tersedia
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
