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
  
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('release_date');
  const [searchTerm, setSearchTerm] = useState('');
  
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await movieService.getAllMovies();
      console.log('API Response:', response);
      
      
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

  
  const applyFiltersAndSort = useCallback((movieList, search, genre, sort) => {
    let filtered = [...movieList];

    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title?.toLowerCase().includes(searchLower) ||
        movie.genres?.some(g => g.toLowerCase().includes(searchLower)) ||
        movie.overview?.toLowerCase().includes(searchLower)
      );
    }

    
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

  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  
  useEffect(() => {
    applyFiltersAndSort(movies, searchTerm, selectedGenre, sortBy);
  }, [movies, searchTerm, selectedGenre, sortBy, applyFiltersAndSort]);

  
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term && term.trim()) {
      setSelectedGenre('ALL');
    }
  };

  
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (genre !== 'ALL') {
      setSearchTerm('');
    }
  };

  
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  
  const handleAddMovie = () => {
    setEditingMovie(null);
    setShowAddModal(true);
  };

  
  const handleEditMovie = (movie) => {
    console.log('Editing movie:', movie);
    setEditingMovie(movie);
    setShowAddModal(true);
    setShowMovieDetail(false); 
  };

  
  const handleDeleteMovie = (movie) => {
    console.log('Deleting movie:', movie);
    setMovieToDelete(movie);
    setShowDeleteModal(true);
    setShowMovieDetail(false); 
  };

  
  const handleMovieSelect = async (movie) => {
    try {
      setIsLoading(true);
      console.log('Selected movie for details:', movie);
      
      
      const fullMovie = await movieService.getMovieById(movie.id);
      console.log('Full movie details from API:', fullMovie);
      
      setSelectedMovie(fullMovie);
      setShowMovieDetail(true);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      
      console.log('Using fallback movie data:', movie);
      setSelectedMovie(movie);
      setShowMovieDetail(true);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleCloseMovieDetail = () => {
    setShowMovieDetail(false);
    setSelectedMovie(null);
  };

  
  const handleMovieSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Form data received:', formData);
      
      
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
        
        const updateData = {
          ...movieData,
          id: editingMovie.id
        };
        
        console.log('Updating movie with data:', updateData);
        await movieService.updateMovie(updateData);
        setSuccessMessage('The movie has been updated successfully');
      } else {
        
        console.log('Creating movie with data:', movieData);
        await movieService.createMovie(movieData);
        setSuccessMessage('The movie has been added to database successfully');
      }
      
      
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

  
  const handleRetry = () => {
    setError(null);
    fetchMovies();
  };

  
  const handleCloseError = () => {
    setError(null);
  };

  
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingMovie(null);
    setError(null); 
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setMovieToDelete(null);
    setError(null); 
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  
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
      
      {}
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
      
      {}
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
  
      {}
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