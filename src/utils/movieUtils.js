
export const filterMoviesByGenre = (movies, genre) => {
    if (genre === 'ALL') return movies;
    
    return movies.filter(movie => {
      const movieGenre = movie.genre.toLowerCase();
      const filterGenre = genre.toLowerCase();
      
      
      if (genre === 'ACTION') {
        return movieGenre.includes('action') || movieGenre.includes('adventure');
      }
      
      return movieGenre.includes(filterGenre);
    });
  };
  
  export const sortMovies = (movies, sortBy) => {
    return [...movies].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'release_date':
        default:
          return new Date(b.releaseDate || b.year) - new Date(a.releaseDate || a.year);
      }
    });
  };
  
  export const searchMovies = (movies, searchTerm) => {
    if (!searchTerm) return movies;
    
    const term = searchTerm.toLowerCase();
    
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(term) ||
      movie.genre.toLowerCase().includes(term) ||
      movie.overview.toLowerCase().includes(term) ||
      movie.year.toString().includes(term)
    );
  };
  
  export const getMovieCountText = (count) => {
    if (count === 0) return 'No movies found';
    if (count === 1) return '1 movie found';
    return `${count} movies found`;
  };
  
  export const validateMovieData = (movieData) => {
    const errors = {};
    
    if (!movieData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!movieData.releaseDate) {
      errors.releaseDate = 'Release date is required';
    }
    
    if (!movieData.movieUrl?.trim()) {
      errors.movieUrl = 'Movie URL is required';
    } else if (!isValidUrl(movieData.movieUrl)) {
      errors.movieUrl = 'Please enter a valid URL';
    }
    
    if (!movieData.rating) {
      errors.rating = 'Rating is required';
    } else if (movieData.rating < 0 || movieData.rating > 10) {
      errors.rating = 'Rating must be between 0 and 10';
    }
    
    if (!movieData.genre?.trim()) {
      errors.genre = 'Genre is required';
    }
    
    if (!movieData.runtime?.trim()) {
      errors.runtime = 'Runtime is required';
    }
    
    if (!movieData.overview?.trim()) {
      errors.overview = 'Overview is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  export const generateMovieId = (movies) => {
    if (!movies || movies.length === 0) return 1;
    return Math.max(...movies.map(movie => movie.id)) + 1;
  };
  
  export const formatMovieForSubmission = (formData) => {
    return {
      title: formData.title.trim(),
      year: new Date(formData.releaseDate).getFullYear().toString(),
      genre: formData.genre,
      rating: parseFloat(formData.rating),
      runtime: formData.runtime.trim(),
      overview: formData.overview.trim(),
      poster: formData.movieUrl.trim(),
      url: formData.movieUrl.trim(),
      releaseDate: formData.releaseDate
    };
  };
  