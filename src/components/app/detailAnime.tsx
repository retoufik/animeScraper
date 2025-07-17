import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
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
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
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
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Anime Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-80 h-auto rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                
                {/* Score Badge */}
                {anime.score && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold flex items-center gap-1">
                    <span>⭐</span>
                    <span>{anime.score}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Anime Info */}
            <div className="text-white space-y-6">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {anime.title}
                </h1>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {anime.episodes && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-purple-400">📺</span>
                      <span>{anime.episodes} Episodes</span>
                    </div>
                  )}
                  {anime.status && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-purple-400">📡</span>
                      <span>{anime.status}</span>
                    </div>
                  )}
                  {anime.aired?.string && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-purple-400">📅</span>
                      <span>{anime.aired.string}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {anime.genres && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                    <span>▶️</span>
                    <span>Watch Now</span>
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-xl font-medium transition-all duration-300">
                    <span>➕</span>
                    <span>Add to List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Synopsis */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-purple-400">📖</span>
            Synopsis
          </h2>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <p className="text-gray-300 leading-relaxed text-lg">
              {anime.synopsis}
            </p>
          </div>
        </div>

        {/* Episodes Section */}
        {episodes.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-purple-400">📺</span>
              Episodes ({episodes.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {episodes.map((episode, index) => (
                <div
                  key={episode.mal_id}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
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
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <span>⭐</span>
                        <span>{episode.score}</span>
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
                      <span className="text-purple-400">📅</span>
                      <span>{new Date(episode.aired).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Episode Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {episode.filler && (
                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full">
                        Filler
                      </span>
                    )}
                    {episode.recap && (
                      <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-full">
                        Recap
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-xl">
                    <div className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg">
                      <span className="text-xl">▶️</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Episodes Message */}
        {episodes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Episodes Available</h3>
            <p className="text-gray-400">Episode information is not available for this anime.</p>
          </div>
        )}
      </div>

      {/* Episode Modal */}
      {selectedEpisode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Episode {selectedEpisode.mal_id}
              </h3>
              <button
                onClick={() => setSelectedEpisode(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <h4 className="text-purple-300 font-medium mb-4">
              {selectedEpisode.title}
            </h4>
            
            {selectedEpisode.aired && (
              <p className="text-gray-400 mb-4">
                Aired: {new Date(selectedEpisode.aired).toLocaleDateString()}
              </p>
            )}
            
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300">
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
      )}

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
      `}</style>
    </div>
  );
}