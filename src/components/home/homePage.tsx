import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Fix the import

interface AnimeData {
  mal_id: number;
  title: string;
  title_english: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  status: string;
  aired: {
    string: string;
  };
  genres: Array<{
    name: string;
  }>;
}

interface ApiResponse {
  data: {
    data: AnimeData[];
    pagination: {
      current_page: number;
      has_next_page: boolean;
      items: {
        count: number;
        total: number;
      };
    };
  };
}

export default function HomePage(): React.ReactElement {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(`https://api.jikan.moe/v4/seasons/2025/summer?sfw`);
        setAnimeList(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  const forwardToDetail = (id: number) => {
    window.location.href = `/anime/${id}`; // Adjust the path as needed for your routing
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!animeList.length) return <div>No anime found</div>;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 d-flex">
      {animeList.map((anime) => (
        <div key={anime.mal_id} className="border rounded-lg p-4 shadow-sm d-flex flex-col">
          <img 
            src={anime.images.jpg.image_url} 
            alt={anime.title}
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="text-xl font-bold mt-2">{anime.title_english || anime.title}</h2>
          <p className="text-gray-600 text-sm mt-1">{anime.aired.string}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {anime.genres.map((genre, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <p className="text-gray-700 mt-2 line-clamp-3">{anime.synopsis}</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            <Link to={`/anime/${anime.mal_id}`} className="text-white no-underline">
              Watch Now
            </Link>
          </button>
        </div>
      ))}
    </div>
  );
}