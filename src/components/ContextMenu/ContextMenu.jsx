import React, { useEffect, useRef } from 'react';
import { EditIcon, TrashIcon } from '../Icons/Icons';
import './ContextMenu.css';

const ContextMenu = ({ onEdit, onDelete, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="context-menu" ref={menuRef}>
      <button className="context-menu-item" onClick={handleEdit}>
        <EditIcon size={16} />
        Edit
      </button>
      <button className="context-menu-item" onClick={handleDelete}>
        <TrashIcon size={16} />
        Delete
      </button>
    </div>
  );
};

export default ContextMenu;