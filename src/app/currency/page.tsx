"use client";
import { useState } from "react";
import CurrencyForm from "@/components/currency/CurrencyForm";
import CurrencyList from "@/components/currency/CurrencyList";
import { ModeToggle } from "@/components/theme/toggle-mode";
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
        <ResponsiveHeader />
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
