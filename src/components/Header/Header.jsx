import React from 'react';
import './Header.css';

const Header = ({ onAddMovie }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="netflix">netflix</span>
          <span className="roulette">roulette</span>
        </div>
        <button className="add-movie-btn" onClick={onAddMovie}>
          + ADD MOVIE
        </button>
      </div>
    </header>
  );
};

export default Header;