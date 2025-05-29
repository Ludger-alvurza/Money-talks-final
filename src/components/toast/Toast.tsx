import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 dark:bg-green-600 text-white";
      case "error":
        return "bg-red-500 dark:bg-red-600 text-white";
      case "info":
        return "bg-blue-500 dark:bg-blue-600 text-white";
      default:
        return "bg-gray-500 dark:bg-gray-600 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div
        className={`${getToastStyles()} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80 max-w-md`}
      >
        <span className="text-xl">{getIcon()}</span>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors ml-2"
        >
          <span className="text-lg">✕</span>
        </button>
      </div>
    </div>
  );
}
