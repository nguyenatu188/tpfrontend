import { useState, useEffect } from "react";

interface BudgetItem {
  name: string;
  price: number;
  type: "accommodation" | "transport";
}

interface BudgetResponse {
  message: string;
  data: {
    items: BudgetItem[];
    totalPrice: number;
  };
}

interface BudgetError {
  error: string;
}

const useBudget = (tripId: string) => {
  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!tripId) return;

    const fetchBudget = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/budget?tripId=${tripId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData: BudgetError = await response.json();
          throw new Error(errorData.error || "Failed to fetch budget");
        }

        const data: BudgetResponse = await response.json();
        setBudget(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching budget:", err);
        setError( "An error occurred");
        setBudget(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [tripId]);

  return { budget, error, loading };
};

export default useBudget;