import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import './Dialog.css';

const Dialog = ({ 
  isOpen, 
  title, 
  children, 
  onClose, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true 
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const dialogContent = (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <FocusTrap
        focusTrapOptions={{
          initialFocus: false,
          allowOutsideClick: true,
          clickOutsideDeactivates: closeOnOverlayClick,
          escapeDeactivates: closeOnEscape,
          fallbackFocus: () => document.querySelector('.dialog-content'),
        }}
      >
        <div 
          className={`dialog-content dialog-content--${size}`}
          role="dialog" 
          aria-modal="true"
          aria-labelledby={title ? "dialog-title" : undefined}
          tabIndex="-1"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="dialog-header">
              {title && (
                <h2 id="dialog-title" className="dialog-title">
                  {typeof title === 'string' ? title : title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  className="dialog-close-button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="dialog-body">
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  );

  // Render to portal
  return createPortal(dialogContent, document.body);
};

export default Dialog;