"use client";
import { useState, useEffect, useCallback } from "react";
import { getBasketItems, getBasketDetail } from "../lib/api";

export function useBasket() {
  const [basketItems, setBasketItems] = useState([]);
  const [basketCount, setBasketCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBasket = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBasketItems();
      // console.log("Fetched basket items:", data);

      // For each basket item, fetch book detail by ISBN and merge
      const itemsWithDetails = await Promise.all(
        data.map(async (item) => {
          const isbn = item.isbn || item.book_isbn || item.isbn13 || item.code;
          if (!isbn) return { ...item, detail: null };
          try {
            const { data: detail } = await getBasketDetail(isbn);
            return { ...item, detail };
          } catch (err) {
            return { ...item, detail: null };
          }
        })
      );

      setBasketItems(itemsWithDetails);
      const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onBasketUpdated = () => {
      const token = localStorage.getItem("token");
      if (token) fetchBasket();
    };
    window.addEventListener("basketUpdated", onBasketUpdated);
    return () => window.removeEventListener("basketUpdated", onBasketUpdated);
  }, [fetchBasket]);

  return { basketItems, basketCount, loading, refetch: fetchBasket };
}