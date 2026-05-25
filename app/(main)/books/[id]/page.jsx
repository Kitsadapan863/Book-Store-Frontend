"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getBookById, getGenres } from "../../../lib/api";
import { useBasket } from "../../../hooks/useBasket";
import BookDetail from "../../../components/books/BookDetail";
import { BookOpen } from "lucide-react";

export default function BookDetailPage() {
  const { id } = useParams();
  const { refetch: refetchBasket } = useBasket();

  const [book, setBook]     = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [bookRes, genresRes] = await Promise.all([
          getBookById(id),
          getGenres(),
        ]);
        setBook(bookRes.data);
        setGenres(genresRes.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">กำลังโหลดข้อมูลหนังสือ...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <BookOpen size={48} className="mb-4 opacity-40" />
        <p className="text-base font-medium">ไม่พบหนังสือที่ต้องการ</p>
        <p className="text-sm mt-1">กรุณากลับไปหน้าหลักและลองใหม่อีกครั้ง</p>
      </div>
    );
  }

  return (
    <BookDetail
      book={book}
      genres={genres}
      onAddSuccess={refetchBasket}
    />
  );
}