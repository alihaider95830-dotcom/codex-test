import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, Share2, MoreVertical } from 'lucide-react';
import { formatRelativeTime, stripHtml, truncateText } from '../utils/helpers';
import TagBadge from './TagBadge';

const NoteCard = ({ note, onStar, onDelete, onShare }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/notes/${note.id}`);
  };

  const handleStar = (e) => {
    e.stopPropagation();
    onStar(note);
  };

  return (
    <div
      onClick={handleClick}
      className="note-card relative"
      style={{ borderLeft: `4px solid ${note.color || '#6366f1'}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {note.title}
        </h3>
        <div className="flex items-center space-x-2">
          {note.isPrivate && (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
          <button
            onClick={handleStar}
            className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
              note.starred ? 'text-yellow-500' : 'text-gray-400'
            }`}
          >
            <Star className="w-4 h-4" fill={note.starred ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {truncateText(stripHtml(note.content), 150)}
      </p>

      {note.Tags && note.Tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.Tags.slice(0, 3).map(tag => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
          {note.Tags.length > 3 && (
            <span className="text-xs text-gray-500">+{note.Tags.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatRelativeTime(note.updatedAt)}</span>
        {note.User && (
          <span className="text-gray-400">by {note.User.username}</span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
