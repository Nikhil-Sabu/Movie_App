import React from 'react';
import Dialog from '../Dialog/Dialog';
import './MovieDetail.css';

const MovieDetail = ({ isOpen, movie, onClose, onEdit, onDelete }) => {
  if (!movie) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      showCloseButton={true}
    >
      <div className="movie-detail-content">
        <div className="movie-detail-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
        
        <div className="movie-detail-info">
          <h1 className="movie-detail-title">{movie.title}</h1>
          
          <div className="movie-detail-meta">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-rating">⭐ {movie.rating}</span>
            <span className="movie-runtime">{movie.runtime}</span>
          </div>
          
          <div className="movie-genre">
            <strong>Genre:</strong> {movie.genre}
          </div>
          
          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
          
          <div className="movie-actions">
            <button onClick={() => onEdit(movie)} className="btn-edit">
              EDIT
            </button>
            <button onClick={() => onDelete(movie.id)} className="btn-delete">
              DELETE
            </button>
            <a 
              href={movie.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-watch"
            >
              WATCH
            </a>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default MovieDetail;