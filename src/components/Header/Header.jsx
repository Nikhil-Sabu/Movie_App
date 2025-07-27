import React from 'react';
import './Header.css';

const Header = ({ onAddMovie }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="nix">Nix</span>
          <span className="mov">Movies</span>
        </div>
        <button className="add-movie-btn" onClick={onAddMovie}>
        ADD MOVIE
        </button>
      </div>
    </header>
  );
};

export default Header;