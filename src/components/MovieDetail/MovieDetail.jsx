import React from 'react';
import { X } from 'lucide-react';
import './MovieDetail.css';

const MovieDetail = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="movie-detail-header">
          <div className="movie-poster-large">
            <img src={movie.poster} alt={movie.title} />
          </div>
          
          <div className="movie-info-large">
            <div className="title-rating">
              <h1 className="movie-title-large">{movie.title}</h1>
              <span className="rating-badge">{movie.rating}</span>
            </div>
            
            <p className="movie-genre-large">{movie.genre}</p>
            
            <div className="movie-meta">
              <span className="movie-year-large">{movie.year}</span>
              <span className="movie-runtime-large">{movie.runtime}</span>
            </div>
            
            <p className="movie-overview-large">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;