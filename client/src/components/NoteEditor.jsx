import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, X, Tag as TagIcon, Lock, Unlock } from 'lucide-react';
import TagBadge from './TagBadge';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isPrivate, setIsPrivate] = useState(note?.isPrivate ?? true);
  const [tags, setTags] = useState(note?.Tags?.map(t => t.name) || []);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState(note?.color || '#6366f1');
  const [saving, setSaving] = useState(false);

  const colors = [
    '#6366f1', // primary
    '#8b5cf6', // secondary
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // green
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#ffffff', // white
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title,
        content,
        isPrivate,
        tags,
        color,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold w-full border-none focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {isPrivate ? (
            <>
              <Lock className="w-4 h-4" />
              <span className="text-sm">Private</span>
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4" />
              <span className="text-sm">Shared</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${
                color === c ? 'border-gray-900 dark:border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Start writing your note..."
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <TagIcon className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tags (press Enter)"
            className="input flex-1"
          />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <TagBadge key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button onClick={onCancel} className="btn btn-outline">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
