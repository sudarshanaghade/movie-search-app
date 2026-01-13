import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [sortFilter, setSortFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState({});

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=1ade8330&s=${query}`
      );
      const data = await res.json();
      setMovies(data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (movieId) => {
    setFavorites((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const renderStars = (rating) => {
    const rate = parseFloat(rating);
    const stars = Math.min(Math.round(rate / 2), 5);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  const getYearBadge = (year) => {
    const currentYear = new Date().getFullYear();
    if (parseInt(year) >= currentYear - 1) return "NEW";
    if (parseInt(year) >= currentYear - 5) return "POPULAR";
    return null;
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          <h1>Movie App</h1>
        </div>
        <div className="search-container">
          <input
            placeholder="Search Movies or Shows"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchMovies()}
            disabled={loading}
          />
          <button
            className="search-btn"
            onClick={searchMovies}
            disabled={loading}
            title={loading ? "Searching..." : "Search"}
          >
            {loading ? "⟳" : "🔍"}
          </button>
        </div>
        <div className="header-right">
          <div className="profile-icon" title="Profile">👤</div>
        </div>
      </div>

      <div className="content">
        <div className="section-header">
          <h2>Movies</h2>
          <select
            className="filter-dropdown"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
          >
            <option>All</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
            <option>Horror</option>
            <option>Thriller</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid">
            {movies.map((movie) => {
              const badgeType = getYearBadge(movie.Year);
              return (
                <div className="card" key={movie.imdbID}>
                  <div className="card-image">
                    {badgeType && <span className="card-badge">{badgeType}</span>}
                    <img src={movie.Poster} alt={movie.Title} />
                    <div className="card-overlay">
                      <Link href={`/movie/${movie.imdbID}`}>
                        <button className="play-btn">▶ Play</button>
                      </Link>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{movie.Title}</h3>
                    <p className="year">{movie.Year}</p>
                    <div className="card-rating">
                      <span className="star">{renderStars(movie.imdbRating || "5")}</span>
                    </div>
                    <div className="card-footer">
                      <select className="rating-dropdown">
                        <option>Lower</option>
                        <option>Higher</option>
                      </select>
                      <button
                        className={`favorite-btn ${favorites[movie.imdbID] ? "active" : ""}`}
                        onClick={() => toggleFavorite(movie.imdbID)}
                        title={favorites[movie.imdbID] ? "Remove from favorites" : "Add to favorites"}
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>Search for your favorite movies to get started! 🍿</p>
          </div>
        )}
      </div>
    </>
  );
}
