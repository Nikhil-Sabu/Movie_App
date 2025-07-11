import React, { useState, useEffect } from "react";
import { XIcon, CalendarIcon, ChevronDownIcon } from "../Icons/Icons";
import "./AddMovieModal.css";

const AddMovieModal = ({
  isOpen,
  onClose,
  onSubmit,
  movie = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    movieUrl: "",
    rating: "",
    genre: "",
    runtime: "",
    overview: "",
  });

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const genres = [
    "Crime",
    "Documentary",
    "Horror",
    "Comedy",
    "Action",
    "Drama",
  ];

  useEffect(() => {
    if (movie && mode === "edit") {
      console.log("Editing movie:", movie);
      setFormData({
        title: movie.title || "",
        releaseDate: movie.releaseDate || "",
        movieUrl: movie.url || "",
        rating: movie.rating?.toString() || "",
        genre: movie.genre || "",
        runtime: movie.runtime || "",
        overview: movie.overview || "",
      });
    } else if (mode === "add") {
      // Reset form for new movie
      setFormData({
        title: "",
        releaseDate: "",
        movieUrl: "",
        rating: "",
        genre: "",
        runtime: "",
        overview: "",
      });
    }
    setErrors({});
  }, [movie, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.releaseDate)
      newErrors.releaseDate = "Release date is required";
    if (!formData.movieUrl.trim()) newErrors.movieUrl = "Movie URL is required";
    if (!formData.rating) newErrors.rating = "Rating is required";
    if (!formData.genre) newErrors.genre = "Please select at least one genre";
    if (!formData.runtime.trim()) newErrors.runtime = "Runtime is required";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";

    // Validate rating range
    const rating = parseFloat(formData.rating);
    if (formData.rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      releaseDate: "",
      movieUrl: "",
      rating: "",
      genre: "",
      runtime: "",
      overview: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    setShowGenreDropdown(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "edit" ? "EDIT MOVIE" : "ADD MOVIE"}</h2>
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <XIcon size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">TITLE</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`form-input ${errors.title ? "error" : ""}`}
                placeholder="Movie title"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="release-date">
                RELEASE DATE
              </label>
              <div className="date-input-wrapper">
                <input
                  id="release-date"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) =>
                    handleInputChange("releaseDate", e.target.value)
                  }
                  className={`form-input date-input ${
                    errors.releaseDate ? "error" : ""
                  }`}
                />
                <CalendarIcon className="date-icon" size={20} />
              </div>
              {errors.releaseDate && (
                <span className="error-message">{errors.releaseDate}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">MOVIE URL</label>
              <input
                type="url"
                value={formData.movieUrl}
                onChange={(e) => handleInputChange("movieUrl", e.target.value)}
                className={`form-input ${errors.movieUrl ? "error" : ""}`}
                placeholder="https://"
              />
              {errors.movieUrl && (
                <span className="error-message">{errors.movieUrl}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">RATING</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                className={`form-input ${errors.rating ? "error" : ""}`}
                placeholder="7.8"
              />
              {errors.rating && (
                <span className="error-message">{errors.rating}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GENRE</label>
              <div className="dropdown-wrapper">
                <button
                  type="button"
                  className={`dropdown-btn ${errors.genre ? "error" : ""}`}
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                >
                  {formData.genre || "Select Genre"}
                  <ChevronDownIcon size={20} />
                </button>
                {showGenreDropdown && (
                  <div className="dropdown-menu">
                    {genres.map((genre) => (
                      <label key={genre} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={formData.genre.includes(genre)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange(
                                "genre",
                                formData.genre
                                  ? `${formData.genre}, ${genre}`
                                  : genre
                              );
                            } else {
                              const newGenres = formData.genre
                                .split(", ")
                                .filter((g) => g !== genre);
                              handleInputChange("genre", newGenres.join(", "));
                            }
                          }}
                        />
                        {genre}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.genre && (
                <span className="error-message">{errors.genre}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">RUNTIME</label>
              <input
                type="text"
                value={formData.runtime}
                onChange={(e) => handleInputChange("runtime", e.target.value)}
                className={`form-input ${errors.runtime ? "error" : ""}`}
                placeholder="2h 30min"
              />
              {errors.runtime && (
                <span className="error-message">{errors.runtime}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">OVERVIEW</label>
            <textarea
              value={formData.overview}
              onChange={(e) => handleInputChange("overview", e.target.value)}
              className={`form-textarea ${errors.overview ? "error" : ""}`}
              placeholder="Movie description"
              rows={4}
            />
            {errors.overview && (
              <span className="error-message">{errors.overview}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">
              RESET
            </button>
            <button type="submit" className="submit-btn">
              {mode === "edit" ? "UPDATE" : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
