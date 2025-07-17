import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  score?: number;
  scored_by?: number;
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
    window.location.href = `/anime/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading amazing anime...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!animeList.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No anime found</h2>
          <p className="text-gray-300">Try refreshing the page or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Summer 2025 Anime
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the hottest anime series of the summer season
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">👁️</span>
              <span>{animeList.length} Series</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">📅</span>
              <span>Summer 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {animeList.map((anime, index) => (
            <div
              key={anime.mal_id}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards"
              }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Score Badge */}
                {anime.score && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span>⭐</span>
                    {anime.score}
                  </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                  anime.status === 'Currently Airing' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {anime.status}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-2xl">▶️</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                  {anime.title_english || anime.title}
                </h2>

                {/* Air Date */}
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="text-purple-400">📅</span>
                  <span>{anime.aired.string}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {anime.genres.slice(0, 3).map((genre, genreIndex) => (
                    <span
                      key={genreIndex}
                      className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 rounded-full hover:bg-purple-500/30 transition-colors duration-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {anime.genres.length > 3 && (
                    <span className="text-gray-400 text-xs px-3 py-1">
                      +{anime.genres.length - 3} more
                    </span>
                  )}
                </div>

                {/* Synopsis */}
                <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {anime.synopsis}
                </p>

                {/* Action Button */}
                <Link
                  to={`/anime/${anime.mal_id}`}
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 no-underline"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>▶️</span>
                    <span>Watch Now</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}