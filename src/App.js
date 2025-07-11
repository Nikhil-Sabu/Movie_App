import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchSection from './components/SearchSection/SearchSection';
import MovieGrid from './components/MovieGrid/MovieGrid';
import AddMovieModal from './components/AddMovieModal/AddMovieModal';
import DeleteModal from './components/DeleteModal/DeleteModal';
import SuccessModal from './components/SuccessModal/SuccessModal';
import MovieDetail from './components/MovieDetail/MovieDetail';
import { mockMovies } from './data/movies';
import './styles/globals.css';
import './App.css';

function App() {
  const [movies, setMovies] = useState(mockMovies);
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);
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

  // Filter and sort movies
  useEffect(() => {
    let filtered = [...movies];

    // Apply search filter first
    if (searchTerm.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.overview.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenre !== 'ALL') {
      filtered = filtered.filter(movie => {
        // Handle "Action & Adventure" vs "ACTION" mapping
        if (selectedGenre === 'ACTION') {
          return movie.genre.toLowerCase().includes('action');
        }
        return movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'release_date':
        default:
          return new Date(b.year) - new Date(a.year);
      }
    });

    setFilteredMovies(filtered);
  }, [movies, selectedGenre, sortBy, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Reset genre to ALL when searching
    if (term.trim()) {
      setSelectedGenre('ALL');
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    // Clear search when selecting a genre
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
    setEditingMovie(movie);
    setShowAddModal(true);
  };

  const handleDeleteMovie = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setShowMovieDetail(true);
  };

  const handleMovieSubmit = (formData) => {
    if (editingMovie) {
      // Edit existing movie
      setMovies(prev => prev.map(movie =>
        movie.id === editingMovie.id
          ? { 
              ...movie, 
              title: formData.title,
              releaseDate: formData.releaseDate,
              url: formData.movieUrl,
              rating: parseFloat(formData.rating),
              genre: formData.genre,
              runtime: formData.runtime,
              overview: formData.overview,
              year: new Date(formData.releaseDate).getFullYear().toString()
            }
          : movie
      ));
      setSuccessMessage('The movie has been updated successfully');
    } else {
      // Add new movie
      const newMovie = {
        id: Date.now(),
        title: formData.title,
        year: new Date(formData.releaseDate).getFullYear().toString(),
        genre: formData.genre,
        rating: parseFloat(formData.rating),
        runtime: formData.runtime,
        overview: formData.overview,
        poster: `https://picsum.photos/300/450?random=${Date.now()}`,
        url: formData.movieUrl,
        releaseDate: formData.releaseDate
      };
      setMovies(prev => [...prev, newMovie]);
      setSuccessMessage('The movie has been added to database successfully');
    }
    
    setShowAddModal(false);
    setEditingMovie(null);
    setShowSuccessModal(true);
  };

  const handleDeleteConfirm = () => {
    if (movieToDelete) {
      setMovies(prev => prev.filter(movie => movie.id !== movieToDelete.id));
      setSuccessMessage('The movie has been deleted successfully');
      setShowDeleteModal(false);
      setMovieToDelete(null);
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="App">
      <Header onAddMovie={handleAddMovie} />
      
      <SearchSection onSearch={handleSearch} />
      
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

      {/* Add Movie Button - Fixed Position */}
      <button className="floating-add-btn" onClick={handleAddMovie}>
        + ADD MOVIE
      </button>

      {/* Modals */}
      <AddMovieModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleMovieSubmit}
        movie={editingMovie}
        mode={editingMovie ? 'edit' : 'add'}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        movieTitle={movieToDelete?.title}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      <MovieDetail
        movie={selectedMovie}
        isOpen={showMovieDetail}
        onClose={() => setShowMovieDetail(false)}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span className="netflix">netflix</span>
          <span className="roulette">roulette</span>
        </div>
      </footer>
    </div>
  );
}

export default App;