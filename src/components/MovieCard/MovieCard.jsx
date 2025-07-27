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

  // Extract year from release_date
  const getYear = () => {
    if (movie.release_date) {
      return new Date(movie.release_date).getFullYear();
    }
    return movie.year || 'N/A';
  };

  // Get genre display text
  const getGenreDisplay = () => {
    if (Array.isArray(movie.genres) && movie.genres.length > 0) {
      return movie.genres.slice(0, 2).join(', '); // Show first 2 genres
    }
    return movie.genre || 'N/A';
  };

  // Safe function to encode text for SVG (handles Unicode characters)
  const safeEncode = (text) => {
    try {
      // Remove or replace problematic characters
      const cleanText = text
        .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
        .replace(/[<>&"']/g, ''); // Remove XML special characters
      return cleanText || 'Movie';
    } catch (error) {
      return 'Movie';
    }
  };

  // Create fallback image without btoa (safer approach)
  const createFallbackImage = () => {
    const title = safeEncode(movie.title || 'Untitled');
    const year = getYear();
    
    const svgContent = `
      <svg width="300" height="450" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#333333"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
          ${title}
        </text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ccc" font-size="12" font-family="Arial">
          ${year}
        </text>
      </svg>
    `;
    
    try {
      // Use encodeURIComponent instead of btoa for better Unicode support
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    } catch (error) {
      console.error('Error creating fallback image:', error);
      // Return a simple colored rectangle as ultimate fallback
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="300" height="450" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#333333"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
            No Image
          </text>
        </svg>
      `)}`;
    }
  };

  const fallbackImage = createFallbackImage();

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster">
        <img 
          src={imageError ? fallbackImage : (movie.poster_path || movie.poster || fallbackImage)} 
          alt={movie.title || 'Movie poster'}
          onError={handleImageError}
          loading="lazy"
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
        <h3 className="movie-title">{movie.title || 'Untitled'}</h3>
        <p className="movie-genre">{getGenreDisplay()}</p>
        <span className="movie-year">{getYear()}</span>
      </div>
    </div>
  );
};

export default MovieCard;