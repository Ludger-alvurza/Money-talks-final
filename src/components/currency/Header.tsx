import React, { useState } from "react";
import { ModeToggle } from "../theme/toggle-mode";

// Props interface for TypeScript support
interface ResponsiveHeaderProps {
  title?: string;
  subtitle?: string;
  mobileSubtitle?: string;
  icon?: string;
  onVoiceToggle?: (isListening: boolean) => void;
  onAudioToggle?: (audioEnabled: boolean) => void;
  voiceSupported?: boolean;
  initialAudioEnabled?: boolean;
  initialListening?: boolean;
  showModeToggle?: boolean;
  className?: string;
}

export default function ResponsiveHeader({
  title = "IDR Currency Detector",
  subtitle = "AI-Powered Indonesian Rupiah Recognition with Voice Control",
  mobileSubtitle = "AI-Powered IDR Recognition",
  icon = "💰",
  onVoiceToggle,
  onAudioToggle,
  voiceSupported = true,
  initialAudioEnabled = true,
  initialListening = false,
  showModeToggle = true,
  className = "",
}: ResponsiveHeaderProps) {
  const [isListening, setIsListening] = useState(initialListening);
  const [audioEnabled, setAudioEnabled] = useState(initialAudioEnabled);

  const toggleVoiceRecognition = () => {
    const newListeningState = !isListening;
    setIsListening(newListeningState);
    onVoiceToggle?.(newListeningState);
  };

  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    onAudioToggle?.(newAudioState);
  };

  return (
    <div
      className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg sticky top-0 z-50 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
      <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          {/* Left section - Logo and Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl sm:text-2xl filter drop-shadow-sm">
                  {icon}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent truncate">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-1 font-medium hidden sm:block">
                {subtitle}
              </p>
              {/* Mobile subtitle - shorter version */}
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 font-medium sm:hidden">
                {mobileSubtitle}
              </p>
            </div>
          </div>

          {/* Right section - Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 w-full sm:w-auto justify-end">
            {showModeToggle && <ModeToggle />}

            {/* Voice Recognition Toggle */}
            {voiceSupported && (
              <button
                onClick={toggleVoiceRecognition}
                className={`group relative px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg sm:shadow-xl overflow-hidden ${
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
                <div className="relative flex items-center space-x-1 sm:space-x-2">
                  <span className="text-sm sm:text-lg">
                    {isListening ? "🎤" : "🎙️"}
                  </span>
                  <span className="hidden sm:inline">
                    {isListening ? "LISTENING" : "VOICE"}
                  </span>
                  {/* Mobile: Show shorter text */}
                  <span className="sm:hidden text-xs">
                    {isListening ? "ON" : "MIC"}
                  </span>
                </div>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`group relative px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg sm:shadow-xl overflow-hidden ${
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
              <div className="relative flex items-center space-x-1 sm:space-x-2">
                <span className="text-sm sm:text-lg">🔊</span>
                <span className="text-xs sm:text-sm">
                  {audioEnabled ? "ON" : "OFF"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
