import React, { useState, useEffect } from 'react';
import './AddMovieModal.css';

const AddMovieModal = ({ isOpen, onClose, onSubmit, mode = 'add', movie = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    releaseDate: '',
    movieUrl: '',
    rating: '',
    genre: '',
    runtime: '',
    overview: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && movie) {
      console.log('Edit mode - movie data:', movie); // Debug log
      
      const releaseDate = movie.release_date || movie.releaseDate || '';
      const movieUrl = movie.poster_path || movie.url || movie.poster || movie.movieUrl || '';
      const rating = movie.vote_average ?? movie.rating ?? '';
      const genre = Array.isArray(movie.genres) ? movie.genres[0] : (movie.genre || '');
      
      // Fixed runtime handling
      const runtime = (movie.runtime !== null && movie.runtime !== undefined) 
        ? movie.runtime.toString() 
        : '';
      
      console.log('Processed runtime:', runtime); // Debug log
      
      setFormData({
        title: movie.title || '',
        releaseDate: releaseDate,
        movieUrl: movieUrl,
        rating: rating.toString(),
        genre: genre,
        runtime: runtime,
        overview: movie.overview || ''
      });
    } else {
      setFormData({
        title: '',
        releaseDate: '',
        movieUrl: '',
        rating: '',
        genre: '',
        runtime: '',
        overview: ''
      });
    }
    setErrors({});
  }, [mode, movie, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required';
    }
    if (!formData.movieUrl || !formData.movieUrl.trim()) {
      newErrors.movieUrl = 'Movie URL is required';
    }
    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else {
      const ratingNum = parseFloat(formData.rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
        newErrors.rating = 'Rating must be between 0 and 10';
      }
    }
    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }
    if (!formData.runtime || !formData.runtime.toString().trim()) {
      newErrors.runtime = 'Runtime is required';
    } else {
      // Add runtime validation
      const runtimeNum = parseInt(formData.runtime);
      if (isNaN(runtimeNum) || runtimeNum <= 0) {
        newErrors.runtime = 'Runtime must be a valid positive number';
      }
    }
    if (!formData.overview || !formData.overview.trim()) {
      newErrors.overview = 'Overview is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleReset = () => {
    if (mode === 'edit' && movie) {
      const releaseDate = movie.release_date || movie.releaseDate || '';
      const movieUrl = movie.poster_path || movie.url || movie.poster || movie.movieUrl || '';
      const rating = movie.vote_average ?? movie.rating ?? '';
      const genre = Array.isArray(movie.genres) ? movie.genres[0] : (movie.genre || '');
      
      // Fixed runtime handling
      const runtime = (movie.runtime !== null && movie.runtime !== undefined) 
        ? movie.runtime.toString() 
        : '';
      
      setFormData({
        title: movie.title || '',
        releaseDate: releaseDate,
        movieUrl: movieUrl,
        rating: rating.toString(),
        genre: genre,
        runtime: runtime,
        overview: movie.overview || ''
      });
    } else {
      setFormData({
        title: '',
        releaseDate: '',
        movieUrl: '',
        rating: '',
        genre: '',
        runtime: '',
        overview: ''
      });
    }
    setErrors({});
  };

  if (!isOpen) return null;

  const title = mode === 'edit' ? 'EDIT MOVIE' : 'ADD MOVIE';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-btn" onClick={onClose}  aria-label="Close dialog">×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-movie-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">TITLE</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Movie title"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="releaseDate">RELEASE DATE</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className={errors.releaseDate ? 'error' : ''}
              />
              {errors.releaseDate && <span className="error-message">{errors.releaseDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="movieUrl">MOVIE URL</label>
              <input
                type="url"
                id="movieUrl"
                name="movieUrl"
                value={formData.movieUrl}
                onChange={handleChange}
                className={errors.movieUrl ? 'error' : ''}
                placeholder="https://image.tmdb.org/t/p/w500/example.jpg"
              />
              {errors.movieUrl && <span className="error-message">{errors.movieUrl}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rating">RATING</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={errors.rating ? 'error' : ''}
                min="0"
                max="10"
                step="0.1"
                placeholder="7.5"
              />
              {errors.rating && <span className="error-message">{errors.rating}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre">GENRE</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={errors.genre ? 'error' : ''}
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Animation">Animation</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Documentary">Documentary</option>
                <option value="Drama">Drama</option>
                <option value="Family">Family</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Thriller">Thriller</option>
              </select>
              {errors.genre && <span className="error-message">{errors.genre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="runtime">RUNTIME</label>
              <input
                type="number"
                id="runtime"
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                className={errors.runtime ? 'error' : ''}
                placeholder="108"
                min="1"
                max="500"
              />
              {errors.runtime && <span className="error-message">{errors.runtime}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="overview">OVERVIEW</label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              className={errors.overview ? 'error' : ''}
              placeholder="Movie description..."
              rows="4"
            />
            {errors.overview && <span className="error-message">{errors.overview}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="btn-reset">
              RESET
            </button>
            <button type="submit" className="btn-submit">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;