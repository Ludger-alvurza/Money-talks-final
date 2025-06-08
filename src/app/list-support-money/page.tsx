"use client";

import React, { useEffect, useState } from "react";
import ResponsiveHeader from "@/components/currency/Header";

type Currency = {
  id: string;
  name: string;
  code: string;
  value: number;
};

// Komponen CurrencyListViewOnly khusus untuk halaman ini dengan responsivitas penuh dan animasi
function CurrencyListViewOnly() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCurrencies();
  }, []);

  // Trigger staggered animation untuk currency items
  useEffect(() => {
    if (!loading && currencies.length > 0) {
      setTimeout(() => setItemsLoaded(true), 100);
    }
  }, [loading, currencies]);

  async function fetchCurrencies() {
    setLoading(true);
    setItemsLoaded(false);
    try {
      const response = await fetch("/api/currency");
      if (!response.ok) {
        throw new Error("Failed to fetch currencies");
      }
      const data = await response.json();
      setCurrencies(data || []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Loading currencies...
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 transform transition-all duration-500 ease-out">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 animate-pulse">
            Loading currencies...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-700 ease-out">
      {/* Header Section - Mobile Optimized dengan slide-in */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-gray-200 dark:border-gray-600 transform transition-all duration-600 ease-out translate-y-0 opacity-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl animate-bounce">
              📊
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Nominal List
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full transform transition-all duration-500 hover:scale-105">
              {currencies.length} currencies
            </span>
          </div>
          <button
            onClick={fetchCurrencies}
            className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-3 sm:px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span className="text-sm transition-transform duration-300 hover:rotate-180">
              🔄
            </span>
            Refresh
          </button>
        </div>
      </div>

      {/* Content Section - Mobile Optimized dengan animasi */}
      <div className="p-4 sm:p-6 md:p-8">
        {currencies.length === 0 ? (
          <div className="text-center py-8 sm:py-12 transform transition-all duration-700 ease-out opacity-100">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
              💸
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No currencies found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
              No currency data available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {currencies.map((currency, index) => (
              <div
                key={currency.id}
                className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-5 md:p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 transform
                           ${
                             itemsLoaded
                               ? "translate-x-0 opacity-100"
                               : "translate-x-full opacity-0"
                           }`}
                style={{
                  transitionDelay: itemsLoaded ? `${index * 100}ms` : "0ms",
                  transitionDuration: "600ms",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Currency Info - Mobile Stacked */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded inline-block w-fit transition-all duration-300 hover:scale-110">
                        {currency.code}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {currency.name}
                      </h3>
                    </div>

                    {/* Value Display - Mobile Optimized */}
                    <div className="space-y-1">
                      <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300 hover:scale-105">
                        IDR {formatValue(currency.value)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Exchange rate to Indonesian Rupiah
                      </div>
                    </div>
                  </div>

                  {/* Additional info for larger screens dengan hover effect */}
                  <div className="hidden md:flex items-center text-gray-400 dark:text-gray-500 transition-all duration-300 hover:text-blue-500 dark:hover:text-blue-400">
                    <svg
                      className="w-4 h-4 transition-transform duration-300 hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CurrencyPage() {
  const [mounted, setMounted] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger page animations
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ResponsiveHeader />
        <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4 sm:mb-6 shadow-lg">
              <span className="text-2xl sm:text-3xl md:text-4xl">💰</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
              Supported Money List
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
              Real-time exchange rates and currency information at your
              fingertips
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-500">
      {/* Header dengan slide-in dari atas */}
      <div
        className={`transform transition-all duration-700 ease-out ${
          pageLoaded
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <ResponsiveHeader />
      </div>

      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Page Header - Mobile Optimized dengan fade-in dan scale */}
        <div
          className={`text-center mb-8 sm:mb-12 md:mb-16 transform transition-all duration-800 ease-out delay-200 ${
            pageLoaded
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-4 sm:mb-6 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl">
            <span className="text-2xl sm:text-3xl md:text-4xl animate-bounce">
              💰
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 transition-all duration-700">
            Supported Money List
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            List of supported nominal money
          </p>

          <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>

        {/* Currency List Container - Mobile Optimized dengan slide-in dari bawah */}
        <div
          className={`max-w-7xl mx-auto transform transition-all duration-900 ease-out delay-400 ${
            pageLoaded
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 md:p-8 hover:shadow-3xl transition-all duration-500">
            {/* Status Header - Mobile Optimized dengan pulse effect */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4 transform transition-all duration-700 ease-out delay-600 ${
                pageLoaded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
                Live Supported Nominal
              </h2>

              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Updated continuously</span>
                <span className="sm:hidden">Live updates</span>
              </div>
            </div>

            {/* Currency List dengan stagger animation */}
            <div
              className={`transform transition-all duration-800 ease-out delay-800 ${
                pageLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <CurrencyListViewOnly />
            </div>
          </div>
        </div>

        {/* Footer Info - Mobile Optimized dengan fade-in */}
        <div
          className={`text-center mt-8 sm:mt-12 md:mt-16 transform transition-all duration-700 ease-out delay-1000 ${
            pageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <span className="hidden sm:inline">
                Data provided by leading financial institutions
              </span>
              <span className="sm:hidden">Real-time financial data</span>
            </span>
          </div>
        </div>

        {/* Mobile-specific help text dengan fade-in */}
        <div
          className={`text-center mt-4 block sm:hidden transform transition-all duration-500 ease-out delay-1200 ${
            pageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs text-gray-400 dark:text-gray-500 px-4">
            Scroll horizontally if content appears cut off
          </p>
        </div>
      </main>
    </div>
  );
}
