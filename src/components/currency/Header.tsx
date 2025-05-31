import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  showNavigation?: boolean;
  className?: string;
}

const navigationItems = [
  { href: "/money-talks", label: "Home", icon: "🏠" },
  { href: "/currency", label: "Currency", icon: "💱" },
  { href: "/list-support-money", label: "Support Money", icon: "📋" },
  { href: "/about", label: "About", icon: "ℹ️" },
];

// Animated Hamburger Menu Component
interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 group"
      aria-label="Toggle navigation menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center relative">
        {/* Top line */}
        <span
          className={`block h-0.5 w-6 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-in-out transform origin-center ${
            isOpen ? "rotate-45 translate-y-0" : "rotate-0 -translate-y-1.5"
          }`}
        />

        {/* Middle line */}
        <span
          className={`block h-0.5 w-6 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        />

        {/* Bottom line */}
        <span
          className={`block h-0.5 w-6 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-in-out transform origin-center ${
            isOpen ? "-rotate-45 translate-y-0" : "rotate-0 translate-y-1.5"
          }`}
        />
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
    </button>
  );
};

export default function ResponsiveHeader({
  title = "Money Talks",
  subtitle = "AI-Powered Indonesian Rupiah Recognition with Voice Control",
  mobileSubtitle = "AI-Powered IDR Recognition",
  icon = "💰",
  onVoiceToggle,
  onAudioToggle,
  voiceSupported = true,
  initialAudioEnabled = true,
  initialListening = false,
  showModeToggle = true,
  showNavigation = true,
  className = "",
}: ResponsiveHeaderProps) {
  const [isListening, setIsListening] = useState(initialListening);
  const [audioEnabled, setAudioEnabled] = useState(initialAudioEnabled);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePage = (href: string) => {
    return pathname === href;
  };

  return (
    <div
      className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg sticky top-0 z-50 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
      <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col gap-4">
          {/* Top row - Logo, Title and Controls */}
          <div className="flex justify-between items-center">
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
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Animated Mobile Menu Toggle */}
              {showNavigation && (
                <AnimatedHamburger
                  isOpen={isMobileMenuOpen}
                  onClick={toggleMobileMenu}
                />
              )}

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

          {/* Navigation Menu */}
          {showNavigation && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-medium transition-all duration-300 transform hover:scale-105 group overflow-hidden ${
                      isActivePage(item.href)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="relative flex items-center space-x-2">
                      <span className="text-base lg:text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Mobile Navigation with smooth slide animation */}
              <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 rounded-b-xl">
                  <div className="px-4 py-3 space-y-2">
                    {navigationItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                          isActivePage(item.href)
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: isMobileMenuOpen
                            ? `slideInUp 0.3s ease-out ${index * 50}ms both`
                            : "none",
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS Keyframes for menu item animation */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
