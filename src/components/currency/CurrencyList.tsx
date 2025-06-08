import { useEffect, useState } from "react";
import Toast from "../toast/Toast";
import Modal from "../toast/Modal";

type Currency = {
  id: string;
  name: string;
  code: string;
  value: number;
};

interface CurrencyListProps {
  onEdit: (currency: Currency) => void;
  refreshTrigger: number;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: "success" | "error" | "info";
}

interface ModalState {
  isOpen: boolean;
  currency: Currency | null;
}

export default function CurrencyList({
  onEdit,
  refreshTrigger,
}: CurrencyListProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "info",
  });
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    isOpen: false,
    currency: null,
  });

  useEffect(() => {
    fetchCurrencies();
  }, [refreshTrigger]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  async function fetchCurrencies() {
    setLoading(true);
    try {
      const response = await fetch("/api/currency");
      if (!response.ok) {
        throw new Error("Failed to fetch currencies");
      }
      const data = await response.json();
      setCurrencies(data || []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      showToast("Error fetching currencies. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(currency: Currency) {
    setDeleteModal({ isOpen: true, currency });
  }

  async function handleDeleteConfirm() {
    if (!deleteModal.currency) return;

    const { id, name } = deleteModal.currency;

    try {
      const response = await fetch(`/api/currency/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete currency");
      }

      setCurrencies((prev) => prev.filter((currency) => currency.id !== id));
      showToast(`${name} deleted successfully!`, "success");
    } catch (error) {
      console.error("Error deleting currency:", error);
      showToast(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
      );
    }

    setDeleteModal({ isOpen: false, currency: null });
  }

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Loading currencies...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span className="text-lg sm:text-xl lg:text-2xl">📊</span>
              <span className="hidden sm:inline">Nominal List</span>
              <span className="sm:hidden">Currencies</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                {currencies.length}
              </span>
            </h2>
            <button
              onClick={fetchCurrencies}
              className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-3 sm:px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors flex items-center gap-1 sm:gap-2 text-sm"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {currencies.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">💸</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No currencies found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Add your first currency to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded flex-shrink-0">
                          {currency.code}
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {currency.name}
                        </h3>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        IDR {formatValue(currency.value)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Exchange rate to Indonesian Rupiah
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 sm:ml-4">
                      <button
                        onClick={() => onEdit(currency)}
                        className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 shadow-sm hover:shadow-md text-sm"
                      >
                        <span className="text-xs sm:text-sm">✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(currency)}
                        className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 shadow-sm hover:shadow-md text-sm"
                      >
                        <span className="text-xs sm:text-sm">🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, currency: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Currency"
        message={`Are you sure you want to delete "${deleteModal.currency?.name}" (${deleteModal.currency?.code})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}
