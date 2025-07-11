import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import ContextMenu from '../ContextMenu/ContextMenu';
import './MovieCard.css';

const MovieCard = ({ movie, onEdit, onDelete, onSelect }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-overlay">
          <button 
            className="context-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowContextMenu(!showContextMenu);
            }}
          >
            <MoreHorizontal size={20} />
          </button>
          {showContextMenu && (
            <ContextMenu 
              onEdit={() => {
                onEdit(movie);
                setShowContextMenu(false);
              }}
              onDelete={() => {
                onDelete(movie);
                setShowContextMenu(false);
              }}
              onClose={() => setShowContextMenu(false)}
            />
          )}
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <span className="movie-year">{movie.year}</span>
      </div>
    </div>
  );
};

export default MovieCard;