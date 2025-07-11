import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Trigger search on every keystroke (live search)
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <section className="search-section">
      <div className="search-content">
        <h1 className="search-title">FIND YOUR MOVIE</h1>
        <form onSubmit={handleSubmit} className="search-bar">
          <input
            type="text"
            placeholder="What do you want to watch?"
            value={searchTerm}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            SEARCH
          </button>
          {searchTerm && (
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-btn"
            >
              CLEAR
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default SearchSection;