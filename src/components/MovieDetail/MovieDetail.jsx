import React from 'react';
import './MovieDetail.css';

const MovieDetail = ({ movie, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !movie) return null;

  const getYear = () => {
    if (movie.release_date) {
      return new Date(movie.release_date).getFullYear();
    }
    return movie.year || 'N/A';
  };

  const getRuntime = () => {
    if (movie.runtime) {
      const hours = Math.floor(movie.runtime / 60);
      const minutes = movie.runtime % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}min`;
      }
      return `${minutes}min`;
    }
    return 'N/A';
  };

  const getGenres = () => {
    if (Array.isArray(movie.genres)) {
      return movie.genres.join(' & ');
    }
    return movie.genre || 'N/A';
  };

  return (
    <div className="movie-detail-hero">
      <div className="movie-detail-container">
        {/* Search icon in top right */}
        <button className="search-icon-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        
        <div className="movie-detail-content">
          <div className="movie-poster-container">
            <img 
              src={movie.poster_path || movie.poster} 
              alt={movie.title}
              className="movie-detail-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600/333333/ffffff?text=No+Image';
              }}
            />
          </div>
          
          <div className="movie-info-container">
            <div className="movie-header">
              <h1 className="movie-title-detail">{movie.title}</h1>
              <div className="movie-rating-detail">
                <span className="rating-score">{movie.vote_average || movie.rating || 'N/A'}</span>
              </div>
            </div>
            
            <div className="movie-subtitle">
              <span className="movie-genres">{getGenres()}</span>
            </div>
            
            <div className="movie-meta">
              <span className="movie-year">{getYear()}</span>
              <span className="movie-runtime">{getRuntime()}</span>
            </div>
            
            <div className="movie-overview">
              <p>{movie.overview || 'No overview available.'}</p>
            </div>
            
            {movie.tagline && (
              <div className="movie-tagline">
                <em>"{movie.tagline}"</em>
              </div>
            )}
            
            <div className="movie-actions">
              <button className="action-btn edit-btn" onClick={() => onEdit(movie)}>
                EDIT MOVIE
              </button>
              <button className="action-btn delete-btn" onClick={() => onDelete(movie)}>
                DELETE MOVIE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;