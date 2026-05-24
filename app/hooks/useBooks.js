"use client";
import { useState, useEffect, useCallback } from "react";
import { getBooks, getGenres } from "../lib/api";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, genresRes] = await Promise.all([getBooks(), getGenres()]);
        setBooks(booksRes.data);
        setFilteredBooks(booksRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterByGenre = useCallback(
    (genreId) => {
      if (!genreId) {
        setFilteredBooks(books);
        return;
      }
      setFilteredBooks(books.filter((b) => b.genres.includes(genreId)));
    },
    [books]
  );

  const search = useCallback(
    (query) => {
      const q = query.toLowerCase();
      setFilteredBooks(
        books.filter(
          (b) =>
            b.book_name.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q)
        )
      );
    },
    [books]
  );

  const reset = useCallback(() => setFilteredBooks(books), [books]);

  return { books, genres, filteredBooks, loading, filterByGenre, search, reset };
}