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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!anime) return <div className="p-4">No anime found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Anime Image and Basic Info */}
        <div className="flex flex-col">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full rounded-lg shadow-lg mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{anime.title}</h1>
        </div>

        {/* Synopsis */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
          <p className="text-gray-700 leading-relaxed">{anime.synopsis}</p>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((episode) => (
            <div
              key={episode.mal_id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Episode {episode.mal_id}</h3>
                {episode.score && (
                  <span className="text-sm text-blue-600">
                    Score: {episode.score}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{episode.title}</p>
              {episode.aired && (
                <p className="text-xs text-gray-500">Aired: {episode.aired}</p>
              )}
              {(episode.filler || episode.recap) && (
                <div className="flex gap-2 mt-2">
                  {episode.filler && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Filler
                    </span>
                  )}
                  {episode.recap && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      Recap
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}