"use client";
import { useState } from "react";
import CurrencyForm from "@/components/currency/CurrencyForm";
import CurrencyList from "@/components/currency/CurrencyList";
import { ModeToggle } from "@/components/theme/toggle-mode";

type Currency = {
  id: string;
  name: string;
  code: string;
  value: number;
};

export default function Home() {
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
              💱 Currency Manager
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
              Manage exchange rates and currency information with ease. Add,
              update, and track various currencies in one place.
            </p>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Currency Form */}
          <CurrencyForm
            editingCurrency={editingCurrency}
            onSave={handleSave}
            onCancelEdit={handleCancelEdit}
          />

          {/* Currency List */}
          <CurrencyList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2">
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
