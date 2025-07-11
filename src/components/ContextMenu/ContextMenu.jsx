import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

const ContextMenu = ({ onEdit, onDelete, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="context-menu" ref={menuRef}>
      <button className="context-menu-item" onClick={onEdit}>
        Edit
      </button>
      <button className="context-menu-item delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default ContextMenu;