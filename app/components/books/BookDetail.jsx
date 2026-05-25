"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, BookOpen, User, Tag } from "lucide-react";
import { addToBasket } from "../../lib/api";

export default function BookDetail({ book, genres, onAddSuccess }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded]   = useState(false);

  const handleAddToBasket = async () => {
    if (Number(book.amounts) <= 0) {
      console.warn("Book out of stock, cannot add to basket");
      return;
    }
    setAdding(true);
    try {
      await addToBasket(book.isbn);
      setAdded(true);
      onAddSuccess?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("basketUpdated"));
      }
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error("Add to basket failed:", err);
    } finally {
      setAdding(false);
    }
  };

  // จับ genre ของหนังสือเล่มนี้
  const bookGenres = genres.filter((g) => book.genres?.includes(g.id));
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        กลับหน้าหลัก
      </Link>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Book cover */}
          <div className="md:w-72 shrink-0 bg-gray-100 flex items-center justify-center p-8 min-h-72">
            {book.image_url ? (
              <img
                src={book.image_url}
                alt={book.book_name}
                className="w-full max-w-52 rounded-xl shadow-lg object-cover"
              />
            ) : (
              <div className="w-44 h-60 rounded-xl bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                <BookOpen size={40} />
                <p className="text-xs mt-2">ไม่มีรูปปก</p>
              </div>
            )}
          </div>

          {/* Book info */}
          <div className="flex-1 p-8 flex flex-col">
            {/* Genres */}
            {bookGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {bookGenres.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                  >
                    <Tag size={10} />
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">
              {book.book_name}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <User size={15} />
              <span>{book.author}</span>
            </div>

            {/* ISBN */}
            {book.isbn && (
              <p className="text-xs text-gray-400 mb-6">
                ISBN: {book.isbn}
              </p>
            )}

            {/* Description */}
            {book.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6 border-t border-gray-100 pt-5">
                {book.description}
              </p>
            )}

            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              {/* Price */}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">ราคา</p>
                <p className="text-3xl font-bold text-red-600">
                  ฿{Number(book.price).toLocaleString()}
                  <span className="text-sm font-normal text-gray-400 ml-1">บาท</span>
                </p>
              </div>

              {/* Add to basket */}
              <button
                onClick={handleAddToBasket}
                disabled={adding || Number(book.amounts) <= 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${added
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white"
                  }`}
              >
                {adding ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={16} />
                )}
                {added ? "เพิ่มลงตะกร้าแล้ว ✓" : (Number(book.amounts) > 0 ? "ใส่ตะกร้า" : "สินค้าหมด")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}