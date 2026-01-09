import React from 'react';
import { X } from 'lucide-react';

const TagBadge = ({ tag, onRemove, clickable = false, onClick }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 ${
        clickable ? 'cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800' : ''
      }`}
      onClick={onClick}
    >
      {tag.name || tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="hover:bg-primary-200 dark:hover:bg-primary-700 rounded-full p-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default TagBadge;
