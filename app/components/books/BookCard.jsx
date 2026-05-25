"use client";
import Link from "next/link";
import { ShoppingCart, BookOpen } from "lucide-react";
import { addToBasket } from "../../lib/api";
import { useState } from "react";

export default function BookCard({ book, onAddSuccess }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const inStock = Number(book.amounts) > 0;
  
  const handleAddToBasket = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToBasket(book.isbn);
      setAdded(true);
      onAddSuccess?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("basketUpdated"));
      }
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Add to basket failed:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group h-full flex flex-col">

        {/* Book cover */}
        <div className="relative bg-gray-100 h-52 overflow-hidden">
          {book.image_url ? (
            <img
              src={book.image_url}
              alt={book.book_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <BookOpen size={40} />
              <p className="text-xs mt-2">ไม่มีรูปปก</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug mb-1">
            {book.book_name}
          </h3>
          <p className="text-gray-400 text-xs mb-3">{book.author}</p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-red-600 font-bold text-base">
              ฿{Number(book.price).toLocaleString()}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!inStock) return;
                handleAddToBasket(e);
              }}
              disabled={adding || !inStock}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${added
                  ? "bg-green-500 text-white"
                  : inStock
                    ? "bg-gray-900 hover:bg-gray-700 text-white disabled:bg-gray-300"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
            >
              {adding ? (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={13} />
              )}
              { !inStock ? "สินค้าหมด" : (added ? "เพิ่มแล้ว ✓" : "ใส่ตะกร้า") }
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}