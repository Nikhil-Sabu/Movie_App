import React from 'react';
import { X } from 'lucide-react';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, movieTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="delete-modal-body">
          <h2 className="delete-title">DELETE MOVIE</h2>
          <p className="delete-message">
            Are you sure you want to delete this movie?
          </p>
          {movieTitle && (
            <p className="movie-title-confirm">"{movieTitle}"</p>
          )}
          
          <button onClick={onConfirm} className="confirm-btn">
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;