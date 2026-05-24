"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookCarousel({ books }) {
  const slides = books.filter((b) => b.image_url).slice(0, 5);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-900 mb-8">
      {/* Slides */}
      {slides.map((book, i) => (
        <div
          key={book.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={book.image_url}
            alt={book.book_name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-white font-bold text-lg drop-shadow">{book.book_name}</p>
            <p className="text-gray-300 text-sm">{book.author}</p>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}