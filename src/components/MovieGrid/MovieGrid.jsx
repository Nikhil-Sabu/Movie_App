import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ movies, onEdit, onDelete, onSelect, selectedGenre, onGenreChange, sortBy, onSortChange }) => {
  const genres = ['ALL', 'ACTION', 'CRIME', 'HORROR', 'COMEDY', 'DOCUMENTARY', 'DRAMA'];

  return (
    <div className="movie-grid-container">
      <div className="filters">
        <div className="genre-filters">
          {genres.map(genre => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => onGenreChange(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="sort-section">
          <span className="sort-label">SORT BY</span>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="release_date">RELEASE DATE</option>
            <option value="title">TITLE</option>
            <option value="rating">RATING</option>
          </select>
        </div>
      </div>

      <div className="movies-count">
        <span className="count-badge">{movies.length}</span>
        <span className="count-text">
          {movies.length} movie{movies.length !== 1 ? 's' : ''} found
          {selectedGenre !== 'ALL' && (
            <span className="filter-indicator"> in {selectedGenre}</span>
          )}
        </span>
      </div>

      {movies.length === 0 ? (
        <div className="no-movies">
          <h3>No movies found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieGrid;