import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import SearchSection from './components/SearchSection/SearchSection';
import MovieGrid from './components/MovieGrid/MovieGrid';
import AddMovieModal from './components/AddMovieModal/AddMovieModal';
import DeleteModal from './components/DeleteModal/DeleteModal';
import SuccessModal from './components/SuccessModal/SuccessModal';
import MovieDetail from './components/MovieDetail/MovieDetail';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import { movieService } from './services/movieService';
import './styles/globals.css';
import './App.css';

function App() {
  // State management
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('release_date');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  
  // Selected items
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from API
  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await movieService.getAllMovies();
      console.log('API Response:', response);
      
      // Handle the nested data structure
      let movieData = [];
      if (response.data && Array.isArray(response.data)) {
        movieData = response.data;
      } else if (Array.isArray(response)) {
        movieData = response;
      } else {
        console.error('Unexpected API response structure:', response);
        throw new Error('Invalid API response format');
      }
      
      console.log('Processed movies:', movieData);
      setMovies(movieData);
      applyFiltersAndSort(movieData, searchTerm, selectedGenre, sortBy);
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch movies. Please make sure the backend server is running on http://localhost:4000';
      setError(errorMessage);
      console.log('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedGenre, sortBy]);

  // Apply client-side filtering and sorting
  const applyFiltersAndSort = useCallback((movieList, search, genre, sort) => {
    let filtered = [...movieList];

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title?.toLowerCase().includes(searchLower) ||
        movie.genres?.some(g => g.toLowerCase().includes(searchLower)) ||
        movie.overview?.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter
    if (genre !== 'ALL') {
      const genreLower = genre.toLowerCase();
      filtered = filtered.filter(movie => {
        if (Array.isArray(movie.genres)) {
          return movie.genres.some(g => 
            g.toLowerCase().includes(genreLower)
          );
        }
        return false;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'release_date':
        default:
          const dateA = new Date(a.release_date || 0);
          const dateB = new Date(b.release_date || 0);
          return dateB - dateA;
      }
    });

    setFilteredMovies(filtered);
  }, []);

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Apply filters when search, genre, or sort changes
  useEffect(() => {
    applyFiltersAndSort(movies, searchTerm, selectedGenre, sortBy);
  }, [movies, searchTerm, selectedGenre, sortBy, applyFiltersAndSort]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term && term.trim()) {
      setSelectedGenre('ALL');
    }
  };

  // Handle genre change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (genre !== 'ALL') {
      setSearchTerm('');
    }
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Handle add movie
  const handleAddMovie = () => {
    setEditingMovie(null);
    setShowAddModal(true);
  };

  // Handle edit movie
  const handleEditMovie = (movie) => {
    console.log('Editing movie:', movie);
    setEditingMovie(movie);
    setShowAddModal(true);
    setShowMovieDetail(false); // Close detail view when editing
  };

  // Handle delete movie
  const handleDeleteMovie = (movie) => {
    console.log('Deleting movie:', movie);
    setMovieToDelete(movie);
    setShowDeleteModal(true);
    setShowMovieDetail(false); // Close detail view when deleting
  };

  // Handle movie select - Show movie detail above grid
  const handleMovieSelect = async (movie) => {
    try {
      setIsLoading(true);
      console.log('Selected movie for details:', movie);
      
      // Fetch full movie details
      const fullMovie = await movieService.getMovieById(movie.id);
      console.log('Full movie details from API:', fullMovie);
      
      setSelectedMovie(fullMovie);
      setShowMovieDetail(true);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      // Fallback to the movie data we already have
      console.log('Using fallback movie data:', movie);
      setSelectedMovie(movie);
      setShowMovieDetail(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close movie detail
  const handleCloseMovieDetail = () => {
    setShowMovieDetail(false);
    setSelectedMovie(null);
  };

  // Handle movie form submission
  const handleMovieSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Form data received:', formData);
      
      // Parse runtime as integer
      const runtimeValue = parseInt(formData.runtime) || 0;
      
      const movieData = {
        title: formData.title.trim(),
        release_date: formData.releaseDate,
        poster_path: formData.movieUrl.trim(),
        vote_average: parseFloat(formData.rating) || 0,
        genres: [formData.genre],
        runtime: runtimeValue,
        overview: formData.overview.trim()
      };

      if (editingMovie) {
        // Update existing movie - include ID in the data
        const updateData = {
          ...movieData,
          id: editingMovie.id
        };
        
        console.log('Updating movie with data:', updateData);
        await movieService.updateMovie(updateData);
        setSuccessMessage('The movie has been updated successfully');
      } else {
        // Create new movie
        console.log('Creating movie with data:', movieData);
        await movieService.createMovie(movieData);
        setSuccessMessage('The movie has been added to database successfully');
      }
      
      // Refresh movie list
      await fetchMovies();
      
      setShowAddModal(false);
      setEditingMovie(null);
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error saving movie:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(`Failed to save movie: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!movieToDelete) {
      console.error('No movie selected for deletion');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Deleting movie with ID:', movieToDelete.id);
      await movieService.deleteMovie(movieToDelete.id);
      
      // Refresh movie list
      await fetchMovies();
      
      setSuccessMessage('The movie has been deleted successfully');
      setShowDeleteModal(false);
      setMovieToDelete(null);
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error deleting movie:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(`Failed to delete movie: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    fetchMovies();
  };

  // Close error message
  const handleCloseError = () => {
    setError(null);
  };

  // Handle modal close functions
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingMovie(null);
    setError(null); // Clear any form errors
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setMovieToDelete(null);
    setError(null); // Clear any delete errors
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  // Show error message if there's a critical error
  if (error && !showAddModal && !showDeleteModal) {
    return (
      <div className="App">
        <Header onAddMovie={handleAddMovie} />
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
          onClose={handleCloseError}
        />
      </div>
    );
  }

  return (
    <div className="App">
      {isLoading && <LoadingSpinner />}
      <Header 
        onAddMovie={handleAddMovie} 
        showSearchIcon={showMovieDetail}
        onSearchClick={handleCloseMovieDetail}
      />
      
      {/* Conditional rendering: Either Search Section OR Movie Detail */}
      {showMovieDetail ? (
        <MovieDetail
          movie={selectedMovie}
          isOpen={showMovieDetail}
          onClose={handleCloseMovieDetail}
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
        />
      ) : (
        <SearchSection 
          onSearch={handleSearch}
          searchTerm={searchTerm}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          movieCount={filteredMovies.length}
        />
      )}
      
      {/* Movie Grid - ALWAYS show, remove the conditional */}
      <MovieGrid
        movies={filteredMovies}
        selectedGenre={selectedGenre}
        sortBy={sortBy}
        onGenreChange={handleGenreChange}
        onSortChange={handleSortChange}
        onEdit={handleEditMovie}
        onDelete={handleDeleteMovie}
        onSelect={handleMovieSelect}
      />
  
      {/* All your modals remain the same */}
      {showAddModal && (
        <AddMovieModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleMovieSubmit}
          movie={editingMovie}
          mode={editingMovie ? 'edit' : 'add'}
        />
      )}
  
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          movieTitle={movieToDelete?.title}
        />
      )}
  
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message={successMessage}
        />
      )}
  
      {error && (showAddModal || showDeleteModal) && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={handleCloseError}>×</button>
        </div>
      )}
  
      <footer className="footer">
        <div className="footer-content">
          <span className="nix">Nix</span>
          <span className="mov">Movies</span>
        </div>
      </footer>
    </div>
  );
}

export default App;