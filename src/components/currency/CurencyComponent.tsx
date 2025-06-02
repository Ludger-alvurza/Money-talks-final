import { useEffect, useState } from "react";

type Currency = {
  id: string;
  value: number;
};

interface CurrencyListProps {
  refreshTrigger: number;
}

export default function CurrencyList({ refreshTrigger }: CurrencyListProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrencies();
  }, [refreshTrigger]);

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
    } finally {
      setLoading(false);
    }
  }
  const sortedCurrencies = currencies.sort((a, b) => a.value - b.value);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading nominal...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
      {sortedCurrencies.map((currency) => (
        <div
          key={currency.id}
          className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 sm:p-4 text-center shadow transition-transform transform hover:scale-105"
        >
          <span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-300 break-words">
            {formatValue(currency.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
