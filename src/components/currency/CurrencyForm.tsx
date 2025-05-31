import { useState, useEffect } from "react";
import Toast from "../toast/Toast";

type Currency = {
  id: string;
  name: string;
  code: string;
  value: number;
};

interface CurrencyFormProps {
  editingCurrency?: Currency | null;
  onSave: () => void;
  onCancelEdit: () => void;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: "success" | "error" | "info";
}

export default function CurrencyForm({
  editingCurrency,
  onSave,
  onCancelEdit,
}: CurrencyFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (editingCurrency) {
      setName(editingCurrency.name);
      setCode(editingCurrency.code);
      setValue(editingCurrency.value);
    } else {
      setName("");
      setCode("");
      setValue("");
    }
  }, [editingCurrency]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !code || value === "") {
      showToast("All fields are required!", "error");
      return;
    }

    setLoading(true);

    try {
      const url = editingCurrency
        ? `/api/currency/${editingCurrency.id}`
        : "/api/currency";

      const method = editingCurrency ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, code, value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingCurrency ? "update" : "add"} currency`
        );
      }

      showToast(
        `Currency ${editingCurrency ? "updated" : "added"} successfully!`,
        "success"
      );
      setName("");
      setCode("");
      setValue("");
      onSave();
    } catch (error) {
      console.error(
        `Error ${editingCurrency ? "updating" : "adding"} currency:`,
        error
      );
      showToast(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setName("");
    setCode("");
    setValue("");
    onCancelEdit();
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="text-lg sm:text-xl lg:text-2xl">💰</span>
            <span className="hidden sm:inline">
              {editingCurrency ? "Update Currency" : "Add New Currency"}
            </span>
            <span className="sm:hidden">
              {editingCurrency ? "Update" : "Add"} Currency
            </span>
          </h2>
          {editingCurrency && (
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1"
            >
              <span className="text-lg sm:text-xl">✕</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Mobile: Stack vertically, Desktop: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Currency Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rupiah"
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Currency Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., IDR"
                maxLength={3}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 uppercase"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Exchange Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder="e.g., 15500"
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="hidden sm:inline">
                    {editingCurrency ? "Updating..." : "Adding..."}
                  </span>
                  <span className="sm:hidden">
                    {editingCurrency ? "Updating..." : "Adding..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{editingCurrency ? "✏️" : "➕"}</span>
                  <span className="hidden sm:inline">
                    {editingCurrency ? "Update Currency" : "Add Currency"}
                  </span>
                  <span className="sm:hidden">
                    {editingCurrency ? "Update" : "Add"}
                  </span>
                </>
              )}
            </button>

            {editingCurrency && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
