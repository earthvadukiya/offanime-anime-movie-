import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import website_name from "@/src/config/website";
import MovieSpotlight from "../components/MovieSpotlight";
import MovieRow from "../components/MovieRow";
import {
  getTrending,
  getSpotlight,
  getPopularMovies,
  getNowPlaying,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
} from "../utils/tmdb";

export default function MoviesHome() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    spotlight: [],
    trending: [],
    popularMovies: [],
    nowPlaying: [],
    popularTV: [],
    topMovies: [],
    topTV: [],
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [spotlight, trending, popularMovies, nowPlaying, popularTV, topMovies, topTV] =
          await Promise.all([
            getSpotlight(8),
            getTrending("week"),
            getPopularMovies(),
            getNowPlaying(),
            getPopularTV(),
            getTopRatedMovies(),
            getTopRatedTV(),
          ]);
        if (!alive) return;
        setData({ spotlight, trending, popularMovies, nowPlaying, popularTV, topMovies, topTV });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#a855f7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0f] text-white">
      <Helmet>
        <title>{`Movies & TV - ${website_name}`}</title>
      </Helmet>

      <MovieSpotlight items={data.spotlight} />

      <div className="max-w-[1600px] mx-auto px-6 py-8 max-[575px]:px-3 flex flex-col gap-y-12">
        <MovieRow label="Trending Now" data={data.trending} viewAllPath="/movies/trending" />
        <MovieRow label="Popular Movies" data={data.popularMovies} viewAllPath="/movies/category/popular-movies" />
        <MovieRow label="Now Playing" data={data.nowPlaying} viewAllPath="/movies/category/now-playing" />
        <MovieRow label="Popular TV Shows" data={data.popularTV} viewAllPath="/movies/category/popular-tv" />
        <MovieRow label="Top Rated Movies" data={data.topMovies} viewAllPath="/movies/category/top-movies" />
        <MovieRow label="Top Rated TV Shows" data={data.topTV} viewAllPath="/movies/category/top-tv" />
      </div>
    </div>
  );
}
