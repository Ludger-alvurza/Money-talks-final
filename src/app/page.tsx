"use client";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [recognitionStatus, setRecognitionStatus] = useState("Initializing...");
  const router = useRouter();
  const recognitionRef = useRef<any>(null);

  // Add debug message
  const addDebug = (message: string) => {
    console.log(`[Speech Debug] ${message}`);
    setDebugInfo((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      addDebug("Checking for speech recognition support...");

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        addDebug("Speech recognition supported!");
        setSpeechSupported(true);
        setRecognitionStatus("Supported");

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        // Configuration
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "id-ID";
        recognition.maxAlternatives = 1;

        // Event handlers
        recognition.onstart = () => {
          addDebug("Recognition started");
          setIsListening(true);
          setRecognitionStatus("Listening...");
        };

        recognition.onend = () => {
          addDebug("Recognition ended");
          setIsListening(false);
          setRecognitionStatus("Stopped");

          // Auto-restart if not manually stopped
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                addDebug("Auto-restarting recognition...");
                recognition.start();
              } catch (e) {
                addDebug(`Auto-restart failed: ${e}`);
              }
            }
          }, 1000);
        };

        recognition.onerror = (event: any) => {
          addDebug(
            `Recognition error: ${event.error} - ${
              event.message || "No message"
            }`
          );
          setRecognitionStatus(`Error: ${event.error}`);

          // Handle specific errors
          if (event.error === "not-allowed") {
            addDebug("Permission denied. Please allow microphone access.");
            setRecognitionStatus("Permission denied");
          } else if (event.error === "no-speech") {
            addDebug("No speech detected. Will restart...");
          }
        };

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          if (interim) {
            setInterimTranscript(interim);
            addDebug(`Interim: "${interim}"`);
          }

          if (final) {
            const finalLower = final.toLowerCase().trim();
            setTranscript(finalLower);
            setInterimTranscript("");
            addDebug(`Final: "${finalLower}"`);
            handleVoiceCommand(finalLower);
          }
        };

        recognition.onsoundstart = () => {
          addDebug("Sound detected");
        };

        recognition.onspeechstart = () => {
          addDebug("Speech detected");
        };

        recognition.onnomatch = () => {
          addDebug("No match found");
        };

        // Start recognition after a delay
        const startTimer = setTimeout(() => {
          try {
            addDebug("Starting initial recognition...");
            recognition.start();
          } catch (e) {
            addDebug(`Failed to start: ${e}`);
          }
        }, 2000);

        return () => {
          clearTimeout(startTimer);
          if (recognition) {
            recognition.stop();
          }
        };
      } else {
        addDebug("Speech recognition not supported in this browser");
        setSpeechSupported(false);
        setRecognitionStatus("Not supported");
      }
    }
  }, []); // Remove dependencies to prevent re-initialization

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    addDebug(`Processing command: "${command}"`);

    const commands = [
      "buka halaman deteksi uang",
      "mulai deteksi",
      "deteksi uang",
      "scan uang",
      "periksa uang",
      "cek uang",
      "buka deteksi",
      "mulai scan",
      "halaman deteksi",
      "deteksi",
    ];

    // Check for partial matches too
    const foundCommand = commands.find(
      (cmd) =>
        command.includes(cmd) ||
        cmd.split(" ").every((word) => command.includes(word))
    );

    if (foundCommand) {
      addDebug(`Command matched: "${foundCommand}"`);
      speak("Membuka halaman deteksi uang");
      setTimeout(() => {
        router.push("/money-talks");
      }, 1000);
    } else {
      addDebug(`No command match found for: "${command}"`);
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    addDebug(`Speaking: "${text}"`);
    if ("speechSynthesis" in window) {
      // Stop any current speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      utterance.volume = 0.8;

      utterance.onstart = () => addDebug("Speech started");
      utterance.onend = () => addDebug("Speech ended");
      utterance.onerror = (e) => addDebug(`Speech error: ${e.error}`);

      speechSynthesis.speak(utterance);
    }
  };

  // Manual start/stop functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        addDebug("Manual start requested");
        recognitionRef.current.start();
      } catch (e) {
        addDebug(`Manual start failed: ${e}`);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      addDebug("Manual stop requested");
      recognitionRef.current.stop();
    }
  };

  // Test voice command
  const testVoiceCommand = () => {
    addDebug("Testing voice command...");
    handleVoiceCommand("buka halaman deteksi uang");
  };

  // Announce page content when loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "Selamat datang di aplikasi Money Detector. Deteksi keaslian uang dengan AI. Katakan 'buka halaman deteksi uang' untuk memulai atau tekan tombol mulai deteksi."
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartDetection = () => {
    speak("Membuka halaman deteksi uang");
    setTimeout(() => {
      router.push("/money-talks");
    }, 1000);
  };

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
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div
                className={`w-3 h-3 rounded-full ${
                  isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {recognitionStatus}
              </span>
            </div>
          )}
          <ModeToggle />
        </div>

        {/* Debug Panel - Only show if there are debug messages */}
        {debugInfo.length > 0 && (
          // <div className="absolute top-6 left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-md">
          //   <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-2">
          //     Debug Info:
          //   </h4>
          //   <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          //     {debugInfo.map((info, index) => (
          //       <div key={index} className="font-mono">
          //         {info}
          //       </div>
          //     ))}
          //   </div>
          //   <div className="flex gap-2 mt-3">
          //     <button
          //       onClick={startListening}
          //       className="px-2 py-1 bg-green-500 text-white text-xs rounded"
          //       disabled={isListening}
          //     >
          //       Start
          //     </button>
          //     <button
          //       onClick={stopListening}
          //       className="px-2 py-1 bg-red-500 text-white text-xs rounded"
          //       disabled={!isListening}
          //     >
          //       Stop
          //     </button>
          //     <button
          //       onClick={testVoiceCommand}
          //       className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
          //     >
          //       Test
          //     </button>
          //   </div>
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
                    <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2V4c0-1.103.897-2 2-2zM19 7v2c0 3.859-3.141 7-7 7s-7-3.141-7-7V7c0-.552-.448-1-1-1s-1 .448-1 1v2c0 4.879 3.519 8.926 8 9.86V21H8c-.552 0-1 .448-1 1s.448 1 1 1h8c.552 0 1-.448 1-1s-.448-1-1-1h-3v-2.14c4.481-.934 8-4.981 8-9.86V7c0-.552-.448-1-1-1s-1 .448-1 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Kontrol Suara Aktif
                </h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed mb-3">
                Perintah yang bisa digunakan:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-600 dark:text-blue-400 mb-3">
                <div>"buka halaman deteksi uang"</div>
                <div>"mulai deteksi"</div>
                <div>"deteksi uang"</div>
                <div>"scan uang"</div>
                <div>"periksa uang"</div>
                <div>"cek uang"</div>
                <div>"buka deteksi"</div>
                <div>"halaman deteksi"</div>
              </div>

              {/* Current transcript display */}
              <div className="space-y-2">
                {interimTranscript && (
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border-l-4 border-yellow-400">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Mendengarkan:{" "}
                      <span className="italic">"{interimTranscript}"</span>
                    </p>
                  </div>
                )}

                {transcript && (
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border-l-4 border-green-400">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Terakhir didengar:{" "}
                      <span className="font-medium">"{transcript}"</span>
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
