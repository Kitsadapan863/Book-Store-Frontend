"use client";
import { useState } from "react";
import { Plus, Minus, BookOpen } from "lucide-react";
import { increaseBasketItem, decreaseBasketItem } from "../../lib/api";

export default function BasketRow({ item, onUpdate }) {
  
  const [loading, setLoading] = useState(null); // "increase" | "decrease" | null

  const handleIncrease = async () => {
    setLoading("increase");
    try {
      await increaseBasketItem(item.detail?.isbn || item.isbn);
      onUpdate?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("basketUpdated"));
      }
    } catch (err) {
      console.error("Increase failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleDecrease = async () => {
    setLoading("decrease");
    try {
      await decreaseBasketItem(item.detail?.isbn || item.isbn);
      onUpdate?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("basketUpdated"));
      }
    } catch (err) {
      console.error("Decrease failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const total = item.detail?.price * item.count;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Book info */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {item.detail?.image_url ? (
              <img src={item.detail?.image_url} alt={item.detail?.book_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <BookOpen size={18} />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm line-clamp-2">{item.detail?.book_name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{item.detail?.author}</p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-4 text-center text-sm text-gray-600">
        ฿{Number(item.detail?.price || 0).toLocaleString()}
      </td>

      {/* Quantity controls */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={loading !== null}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            {loading === "decrease"
              ? <span className="w-3 h-3 border border-gray-400 border-t-gray-700 rounded-full animate-spin" />
              : <Minus size={12} />}
          </button>

          <span className="w-8 text-center font-semibold text-gray-800 text-sm">
            {item.count }
          </span>

          <button
            onClick={handleIncrease}
            disabled={loading !== null}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            {loading === "increase"
              ? <span className="w-3 h-3 border border-gray-400 border-t-gray-700 rounded-full animate-spin" />
              : <Plus size={12} />}
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="py-4 px-4 text-center font-semibold text-red-600 text-sm">
        ฿{Number(total).toLocaleString()}
      </td>
    </tr>
  );
}