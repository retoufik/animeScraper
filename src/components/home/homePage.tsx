import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Slider from "../Slider";

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
  data: AnimeData[];
  pagination: {
    current_page: number;
    has_next_page: boolean;
    items: {
      count: number;
      total: number;
    };
  };
}

export default function HomePage(): React.ReactElement {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(`https://api.jikan.moe/v4/seasons/2025/summer?sfw`);
        setAnimeList(response.data.data);
        setFilteredAnime(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAnime(animeList);
    } else {
      const filtered = animeList.filter(anime => 
        anime.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (anime.title_english && anime.title_english.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAnime(filtered);
    }
  }, [searchTerm, animeList]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-grow pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading amazing anime...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-grow pt-16">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-300">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!animeList.length) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-grow pt-16">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No anime found</h2>
            <p className="text-gray-300">Try refreshing the page or check back later</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Slider */}
      <div className="pt-16 w-full">
        <Slider />
      </div>

      {/* Search Input and Info */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search anime..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6 text-gray-300 justify-center md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">👁️</span>
              <span>{filteredAnime.length} {filteredAnime.length === 1 ? 'Series' : 'Series'}</span>
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
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-16 flex-grow">
        {filteredAnime.length === 0 ? (
          <div className="text-center py-16 h-full flex items-center justify-center">
            <div>
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
              <p className="text-gray-400">Try a different search term</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAnime.map((anime, index) => (
              <div
                key={anime.mal_id}
                className="card-container group relative"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animation: "slideInUp 0.8s ease-out forwards",
                  opacity: 0
                }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-500 group-hover:shadow-purple-500/25 group-hover:scale-[1.02] group-hover:border-purple-400/40"></div>
                
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
                
                <div className="relative z-10 p-2 h-full flex flex-col">
                  {/* Image Container with Enhanced Effects */}
                  <div className="relative overflow-hidden aspect-[2/3] rounded-xl mb-4 shadow-lg">
                    {/* Background Blur Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10"></div>
                    
                    <img
                      src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                    />
                    
                    {/* Animated Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-30">
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {/* Score Badge with Glow */}
                        {anime.score && (
                          <div className="score-badge bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-yellow-400/50">
                            <span className="animate-pulse">⭐</span>
                            {anime.score.toFixed(1)}
                          </div>
                        )}
                        
                        {/* Status Badge with Animation */}
                        <div className={`status-badge px-2 py-1 rounded-full text-xs font-medium shadow-lg transform transition-all duration-300 group-hover:scale-110 ${
                          anime.status === 'Currently Airing' 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse-green shadow-green-400/50' 
                            : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-blue-400/50'
                        }`}>
                          <span className="relative z-10">{anime.status}</span>
                        </div>
                      </div>
                      
                      {/* Play Button with Enhanced Animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="play-button opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                          <div className="relative">
                            {/* Pulsing Ring */}
                            <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-pulse"></div>
                            
                            {/* Main Button */}
                            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white p-4 rounded-full shadow-2xl shadow-purple-500/50 cursor-pointer transition-all duration-300 hover:scale-110">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section with Enhanced Typography */}
                  <div className="flex-1 flex flex-col space-y-3">
                    {/* Title with Gradient */}
                    <h2 className="text-sm font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent line-clamp-2 group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                      {anime.title_english || anime.title}
                    </h2>

                    {/* Air Date with Icon Animation */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="line-clamp-1 group-hover:text-gray-300 transition-colors duration-300">{anime.aired.string}</span>
                    </div>

                    {/* Enhanced Genres */}
                    <div className="flex flex-wrap gap-1">
                      {anime.genres.slice(0, 2).map((genre, genreIndex) => (
                        <span
                          key={genreIndex}
                          className="genre-tag relative bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2 py-0.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 hover:border-purple-400/50 cursor-default overflow-hidden"
                        >
                          <span className="relative z-10">{genre.name}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="text-gray-400 text-xs px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                          +{anime.genres.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Synopsis with Fade Effect */}
                    <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {anime.synopsis || "No synopsis available."}
                    </p>

                    {/* Enhanced Action Button */}
                    <div className="mt-auto">
                      <Link
                        to={`/anime/${anime.mal_id}`}
                        className="watch-button block w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-center py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40 no-underline group/button"
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-white/10 to-pink-500/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/button:opacity-100 group-hover/button:animate-shimmer"></div>
                        
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover/button:scale-110 group-hover/button:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          <span className="font-semibold tracking-wide">WATCH NOW</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/20 py-6 text-center text-gray-400 text-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Anime List. All rights reserved.</p>
          <p className="mt-2">Data provided by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Jikan API</a></p>
        </div>
      </footer>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            background: linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(34, 211, 238, 0.1));
          }
          50% {
            background: linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(34, 211, 238, 0.2));
          }
        }
        
        @keyframes pulse-green {
          0%, 100% {
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.3);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-out;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-pulse-green {
          animation: pulse-green 2s ease-in-out infinite;
        }
        
        .card-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            rgba(168, 85, 247, 0.3), 
            rgba(236, 72, 153, 0.3), 
            rgba(34, 211, 238, 0.3),
            rgba(168, 85, 247, 0.3)
          );
          border-radius: 18px;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -1;
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .card-container:hover::before {
          opacity: 1;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .score-badge::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          transition: transform 0.6s;
        }
        
        .score-badge:hover::before {
          transform: rotate(45deg) translateY(-100%);
        }
        
        .genre-tag::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent);
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
        
        .genre-tag:hover::after {
          width: 100px;
          height: 100px;
        }
        
        .play-button::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.1), transparent 70%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        html, body {
          width: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
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
        
        /* Smooth scrolling for better UX */
        * {
          scroll-behavior: smooth;
        }
        
        /* Custom selection colors */
        ::selection {
          background: rgba(168, 85, 247, 0.3);
          color: white;
        }
        
        /* Enhanced focus states for accessibility */
        .watch-button:focus {
          outline: 2px solid rgba(168, 85, 247, 0.8);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}