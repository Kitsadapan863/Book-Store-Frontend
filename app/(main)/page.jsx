"use client";
import { useState, useCallback } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { useBasket } from "../hooks/useBasket";
import BookCarousel from "../components/books/BookCarousel";
import BookCard from "../components/books/BookCard";
import GenreList from "../components/books/GenreList";

export default function BooksPage() {
  const { books, genres, filteredBooks, loading, filterByGenre, search, reset } = useBooks();
  const { refetch: refetchBasket } = useBasket();
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedGenre(null);
    val.trim() ? search(val) : reset();
  };

  const clearSearch = () => {
    setQuery("");
    reset();
  };

  const handleGenre = useCallback((genreId) => {
    setSelectedGenre(genreId);
    setQuery("");
    filterByGenre(genreId);
  }, [filterByGenre]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">กำลังโหลดหนังสือ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Carousel */}
      <BookCarousel books={books} />

      {/* Search bar */}
      <div className="relative mb-8 max-w-xl mx-auto">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="ค้นหาชื่อหนังสือ หรือผู้แต่ง..."
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
        />
        {query && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <GenreList
            genres={genres}
            selectedGenre={selectedGenre}
            onSelect={handleGenre}
          />
        </aside>

        {/* Books grid */}
        <main className="flex-1">
          {/* Result count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {query
                ? `ผลลัพธ์สำหรับ "${query}"`
                : selectedGenre
                ? `หมวดหมู่ที่เลือก`
                : "หนังสือทั้งหมด"}
              {" "}
              <span className="font-semibold text-gray-700">({filteredBooks.length} เล่ม)</span>
            </p>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <BookOpen size={48} className="mb-4 opacity-40" />
              <p className="text-base font-medium">ไม่พบหนังสือ</p>
              <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddSuccess={refetchBasket}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}