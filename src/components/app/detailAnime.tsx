import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Episode {
  mal_id: number;
  title: string;
  title_japanese: string;
  title_romanji: string;
  aired: string;
  score: number | null;
  filler: boolean;
  recap: boolean;
  forum_url: string;
}

interface EpisodesResponse {
  data: Episode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

interface AnimeDetails {
  title: string;
  title_english?: string;
  synopsis: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score?: number;
  scored_by?: number;
  episodes?: number;
  status?: string;
  aired?: {
    string: string;
  };
  genres?: Array<{
    name: string;
  }>;
  studios?: Array<{
    name: string;
  }>;
  rating?: string;
  duration?: string;
  popularity?: number;
  rank?: number;
  source?: string;
}

interface AnimeResponse {
  data: AnimeDetails;
}

export default function DetailAnime(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [animeRes, episodesRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${id}`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`),
        ]);

        if (!animeRes.ok || !episodesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const animeData: AnimeResponse = await animeRes.json();
        const episodesData: EpisodesResponse = await episodesRes.json();

        setAnime(animeData.data);
        setEpisodes(episodesData.data);

        // Preload background image
        if (animeData.data.images.jpg.large_image_url) {
          const img = new Image();
          img.src = animeData.data.images.jpg.large_image_url;
          img.onload = () => setBackgroundLoaded(true);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading anime details...</p>
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
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Anime not found</h2>
          <p className="text-gray-300">The anime you're looking for doesn't exist</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-purple-900/30 to-slate-900/90 z-10"></div>
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${backgroundLoaded ? 'opacity-20' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
            filter: "blur(8px) brightness(0.7)"
          }}
        ></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16 z-20">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 mb-8 text-purple-300 hover:text-purple-100 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Anime Image */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative group transform transition-all duration-500 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500"></div>
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="relative z-10 w-80 h-auto rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105 border-2 border-white/20"
                  />
                  
                  {/* Score Badge */}
                  {anime.score && (
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full font-bold flex items-center gap-1 shadow-lg z-20 transform transition-all duration-300 hover:scale-110">
                      <span>⭐</span>
                      <span>{anime.score.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Anime Info */}
              <div className="text-white space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {anime.title_english || anime.title}
                  </h1>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <h2 className="text-xl text-purple-300 mb-6">{anime.title}</h2>
                  )}
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {anime.episodes && (
                      <div className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-purple-400">📺</span>
                        <span>{anime.episodes} Episodes</span>
                      </div>
                    )}
                    {anime.status && (
                      <div className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-purple-400">📡</span>
                        <span>{anime.status}</span>
                      </div>
                    )}
                    {anime.aired?.string && (
                      <div className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-purple-400">📅</span>
                        <span>{anime.aired.string}</span>
                      </div>
                    )}
                    {anime.popularity && (
                      <div className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-purple-400">🔥</span>
                        <span>#{anime.popularity} Popularity</span>
                      </div>
                    )}
                    {anime.rank && (
                      <div className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-purple-400">🏆</span>
                        <span>#{anime.rank} Ranked</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {anime.genres && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {anime.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm hover:bg-purple-500/30 transition-all duration-300 hover:scale-105"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Studios */}
                  {anime.studios && anime.studios.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-400 mb-2">Studios</h3>
                      <div className="flex flex-wrap gap-2">
                        {anime.studios.map((studio, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm hover:bg-blue-500/30 transition-all duration-300 hover:scale-105"
                          >
                            {studio.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Watch Now</span>
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Add to List</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="">
          {/* Synopsis */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Synopsis
            </h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-500 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10">
              <p className="text-gray-300 leading-relaxed text-lg">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {anime.source && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                <h3 className="text-gray-400 text-sm mb-2">Source</h3>
                <p className="text-white font-medium">{anime.source}</p>
              </div>
            )}
            {anime.duration && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                <h3 className="text-gray-400 text-sm mb-2">Duration</h3>
                <p className="text-white font-medium">{anime.duration}</p>
              </div>
            )}
            {anime.rating && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                <h3 className="text-gray-400 text-sm mb-2">Rating</h3>
                <p className="text-white font-medium">{anime.rating}</p>
              </div>
            )}
            {anime.scored_by && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                <h3 className="text-gray-400 text-sm mb-2">Scored By</h3>
                <p className="text-white font-medium">{anime.scored_by.toLocaleString()} users</p>
              </div>
            )}
          </div>

          {/* Episodes Section */}
          {episodes.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Episodes ({episodes.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {episodes.map((episode, index) => (
                  <div
                    key={episode.mal_id}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animation: "fadeInUp 0.6s ease-out forwards"
                    }}
                    onClick={() => setSelectedEpisode(episode)}
                  >
                    {/* Episode Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold text-lg">
                        Episode {episode.mal_id}
                      </h3>
                      {episode.score && (
                        <div className="flex items-center gap-1 text-yellow-400 text-sm bg-black/30 px-2 py-1 rounded-full">
                          <span>⭐</span>
                          <span>{episode.score.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Episode Title */}
                    <h4 className="text-purple-300 font-medium mb-3 line-clamp-2">
                      {episode.title}
                    </h4>

                    {/* Episode Meta */}
                    {episode.aired && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(episode.aired).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Episode Tags */}
                    <div className="flex gap-2 flex-wrap">
                      {episode.filler && (
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30 rounded-full">
                          Filler
                        </span>
                      )}
                      {episode.recap && (
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border border-gray-500/30 rounded-full">
                          Recap
                        </span>
                      )}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Episodes Message */}
          {episodes.length === 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="text-6xl mb-4">📺</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Episodes Available</h3>
              <p className="text-gray-400">Episode information is not available for this anime.</p>
            </div>
          )}
        </div>
      </div>

      {/* Episode Modal */}
      {selectedEpisode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-slate-800/90 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 animate-pulse-glow z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Episode {selectedEpisode.mal_id}
                </h3>
                <button
                  onClick={() => setSelectedEpisode(null)}
                  className="text-gray-400 hover:text-white text-2xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>
              
              <h4 className="text-purple-300 font-medium mb-4">
                {selectedEpisode.title}
              </h4>
              
              {selectedEpisode.aired && (
                <p className="text-gray-400 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Aired: {new Date(selectedEpisode.aired).toLocaleDateString()}
                </p>
              )}
              
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Episode
                </button>
                <button
                  onClick={() => setSelectedEpisode(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
        
        @keyframes pulse-glow {
          0%, 100% {
            background: linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(34, 211, 238, 0.1));
          }
          50% {
            background: linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(34, 211, 238, 0.2));
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}