import React, { useState, useEffect } from 'react';
import Dialog from '../Dialog/Dialog';
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
      setFormData({
        title: movie.title || '',
        releaseDate: movie.releaseDate || '',
        movieUrl: movie.url || movie.poster || '',
        rating: movie.rating?.toString() || '',
        genre: movie.genre || '',
        runtime: movie.runtime || '',
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
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.releaseDate) newErrors.releaseDate = 'Release date is required';
    if (!formData.movieUrl.trim()) newErrors.movieUrl = 'Movie URL is required';
    if (!formData.rating) newErrors.rating = 'Rating is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.runtime.trim()) newErrors.runtime = 'Runtime is required';
    if (!formData.overview.trim()) newErrors.overview = 'Overview is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
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

  const title = mode === 'edit' ? 'EDIT MOVIE' : 'ADD MOVIE';

  return (
    <Dialog
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      size="medium"
    >
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
              placeholder="https://example.com"
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
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Crime">Crime</option>
              <option value="Documentary">Documentary</option>
            </select>
            {errors.genre && <span className="error-message">{errors.genre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="runtime">RUNTIME</label>
            <input
              type="text"
              id="runtime"
              name="runtime"
              value={formData.runtime}
              onChange={handleChange}
              className={errors.runtime ? 'error' : ''}
              placeholder="2h 30min"
            />
            {errors.runtime && <span className="error-message">{errors.runtime}</span>}
          </div>
        </div>

        <div className="form-group">
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
          <button type="button" onClick={onClose} className="btn-secondary">
            RESET
          </button>
          <button type="submit" className="btn-primary">
            SUBMIT
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddMovieModal;