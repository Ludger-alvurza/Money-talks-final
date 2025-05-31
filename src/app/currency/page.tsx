"use client";
import { useState, useEffect } from "react";
import CurrencyForm from "@/components/currency/CurrencyForm";
import CurrencyList from "@/components/currency/CurrencyList";
import ResponsiveHeader from "@/components/currency/Header";

type Currency = {
  id: string;
  name: string;
  code: string;
  value: number;
};

export default function Home() {
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations setelah component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    setEditingCurrency(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingCurrency(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header dengan fade-in dari atas */}
      <div
        className={`bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 
                   transform transition-all duration-700 ease-out
                   ${
                     isLoaded
                       ? "translate-y-0 opacity-100"
                       : "-translate-y-full opacity-0"
                   }`}
      >
        <ResponsiveHeader />
      </div>

      {/* Main Content dengan staggered animation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Currency Form dengan slide-in dari kiri */}
          <div
            className={`transform transition-all duration-800 ease-out delay-200
                       ${
                         isLoaded
                           ? "translate-x-0 opacity-100"
                           : "-translate-x-full opacity-0"
                       }`}
          >
            <CurrencyForm
              editingCurrency={editingCurrency}
              onSave={handleSave}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Currency List dengan slide-in dari kanan */}
          <div
            className={`transform transition-all duration-800 ease-out delay-400
                       ${
                         isLoaded
                           ? "translate-x-0 opacity-100"
                           : "translate-x-full opacity-0"
                       }`}
          >
            <CurrencyList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>

      {/* Footer dengan fade-in dari bawah */}
      <footer
        className={`bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8 sm:mt-12 lg:mt-16
                   transform transition-all duration-700 ease-out delay-600
                   ${
                     isLoaded
                       ? "translate-y-0 opacity-100"
                       : "translate-y-full opacity-0"
                   }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <span>💰</span>
              Built with Next.js & Supabase
              <span>🚀</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
