import React, { useState } from 'react';
import { MoreHorizontalIcon } from '../Icons/Icons';
import ContextMenu from '../ContextMenu/ContextMenu';
import './MovieCard.css';

const MovieCard = ({ movie, onEdit, onDelete, onSelect }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on context menu or its button
    if (e.target.closest('.context-menu-btn') || e.target.closest('.context-menu')) {
      return;
    }
    onSelect(movie);
  };

  const handleContextMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(!showContextMenu);
  };

  const handleEdit = () => {
    console.log('Edit clicked for:', movie.title);
    setShowContextMenu(false);
    onEdit(movie);
  };

  const handleDelete = () => {
    console.log('Delete clicked for:', movie.title);
    setShowContextMenu(false);
    onDelete(movie);
  };

  const handleCloseMenu = () => {
    setShowContextMenu(false);
  };

  const fallbackImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="300" height="450" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#333333"/>
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
        ${movie.title}
      </text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ccc" font-size="12" font-family="Arial">
        ${movie.year}
      </text>
    </svg>
  `)}`;

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster">
        <img 
          src={imageError ? fallbackImage : movie.poster} 
          alt={movie.title}
          onError={handleImageError}
        />
        <div className="movie-overlay">
          <div className="context-menu-container">
            <button 
              className="context-menu-btn"
              onClick={handleContextMenuClick}
              aria-label="Movie options"
            >
              <MoreHorizontalIcon size={20} />
            </button>
            {showContextMenu && (
              <ContextMenu 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClose={handleCloseMenu}
              />
            )}
          </div>
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