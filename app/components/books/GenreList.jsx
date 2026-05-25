"use client";

export default function GenreList({ genres, selectedGenre, onSelect }) {
  // console.log("Genres:", genres);
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
        หมวดหมู่
      </h3>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
              ${!selectedGenre
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            ทั้งหมด
          </button>
        </li>
        {genres.map((genre) => (
          <li key={genre.id}>
            <button
              onClick={() => onSelect(genre.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${selectedGenre === genre.id
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}