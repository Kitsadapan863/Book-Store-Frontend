"use client";
import { useState, useEffect, useCallback } from "react";
import { getBasketItems } from "../lib/api";

export function useBasket() {
  const [basketItems, setBasketItems] = useState([]);
  const [basketCount, setBasketCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBasket = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBasketItems();
      setBasketItems(data);
      const total = data.reduce((sum, item) => sum + item.count, 0);
      setBasketCount(total);
    } catch {
      setBasketItems([]);
      setBasketCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) fetchBasket();
  }, [fetchBasket]);

  return { basketItems, basketCount, loading, refetch: fetchBasket };
}