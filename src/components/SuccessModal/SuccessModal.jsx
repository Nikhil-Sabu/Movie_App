import React, { useEffect } from 'react';
import { CheckIcon } from '../Icons/Icons';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, message = "The movie has been added to database successfully" }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="success-modal-content">
        <div className="success-icon">
          <CheckIcon size={32} />
        </div>
        <h2 className="success-title">CONGRATULATIONS!</h2>
        <p className="success-message">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;